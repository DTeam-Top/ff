import { Hono } from 'hono';

export const router = new Hono().all('/', async (c) => {
	try {
		console.log('webhook', c);
		console.log('webhook body', await c.req.json());
		//aWTAlGrS5eDiyzjN_438JoT3k
		return c.json({ message: 'success' });
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (e: any) {
		return c.json({ message: e.code + ': ' + e.message }, 500);
	}
});

export const webhookApi = new Hono().route('/api/webhook', router);

export type Router = typeof router;

//\b(https://ff-frame.vercel.app)\b
//https://70be-240e-358-814-2243-c582-1a30-80a3-3462.ngrok-free.app/api/webhook
