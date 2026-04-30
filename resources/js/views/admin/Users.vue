<template>
    <div>
        <div class="flex bg-white dark:bg-slate-900 p-2 rounded-lg mb-4 space-x-4 justify-center gap-6  m-auto">
            <router-link class="bg-teal-500 rounded-full px-2 text-white cursor-pointer " to="/admin/users?teas=1">Teas
                Users</router-link>
            <router-link class="bg-teal-500 rounded-full px-2 text-white cursor-pointer "
                to="/admin/users?nursing=1">Nursing
                Users</router-link>
            <router-link class="bg-teal-500 rounded-full px-2 text-white  cursor-pointer"
                to="/admin/users?nclex=1">Nclex
                Users</router-link>
            <router-link class="bg-teal-500 rounded-full px-2 text-white cursor-pointer" to="/admin/users?all=1">All
                Users</router-link>
        </div>
        <Table :headers="[
            'NAME',
            'EMAIL',
            'JOIN DATE',
            'LAST LOGIN',
            'SUBSCRIBED',
            'ROLE',
        ]" title="User Management" search_placeholder="Search User" :rows="userData?.length" v-model:query="query">
            <template v-slot:actions>
            </template>
            <template v-slot:content>
                <tr v-for="(user, index) in filteredUsers" :key="index">
                    <td class="p-2 whitespace-nowrap">
                        <div class="text-start">{{ user.name }}</div>
                    </td>
                    <td class="p-2 whitespace-nowrap">
                        <div class="text-start">{{ user.email }}</div>
                    </td>
                    <td class="p-2 whitespace-nowrap">
                        <div class="">{{ new Date(user.created_at).toLocaleString()
                            }}</div>
                    </td>
                    <td class="p-2 whitespace-nowrap">
                        <div>{{ timeAgo(user.last_login ? user.last_login : "-") }}</div>
                    </td>
                    <td class="p-2 whitespace-nowrap">
                        <div
                            :class="['text-center px-2 badge border-0', user.subscribed ? 'bg-teal-500 text-white' : 'bg-rose-500 text-white',]">
                            {{ user.subscribed ? 'Active ✅' : 'inactive' }}</div>
                    </td>

                    <td class="p-2 whitespace-nowrap">
                        <div>
                            {{
                                user.roles.length > 0
                                    ? user.roles
                                        .map((role) => role.name)
                                        .join(", ")
                                    : "student"
                            }}
                        </div>
                    </td>
                    <td class="p-2 whitespace-nowrap">
                        <!-- <div class="flex justify-center space-x-2">
                            <SmallButton classes="border border-blue-500 border-dotted px-2 text-sm bg-sky-500"
                                button-text="Permissions" icon="pi pi-user-edit"
                                :action="() => showModal('permissions' + user.id)" />
                            <SmallButton classes="border border-blue-500 border-dotted px-2 text-sm bg-sky-500"
                                button-text="Edit" icon="pi pi-user-edit" :action="() => showModal('edit' + user.id)" />
                            <SmallButton classes="border border-red-500 border-dotted px-2 text-sm bg-red-500"
                                button-text="Delete" :action="() => deleteUser(user.id)" />
                        </div> -->
                    </td>

                    <dialog :id="'permissions' + user.id" class="modal modal-bottom sm:modal-middle">
                        <div class="modal-box dark:text-slate-200 dark:bg-sky-950 w-11/12 max-w-5x">
                            <Success :msg="flashMessage" />
                            <form method="dialog">
                                <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                            </form>
                            <h3 class="font-bold text-lg">Edit User Permissions for ({{ user.name }})</h3>
                            <strong class="mt-3">User Role : {{ user.roles[0]?.name }}</strong>
                            <div class="modal-action flex justify-center">
                                <form @submit.prevent class="flex flex-col gap-2">
                                    <div>
                                        <label for="edit_permissions"
                                            class="block text-sm text-left">Permissions</label>
                                        <div
                                            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm">
                                            <div class="grid grid-cols-3 2xl:grid-cols-4 gap-4">
                                                <div v-for="permission in permissions" :key="permission.id"
                                                    class="flex items-center space-x-2">
                                                    <input type="checkbox" :id="`permission_${permission.id}`"
                                                        :value="permission.name" v-model="editedUser.permissions"
                                                        class="mr-2 checkbox checkbox-sm dark:checkbox-success ">
                                                    <label :for="`permission_${permission.id}`" class="">
                                                        {{ permission.name }}
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class=" col-span-2 flex justify-end mt-2">
                                        <CommonButton button-text="Update Permissions"
                                            :action="() => updatePermissions(user.id)" />
                                    </div>
                                </form>
                            </div>
                        </div>
                    </dialog>
                </tr>
            </template>
        </Table>
        <!-- Add User Modal -->

    </div>
