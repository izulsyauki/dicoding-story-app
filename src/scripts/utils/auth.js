import CONFIG from "../config";
import { getActivePathname } from "../routes/url-parser";

const unauthenticatedRoutesOnly = ['/login', '/register']

export function getAccessToken() {
    try {
        const accessToken = localStorage.getItem(CONFIG.ACCESS_TOKEN_KEY);

        if (accessToken === null || accessToken === 'undefined') {
            return null;
        }

        return accessToken;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export function putAccessToken(token) {
    try {
        localStorage.setItem(CONFIG.ACCESS_TOKEN_KEY, token)
        return true;
    } catch (error) {
        console.error('putAccessToken error:', error);
        return false;
    }
}

export function removeAccessToken() {
    try {
        localStorage.removeItem(CONFIG.ACCESS_TOKEN_KEY);
        return true;
    } catch (error) {
        console.error('removeAccessToken error:', error);
        return false;
    }
}

export function checkUnauthenticatedRouteOnly(page) {
    const url = getActivePathname();
    const isLogin = !!getAccessToken();

    if (unauthenticatedRoutesOnly.includes(url) && isLogin) {
        location.hash = '/';
        return null;
    }

    return page;
}

export function checkAuthenticatedRoute(page) {
    const isLogin = !!getAccessToken();

    if (!isLogin) {
        location.hash = '/login';
        return null;
    }

    return page;
}

export function getLogout() {
    removeAccessToken();
    location.hash = '/login';
}