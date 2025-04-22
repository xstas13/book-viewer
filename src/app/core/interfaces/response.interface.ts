export interface IResponse<T> {
    data: T | null;
    loading: boolean;
    error?: string;
}