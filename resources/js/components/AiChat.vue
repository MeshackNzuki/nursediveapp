<template>
    <section v-if="props.chatOpened"
        class="fixed left-3 right-3 bottom-3 z-50 mx-auto flex h-[min(78vh,680px)] w-auto max-w-xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/20 dark:border-sky-800 dark:bg-slate-950 dark:shadow-black/30 sm:left-auto sm:right-6 sm:bottom-6 sm:w-[520px]"
        role="dialog" aria-label="Nursedive AI Assistant" :aria-busy="isStreaming">
        <header class="border-b border-white/10 bg-slate-950 px-4 py-3 text-white">
            <div class="flex items-start justify-between gap-3">
                <div class="flex min-w-0 items-center gap-3">
                    <a href="/"
                        class="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white shadow-sm ring-1 ring-white/30"
                        aria-label="Nursedive home">
                        <img src="https://www.nursedive.com/images/favicon.png" class="h-7 w-7 object-contain"
                            alt="Nursedive" />
                    </a>
                    <div class="min-w-0">
                        <h2 class="truncate text-base font-semibold leading-5">Nursedive AI Assistant</h2>
                        <p class="mt-0.5 text-xs text-slate-300">Powered by OpenAI</p>
                    </div>
                </div>

                <button type="button" @click="closeChat"
                    class="grid h-9 w-9 shrink-0 place-items-center rounded-full text-slate-300 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-teal-300"
                    aria-label="Close chat">
                    <i class="pi pi-times text-sm"></i>
                </button>
            </div>

            <div class="mt-3 flex flex-wrap items-center justify-between gap-2">
                <label v-if="!isStreaming"
                    class="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-slate-100 ring-1 ring-white/15"
                    for="customSwitch1">
                    <span>Deep Thinking</span>
                    <input id="customSwitch1" v-model="deepReasoning" type="checkbox" class="peer sr-only" />
                    <span
                        class="relative h-5 w-9 rounded-full bg-white/25 transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:bg-teal-400 peer-checked:after:translate-x-4"
                        aria-hidden="true"></span>
                </label>

                <span v-if="isThinking"
                    class="inline-flex items-center gap-2 rounded-full bg-teal-400/15 px-3 py-1.5 text-xs font-semibold text-teal-100 ring-1 ring-teal-300/30">
                    <span class="h-3 w-3 animate-spin rounded-full border-2 border-teal-100/40 border-t-teal-100"
                        aria-hidden="true"></span>
                    Thinking...
                </span>
                <span v-else-if="isStreaming"
                    class="inline-flex items-center gap-2 rounded-full bg-sky-400/15 px-3 py-1.5 text-xs font-semibold text-sky-100 ring-1 ring-sky-300/30">
                    <span class="h-2 w-2 rounded-full bg-sky-200"></span>
                    Responding...
                </span>
            </div>
        </header>

        <div ref="chatContainer" class="flex-1 space-y-4 overflow-y-auto bg-slate-50 p-4 dark:bg-slate-900/95 sm:p-5">
            <div v-if="questionHtml" class="flex justify-start">
                <div
                    class="max-w-[92%] rounded-2xl rounded-tl-sm border border-amber-200 bg-amber-50 px-4 py-3 shadow-sm dark:border-amber-400/20 dark:bg-amber-400/10">
                    <div
                        class="mb-1 text-[11px] font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-200">
                        Question Recap
                    </div>
                    <div class="whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-800 dark:text-slate-100 [&_strong]:font-semibold"
                        v-html="questionHtml"></div>
                </div>
            </div>

            <div v-for="message in messages" :key="message.id" class="flex w-full"
                :class="message.role === 'user' ? 'justify-end' : 'justify-start'">
                <div class="max-w-[86%] px-4 py-3 shadow-sm ring-1"
                    :class="message.role === 'user'
                        ? 'rounded-2xl rounded-tr-sm bg-teal-600 text-white ring-teal-500/40'
                        : 'rounded-2xl rounded-tl-sm bg-white text-slate-800 ring-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:ring-slate-700'">
                    <div class="mb-1 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide"
                        :class="message.role === 'user' ? 'text-teal-50' : 'text-slate-500 dark:text-slate-300'">
                        <span class="h-1.5 w-1.5 rounded-full"
                            :class="message.role === 'user' ? 'bg-white/80' : 'bg-teal-500'"></span>
                        {{ message.role === "user" ? "You" : "AI Tutor" }}
                    </div>
                    <div class="whitespace-pre-wrap break-words text-sm leading-relaxed [&_strong]:font-semibold"
                        v-html="formatChatText(message.content)"></div>
                </div>
            </div>

            <div v-if="messages.length === 0 && !questionHtml"
                class="flex h-full min-h-64 flex-col items-center justify-center text-center text-slate-500 dark:text-slate-300">
                <div
                    class="grid h-14 w-14 place-items-center rounded-2xl bg-white text-teal-600 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
                    <i class="pi pi-comments text-xl"></i>
                </div>
                <p class="mt-3 text-sm font-medium text-slate-700 dark:text-slate-100">Start a chat with Nursedive AI
                    tutor</p>
                <p class="mt-1 max-w-xs text-xs leading-5 text-slate-500 dark:text-slate-400">
                    Ask about rationales, topics, or study strategy.
                </p>
            </div>

            <div v-if="isLoading" class="flex justify-start">
                <div
                    class="rounded-2xl rounded-tl-sm bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
                    <div
                        class="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">
                        AI Tutor
                    </div>
                    <div class="flex items-center gap-1.5 py-1" aria-label="Loading response">
                        <span class="h-2 w-2 animate-bounce rounded-full bg-teal-500 [animation-delay:-0.3s]"></span>
                        <span class="h-2 w-2 animate-bounce rounded-full bg-teal-500 [animation-delay:-0.15s]"></span>
                        <span class="h-2 w-2 animate-bounce rounded-full bg-teal-500"></span>
                    </div>
                </div>
            </div>

            <div v-if="streamingText" class="flex justify-start">
                <div
                    class="max-w-[86%] rounded-2xl rounded-tl-sm border border-dashed border-teal-300 bg-white px-4 py-3 text-slate-800 shadow-sm dark:border-teal-500/60 dark:bg-slate-800 dark:text-slate-100">
                    <div
                        class="mb-1 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">
                        <span class="h-1.5 w-1.5 rounded-full bg-teal-500"></span>
                        AI Tutor
                    </div>
                    <div class="whitespace-pre-wrap break-words text-sm leading-relaxed [&_strong]:font-semibold"
                        v-html="formatChatText(streamingText)"></div>
                </div>
            </div>
        </div>

        <footer class="border-t border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950">
            <form @submit.prevent="startStream()"
                class="flex items-center gap-2 rounded-[1.5rem] bg-slate-100 p-2 ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
                <input v-model.trim="inputText" type="text"
                    class="min-h-11 flex-1 rounded-full border-0 bg-transparent px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-60 dark:text-white dark:placeholder:text-slate-500"
                    placeholder="Type your message" :disabled="isStreaming" />
                <button
                    class="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-teal-600 text-white shadow-sm shadow-teal-900/20 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none dark:focus:ring-offset-slate-950"
                    type="submit" :disabled="isStreaming || !inputText.trim()" aria-label="Send message">
                    <i class="pi pi-arrow-up text-sm"></i>
                </button>
            </form>
        </footer>
    </section>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from "vue";
