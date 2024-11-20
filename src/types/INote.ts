/**
 * Interface for a note object
 */
export interface INote {
    id?: number;
    title: string;
    body: string;
    userId: number;
    completed?: boolean;
}
