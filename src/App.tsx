import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";

import AppLayout from "@/Pages/__LAYOUT/AppLayout";
import ErrorPage from "@/Pages/__LAYOUT/ErrorPage";

import Dashboard from "@/Pages/Dashboard/Dashboard";
import Login from "@/Pages/Login/Login";
import Market from "@/Pages/Market/Market";
import StockPage from "@/Pages/Market/StockPage";
import Charts from "@/Pages/Charts/Charts";
import News from "@/Pages/News/News";
import Portfolio from "@/Pages/Portfolio/Portfolio";
import Calendar from "@/Pages/Calendar/Calendar";
import Leaderboard from "@/Pages/Leaderboard/Leaderboard";
import Settings from "@/Pages/Settings/Settings";

const browserRouter = createBrowserRouter([
    {
        path: "/",
        element: <AppLayout />,
        errorElement: <ErrorPage />,
        children: [
            { index: true, element: <Dashboard /> },
            { path: "market", element: <Market /> },
            { path: "charts", element: <Charts /> },
            { path: "market/:symbol", element: <StockPage /> },
            { path: "news", element: <News /> },
            { path: "portfolio", element: <Portfolio /> },
            { path: "calendar", element: <Calendar /> },
            { path: "leaderboard", element: <Leaderboard /> },
            { path: "settings", element: <Settings /> },
        ],
    },
    {
        path: "/login",
        element: <Login />,
        errorElement: <ErrorPage />,
    },
    {
        path: "*",
        element: <ErrorPage />,
    },
]);

const App = () => {
    return <RouterProvider router={browserRouter} />;
};

export default App;
