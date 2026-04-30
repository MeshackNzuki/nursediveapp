<template>
    <div>
        <Table :headers="[
            'name',
            'EMAIL',
            'DETAILS',
            'ROLE',
            'PHONE',
            'STAFF NUMBER',
            'ACTIONS',
        ]" title="All Payments" search_placeholder="Search User" :rows="userData?.length">
            <template v-slot:actions>
                <SmallButton icon="pi pi-dollar" buttonText='View Payments'
                    :action="() => router.push('/admin/payments')">
                </SmallButton>
            </template>
            <template v-slot:content>
                <tr v-for="(user, index) in userData" :key="index">
                    <td class="p-2 whitespace-nowrap">
                        <div class="text-start">{{ user.name }}</div>
                    </td>
                    <td class="p-2 whitespace-nowrap">
                        <div class="text-start">{{ user.email }}</div>
                    </td>
                    <td class="p-2 whitespace-nowrap">
                        <div>{{ user.deatails ? user.deatails : "-" }}</div>
                    </td>
                    <td class="p-2 whitespace-nowrap">
                        <div>
                            {{
                                user.roles.length > 0
                                    ? user.roles
                                        .map((role) => role.name)
                                        .join(", ")
                                    : "-"
                            }}
                        </div>
                    </td>
                    <td class="p-2 whitespace-nowrap">
                        <div>{{ user.phone }}</div>
                    </td>
                    <td class="p-2 whitespace-nowrap">
                        <div>{{ user.staff_number }}</div>
                    </td>
                    <td class="p-2 whitespace-nowrap">
                        <div class="flex justify-center space-x-2">
                            <SmallButton classes="border border-blue-500 border-dotted px-2 text-sm bg-sky-500"
                                button-text="Permissions" icon="pi pi-user-edit"
                                :action="() => showModal('permissions' + user.id)" />
                            <SmallButton classes="border border-blue-500 border-dotted px-2 text-sm bg-sky-500"
                                button-text="Edit" icon="pi pi-user-edit" :action="() => showModal('edit' + user.id)" />
                            <SmallButton classes="border border-red-500 border-dotted px-2 text-sm bg-red-500"
                                button-text="Delete" :action="() => deleteUser(user.id)" />
                        </div>
                    </td>
                    <!-- Edit User Modal -->
                    <dialog :id="'edit' + user.id" class="modal modal-bottom sm:modal-middle">
                        <div class="modal-box dark:text-slate-400 dark:bg-sky-950">
                            <form method="dialog">
                                <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                            </form>
                            <h3 class="font-bold text-lg">Edit User</h3>
                            <div class="modal-action flex justify-center">
                                <form @submit.prevent="editUser(editingUserId)" class="flex flex-col gap-2">
                                    <div>
                                        <label for="edit_name" class="block text-smtext-left">name</label>
                                        <input v-model="editedUser.name" type="text" id="edit_name" name="edit_name"
                                            required
                                            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm"
                                            placeholder="Enter name" />
                                    </div>
                                    <div>
                                        <label for="edit_name" class="block text-smtext-left">Email</label>
                                        <input v-model="editedUser.email" type="text" id="edit_email" name="edit_email"
                                            required
                                            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm"
                                            placeholder="Enter email" />
                                    </div>
                                    <div>
                                        <label for="edit_details" class="block text-smtext-left">Details</label>
                                        <input v-model="editedUser.details" type="text" id="edit_details"
                                            name="edit_details" required
                                            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm"
                                            placeholder="Enter user details" />
                                    </div>
                                    <div>
                                        <label for="edit_role" class="block text-smtext-left">Role</label>
                                        <input v-model="editedUser.role" type="text" id="edit_role" name="edit_role"
                                            required
                                            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm"
                                            placeholder="Enter user role" />
                                    </div>
                                    <div>
                                        <label for="edit_phone" class="block text-smtext-left">Phone Number</label>
                                        <input v-model="editedUser.phone" type="tel" id="edit_phone" name="edit_phone"
                                            required
                                            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm"
                                            placeholder="Enter phone number" />
                                    </div>
                                    <div>
                                        <label for="edit_staff_number" class="block text-smtext-left">Staff
                                            Number</label>
                                        <input v-model="editedUser.staff_number" type="text" id="edit_staff_number"
                                            name="edit_staff_number" required
                                            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm"
                                            placeholder="Enter staff number" />
                                    </div>
                                    <div class="col-span-2 flex justify-end mt-2">
                                        <CommonButton button-text="Submit" :action="() => editUser(editingUserId)
                                            " />
                                    </div>
                                </form>
                            </div>
                        </div>
                    </dialog>
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
import { ref, onMounted, watch } from "vue";
import axios from "axios";
import { useToast } from "primevue/usetoast";
import Error from "../../components/Flash/Error.vue";
import Success from "../../components/Flash/Success.vue";



