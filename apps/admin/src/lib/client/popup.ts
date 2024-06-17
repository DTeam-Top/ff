import {
	type ModalComponent,
	type ModalSettings,
	type ModalStore,
	type ToastSettings,
	type ToastStore
} from '@skeletonlabs/skeleton';

const modalHander = (type: 'alert' | 'confirm' | 'prompt' | 'component') => {
	return (
		modalStore: ModalStore,
		title: string,
		body: string,
		cssClass: string,
		handler: (r: boolean) => void
	) => {
		const modal: ModalSettings = {
			type: type,
			title,
			body,
			modalClasses: cssClass,
			response: async (r: boolean) => {
				handler(r);
			}
		};
		modalStore.trigger(modal);
	};
};
const modalComponentForm = (
	modalStore: ModalStore,
	message: string,
	c: ModalComponent,
	handler: (r: boolean) => void
) => {
	const modal: ModalSettings = {
		type: 'component',
		component: c,
		title: 'Withdraw confirm',
		body: message,
		response: (r: any) => {
			handler(r);
		}
	};
	modalStore.trigger(modal);
};

export const modal = { confirm: modalHander('confirm'), prompt: modalComponentForm };

const toastlHander = (type: 'success' | 'error') => {
	return (toastStore: ToastStore, message: string) => {
		const t: ToastSettings = {
			message: message,
			background: `variant-filled-${type}`,
			timeout: 3000
		};
		toastStore.trigger(t);
	};
};

export const toast = { success: toastlHander('success'), error: toastlHander('error') };
