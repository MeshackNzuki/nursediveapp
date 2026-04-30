<template>
    <div class="flex justify-between px-4 py-2 bg-gray-100">
        <span>All messages</span>
        <span>Unread messages</span>
        <span>Read messages</span>
    </div>
    <div class="w-100 flex justify-center items-center">
        <div class="p-4 w-full lg:w-2/3 2xl:w-1/2 bg-white">
            <ul class="">
                <li v-for="message in messages" :key="message.id">
                    <div class="" :class="message.sender === 'Mesh'
                            ? 'chat chat-end'
                            : 'chat chat-start'
                        ">
                        <div class="chat-image avatar">
                            <div class="w-10 rounded-full">
                                <img alt="Tailwind CSS chat bubble component"
                                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                            </div>
                        </div>
                        <div :class="message.sender === 'Mesh'
                                ? 'chat-bubble bg-lime-300 text-gray-700'
                                : 'chat-bubble bg-sky-100  text-gray-700'
                            ">
                            {{ message.text }}
                        </div>
                    </div>
                </li>
            </ul>
            <div class="flex justify-center mt-5">
                <textarea type="textarea" placeholder="Message"
                    class="rounded-lg border bg-gray-50 focus:outline-none focus:ring-0 focus:border-transparent w-full p-2"></textarea>
                <span class="flex justify-center items-center bg-emerald-500 rounded-full size-8 ms-2">
                    <i class="pi pi-send text-white"></i>
                </span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const messages = ref([
    {
        id: 1,
        text: "Hello, how are you?",
        sender: "Alice",
        timestamp: "2024-09-01 10:00:00",
    },
    {
        id: 2,
        text: "I’m good, thanks! How about you?",
        sender: "Mesh",
        timestamp: "2024-09-01 10:01:00",
    },
    {
        id: 3,
        text: "Doing well, thanks for asking!",
        sender: "Alice",
        timestamp: "2024-09-01 10:02:00",
    },
    {
        id: 4,
        text: "What’s the plan for today?",
        sender: "Bob",
        timestamp: "2024-09-01 10:03:00",
    },
    {
        id: 5,
        text: "I was thinking about working on the project.",
        sender: "Alice",
        timestamp: "2024-09-01 10:04:00",
    },
    {
        id: 6,
        text: "Sounds good to me!",
        sender: "Bob",
        timestamp: "2024-09-01 10:05:00",
    },
]);

const fetchMessages = () => {
    axios
        .get("/api/chat/messages")
        .then((response) => {
            messages.value = response.data;
        })
        .catch((error) => {
            console.error("Error fetching messages:", error);
        });
};
onMounted(() => {
    // fetchMessages();
    //setInterval(fetchMessages, 2000); // Poll every 5 seconds
});
</script>
