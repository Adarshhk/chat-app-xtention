import axios from "axios";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useProfileStore = defineStore('profile' , () => {
    const profileData = ref({});
    const authToken = localStorage.getItem('accessToken');

    
    const getProfileData = async () => {
        try {
            const res = await axios.get('http://192.168.29.152:5000/chat/info' , {
                headers : {
                    Authorization : `Bearer ${authToken}`
                }
            });
            profileData.value = res.data;
            
        } catch (error) {
            console.log("error occured in fetching profile")
            console.log(error)
        }
    }

    return {profileData , getProfileData , authToken}
});