import './blocks/index.css';
import { chat, loginForm, root, userList, header } from './components/elements';
import { Form } from './components/view/form';
import { EventEmitter } from './components/base/eventEmitter';
import { AppModel } from './components/base/model';
import { ChatWebSocketAPI } from './components/chatWebSocketAPI';
import { TMessage, TUser } from './utils/types';
import { UserList } from './components/view/userList';
import { Chat } from './components/view/chat';
import { Profile } from './components/view/profile';

const events = new EventEmitter();

const form = new Form(loginForm, events);
const userListView = new UserList(userList, events);
const model = new AppModel(events);
const chatView = new Chat(chat, events);
const profileView = new Profile(header, events);

const chatApi = new ChatWebSocketAPI(
	'wss:https://fun-chat-server-yzi3.onrender.com',
	events
);

chatApi.connect();

// server response events

events.on('USER_LOGIN', () => {
	events.emit('user:login');
});

events.on('USER_ACTIVE', (payload: { users: TUser[] }) => {
	userListView.loadUsers(payload.users, model.userInfo);
});

events.on('USER_INACTIVE', (payload: { users: TUser[] }) => {
	userListView.loadUsers(payload.users, model.userInfo);
});

events.on('MSG_FROM_USER', (payload: { messages: TMessage[] }) => {
	chatView.setMessages(model.userInfo!.login!, payload.messages);
});

events.on('MSG_SEND', (payload: { message: TMessage }) => {
	if (model.userInfo) {
		chatView.addMessage(model.userInfo.login, payload.message);
	}
	if (chatView.currentRecipient === payload.message.from) {
		events.emit('messages:read', { messagesID: [payload.message.id] });
	}
});

events.on('USER_EXTERNAL_LOGIN', (payload: { user: TUser }) => {
	userListView.addUser(payload.user);
});

events.on('USER_EXTERNAL_LOGOUT', (payload: { user: TUser }) => {
	userListView.removeUser(payload.user);
});

events.on(
	'MSG_EDIT',
	(payload: {
		message: {
			id: string;
			text: string;
			status: {
				isEdited: boolean;
			};
		};
	}) => {
		chatView.updateMessage(payload.message.text);
		model.messageToUpdate = undefined;
	}
);

events.on(
	'MSG_READ',
	(payload: {
		message: {
			id: string;
			text: string;
			status: {
				isReaded: boolean;
			};
		};
	}) => {
		chatView.updateReadStatus(payload.message.id);
	}
);

// client response events

events.on('form:submit', (data: { login: string; password: string }) => {
	chatApi.login(data.login, data.password);
	form.render().remove();
	model.addUserToSessionStorage(data);
});

events.on('user:login', () => {
	profileView.setUser(model.userInfo!.login);
	chatApi.getAllAuthenticatedUsers();
	chatApi.getAllUnauthorizedUsers();
	document.body.append(root);
});

events.on('user:logout', () => {
	model.removeUserFromSessionStorage();
	chatApi.logout(model.userInfo!.login, model.userInfo!.password);
	model.userInfo = undefined;
	root.remove();
	document.body.append(form.render());
	userListView.cleanUserList();
	chatView.cleanChat();
});

events.on('user:select', (user: TUser) => {
	chatView.setUserName(user);
	chatApi.fetchMessageHistoryWithUser(user.login);
});

events.on('message:updated', ({ text, id }: { text: string; id: string }) => {
	chatApi.editMessage(id, text);
});

events.on('message:send', ({ to, text }: { to: string; text: string }) => {
	if (model.messageToUpdate) {
		events.emit('message:updated', { text, id: model.messageToUpdate });
	} else {
		chatApi.sendUserMessage(to, text);
	}
});

events.on('connection:established', () => {
	getUser();
});

events.on('message:delete', ({ id }: { id: string }) => {
	chatApi.deleteMessage(id);
});

events.on('message:edit', ({ id, text }: { id: string; text: string }) => {
	chatView.editMessage(text);
	model.messageToUpdate = id;
});

events.on('connection:closed', () => {
	userListView.cleanUserList();
	chatView.cleanChat();
});

events.on('messages:read', ({ messagesID }: { messagesID: string[] }) => {
	messagesID.forEach((message) => {
		console.log(message);
		chatApi.changeReadStatus(message);
	});
});

function getUser() {
	const data: { login: string; password: string } | undefined =
		model.getUserFromSessionStorage();

	if (data) {
		chatApi.login(data.login, data.password);
	} else {
		document.body.append(form.render());
	}
}
