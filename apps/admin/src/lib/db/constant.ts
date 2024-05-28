import pino from 'pino';
import { PUBLIC_LOG_LEVEL } from '$env/static/public';

export const LOGGER = pino({ level: 'debug' });
