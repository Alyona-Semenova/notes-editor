import axios from "axios";
import type { AxiosResponse } from "axios";
import type { INote } from "../types/INote";

/**
 * API client instance
 */
const apiClient = axios.create({
    baseURL: 'https://jsonplaceholder.typicode.com',
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * method for getting notes from API
 * @returns Promise<INote[]>
 */
export const getNotes = async (): Promise<INote[]> => {
    const response: AxiosResponse<INote[]> = await apiClient.get('/posts');
    return response.data;
}
