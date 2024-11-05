import { io } from 'socket.io-client';
import { ref } from 'vue';
import { useChatStore } from './store/chatStore';
const authToken = localStorage.getItem('access_token')

const socket = io('http://192.168.29.152:5000', {
  autoConnect: false,
  query : {
    token : authToken
  }
});

export const isConnected = ref(false);

export function setupSocketIO() {
  const chatStore = useChatStore();

  socket.on('connect', () => {
    console.log('Connected to Socket.IO server');
    isConnected.value = true;
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from Socket.IO server');
    isConnected.value = false;
  });

  socket.on('new_message', (message) => {
    chatStore.addMessage(message);
  });

  return {
    connect: (token) => {
      socket.auth = { token };
      socket.connect();
    },
    disconnect: () => socket.disconnect(),
    sendMessage: (message) => {
      return new Promise((resolve, reject) => {
        socket.emit('send_message', message,   (response) => {
          if (response.status === 'ok') {
            resolve(response.message);
          } else {
            reject(new Error(response.error));
          }
        });
      });
    }
  };
}