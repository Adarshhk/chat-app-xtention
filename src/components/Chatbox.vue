<template>
  <div class="w-full h-max bg-slate-300 rounded">
    <!-- Header -->
    <div class="w-full bg-gray-600 flex items-center rounded">
      <div class="border border-gray-600 rounded-full text-2xl p-4 m-2 px-6 bg-black">
        <i class="pi pi-user" style="font-size: large;"></i>
      </div>

      <div class="w-full flex items-center ml-4">
        <p class="self-center my-5 text-lg">{{ props.selectedUser.name }}</p>
      </div>

      <button @click="props.closeChatBox"
        class="rounded-lg hover:bg-gray-500 transition-all duration-300 mr-4 my-2 p-4">
        <i class="pi pi-arrow-left" style="font-size: larger;"></i>
      </button>
    </div>

    <!-- Chat Messages -->
    <div class="bg-slate-300 w-full h-96 overflow-y-auto p-4 space-y-4">
      <div v-if="chatStore.loading" class="flex justify-center mt-4">
        <ProgressSpinner />
      </div>
      <div v-else>
        <div v-for="(chat, index) in chats" :key="index"
          :class="['w-full flex mb-2', chat.receiver_role === profileStore.profileData.role ? 'justify-start' : 'justify-end']">
          <div
            :class="['max-w-[75%] px-4 py-3 rounded-lg overflow-hidden', chat.receiver_role !== profileStore.profileData.role ? 'bg-blue-600' : 'bg-gray-700']">
            <!-- Show only the time next to each message -->
            <span class="text-xs text-gray-400">{{ formatTime(chat.timestamp) }}</span>
            <p class="text-sm text-white my-2">{{ chat.content }}</p>
            <!-- Show date next to Delivered -->
            <span class="text-xs text-gray-400 block">Delivered - {{ formatDate(chat.timestamp) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Message Input -->
    <div class="bg-blue-400 h-12 rounded-sm flex items-center px-4 space-x-2">
      <input placeholder="Write a message..." type="text"
        class="flex-grow rounded-xl bg-white p-2 text-black focus:outline-none" v-model="message.content">
      <button :disabled="sendingMsg" @click="sendMessage"
        class="bg-blue-600 p-2 rounded-full hover:bg-blue-700 transition">
        <i v-if="!sendingMsg" class="pi pi-send text-white" style="font-size: larger;"></i>
        <div v-else>

          <ProgressSpinner />
        </div>
      </button>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import { onMounted, reactive, ref, watch } from 'vue';
import { useProfileStore } from '../store/profileStore';
import { useChatStore } from '../store/chatStore';

import ProgressSpinner from 'primevue/progressspinner';
import { io } from 'socket.io-client';

import { useToast } from 'primevue/usetoast';
import { data } from 'autoprefixer';

const toast = useToast();
const profileStore = useProfileStore();
const chatStore = useChatStore();

const chats = ref([]);

const socket = ref(null);
const setupSocket = () => {
  try {

    socket.value = io('http://192.168.29.152:5000' , {
      
      query : {
        //user_id : profileStore.profileData.id,
        token:  localStorage.getItem('accessToken')
      },
      extraHeaders : {
        Authorization : `Bearer ${localStorage.getItem('accessToken')}`
      }
      
    })
  } catch (error) {
    console.log("error in setup");
  }

  socket.value.on('connect_error', (error) => {
    console.error("Connection error:", error);
  });
  socket.value.on('connect_failed', (error) => {
    console.error("Connection failed:", error);
  });

  socket.value.on('connect', () => {
    console.log(`connecting with socket id: ${socket.value.id}`);
  })

  socket.value.on('receive_message', (res) => {
    console.log(res);

  })
  socket.value.on('message_sent' , (res) => {
    toast.add({ severity: 'success', summary: 'Sucess', detail: res.msg, life: 3000 });
  })
}

const props = defineProps({
  closeChatBox: Function,
  selectedUser: Object,

});

const sendingMsg = ref(false);
const message = reactive({
  content: "",
  receiver_id: null,  // Initialize as null, set in `watch`
});

// Fetch chats when component mounts
onMounted(async () => {
  await fetchChats();
  setupSocket();
  console.log(localStorage.getItem('accessToken'))
});

// Watch for changes in selectedUser and fetch chats each time it changes
watch(
  () => props.selectedUser,
  async (newUser) => {
    if (newUser) {
      await fetchChats();
      message.receiver_id = props.selectedUser.id;
    }
  },
  { immediate: true }
);

const sendMessage = async () => {
  try {
    sendingMsg.value = true;
    // await axios.post('http://192.168.29.152:5000/chat/send', message, {
    //     headers: {
    //         Authorization: `Bearer ${profileStore.authToken}`,
    //     },
    // });
    console.log(message)
    socket.value.emit("smessage", message);

    const sentMessage = {
      content: message.content,
      receiver_id: message.receiver_id,
      sender_id: profileStore.profileData.id,
      timestamp: new Date().toUTCString(),
      sender_role: profileStore.profileData.role,
      receiver_role: profileStore.profileData.role === 'admin' ? 'user' : 'admin',
    };

    chatStore.chats.push(sentMessage);

    message.content = ""; // Clear the input field after sending
  } catch (error) {
    console.log("An error occurred while sending the message");
    console.log(error)
  } finally {
    sendingMsg.value = false;
    console.log(chatStore.chats)
  }
};

// Define a function to fetch chats
async function fetchChats() {
  await chatStore.getChats(props.selectedUser.id);
  chats.value = chatStore.chats;
}

// Function to format timestamp as time only
function formatTime(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Function to format timestamp as date only
function formatDate(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleDateString();
}
</script>