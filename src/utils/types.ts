export type TUser = {
	login: string;
	isLogined: boolean;
};

export type TMessage = {
	id: string;
	from: string;
	to: string;
	text: string;
	datetime: number;
	status: TMessageStatus;
};

export type TMessageStatus = {
	isDelivered: boolean;
	isReaded: boolean;
	isEdited: boolean;
};
