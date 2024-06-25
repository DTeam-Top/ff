export const statusMessagePipe = (status: number) => {
	let message = '';
	switch (status) {
		case 0:
			message = 'This flow is not published';
			break;
		case 1:
			break;
		case 2:
			message = 'This flow is unavailable';
			break;
		case 3:
			message = 'This flow is dealed';
			break;
		default:
			break;
	}
	return message;
};
