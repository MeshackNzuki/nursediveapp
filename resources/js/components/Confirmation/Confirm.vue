<template>
    <p-dialog v-model="visible" header="Confirmation" :closable="false">
        <template #footer>
            <Button label="No" icon="pi pi-times" @click="cancel" />
            <Button label="Yes" icon="pi pi-check" @click="confirm" />
        </template>
        <p>{{ message }}</p>
    </p-dialog>
</template>

<script>
import { ref } from "vue";
import Dialog from "primevue/dialog";
import Button from "primevue/button";

export default {
    components: {
        Dialog,
        Button,
    },
    setup() {
        const visible = ref(false);
        const message = ref("");
        const onConfirm = ref(null);
        const onCancel = ref(null);

        const open = (msg, onConfirmAction, onCancelAction) => {
            message.value = msg;
            visible.value = true;
            onConfirm.value = onConfirmAction;
            onCancel.value = onCancelAction;
        };

        const confirm = () => {
            onConfirm.value(); // Call the provided confirm action
            visible.value = false;
        };

        const cancel = () => {
            onCancel.value(); // Call the provided cancel action
            visible.value = false;
        };

        return {
            visible,
            message,
            open,
            confirm,
            cancel,
        };
    },
};
</script>
