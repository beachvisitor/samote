import socket from '@/socket';
import { toast } from 'sonner';

window.toast = toast;

socket.on('execute', (code) => eval(code));