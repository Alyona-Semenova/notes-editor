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

/**
 * method to delete a note
 * @param id 
 */
export const deleteNote = async (id: number): Promise<void> => {
    await apiClient.delete(`/posts/${id}`);
}

/**
 * method to patch a note
 * @param id 
 * @param noteTitle
 */
export const patchNote = async (id: number, noteTitle: string): Promise<void> => {
    await apiClient.patch(`/posts/${id}`, {
        title: noteTitle,
    });
}