</template>
<script setup>
import Table from "../../components/Tables/mainTable.vue";
import CommonButton from "../../components/Buttons/CommonButton.vue";
import SmallButton from "../../components/Buttons/Small.vue";
import { ref, onMounted, watch, computed } from "vue";
import axios from "axios";
import { useToast } from "primevue/usetoast";
import Error from "../../components/Flash/Error.vue";
import Success from "../../components/Flash/Success.vue";
import { timeAgo } from "../../utils/timeAgo";
import { useRoute } from "vue-router";






const toastPrime = useToast();


const roles = ref([]);
const permissions = ref([]);
const userData = ref([]);
const refresh = ref(false)
const query = ref()
const route = useRoute();
const param = ref('')

const editedUser = ref({
    name: "",
    details: "",
    role: "",
    email: "",
    phone: "",
    staff_number: "",
    permissions: []
});



const showModal = (modalId) => {
    if (modalId.substring(0, 11) === 'permissions') {
        editedUser.value.permissions = []
        flashMessage.value = ''
        const userId = modalId.replace('permissions', ''); // Extract user id or determine the specific user
        const user = userData.value.find(user => user.id === parseInt(userId));
        console.log('user.permissions.map(permission => permission.name', user.permissions.map(permission => permission.name));
        if (user) {
            console.log('user permissions', user.permissions);
            editedUser.value.permissions = user.permissions.map(permission => permission.name);
        }
        console.log('current user permissions', editedUser.value.permissions);
    }
    document.getElementById(modalId).showModal();
};


// Function to fetch all users
const fetchUsers = async () => {
    try {
        const response = await axios.post(`admin/users`, param.value);
        userData.value = response.data.data.users;

    } catch (error) {
        console.error("Error fetching users:", error);
    }
};

// Fetch initial user data on component mount
onMounted(async () => {
    param.value = route.query
    fetchUsers();
    fetchRoles()
    fetchPermissions()

});

watch(refresh, () => {
    fetchUsers();
});

watch(route, () => {
    param.value = route.query
    fetchUsers();
});


const fetchRoles = async () => {
    try {
        const response = await axios.get("admin/user/roles/");
        roles.value = response.data.data.roles;
    } catch (error) {
        console.error("Error fetching roles:", error);
    }
};


const updatePermissions = async (userId) => {
    try {
        const response = await axios.put(`/admin/users/${userId}/permissions`, { permissions: editedUser.value.permissions });
        flashMessage.value = 'Permision updated successfully'
        refresh.value = !refresh.value
        if (response.data.success) {
            toastPrime.add({
                severity: "success",
                summary: "Permissions Updated",
                detail: 'User permissions updated successfully',
                life: 3000,
            });

        }
    } catch (error) {
        console.error("Error updating permissions:", error);
        toastPrime.add({
            severity: "error",
            summary: "Update Error",
            detail: 'Error updating permissions',
            life: 3000,
        });
    }
};

const fetchPermissions = async () => {
    try {
        const response = await axios.get("admin/user/permissions/");
        permissions.value = response.data.data.permissions;
    } catch (error) {
        console.error("Error fetching permissions:", error);
    }
};

const filteredUsers = computed(() => {
    if (!query.value || query.value.trim() === "") return userData.value

    const q = query.value.toLowerCase()

    return userData.value.filter(user => {
        return (
            user.name?.toLowerCase().includes(q) ||
            user.email?.toLowerCase().includes(q) ||
            user.roles?.some(role => role.name.toLowerCase().includes(q)) ||
            user.phone?.toLowerCase().includes(q)
        )
    })
})


// Function to add a new user
</script>
