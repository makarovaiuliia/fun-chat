import { IEvents } from './eventEmitter';

export class AppModel {
	public userInfo: { login: string; password: string } | undefined;
	public user: string | undefined;
	public messageToUpdate: string | undefined;

	constructor(private events: IEvents) {}

	public addUserToSessionStorage(user: { login: string; password: string }) {
		this.userInfo = user;
		sessionStorage.setItem('user', JSON.stringify(user));
	}

	public removeUserFromSessionStorage() {
		sessionStorage.removeItem('user');
	}

	public getUserFromSessionStorage():
		| { login: string; password: string }
		| undefined {
		const user = sessionStorage.getItem('user');

		if (user === null) {
			return undefined;
		}
		this.userInfo = JSON.parse(user);

		return JSON.parse(user);
	}
}
