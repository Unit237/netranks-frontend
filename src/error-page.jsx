import { Navigate, useRouteError } from "react-router-dom";

export default function ErrorPage() {
    const error = useRouteError();
    console.error(error);

    return <Navigate replace to="/" />;

    return (
        <div id="error-page">
            <h1>Something's not quite right...</h1>
            <p>Well, this was't expected. But we'll take care of it as soon as possible.</p>
            <p>
                <i>{error.statusText || error.message}</i>
            </p>
        </div>
    );
}