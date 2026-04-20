import { customAlphabet } from 'nanoid';
const alpha = '0123456789abcdefghijklmnopqrstuvwxyz';
export const newId = customAlphabet(alpha, 10);
