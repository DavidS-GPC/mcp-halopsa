import axios from 'axios';
// HaloPSA auth endpoint is separate from the REST API base.
// If HALOPSA_BASE_URL = https://instance.halopsa.com/api
// then auth URL defaults to  https://instance.halopsa.com/auth/token
// Override with HALOPSA_AUTH_URL if your instance differs.
function getTokenEndpoint() {
    if (process.env.HALOPSA_AUTH_URL) {
        return process.env.HALOPSA_AUTH_URL;
    }
    const base = process.env.HALOPSA_BASE_URL ?? '';
    // Strip trailing /api (with or without trailing slash) and append /auth/token
    return base.replace(/\/api\/?$/, '') + '/auth/token';
}
let cache = null;
export async function getAccessToken() {
    const now = Date.now();
    if (cache && cache.expiresAt > now + 60_000) {
        return cache.accessToken;
    }
    const params = new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: process.env.HALOPSA_CLIENT_ID,
        client_secret: process.env.HALOPSA_CLIENT_SECRET,
        scope: 'all',
    });
    // Some HaloPSA instances require a tenant identifier
    if (process.env.HALOPSA_TENANT) {
        params.set('tenant', process.env.HALOPSA_TENANT);
    }
    const response = await axios.post(getTokenEndpoint(), params.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    const { access_token, expires_in } = response.data;
    cache = {
        accessToken: access_token,
        expiresAt: now + (expires_in ?? 3600) * 1000,
    };
    return cache.accessToken;
}
export function invalidateToken() {
    cache = null;
}
//# sourceMappingURL=auth.js.map