const toastPrime = useToast();

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


const roles = ref([]);
const permissions = ref([]);
const userData = ref([]);
const refresh = ref(false)
const flashMessage = ref(null);

const newUser = ref({
    name: "",
    email: "",
    details: "",
    role: "",
    phone: "",
    staff_number: "",
});

const editedUser = ref({
    name: "",
    details: "",
    role: "",
    email: "",
    phone: "",
    staff_number: "",
    permissions: []
});

// Function to fetch all users
const fetchUsers = async () => {
    try {
        const response = await axios.get("admin/users/");
        userData.value = response.data.data.users;

    } catch (error) {
        console.error("Error fetching users:", error);
    }
};

// Fetch initial user data on component mount
onMounted(async () => {
    fetchUsers();
    fetchRoles()
    fetchPermissions()

});

watch(refresh, () => {
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

// Function to add a new user
const addUser = async () => {
    try {
        // Validate form data (if needed)
        // Prepare form data
        const formData = {
            name: newUser.value.name,
            details: newUser.value.details,
            role: newUser.value.role,
            email: newUser.value.email,
            phone: newUser.value.phone,
            staff_number: newUser.value.staff_number,
        };

        // Send POST request to create user
        const response = await axios.post("admin/users/", formData);

        if (response.data.success === true) {
            fetchUsers();
            toastPrime.add({
                severity: "success",
                summary: "Data Success",
                detail: 'User added successfully',
                life: 3000,
            });
        }

    } catch (error) {
        console.error("Error adding user:", error);
        toastPrime.add({
            severity: "error",
            summary: "Data Error",
            detail: 'Error adding user',
            life: 3000,
        });
    }
};

// Function to edit an existing user
const editUser = async (userId) => {
    try {
        // Validate form data (if needed)
        // Prepare form data
        const formData = {
            name: editedUser.value.name,
            details: editedUser.value.details,
            role: editedUser.value.role,
            email: editedUser.value.email,
            phone: editedUser.value.phone,
            staff_number: editedUser.value.staff_number,
        };

        // Send PUT request to update user
        const response = await axios.put(`/admin/users/${userId}`, formData);
        fetchUsers();
        console.log("User updated successfully:", response.data);

        // Clear form and close modal
        clearForm();
        closeModal(`editUser${userId}`); // Implement closeModal function if necessary
    } catch (error) {
        console.error("Error updating user:", error);
    }
};

// Function to delete a user
const deleteUser = async (userId) => {
    try {
        // Send DELETE request to delete user
        const response = await axios.delete(`/admin/user/${userId}`);
        // Update user data after deletion
        if (response.data.success === true) {
            fetchUsers();
            toastPrime.add({
                severity: "success",
                summary: "Data Success",
                detail: 'User deleted successfully',
                life: 3000,
            });
        }

        //userData.value = userData.value.filter((user) => user.id !== userId);
    } catch (error) {
        console.error("Error deleting user:", error);
    }
};

// Function to clear form data
const clearForm = () => {
    newUser.value = {
        name: "",
        details: "",
        role: "",
        phone: "",
        staff_number: "",
        email: "",
    };
    editedUser.value = {
        name: "",
        details: "",
        role: "",
        phone: "",
        staff_number: "",
        email: "",
    };
};
</script>
