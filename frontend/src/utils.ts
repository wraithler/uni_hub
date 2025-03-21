/* Debounce function to limit the number of times a function is called in a given time frame */
export function debounce(func: (...args: any[]) => void, wait: number) {
    let timeout: NodeJS.Timeout;
    return function (this: any, ...args: any[]) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

export type Filters = {
    [key: string]: string | number | boolean | undefined;
}

export function buildQueryParams(filters: Filters) {
    const queryParams = new URLSearchParams();

    Object.keys(filters).forEach((key) => {
        const value = filters[key];

        if (value !== undefined && value !== "") {
            queryParams.append(key, String(value));
        }
    });

    return queryParams.toString();
}