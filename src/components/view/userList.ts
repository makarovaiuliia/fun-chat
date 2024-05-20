import { TUser } from '../../utils/types';
import createElement from '../../utils/utils';
import { IEvents } from '../base/eventEmitter';
import { View } from '../base/view';

export class UserList extends View {
	userList: HTMLUListElement;
	searchElement: HTMLInputElement;
	currentUserElement: HTMLElement | null;
	users: TUser[] | undefined;

	constructor(container: HTMLElement, events: IEvents) {
		super(container, events);
		this.userList = this.container.querySelector('.user-list_list')!;
		this.searchElement = this.container.querySelector(
			'.user-list_search_input'
		)!;
		this.currentUserElement = null;

		this.userList.addEventListener('keydown', this.handleClick.bind(this));
		this.searchElement.addEventListener('input', this.handleSearch.bind(this));
	}

	public loadUsers(
		users: TUser[],
		currentUser: { login: string; password: string } | undefined = undefined
	) {
		users.forEach((user) => {
			if (currentUser && currentUser.login === user.login) return;
			this.addUser(user);
		});
	}

	private handleClick(event: Event) {
		const eventTarget = event.target as HTMLElement;
		const target = eventTarget.closest('.user')! as HTMLElement;
		if (target) {
			this.events.emit('user:select', {
				login: target.dataset.login,
				isLogined: target.dataset.online,
			});
			this.currentUserElement?.removeAttribute('data-active');
			this.currentUserElement = target;
			this.currentUserElement?.setAttribute('data-active', 'true');
		}
	}

	private handleSearch(event: Event) {
		const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();

		Array.from(this.userList.children).forEach((userElement: Element) => {
			const userName = userElement.getAttribute('data-login')!.toLowerCase();
			const isMatch = userName.startsWith(searchTerm);
			(userElement as HTMLElement).style.display = isMatch ? '' : 'none';
		});
	}

	public removeUser(user: TUser) {
		const userToRemove = this.userList.querySelector(
			`[data-login=${user.login}]`
		);
		userToRemove?.remove();
	}

	public addUser(user: TUser) {
		const userCurrent = this.userList.querySelector(
			`[data-login=${user.login}]`
		);
		if (userCurrent) return;
		const userElement = createElement(
			'li',
			{
				className: 'user',
				dataset: {
					lastMessage: 'you',
					online: user.isLogined,
					login: user.login,
				},
			},
			[
				createElement('div', { className: 'user_photo' }),
				createElement('div', { className: 'user_info' }, [
					createElement('div', {
						className: 'user_name',
						textContent: `${user.login}${user.isLogined ? ' (online)' : ''}`,
					}),
				]),
			]
		);

		userElement.addEventListener('click', this.handleClick.bind(this));
		user.isLogined
			? this.userList.prepend(userElement)
			: this.userList.append(userElement);
	}

	public cleanUserList() {
		this.userList.innerHTML = '';
	}
}
