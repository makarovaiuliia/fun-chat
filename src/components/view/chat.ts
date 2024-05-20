import { View } from '../base/view';
import { IEvents } from '../base/eventEmitter';
import { TMessage, TUser } from '../../utils/types';
import createElement from '../../utils/utils';
import { divider } from '../elements';

export class Chat extends View {
	nameElement: HTMLElement;
	messagesElement: HTMLElement;
	sendingForm: HTMLFormElement;
	inputElement: HTMLInputElement;
	currentRecipient: string | undefined;
	messageToEdit: HTMLElement | undefined;
	divider: boolean = false;
	unreadMessages: string[] = [];
	newDialog: boolean = false;

	constructor(container: HTMLElement, events: IEvents) {
		super(container, events);
		this.nameElement = this.container.querySelector('.chat_header-name')!;
		this.messagesElement = this.container.querySelector('.chat_messages')!;
		this.sendingForm = this.container.querySelector('.form')!;
		this.inputElement = this.sendingForm.querySelector('.input')!;

		this.sendingForm.addEventListener('submit', this.handleSending.bind(this));
		this.messagesElement.addEventListener(
			'click',
			this.handleMessageClick.bind(this)
		);
	}

	public setUserName(user: TUser) {
		this.nameElement.textContent = user.login;
		this.nameElement.setAttribute('data-online', user.isLogined.toString());
		this.currentRecipient = user.login;
		this.inputElement.removeAttribute('disabled');
	}

	public setMessages(user: string, messages: TMessage[]) {
		this.messagesElement.innerHTML = '';
		if (messages.length === 0) {
			this.newDialog = true;
			this.messagesElement.append(
				createElement('div', {
					textContent: 'This is beginning of the chat. Send the first message',
					id: 'new',
				})
			);
			return;
		} else {
			this.newDialog = false;
		}
		messages.forEach((message) => {
			if (!message.status.isReaded) {
				this.unreadMessages.push(message.id);
				if (!this.divider && user !== message.from) {
					this.messagesElement.append(divider);
					this.divider = true;
				}
			}

			this.addMessage(user, message);
		});
	}

	public addMessage(user: string, message: TMessage) {
		if (this.currentRecipient) {
			if (this.newDialog) {
				const el = this.messagesElement.querySelector('#new')!;
				el.remove();
				this.newDialog = false;
			}
			const date = new Date(message.datetime);
			const read = message.status.isReaded;

			const messageElement = createElement(
				'div',
				{
					className: 'message-container',
					dataset: {
						user: user === message.from,
						id: message.id,
					},
				},
				[
					createElement('div', { className: 'message_header' }, [
						createElement('p', {
							className: 'message-author',
							textContent: `${user === message.from ? 'You' : message.from}`,
						}),
						user === message.from
							? createElement('div', { className: 'message_buttons' }, [
									createElement('div', {
										className: 'message-edit',
										id: 'edit',
									}),
									createElement('div', {
										className: 'message-delete',
										id: 'delete',
									}),
								])
							: createElement('div', { className: 'message_buttons' }),
					]),
					createElement('div', {
						className: 'message',
						textContent: message.text,
					}),
					createElement('div', { className: 'message_info' }, [
						user === message.from
							? createElement('p', {
									className: 'message-status delivered',
									textContent: read
										? 'read'
										: message.status.isDelivered
											? 'delivered'
											: 'sent',
								})
							: createElement('p', { className: 'message-status' }),
						createElement('p', {
							className: 'message-status edit',
							textContent: message.status.isEdited ? 'edited' : '',
						}),
						createElement('div', {
							className: 'message-time',
							textContent: `${date.getHours()}:${
								date.getMinutes().toString().length === 1
									? `0${date.getMinutes()}`
									: `${date.getMinutes()}`
							}`,
						}),
					]),
				]
			);

			this.messagesElement.append(messageElement);
			messageElement.scrollIntoView();
		}
	}

	private handleSending(event: Event) {
		event.preventDefault();
		const dividerOfMessages = this.messagesElement.querySelector('.divider');
		if (dividerOfMessages) {
			divider.remove();
			this.events.emit('messages:read', { messagesID: this.unreadMessages });
		}
		const text = this.inputElement.value;
		if (text.trim() !== '') {
			this.events.emit('message:send', { to: this.currentRecipient, text });
		}
		this.sendingForm.reset();
	}

	public cleanChat() {
		this.nameElement.textContent = 'Choose a user from the list';
		this.messagesElement.innerHTML = '';
		this.sendingForm.reset();
	}

	public editMessage(text: string) {
		this.inputElement.value = text;
	}

	public updateMessage(text: string) {
		if (this.messageToEdit) {
			this.messageToEdit.querySelector('.message')!.textContent = text;
			this.messageToEdit.querySelector('.edit')!.textContent = 'edited';
		}
		this.messageToEdit = undefined;
	}

	private handleMessageClick(event: Event) {
		const target = event.target as HTMLElement;
		const message = target.closest('.message-container') as HTMLElement;

		const dividerOfMessages = this.messagesElement.querySelector('.divider');
		if (dividerOfMessages) {
			divider.remove();
			this.events.emit('messages:read', { messagesID: this.unreadMessages });
		}

		if (
			target.classList.contains('message-edit') ||
			target.classList.contains('message-delete')
		) {
			const text = message.querySelector('.message')!.textContent;

			switch (target.id) {
				case 'edit':
					this.events.emit('message:edit', {
						id: message.dataset.id,
						text,
					});
					this.messageToEdit = message;
					break;
				case 'delete':
					this.events.emit('message:delete', { id: message.dataset.id });
					message.remove();
					break;
				default:
					break;
			}
		}
	}

	public updateReadStatus(id: string) {
		const cssId = `\\3${id[0]} ${id.slice(1)}`;
		const message = this.messagesElement.querySelector(`[data-id=${cssId}]`);
		if (message) {
			const status = message.querySelector('.delivered');
			if (status) status.textContent = 'read';
		}
	}
}
