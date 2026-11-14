import http from "node:http";
import { createHash, randomUUID } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { GAME_RULES } from "../src/data/gameRules.ts";

const PLAYERS_FIXTURE = fileURLToPath(new URL("./fixtures/players.json", import.meta.url));
const PERSIST_FILE = fileURLToPath(new URL("./.mock-db.json", import.meta.url));

const TOKEN_LIFETIME_SECONDS = 3600;
const MIN_PASSWORD_LENGTH = 6;
const RESERVED_PARAMS = new Set(["select", "order", "limit", "offset", "on_conflict", "columns"]);

const TABLES = {
    leaderboard: {
        primaryKey: "player_id",
        ownerColumn: "player_id",
        required: ["player_id", "name", "return_pct", "equity", "hour"],
        validate: (row) => {
            if (typeof row.name !== "string" || row.name.length < 1 || row.name.length > 32) return "name must be 1-32 characters";
            if (row.return_pct < -GAME_RULES.maxLoss || row.return_pct > GAME_RULES.maxGrowth) return "return_pct is outside the allowed range";
            if (row.hour < 0 || row.hour > GAME_RULES.hoursPerYear) return "hour is outside the allowed range";
            return null;
        },
    },
};

const parseArgs = (argv) => {
    const options = { port: Number(process.env.PORT) || 54321, users: 24, persist: false, seed: "mock-players", password: "password123" };
    for (let i = 0; i < argv.length; i++) {
        const [flag, inline] = argv[i].split("=");
        const value = () => inline ?? argv[++i];
        if (flag === "--port") options.port = Number(value());
        else if (flag === "--users") options.users = Number(value());
        else if (flag === "--seed") options.seed = value();
        else if (flag === "--password") options.password = value();
        else if (flag === "--persist") options.persist = true;
    }
    return options;
};

const hashPassword = (password) => createHash("sha256").update(password).digest("hex");

