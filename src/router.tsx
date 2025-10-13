import React from "react";
import { createBrowserRouter, redirect, replace } from "react-router-dom";
import { LoadingLite } from "./main";
import connection from "./util/connection";
import keys from "./util/keys";
import token from "./util/token";
import { getOrLoadUser, loadUser } from "./util/user";
import ErrorPage from "./error-page";

export const router = createBrowserRouter([
    // Root
    {
        path: "/",
        Component: LoadingLite,
        loader: async () => replace(token.get()
            ? keys.routes.ProjectOverview((await loadUser()).ActiveProjectId)
            : keys.routes.SignIn
        ),
        hydrateFallbackElement: <LoadingLite />,
        errorElement: <ErrorPage />,
    },

    // Auth
    {
        hydrateFallbackElement: <LoadingLite />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "/sign-up",
                lazy: async () => ({ Component: (await import("./pages/auth/SignUpOrSignIn")).default }),
                loader: () => ({ signUp: true }),
            },
            {
                path: "/sign-in",
                lazy: async () => ({ Component: (await import("./pages/auth/SignUpOrSignIn")).default }),
                loader: () => ({ signUp: false }),
            },
            {
                path: "/magic-link-sent",
                lazy: async () => ({ Component: (await import("./pages/auth/MagicLinkSent")).default }),
            },
            {
                path: "/login/:magicLinkId/:p1/:p2",
                loader: async ({ params }) => {
                    const { magicLinkId, p1, p2 } = params;
                    const t = await connection().get(`api/ConsumeMagicLink/${magicLinkId}/${p1}/${p2}`);
                    token.set(t);
                    return redirect(keys.routes.Root);
                },
            },
        ]
    },

    // Dashboard
    {
        path: "/p/:pid",
        lazy: async () => ({ Component: (await import("./templates/dashboard/Dashboard")).default }),
        loader: getOrLoadUser,
        hydrateFallbackElement: <LoadingLite />,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                lazy: async () => ({ Component: (await import("./pages/project/ProjectOverview")).default }),
            },
            {
                path: "new-survey",
                lazy: async () => ({ Component: (await import("./pages/new-survey/NewSurvey")).default }),
            },
            {
                path: "s/:sid",
                lazy: async () => ({ Component: (await import("./pages/survey/Survey")).default }),
                loader: async ({ params }) => await connection().get(`api/GetSurvey/${params.sid}`),
            },
            {
                path: "profile",
                lazy: async () => ({ Component: (await import("./pages/Profile")).default }),
            },
            {
                path: "members",
                lazy: async () => ({ Component: (await import("./pages/members/Members")).default }),
                loader: async ({ params }) => await connection().get(`api/GetMembers/${params.pid}`),
            },
            {
                path: "billing",
                lazy: async () => ({ Component: (await import("./pages/billing/Billing")).default }),
                loader: async ({ params }) => await connection().get(`api/GetPaymentMethod/${params.pid}`),
            }
        ],
    },
]);
