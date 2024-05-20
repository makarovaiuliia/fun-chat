import { IEvents } from '../base/eventEmitter';

export class Form {
	private submit: HTMLButtonElement;
	private inputElements: HTMLInputElement[];
	private container: HTMLFormElement;
	private events: IEvents;

	constructor(container: HTMLFormElement, events: IEvents) {
		this.container = container;
		this.events = events;
		this.submit = this.container.querySelector<HTMLButtonElement>('.button')!;
		this.inputElements = Array.from(
			this.container.querySelectorAll('.login_input')!
		);

		this.inputElements.forEach((element: HTMLInputElement) => {
			element.addEventListener('input', () => {
				this.checkValidity(element);
				this.toggleButtonState();
			});
		});

		this.container.addEventListener('submit', this.handleSubmit.bind(this));
	}

	private handleSubmit(event: Event) {
		event.preventDefault();
		const data = this.inputElements.reduce((acc, val) => {
			return { ...acc, [val.name]: val.value };
		}, {});
		this.events.emit('form:submit', data);
		this.container.reset();
	}

	private checkValidity(element: HTMLInputElement) {
		if (element.validity.patternMismatch) {
			element.setCustomValidity(element.dataset.errorMessage!);
		} else {
			element.setCustomValidity('');
		}
		if (!element.validity.valid) {
			this.showErrorMessage(element);
		} else {
			this.hideErrorMessage(element);
		}
	}

	private toggleButtonState() {
		if (this.hasInvalidInput()) {
			this.submit.setAttribute('disabled', '');
		} else {
			this.submit.removeAttribute('disabled');
		}
	}

	private hasInvalidInput() {
		return this.inputElements.some((inputElement) => {
			return !inputElement.validity.valid;
		});
	}

	private showErrorMessage(element: HTMLInputElement) {
		const errorElement = this.container.querySelector(
			`#error-${element.name}`
		)!;
		element.classList.add('login_input-error');
		errorElement.textContent = element.validationMessage;
		errorElement.classList.add('error-active');
	}

	private hideErrorMessage(element: HTMLInputElement) {
		const errorElement = this.container.querySelector(
			`#error-${element.name}`
		)!;
		element.classList.remove('login_input-error');
		errorElement.textContent = element.validationMessage;
		errorElement.classList.remove('error-active');
	}

	public render() {
		return this.container;
	}
}
