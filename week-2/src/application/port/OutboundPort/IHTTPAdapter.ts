export interface IHTTPAdapter {
    post(url: string, data: object): Promise<any>;
}