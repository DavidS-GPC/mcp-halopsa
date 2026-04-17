import axios from 'axios';
import { getAccessToken, invalidateToken } from './auth.js';
export function createHaloClient() {
    const client = axios.create({
        baseURL: process.env.HALOPSA_BASE_URL,
        headers: { 'Content-Type': 'application/json' },
    });
    // Inject Bearer token on every request
    client.interceptors.request.use(async (config) => {
        const token = await getAccessToken();
        config.headers.Authorization = `Bearer ${token}`;
        return config;
    });
    // On 401, invalidate cached token and retry once
    client.interceptors.response.use((res) => res, async (error) => {
        if (axios.isAxiosError(error) &&
            error.response?.status === 401 &&
            error.config) {
            const config = error.config;
            if (!config._retry) {
                config._retry = true;
                invalidateToken();
                config.headers.Authorization = `Bearer ${await getAccessToken()}`;
                return client(config);
            }
        }
        throw error;
    });
    return client;
}
export const haloClient = createHaloClient();
//# sourceMappingURL=client.js.map