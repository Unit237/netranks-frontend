export function urlParams(url: string, params: Record<string, string>) {
    return url + "?" + new URLSearchParams(params).toString();
}

export function money(amount) {
    return amount
        ? `$${amount}`
        : `Free`;
}