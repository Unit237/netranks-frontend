import Axios, { AxiosRequestConfig, CancelTokenSource } from "axios";
import { Component } from "react";
import token from "./token";
import prms from "./prms";
import { v4 as uuid } from 'uuid';

export interface ConnectionConfig extends AxiosRequestConfig {
    /**
    * To cancel the connection request.
    *
    * 1. Like file upload queries, apiCancel is called with the same key to cancel.
    *
    * 2. In order to automatically cancel previous queries in consecutive queries, such as autocomplete,
    * previous queries with the same cancelTokenKey are automatically canceled, no additional action is required.
    *
    */
    cancelTokenKey: string,

    /**
    * screen componentId, if this is filled, requests on that screen are automatically canceled when that screen is pop
    */
    componentId: string,
}

const axios = Axios.create({
    timeout: 120000,
    validateStatus: _ => true,
});

axios.interceptors.request.use(
    async config => {

        config.headers.post["Content-Type"] = "application/json";
        config.headers.put["Content-Type"] = "application/json";
        config.headers.patch["Content-Type"] = "application/json";

        const authToken = token.get();
        if (authToken) {
            // TODO: security vulnerability!!! webclient authentication works like always remember me. Also, we can think of a better solution than storing the token explicitly in localStorage.
            config.headers.common["token"] = authToken;
        }

        return config;
    });

const loading = (f?: (x: boolean) => {} | undefined, isLoading?: boolean) => {
    if (!f) return;

    try {
        f?.(!!isLoading);
    } catch (error) {
        console.log(`Connection.SetLoading=${isLoading} failed`, error);
    }
}

const STR_CANCEL_TOKEN_MSG = "Request canceled with cancel token";
const cancelTokens = new Map<any, CancelTokenSource>();
const screenCancelTokenKeys = new Map<string, string[]>();
function handleCancelTokens(config?: ConnectionConfig): string | null {
    const key = config?.cancelTokenKey || (config?.componentId && uuid());
    if (!key) return null;

    cancelConnection(key);

    const cts = Axios.CancelToken.source();
    cancelTokens.set(key, cts);
    if (screenCancelTokenKeys.has(config.componentId)) {
        screenCancelTokenKeys.get(config.componentId)?.push(key);
    } else {
        screenCancelTokenKeys.set(config.componentId, [key]);
    }
    config.cancelToken = cts.token;
    return key;
}

export function cancelConnection(cancelTokenKey: string): boolean {
    const key = cancelTokenKey;
    if (!key || !cancelTokens.has(key)) return false;
    cancelTokens.get(key)?.cancel(STR_CANCEL_TOKEN_MSG);
    cancelTokens.delete(key);
    return true;
}

export function cancelScreenConnections(componentId: string): boolean {
    const hasCanceledAny = (screenCancelTokenKeys.get(componentId) || []).map(cancelConnection).filter(x => x).length > 0;
    screenCancelTokenKeys.delete(componentId);
    return hasCanceledAny;
}

function clearJsonIds(obj: any) {
    if (obj && typeof obj === "object") {
        delete obj.$id;
        Object.values(obj).forEach(clearJsonIds);
    }
}

async function myFetch(setLoading?: (x: boolean) => {} | Component | undefined, config?: ConnectionConfig): Promise<Response> {
    return new Promise(async (resolve, reject) => {

        try {
            loading(setLoading, true);

            console.log(config?.method, config?.url, config?.data);
            const cancelKey = handleCancelTokens(config);
            clearJsonIds(config?.data);
            const response = await axios.request(config || {});
            console.log(response.status, config?.url);

            if (cancelKey) {
                cancelTokens.delete(cancelKey);
            }

            // Unauthorized
            if (response.status === 401) {
                token.clear();
                window.location.href = "/";
                return;
            }

            // Forbidden
            if (response.status === 403) {
                alert(response.data || "Unauthorized");
                window.location.href = '/';
                return;
            }

            loading(setLoading, false);

            // Internal Server Error
            if (response.status === 500) {
                console.log(response);
                alert("TODO: Unexpected Error");
                return;
            }

            if (response.status !== 200 && response.status !== 204) {
                reject(response);
                return;
            }

            resolve(response.data);

        } catch (error) {

            if (error.message == STR_CANCEL_TOKEN_MSG) {
                console.log(STR_CANCEL_TOKEN_MSG, config?.url);
                return;
            }

            console.log("=== CONNECTION ERROR ===");
            console.log(error);
            console.log(JSON.stringify(error));
            console.log("=======================");

            if (error.code == "ECONNABORTED") {
                alert("TODO: Timeout");
            } else {
                alert("TODO: No connection");
            }

            loading(setLoading, false);
            //reject(error); // In this case, when using the connection on the screens, it should not fall into catch, it should fall only when the response to catch comes successfully but is not 200 or 204.
        }
    });
}

export default function connection(setLoading?: (x: boolean) => {} | Component | undefined, config?: ConnectionConfig) {

    const baseUrl = prms.SERVER_URL;

    return {
        get: (url: string): any => {
            return myFetch(setLoading, { ...config, url: baseUrl + url, method: "GET" });
        },

        post: (url: string, data: object | number | string): any => {

            // fix: public IHttpActionResult Patch(int id, [FromBody] int data) { /* ... */ }
            if (typeof (data) == "number") {
                data = "\"" + data + "\"";
            } else if (typeof (data) == "string") {
                data = JSON.stringify(data);
            }

            return myFetch(setLoading, { ...config, url: baseUrl + url, method: "POST", data });
        },

        put: (id: number, url: string, data: object): any => {
            if (url.startsWith("odata")) {
                url += "(" + id + ")";
            } else {
                url += "/" + id;
            }
            return myFetch(setLoading, { ...config, url: baseUrl + url, method: "PUT", data });
        },

        patch: (id: number, url: string, data: object | number | string): any => {
            if (url.startsWith("odata")) {
                url += "(" + id + ")";
            } else {
                url += "/" + id;
            }

            // fix: public IHttpActionResult Patch(int id, [FromBody] int data) { /* ... */ }
            if (typeof (data) == "number") {
                data = "\"" + data + "\"";
            } else if (typeof (data) == "string") {
                data = JSON.stringify(data);
            }

            return myFetch(setLoading, { ...config, url: baseUrl + url, method: "PATCH", data });
        },

        delete: (id: number, url: string): any => {
            if (id != null) {
                url += "/" + id;
            }
            return myFetch(setLoading, { ...config, url: baseUrl + url, method: "DELETE" });
        },
    };
}
