import { IEvents } from './base/eventEmitter';

type MessageType =
	| 'USER_LOGIN'
	| 'USER_LOGOUT'
	| 'MSG_SEND'
	| 'MSG_FROM_USER'
	| 'ERROR'
	| string;

interface IMessagePayload {
	user?: {
		login: string;
		password?: string;
	};
	message?: {
		to?: string;
		text?: string;
		id?: string;
	};
}

interface IMessage {
	id: string | null;
	type: MessageType;
	payload: IMessagePayload;
}

export class ChatWebSocketAPI {
	private serverUrl: string;
	private websocket: WebSocket | null;
	private events: IEvents;

	constructor(serverUrl: string, events: IEvents) {
		this.serverUrl = serverUrl;
		this.websocket = null;
		this.events = events;
	}

	connect(): void {
		this.websocket = new WebSocket(this.serverUrl);

		this.websocket.onopen = () => this.events.emit('connection:established');
		this.websocket.onmessage = this.handleMessage.bind(this);
		this.websocket.onerror = (error: Event) =>
			console.error('WebSocket error:', error);
		this.websocket.onclose = () => this.events.emit('connection:closed');
	}

	private sendMessage(
		type: MessageType,
		payload: IMessagePayload,
		id: string | null = null
	): void {
		if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
			this.websocket.send(JSON.stringify({ id, type, payload }));
		} else {
			console.error('WebSocket is not open. Cannot send messages.');
		}
	}

	private handleMessage(event: MessageEvent): void {
		const message: IMessage = JSON.parse(event.data);
		this.events.emit(message.type, message.payload);
	}

	public login(login: string, password: string): void {
		this.sendMessage('USER_LOGIN', { user: { login, password } });
	}

	public logout(login: string, password: string): void {
		this.sendMessage('USER_LOGOUT', { user: { login, password } });
	}

	public sendUserMessage(to: string, text: string): void {
		this.sendMessage('MSG_SEND', { message: { to, text } });
	}

	public fetchMessageHistoryWithUser(login: string): void {
		this.sendMessage('MSG_FROM_USER', { user: { login } });
	}

	public getAllAuthenticatedUsers(): void {
		this.sendMessage('USER_ACTIVE', {});
	}

	public getAllUnauthorizedUsers(): void {
		this.sendMessage('USER_INACTIVE', {});
	}

	public deleteMessage(id: string): void {
		this.sendMessage('MSG_DELETE', { message: { id } });
	}

	public editMessage(id: string, text: string) {
		this.sendMessage('MSG_EDIT', { message: { id, text } });
	}

	public changeReadStatus(id: string) {
		this.sendMessage('MSG_READ', { message: { id } });
	}

	disconnect(): void {
		if (this.websocket) {
			this.websocket.close();
			this.websocket = null;
		}
	}
}
