export class ApiService<T> {
    private readonly baseUrl: string = "http://localhost:3000";

    private entity: string;

    constructor(entity: string) {
        this.entity = entity;
    }

    private async request<T>(method: string, url: string, data?: any): Promise<T> {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    }

    async getAll(queryParams?: { page?: number; limit?: number }): Promise<T[]> {
        let url = `${this.baseUrl}/${this.entity}`;
        
        if (queryParams) {
            const params = new URLSearchParams();
            if (queryParams.page) params.append('page', queryParams.page.toString());
            if (queryParams.limit) params.append('limit', queryParams.limit.toString());
            url += `?${params.toString()}`;
        }

        return this.request<T[]>('GET', url);
    }

    async getOne(id: string | number): Promise<T> {
        const url = `${this.baseUrl}/${this.entity}/${id}`;
        return this.request<T>('GET', url);
    }

    async create(data: Omit<T, 'id'>): Promise<T> {
        const url = `${this.baseUrl}/${this.entity}`;
        return this.request<T>('POST', url, data);
    }

    async update(id: string | number, data: Partial<T>): Promise<T> {
        const url = `${this.baseUrl}/${this.entity}/${id}`;
        return this.request<T>('PATCH', url, data);
    }

    async delete(id: string | number): Promise<void> {
        const url = `${this.baseUrl}/${this.entity}/${id}`;
        await this.request<void>('DELETE', url);
    }
}