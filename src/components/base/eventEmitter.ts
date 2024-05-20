type EventName = string | RegExp;
// @typescript-eslint/ban-types
type Subscriber = Function;

export interface IEvents {
	on<T extends object>(event: EventName, callback: (data: T) => void): void;
	emit<T extends object>(event: string, data?: T): void;
}

export class EventEmitter implements IEvents {
	_events: Map<EventName, Set<Subscriber>>;

	constructor() {
		this._events = new Map<EventName, Set<Subscriber>>();
	}

	on<T extends object>(eventName: EventName, callback: (event: T) => void) {
		let subscribers = this._events.get(eventName);
		if (!subscribers) {
			subscribers = new Set<Subscriber>();
			this._events.set(eventName, subscribers);
		}
		subscribers.add(callback);
	}

	emit<T>(eventName: string, data?: T) {
		this._events.forEach((subscribers, name) => {
			if (name === eventName) {
				subscribers.forEach((callback) => callback(data));
			}
		});
	}
}
