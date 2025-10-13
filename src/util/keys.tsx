export default {
    localStorage: {
        SELECTED_LANGUAGE_LOCALE: "SELECTED_LANGUAGE_LOCALE",
        ACTIVE_PROJECT_ID: "ACTIVE_PROJECT_ID",
        NEW_SURVEY: "NEW_SURVEY",
    },
    routes: {
        Root: "/",

        SignIn: "/sign-in",
        SignUp: "/sign-up",
        MagicLinkSent: "/magic-link-sent",

        Profile: pid => `/p/${pid}/profile`,
        Members: pid => `/p/${pid}/members`,
        Billing: pid => `/p/${pid}/billing`,

        ProjectOverview: pid => `/p/${pid}`,
        Survey: (pid, sid) => `/p/${pid}/s/${sid}`,
        NewSurvey: pid => `/p/${pid}/new-survey`,
    }
}