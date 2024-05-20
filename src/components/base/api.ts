type ApiPostMethods = 'POST' | 'DELETE' | 'GET' | 'PUT' | 'PATCH';

export class Api {
	readonly baseUrl: string;
	protected options: RequestInit;

	constructor(baseUrl: string, options: RequestInit = {}) {
		this.baseUrl = baseUrl;
		this.options = {
			headers: {
				'Content-Type': 'application/json',
				...((options.headers as object) ?? {}),
			},
		};
	}

	protected handleResponse<T>(response: Response): Promise<T> {
		if (response.ok) return response.json();
		else
			return response
				.json()
				.then((data) => Promise.reject(data.error ?? response.statusText));
	}

	get<T>(uri: string) {
		return fetch(this.baseUrl + uri, {
			...this.options,
			method: 'GET',
		}).then(this.handleResponse<T>);
	}

	post<T>(
		uri: string,
		data: object,
		method: ApiPostMethods = 'POST'
	): Promise<T> {
		return fetch(this.baseUrl + uri, {
			...this.options,
			method,
			body: JSON.stringify(data),
		}).then(this.handleResponse<T>);
	}

	delete<T>(uri: string, method: ApiPostMethods = 'DELETE'): Promise<T> {
		return fetch(this.baseUrl + uri, {
			...this.options,
			method,
		}).then(this.handleResponse<T>);
	}

	put<T>(
		uri: string,
		data: object,
		method: ApiPostMethods = 'PUT'
	): Promise<T> {
		return fetch(this.baseUrl + uri, {
			...this.options,
			method,
			body: JSON.stringify(data),
		}).then(this.handleResponse<T>);
	}

	patch<T>(uri: string, method: ApiPostMethods = 'PATCH'): Promise<T> {
		return fetch(this.baseUrl + uri, {
			...this.options,
			method,
		}).then(this.handleResponse<T>);
	}
}
