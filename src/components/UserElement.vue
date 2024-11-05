<template>
    <button class="w-full bg-gray-600 hover:bg-gray-700 flex border rounded mb-2 p-1 transition-all duration-200">
        
        <div class="border border-gray-600 rounded-full text-2xl p-4 bg-black">
            <i class="pi pi-user" style="font-size: larger;"></i>
        </div>

        <div class=" w-full flex align-middle ml-4">
            <p class="self-center my-5 text-lg">{{ props.name }}</p>
        </div>

    </button>
    
    
</template>
<script setup>


const props = defineProps({
    name: String , 
    id : Number
})
</script>