import { IEvents } from '../base/eventEmitter';
import { View } from '../base/view';

export class Profile extends View {
	logoutButton: HTMLButtonElement;
	userName: HTMLElement;
	userDescription: HTMLElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container, events);
		this.logoutButton = this.container.querySelector('button')!;
		this.userName = this.container.querySelector('.header_profile-name')!;
		this.userDescription = this.container.querySelector(
			'.header_profile-description'
		)!;

		this.logoutButton.addEventListener('click', () => {
			this.events.emit('user:logout');
		});
	}

	public setUser(login: string) {
		this.userName.textContent = login;
		this.userDescription.textContent = this.getRandomPhrase();
	}

	private getRandomPhrase(): string {
		const index = Math.floor(Math.random() * phrases.length);
		return phrases[index];
	}
}

const phrases: string[] = [
	'Chasing sunsets and dreams.',
	'Wandering through the pages of my story.',
	'Crafting smiles, brewing laughter.',
	'Dancing in the rain of life’s adventures.',
	'Stargazer, dream chaser.',
	'Sailing the ocean of dreams.',
	'Finding magic in the mundane.',
	'Explorer of unseen paths.',
	'Keeper of forgotten tales.',
	'Weaving dreams into reality.',
	'In pursuit of moments that matter.',
	'Collecting memories, not things.',
	'Living in a world of wonder.',
	'Journeying through life’s symphony.',
	'Embracing the art of imperfection.',
	'Finding harmony in chaos.',
	'Seeker of life’s simple joys.',
	'Crafting stories from whispers of the past.',
	'Nurturing seeds of hope and happiness.',
	'Dancing to the rhythm of the heartbeats.',
];
