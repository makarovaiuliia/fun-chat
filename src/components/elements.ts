import createElement from '../utils/utils';

// profile photo, name and data

export const header = createElement('header', { className: 'header' }, [
	createElement('div', { className: 'header_profile' }, [
		createElement('div', { className: 'header_profile-photo' }),
		createElement('div', {
			className: 'header_profile-name',
			textContent: 'Iuliia Makarova',
		}),
		createElement('div', {
			className: 'header_profile-description',
			textContent: 'I love dogs, travelling and chatting',
		}),
	]),
	createElement('button', {
		className: 'header_logout',
		textContent: 'Logout',
	}),
]);

// messages and chat

export const userList = createElement('section', { className: 'user-list' }, [
	createElement(
		'div',
		{ className: 'user-list_search' },
		createElement<HTMLInputElement>('input', {
			className: 'user-list_search_input',
			placeholder: 'Search...',
		})
	),
	createElement('ul', { className: 'user-list_list' }, []),
]);

export const chat = createElement('section', { className: 'chat' }, [
	createElement('div', { className: 'chat_header' }, [
		createElement('h2', {
			classList: 'chat_header-name',
			textContent: 'Choose a user from the list',
		}),
	]),
	createElement('div', { className: 'chat_messages' }),
	createElement(
		'div',
		{ className: 'chat_sending-form' },
		createElement('form', { className: 'form' }, [
			createElement<HTMLInputElement>('input', {
				placeholder: 'Your message',
				name: 'message',
				className: 'input',
				disabled: 'true',
			}),
			createElement<HTMLButtonElement>('button', {
				className: 'form_button',
				type: 'submit',
			}),
		])
	),
]);

export const main = createElement('main', { className: 'main' }, [
	userList,
	chat,
]);

export const divider = createElement('div', { className: 'divider' });

// rs school

export const footer = createElement('footer', { className: 'footer' }, [
	createElement('div', { textContent: 'RS school' }),
	createElement('div', { textContent: 'Fun chat project' }),
	createElement('div', { textContent: '2024' }),
]);

export const root = createElement('div', { className: 'root' }, [
	main,
	header,
	footer,
]);

// authentication form

export const loginForm = createElement<HTMLFormElement>(
	'form',
	{ className: 'login' },
	[
		createElement('label', {
			className: 'login_title',
			textContent: 'Login - Fun Chat',
		}),
		createElement<HTMLLabelElement>('label', { className: 'login_field' }, [
			createElement('span', {
				className: 'login_label',
				textContent: 'Login',
			}),
			createElement<HTMLInputElement>('input', {
				className: 'login_input',
				type: 'text',
				name: 'login',
				pattern: '[\\-a-zA-z0-9\\s]+$',
				minLength: '3',
				required: 'true',
				dataset: {
					errorMessage:
						'Only English alphabet letters, numbers, spaces and hyphens allowed.',
				},
			}),
			createElement('span', {
				className: 'error',
				id: 'error-login',
			}),
		]),
		createElement<HTMLLabelElement>('label', { className: 'login_field' }, [
			createElement('span', {
				className: 'login_label',
				textContent: 'Password',
			}),
			createElement<HTMLInputElement>('input', {
				className: 'login_input',
				type: 'text',
				name: 'password',
				pattern: '[\\-a-zA-z0-9\\s]+$',
				required: 'true',
				minLength: '3',
				dataset: {
					errorMessage:
						'Only English alphabet letters, numbers, spaces and hyphens allowed.',
				},
			}),
			createElement('span', {
				className: 'error',
				id: 'error-password',
			}),
		]),
		createElement<HTMLButtonElement>('button', {
			className: 'button',
			type: 'submit',
			textContent: 'Login',
			disabled: 'true',
		}),
	]
);
