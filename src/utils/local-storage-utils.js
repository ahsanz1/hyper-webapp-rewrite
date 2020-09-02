export const getLocal = (key) => {
    return JSON.parse(window.localStorage.getItem(key));
}

export const saveLocal = (key, value) => {
    window.localStorage.setItem(key, JSON.stringify(value));
}

export const removeLocal = (key) => {
    window.localStorage.removeItem(key);
}