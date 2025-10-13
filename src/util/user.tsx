import { useMemo, useState } from "react";
import { replace } from "react-router-dom";
import Hub, { HubType, useHub } from "./Hub";
import connection from "./connection";
import keys from "./keys";

let globalUser;

export function useUser() {
    const [user, setUser] = useState(globalUser);
    useHub(HubType.UserChanged, setUser);
    return user;
}

export function setUser(k) {
    globalUser = k && { ...globalUser, ...k };
    Hub.dispatch(HubType.UserChanged, globalUser);
}

export function getUser() {
    return globalUser;
}

export async function loadUser(pid?: Number | undefined) {
    globalUser = await connection().get("api/GetUser");

    const savedActiveProjectId = pid ?? localStorage.getItem(keys.localStorage.ACTIVE_PROJECT_ID);
    const doesSavedActiveProjectIdExist = globalUser.Projects.filter(x => x.Id == savedActiveProjectId).length > 0;
    setActiveProjectId(doesSavedActiveProjectIdExist
        ? savedActiveProjectId
        : globalUser.Projects[0].Id
    );

    setUser(globalUser);

    return globalUser;
}

export async function getOrLoadUser({ params }) {
    const { pid } = params;
    const user = globalUser ?? await loadUser(pid);
    return pid == user.ActiveProjectId
        ? user
        : replace(keys.routes.Root);
}

export function setActiveProjectId(projectId) {
    localStorage.setItem(
        keys.localStorage.ACTIVE_PROJECT_ID,
        projectId
    );
    setUser({ ActiveProjectId: projectId });
}

export function useActiveProject() {
    const user = useUser();
    return useMemo(() => {
        return user.Projects.filter(x => x.Id == user.ActiveProjectId)[0];
    }, [user]);
}

export function useSurveys() {
    return useActiveProject().Surveys;
}
