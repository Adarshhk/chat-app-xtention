import axios from "axios";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserStore = defineStore('users' , () => {
    const userList = ref([]);
    const authToken = localStorage.getItem('accessToken');

    const getUserList = async (role) => {
        try {
            
            if(role === 'admin')
            {
                const res = await axios.get('http://192.168.29.152:5000/chat/users', {
                    headers : {
                        Authorization : `Bearer ${authToken}`
                    }
                })
                userList.value = res.data;
            }
            else{
                const res = await axios.get('http://192.168.29.152:5000/chat/admins', {
                    headers : {
                        Authorization : `Bearer ${authToken}`
                    }
                })
                userList.value = res.data;
            }
        } catch (error) {
            console.log("err on userstore")
        }
    }
    
    return {userList , getUserList}
})