import CryptoJS from "crypto-js";

const props = defineProps({
    question: {
        type: Object,
        default: null,
    },
    chatOpened: {
        type: Boolean,
        default: true,
    }
});

const emit = defineEmits(["update:chatOpened", "close"]);

const messages = ref([]);
const streamingText = ref("");
const inputText = ref("");
const deepReasoning = ref(false);
const isStreaming = ref(false);
const isLoading = ref(false);
const hasFirstToken = ref(false);
const chatContainer = ref(null);
const lastAutoQuestionPayload = ref("");
const pendingAutoQuestionPayload = ref("");
const questionHtml = computed(() => {
    const rawQuestion = props.question && typeof props.question === "object"
        ? props.question.question
        : "";

    return typeof rawQuestion === "string" ? rawQuestion.trim() : "";
});

let eventSource = null;
const encryptionKey = "!@$nursedive";

const isThinking = computed(() => isStreaming.value && isLoading.value && !hasFirstToken.value);

const escapeHtml = (value) => {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
};

const formatChatText = (value) => {
    const escaped = escapeHtml(value);
    const withBold = escaped.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    return withBold.replace(/\n/g, "<br>");
};

const scrollToBottom = async () => {
    await nextTick();
    if (!chatContainer.value) return;
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
};

const closeStream = () => {
    if (eventSource) {
        eventSource.abort();
        eventSource = null;
    }
    isStreaming.value = false;
    isLoading.value = false;
    hasFirstToken.value = false;
};

