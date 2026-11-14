import { Link, isRouteErrorResponse, useRouteError } from "react-router";
import EmptyState from "@/Components/EmptyState/EmptyState";
import styles from "./ErrorPage.module.css";

const describeError = (error: unknown) => {
    if (isRouteErrorResponse(error)) {
        return error.status === 404
            ? { title: "Page not found", description: "That address doesn't match anything in the app." }
            : { title: `Error ${error.status}`, description: error.statusText };
    }
    if (error instanceof Error) return { title: "Something went wrong", description: error.message };
    return { title: "Something went wrong", description: "An unexpected error occurred." };
};

const ErrorPage = () => {
    const { title, description } = describeError(useRouteError());

    return (
        <div className={styles.page}>
            <EmptyState
                title={title}
                description={description}
                action={
                    <Link to="/" className="button primary">
                        Back to dashboard
                    </Link>
                }
            />
        </div>
    );
};

export default ErrorPage;
