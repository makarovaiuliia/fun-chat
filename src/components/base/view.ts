import { IEvents } from './eventEmitter';

export class View {
	protected container: HTMLElement;
	protected events: IEvents;

	constructor(container: HTMLElement, events: IEvents) {
		this.container = container;
		this.events = events;
	}

	render() {
		return this.container;
	}
}
