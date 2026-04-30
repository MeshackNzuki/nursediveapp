<script setup>
import { ref, onMounted, nextTick } from "vue";
import { useAuthStore } from "../stores/authStore";
import Avatar from "../assets/images/avatar.png";
import axios from "axios";

const { user } = useAuthStore();
const messages = ref([]);
const newMessage = ref("");
const isTyping = ref(false);

// Load existing chat history
const loadMessages = async () => {
    try {
        const { data } = await axios.get("/api/chat");
        messages.value = data?.messages || [
            {
                id: 1,
                sender: "bot",
                name: "Arnold - Nursedive",
                avatar: "https://img.daisyui.com/images/profile/demo/kenobee@192.webp",
                text: "Hi, how can I help you pass?",
                time: "Just now",
            },
        ];
    } catch (e) {
        // fallback default
        messages.value = [
            {
                id: 1,
                sender: "bot",
                name: "Arnold - Nursedive",
                avatar: "https://img.daisyui.com/images/profile/demo/kenobee@192.webp",
                text: "Hi, how can I help you pass?",
                time: "Just now",
            },
        ];
    }
};

// Send message to API
const saveMessage = async (msg) => {
    try {
        await axios.post("/api/chat", msg);
    } catch (e) {
        console.warn("Message not saved (offline mode).");
    }
};

const sendMessage = async () => {
    if (!newMessage.value.trim()) return;

    const userMsg = {
        id: Date.now(),
        sender: "user",
        name: user?.name || "You",
        avatar: user?.avatar ? `/storage/${user.avatar}` : Avatar,
        text: newMessage.value,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    messages.value.push(userMsg);
    await saveMessage(userMsg);

    newMessage.value = "";

    // Typing effect
    isTyping.value = true;
    await nextTick();
    if (messages.value.botMsg > 2) { return 0 }

    setTimeout(async () => {
        isTyping.value = false;

        const botMsg = {
            id: Date.now() + 1,
            sender: "bot",
            name: "Arnold - Nursedive",
            avatar: "https://img.daisyui.com/images/profile/demo/kenobee@192.webp",
            text: `Hello ${user?.name || "there"}, Please click the blue widget on bottom right for a quick chat.`,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };

        messages.value.push(botMsg);
        await saveMessage(botMsg);
    }, 1500);
};

onMounted(() => {
    loadMessages();
});
</script>

<template>
    <div class="relative z-10 rounded-2xl min-h-[93.5vh] max-h-[93.5vh] overflow-y-scroll p-2 bg-white">
        <!-- Gradient Background -->
        <div class="absolute inset-0 pointer-events-none -z-10">
            <div
                class="absolute -top-20 -left-40 h-[600px] w-[600px] bg-gradient-to-r from-purple-300 via-sky-300 to-teal-200 opacity-30 blur-[120px] rounded-full" />
            <div
                class="absolute top-32 right-10 h-[400px] w-[400px] bg-gradient-to-r from-emerald-300 via-sky-300 to-purple-200 opacity-30 blur-[100px] rounded-full" />
        </div>

        <!-- Chat Messages -->
        <div class="space-y-4 pb-20">
            <div v-for="msg in messages" :key="msg.id" class="chat text-sm"
                :class="msg.sender === 'user' ? 'chat-end' : 'chat-start'">
                <div class="chat-image avatar">
                    <div class="w-10 rounded-full">
                        <img :src="msg.avatar || Avatar" alt="Avatar" />
                    </div>
                </div>
                <div class="chat-header">
                    {{ msg.name }}
                    <time class="text-xs opacity-50 ml-2">{{ msg.time }}</time>
                </div>

                <div class="chat-bubble"
                    :class="msg.sender === 'user' ? 'bg-sky-100 text-gray-800' : 'bg-lime-300 text-gray-800'">
                    {{ msg.text }}
                </div>
            </div>

            <!-- Typing Indicator -->
            <div v-if="isTyping" class="chat chat-start">
                <div class="chat-image avatar">
                    <div class="w-10 rounded-full">
                        <img src="https://img.daisyui.com/images/profile/demo/kenobee@192.webp" alt="Typing Avatar" />
                    </div>
                </div>
                <div class="chat-bubble bg-lime-300 text-gray-800 flex gap-1 items-center">
                    <span class="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></span>
                    <span class="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style="animation-delay: 0.2s"></span>
                    <span class="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style="animation-delay: 0.4s"></span>
                </div>
            </div>
        </div>

        <!-- Input Box -->
        <div
            class="absolute bottom-20 md:bottom-4 left-0 right-20  px-6 flex items-center gap-2 bg-white/60 backdrop-blur-md py-2">
            <input v-model="newMessage" type="text" placeholder="Type a message..."
                class="flex-1 border border-teal-500 rounded-full px-4 py-2 focus:outline-none"
                @keyup.enter="sendMessage" />
            <button @click="sendMessage"
                class="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-full shadow transition">
                Send
            </button>
        </div>
    </div>
</template>