const getAuthHeaders = (headers = {}) => {
    const config = {
        ...headers,
    };

    // Encrypted token injection
    const encryptedTokenKey = CryptoJS.SHA256("authToken").toString();
    const authTokenDataEncrypted = localStorage.getItem(encryptedTokenKey);
    if (authTokenDataEncrypted) {
        const bytes = CryptoJS.AES.decrypt(authTokenDataEncrypted, encryptionKey);
        const authToken = bytes.toString(CryptoJS.enc.Utf8);
        if (authToken) {
            config.Authorization = `Bearer ${authToken}`;
        }
    }

    return config;
};

const pushAssistantMessage = () => {
    if (streamingText.value === "") return;

    messages.value.push({
        id: `${Date.now()}-assistant`,
        role: "assistant",
        content: streamingText.value,
    });

    streamingText.value = "";
};

const questionIdParam = () => {
    const questionId = props.question && props.question.id ? props.question.id : null;
    if (questionId === null || questionId === undefined || String(questionId).trim() === "") {
        return null;
    }
    return String(questionId);
};

const startStream = async (messageOverride = null, options = {}) => {

    if (!props.chatOpened) {
        return 0;
    }
    const {
        showUserMessage = true,
        clearInput = true,
        showErrorMessage = true,
    } = options;

    if (messageOverride && typeof messageOverride === "object" && "preventDefault" in messageOverride) {
        messageOverride = null;
    }

    const resolvedMessage = String(messageOverride ?? inputText.value ?? "").trim();
    if (!resolvedMessage || isStreaming.value) return false;

    closeStream();

    if (showUserMessage) {
        messages.value.push({
            id: `${Date.now()}-user`,
            role: "user",
            content: resolvedMessage,
        });
    }

    const requestBody = {
        message: resolvedMessage,
        deep_reasoning: deepReasoning.value,
    };

    const questionId = questionIdParam();
    if (questionId !== null) {
        requestBody.question_id = questionId;
    }

    const endpoint = "/api/ai/incident-assistant";

    if (clearInput && messageOverride === null) {
        inputText.value = "";
    }
    streamingText.value = "";
    isStreaming.value = true;
    isLoading.value = true;
    hasFirstToken.value = false;
    eventSource = new AbortController();

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            credentials: "include",
            headers: getAuthHeaders({
                "Content-Type": "application/json",
                Accept: "text/event-stream",
            }),
            body: JSON.stringify(requestBody),
            signal: eventSource.signal,
        });

        if (!response.ok || !response.body) {
            let backendDetails = "";
            try {
                backendDetails = (await response.text()).trim();
            } catch (readError) {
                backendDetails = "";
            }
            const detailSuffix = backendDetails ? ` - ${backendDetails.slice(0, 300)}` : "";
            throw new Error(`Stream request failed: ${response.status}${detailSuffix}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let buffer = "";

        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                break;
            }

            buffer += decoder.decode(value, { stream: true });

            while (true) {
                const eventBoundaryIndex = buffer.indexOf("\n\n");
                if (eventBoundaryIndex === -1) {
                    break;
                }

                const eventBlock = buffer.slice(0, eventBoundaryIndex);
                buffer = buffer.slice(eventBoundaryIndex + 2);
                const lines = eventBlock.split("\n");
                const dataParts = [];

                for (const rawLine of lines) {
                    const line = rawLine.endsWith("\r") ? rawLine.slice(0, -1) : rawLine;
                    if (!line.startsWith("data:")) {
                        continue;
                    }
                    let valuePart = line.slice(5);
                    if (valuePart.startsWith(" ")) {
                        valuePart = valuePart.slice(1);
                    }
                    dataParts.push(valuePart);
                }

                if (dataParts.length === 0) {
                    continue;
                }

                const payload = dataParts.join("\n");

                if (payload === "[DONE]") {
                    pushAssistantMessage();
                    eventSource = null;
                    isStreaming.value = false;
                    isLoading.value = false;
                    hasFirstToken.value = true;
                    await scrollToBottom();
                    return true;
                }

                if (!hasFirstToken.value && payload.trim() !== "") {
                    hasFirstToken.value = true;
                    isLoading.value = false;
                }

                streamingText.value += payload;
                await scrollToBottom();
            }
        }

        pushAssistantMessage();
        eventSource = null;
        isStreaming.value = false;
        isLoading.value = false;
        hasFirstToken.value = false;
        await scrollToBottom();
        return true;
    } catch (error) {
        if (error?.name !== "AbortError") {
            console.error("Stream error", error);
            if (!streamingText.value && showErrorMessage) {
                messages.value.push({
                    id: `${Date.now()}-error`,
                    role: "assistant",
                    content: "Unable to respond right now. Try again later.",
                });
            } else {
                pushAssistantMessage();
            }
        }

        eventSource = null;
        isStreaming.value = false;
        isLoading.value = false;
        hasFirstToken.value = false;
        await scrollToBottom();
        return false;
    }
};

const closeChat = () => {
    closeStream();
    inputText.value = "";
    emit("update:chatOpened", false);
    emit("close");
};

watch(
    () => [props.question, props.chatOpened],
    async ([value, chatOpened]) => {
        if (!chatOpened) return;
        if (!value || typeof value !== "object") return;

        const payload = JSON.stringify(value);
        if (!payload || payload === "{}") return;
        if (payload === lastAutoQuestionPayload.value || payload === pendingAutoQuestionPayload.value) return;

        const wasStreaming = isStreaming.value;
        const started = await startStream(payload, {
            showUserMessage: false,
            clearInput: false,
            showErrorMessage: false,
        });

        if (started) {
            lastAutoQuestionPayload.value = payload;
            pendingAutoQuestionPayload.value = "";
        } else if (wasStreaming) {
            pendingAutoQuestionPayload.value = payload;
        } else {
            pendingAutoQuestionPayload.value = "";
        }
    },
    { immediate: true, deep: true }
);

watch(
    () => isStreaming.value,
    async (value) => {
        if (value) return;
        if (!pendingAutoQuestionPayload.value) return;
        if (pendingAutoQuestionPayload.value === lastAutoQuestionPayload.value) {
            pendingAutoQuestionPayload.value = "";
            return;
        }

        const payload = pendingAutoQuestionPayload.value;
        const started = await startStream(payload, {
            showUserMessage: false,
            clearInput: false,
            showErrorMessage: false,
        });

        if (started) {
            lastAutoQuestionPayload.value = payload;
            pendingAutoQuestionPayload.value = "";
        } else {
            pendingAutoQuestionPayload.value = "";
        }
    }
);

onBeforeUnmount(() => {
    closeStream();
});
</script>