const createRandom = (seedText) => {
    let state = 0;
    for (const char of seedText) state = (Math.imul(state, 31) + char.charCodeAt(0)) | 0;
    const next = () => {
        state = (state + 0x6d2b79f5) | 0;
        let t = Math.imul(state ^ (state >>> 15), 1 | state);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    const normal = () => Math.sqrt(-2 * Math.log(1 - next())) * Math.cos(2 * Math.PI * next());
    return { next, normal, pick: (items) => items[Math.floor(next() * items.length)] };
};

const generateAccounts = async ({ users, seed, password }) => {
    const { firstNames, lastNames } = JSON.parse(await readFile(PLAYERS_FIXTURE, "utf8"));
    const random = createRandom(seed);
    const now = Date.now();
    const usedEmails = new Set();
    const accounts = [];
    const leaderboard = [];

    while (accounts.length < users) {
        const first = random.pick(firstNames);
        const last = random.pick(lastNames);
        const email = `${first}.${last}@example.com`.toLowerCase();
        if (usedEmails.has(email) && usedEmails.size < firstNames.length * lastNames.length) continue;
        usedEmails.add(email);

        const id = randomUUID();
        const name = `${first} ${last}`;
        const createdAt = new Date(now - Math.floor(random.next() * 20 * 24 * 3_600_000)).toISOString();
        accounts.push({ id, email, password_hash: hashPassword(password), display_name: name, created_at: createdAt });

        const finished = random.next() < 0.3;
        const hour = finished ? GAME_RULES.hoursPerYear : Math.max(24, Math.floor(random.next() * GAME_RULES.hoursPerYear));
        const returnPct = Math.min(GAME_RULES.maxGrowth, Math.max(-GAME_RULES.maxLoss, 0.1 + random.normal() * 0.45));
        leaderboard.push({
            player_id: id,
            name,
            return_pct: Math.round(returnPct * 10000) / 10000,
            equity: Math.round(GAME_RULES.startingCash * (1 + returnPct) * 100) / 100,
            hour,
            updated_at: new Date(now - Math.floor(random.next() * 5 * 24 * 3_600_000)).toISOString(),
        });
    }

    return { users: accounts, leaderboard };
};

const loadStore = async (options) => {
    if (options.persist && existsSync(PERSIST_FILE)) return JSON.parse(await readFile(PERSIST_FILE, "utf8"));
    return generateAccounts(options);
};

const encode = (value) => Buffer.from(JSON.stringify(value)).toString("base64url");

const publicUser = (user) => ({
    id: user.id,
    aud: "authenticated",
    role: "authenticated",
    email: user.email,
    email_confirmed_at: user.created_at,
    created_at: user.created_at,
    updated_at: user.updated_at ?? user.created_at,
    app_metadata: { provider: "email", providers: ["email"] },
    user_metadata: { display_name: user.display_name },
    identities: [],
});

const createSession = (user) => {
    const expiresAt = Math.floor(Date.now() / 1000) + TOKEN_LIFETIME_SECONDS;
    const claims = { sub: user.id, email: user.email, role: "authenticated", aud: "authenticated", exp: expiresAt, iat: Math.floor(Date.now() / 1000) };
    return {
        access_token: `${encode({ alg: "HS256", typ: "JWT" })}.${encode(claims)}.mock-signature`,
        token_type: "bearer",
        expires_in: TOKEN_LIFETIME_SECONDS,
        expires_at: expiresAt,
        refresh_token: `refresh-${user.id}`,
        user: publicUser(user),
    };
};

const readBody = async (request) => {
    const chunks = [];
    for await (const chunk of request) chunks.push(chunk);
    const text = Buffer.concat(chunks).toString("utf8");
    return text ? JSON.parse(text) : null;
};

const comparable = (value, operand) => {
    const number = Number(operand);
    return Number.isNaN(number) || typeof value !== "number" ? [String(value), operand] : [value, number];
};

const FILTERS = {
    eq: (a, b) => a === b,
    neq: (a, b) => a !== b,
    gt: (a, b) => a > b,
    gte: (a, b) => a >= b,
    lt: (a, b) => a < b,
    lte: (a, b) => a <= b,
};

const buildFilter = (params) => {
    const checks = [];
    for (const [column, expression] of params) {
        if (RESERVED_PARAMS.has(column)) continue;
        const dot = expression.indexOf(".");
        const test = FILTERS[expression.slice(0, dot)];
        if (!test) continue;
        const operand = expression.slice(dot + 1);
        checks.push((row) => test(...comparable(row[column], operand)));
    }
    return (row) => checks.every((check) => check(row));
};

const applyOrder = (rows, order) => {
    if (!order) return rows;
    const keys = order.split(",").map((part) => {
        const [column, direction = "asc"] = part.split(".");
        return { column, sign: direction === "desc" ? -1 : 1 };
    });
    return [...rows].sort((a, b) => {
        for (const { column, sign } of keys) {
            if (a[column] < b[column]) return -sign;
            if (a[column] > b[column]) return sign;
        }
        return 0;
    });
};

const main = async () => {
    const options = parseArgs(process.argv.slice(2));
    const store = await loadStore(options);

    const persist = async () => {
        if (options.persist) await writeFile(PERSIST_FILE, JSON.stringify(store, null, 2));
    };

    const send = (response, status, body) => {
        response.writeHead(status, { "Content-Type": "application/json" });
        response.end(body === undefined ? "" : JSON.stringify(body));
    };

    const dbError = (response, status, code, message) => send(response, status, { code, message, details: null, hint: null });
    const authError = (response, status, errorCode, message) => send(response, status, { code: status, error_code: errorCode, msg: message });

    const authenticate = (request) => {
        const token = (request.headers.authorization ?? "").replace(/^Bearer\s+/i, "");
        try {
            const claims = JSON.parse(Buffer.from(token.split(".")[1], "base64url").toString("utf8"));
            if (claims.exp * 1000 < Date.now()) return null;
            return store.users.find((user) => user.id === claims.sub) ?? null;
        } catch {
            return null;
        }
    };

    const handleAuth = async (request, response, route, url) => {
        if (route === "settings" && request.method === "GET") {
            return send(response, 200, { external: { email: true }, disable_signup: false, mailer_autoconfirm: true });
        }

        if (route === "signup" && request.method === "POST") {
            const { email, password, data } = (await readBody(request)) ?? {};
            if (!email || !password) return authError(response, 400, "validation_failed", "Email and password are required");
            if (password.length < MIN_PASSWORD_LENGTH) return authError(response, 422, "weak_password", `Password should be at least ${MIN_PASSWORD_LENGTH} characters.`);
            const normalized = email.trim().toLowerCase();
            if (store.users.some((user) => user.email === normalized)) return authError(response, 422, "user_already_exists", "User already registered");

            const user = {
                id: randomUUID(),
                email: normalized,
                password_hash: hashPassword(password),
                display_name: data?.display_name || normalized.split("@")[0],
                created_at: new Date().toISOString(),
            };
            store.users.push(user);
            await persist();
            return send(response, 200, createSession(user));
        }

        if (route === "token" && request.method === "POST") {
            const grant = url.searchParams.get("grant_type");
            const body = (await readBody(request)) ?? {};

            if (grant === "password") {
                const user = store.users.find((candidate) => candidate.email === String(body.email ?? "").trim().toLowerCase());
                if (!user || user.password_hash !== hashPassword(body.password ?? "")) {
                    return authError(response, 400, "invalid_credentials", "Invalid login credentials");
                }
                return send(response, 200, createSession(user));
            }

            if (grant === "refresh_token") {
                const user = store.users.find((candidate) => `refresh-${candidate.id}` === body.refresh_token);
                return user ? send(response, 200, createSession(user)) : authError(response, 400, "refresh_token_not_found", "Invalid Refresh Token");
            }

            return authError(response, 400, "validation_failed", "Unsupported grant type");
        }

        if (route === "user") {
            const user = authenticate(request);
            if (!user) return authError(response, 401, "bad_jwt", "Invalid or expired token");

            if (request.method === "GET") return send(response, 200, publicUser(user));
            if (request.method === "PUT") {
                const { data } = (await readBody(request)) ?? {};
                if (data?.display_name) user.display_name = String(data.display_name);
                user.updated_at = new Date().toISOString();
                await persist();
                return send(response, 200, publicUser(user));
            }
        }

        if (route === "logout" && request.method === "POST") return send(response, 204);

        return authError(response, 404, "not_found", "Unsupported auth route");
    };

    const handleTable = async (request, response, tableName, url) => {
        const table = TABLES[tableName];
        if (!table) return dbError(response, 404, "42P01", `relation "public.${tableName}" does not exist`);

        const rows = store[tableName];
        const prefer = request.headers.prefer ?? "";
        const wantsRows = prefer.includes("return=representation");
        const baseMatch = buildFilter(url.searchParams);
        const user = authenticate(request);
        const denied = () => dbError(response, 401, "42501", `new row violates row-level security policy for table "${tableName}"`);

        if (request.method === "GET") {
            let result = applyOrder(rows.filter(baseMatch), url.searchParams.get("order"));
            const offset = Number(url.searchParams.get("offset")) || 0;
            const limit = Number(url.searchParams.get("limit")) || result.length;
            result = result.slice(offset, offset + limit);
            return send(response, 200, result);
        }

        if (!user) return denied();
        const matches = (row) => baseMatch(row) && row[table.ownerColumn] === user.id;

        if (request.method === "POST") {
            const body = await readBody(request);
            const incoming = Array.isArray(body) ? body : [body];
            const upsert = prefer.includes("resolution=merge-duplicates");
            const saved = [];

            for (const input of incoming) {
                if (input?.[table.ownerColumn] !== user.id) return denied();
                const missing = table.required.find((column) => input[column] === undefined);
                if (missing) return dbError(response, 400, "23502", `null value in column "${missing}" violates not-null constraint`);
                const row = { updated_at: new Date().toISOString(), ...input };
                const problem = table.validate(row);
                if (problem) return dbError(response, 400, "23514", problem);

                const existing = rows.findIndex((candidate) => candidate[table.primaryKey] === row[table.primaryKey]);
                if (existing >= 0 && !upsert) return dbError(response, 409, "23505", "duplicate key value violates unique constraint");
                if (existing >= 0) rows[existing] = { ...rows[existing], ...row };
                else rows.push(row);
                saved.push(row);
            }

            await persist();
            return wantsRows ? send(response, 201, saved) : send(response, 201);
        }

        if (request.method === "PATCH") {
            const body = await readBody(request);
            const updated = [];
            for (let i = 0; i < rows.length; i++) {
                if (!matches(rows[i])) continue;
                const merged = { ...rows[i], ...body, [table.ownerColumn]: user.id };
                const problem = table.validate(merged);
                if (problem) return dbError(response, 400, "23514", problem);
                rows[i] = merged;
                updated.push(merged);
            }
            await persist();
            return wantsRows ? send(response, 200, updated) : send(response, 204);
        }

        if (request.method === "DELETE") {
            const removed = rows.filter(matches);
            store[tableName] = rows.filter((row) => !matches(row));
            await persist();
            return wantsRows ? send(response, 200, removed) : send(response, 204);
        }

        return dbError(response, 405, "PGRST000", "method not allowed");
    };

    const server = http.createServer(async (request, response) => {
        const url = new URL(request.url, `http://${request.headers.host}`);
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", request.headers["access-control-request-headers"] ?? "*");

        if (request.method === "OPTIONS") {
            response.writeHead(204);
            return response.end();
        }

        console.log(`${request.method} ${url.pathname}${url.search}`);

        try {
            const authMatch = url.pathname.match(/^\/auth\/v1\/(\w+)$/);
            if (authMatch) return await handleAuth(request, response, authMatch[1], url);

            const tableMatch = url.pathname.match(/^\/rest\/v1\/(\w+)$/);
            if (tableMatch) return await handleTable(request, response, tableMatch[1], url);

            if (url.pathname === "/") {
                return send(response, 200, { status: "ok", users: store.users.length, leaderboard: store.leaderboard.length });
            }
            return dbError(response, 404, "PGRST125", "Invalid path specified in request URL");
        } catch (error) {
            console.error(error);
            return dbError(response, 500, "PGRST000", error instanceof Error ? error.message : "internal error");
        }
    });

    server.listen(options.port, () => {
        const sample = store.users[0];
        console.log(`Mock Supabase running at http://localhost:${options.port}`);
        console.log(`Seeded ${store.users.length} accounts and ${store.leaderboard.length} leaderboard rows${options.persist ? ` (persisting to ${PERSIST_FILE})` : ""}`);
        if (sample) console.log(`Sign in with e.g. ${sample.email} / ${options.password}`);
        console.log(`Set VITE_SUPABASE_URL=http://localhost:${options.port} and any VITE_SUPABASE_ANON_KEY`);
    });
};

main();
