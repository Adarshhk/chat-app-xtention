import axios from "axios";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useChatStore = defineStore("chats" , () => {
    const chats = ref([]);
    const loading = ref(false);
    const authToken = localStorage.getItem('accessToken');
    const getChats = async (userId) => {
        try {
            loading.value = true;
            const res = await axios.get(`http://192.168.29.152:5000/chat/messages/${userId}`, {
                headers : {
                    Authorization : `Bearer ${authToken}`
                }
            })

            chats.value = res.data;
            loading.value= false;
        } catch (error) {
            console.log("error occured in chatstore");
            console.log(error);
            loading.value= false;
        }
    }

    return {chats , getChats , loading}
})