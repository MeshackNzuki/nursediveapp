<template>
    <div
        class="relative z-10 rounded-2xl min-h-[93.5vh] max-h-[93.5vh] 2xl:max-h-[94vh] 2xl:min-h-[94vh] overflow-y-scroll p-4 sm:p-6 bg-slate-50">
        <div class="absolute inset-0 pointer-events-none -z-10">
            <div
                class="absolute -top-20 -left-40 h-[600px] w-[600px] bg-gradient-to-r from-cyan-300 via-sky-300 to-emerald-200 opacity-30 blur-[120px] rounded-full">
            </div>
            <div
                class="absolute top-32 right-10 h-[400px] w-[400px] bg-gradient-to-r from-emerald-300 via-cyan-300 to-sky-200 opacity-30 blur-[100px] rounded-full">
            </div>
        </div>

        <div class="max-w-6xl mx-auto space-y-6">
            <Navigation />

            <section
                class="relative overflow-hidden rounded-3xl border border-slate-200 bg-white/95 p-5 md:p-6 shadow-[0_14px_35px_-20px_rgba(15,23,42,0.45)]">
                <div class="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-400 to-emerald-500"></div>
                <div class="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <p class="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">Premium Control Center</p>
                        <h1 class="mt-2 text-2xl md:text-3xl font-black text-slate-900">Settings</h1>
                        <p class="mt-2 text-sm text-slate-600 max-w-2xl">
                            Tune notifications, study behavior, appearance, and account security. All changes save to your account.
                        </p>
                    </div>
                    <div class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 min-w-[180px]">
                        <p class="text-xs uppercase tracking-wide text-slate-500">Profile</p>
                        <p class="text-sm font-bold text-slate-900 truncate">{{ user?.name || "Learner" }}</p>
                        <p class="text-xs text-slate-500 truncate">{{ user?.email || "No email" }}</p>
                    </div>
                </div>
            </section>

            <p v-if="feedback.message" class="rounded-2xl border px-4 py-3 text-sm" :class="feedback.type === 'success'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                : 'border-rose-200 bg-rose-50 text-rose-700'">
                {{ feedback.message }}
            </p>

            <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div class="xl:col-span-2 space-y-6">
                    <section class="rounded-3xl border border-slate-200 bg-white/95 p-5">
                        <h2 class="text-lg font-extrabold text-slate-900">Notifications</h2>
                        <p class="text-sm text-slate-600 mt-1">Choose what updates you receive and how often.</p>
                        <div class="mt-4 space-y-3">
                            <label class="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                                <div>
                                    <p class="font-semibold text-slate-800">Email notifications</p>
                                    <p class="text-xs text-slate-500">Important account and exam updates by email.</p>
                                </div>
                                <input v-model="settings.notifications.email_notifications" type="checkbox"
                                    class="toggle toggle-success border-slate-400" />
                            </label>
                            <label class="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                                <div>
                                    <p class="font-semibold text-slate-800">SMS alerts</p>
                                    <p class="text-xs text-slate-500">Critical reminders to your phone.</p>
                                </div>
                                <input v-model="settings.notifications.sms_alerts" type="checkbox"
                                    class="toggle toggle-success border-slate-400" />
                            </label>
                            <label class="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                                <div>
                                    <p class="font-semibold text-slate-800">Exam reminders</p>
                                    <p class="text-xs text-slate-500">Receive study reminders based on your plan.</p>
                                </div>
                                <input v-model="settings.notifications.exam_reminders" type="checkbox"
                                    class="toggle toggle-success border-slate-400" />
                            </label>
                            <label class="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                                <div>
                                    <p class="font-semibold text-slate-800">Weekly digest</p>
                                    <p class="text-xs text-slate-500">Summary of your progress and focus areas.</p>
                                </div>
                                <input v-model="settings.notifications.weekly_digest" type="checkbox"
                                    class="toggle toggle-success border-slate-400" />
                            </label>
                            <label class="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                                <div>
                                    <p class="font-semibold text-slate-800">Product updates</p>
                                    <p class="text-xs text-slate-500">New features, releases, and promos.</p>
                                </div>
                                <input v-model="settings.notifications.marketing_updates" type="checkbox"
                                    class="toggle toggle-success border-slate-400" />
                            </label>
                        </div>
                    </section>

                    <section class="rounded-3xl border border-slate-200 bg-white/95 p-5">
                        <h2 class="text-lg font-extrabold text-slate-900">Study Preferences</h2>
                        <p class="text-sm text-slate-600 mt-1">Customize how study and exam sessions behave by default.</p>

                        <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                            <label class="block">
                                <span class="text-xs font-bold uppercase tracking-wide text-slate-600">Default exam mode</span>
                                <select v-model="settings.preferences.default_exam_mode"
                                    class="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-400">
                                    <option value="exam">Exam</option>
                                    <option value="tutor">Tutor</option>
                                </select>
                            </label>
                            <label class="block">
                                <span class="text-xs font-bold uppercase tracking-wide text-slate-600">Question font size</span>
                                <select v-model="settings.preferences.question_font_size"
                                    class="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-400">
                                    <option value="compact">Compact</option>
                                    <option value="comfortable">Comfortable</option>
                                    <option value="large">Large</option>
                                </select>
                            </label>
                            <label class="block">
                                <span class="text-xs font-bold uppercase tracking-wide text-slate-600">Timezone</span>
                                <select v-model="settings.preferences.timezone"
                                    class="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-400">
                                    <option v-for="tz in timezoneOptions" :key="tz" :value="tz">{{ tz }}</option>
                                </select>
                            </label>
                            <label class="block">
                                <span class="text-xs font-bold uppercase tracking-wide text-slate-600">Daily reminder time</span>
                                <input v-model="settings.preferences.daily_reminder_time" type="time"
                                    class="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-400" />
                            </label>
                        </div>

                        <div class="mt-4 space-y-3">
                            <label class="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                                <div>
                                    <p class="font-semibold text-slate-800">Auto-save progress</p>
                                    <p class="text-xs text-slate-500">Save responses while taking exams.</p>
                                </div>
                                <input v-model="settings.preferences.auto_save_progress" type="checkbox"
                                    class="toggle toggle-success border-slate-400" />
                            </label>
                            <label class="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                                <div>
                                    <p class="font-semibold text-slate-800">Show rationales in tutor mode</p>
                                    <p class="text-xs text-slate-500">Display explanations while answering.</p>
                                </div>
                                <input v-model="settings.preferences.show_rationales_in_tutor" type="checkbox"
                                    class="toggle toggle-success border-slate-400" />
                            </label>
                            <label class="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                                <div>
                                    <p class="font-semibold text-slate-800">Enable sounds</p>
                                    <p class="text-xs text-slate-500">Play subtle interaction sounds in exams.</p>
                                </div>
                                <input v-model="settings.preferences.enable_sounds" type="checkbox"
                                    class="toggle toggle-success border-slate-400" />
                            </label>
                        </div>
                    </section>

                    <section class="rounded-3xl border border-slate-200 bg-white/95 p-5">
                        <h2 class="text-lg font-extrabold text-slate-900">Security Preferences</h2>
                        <p class="text-sm text-slate-600 mt-1">Control sign-in alerts and session behavior.</p>

                        <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                            <label class="block">
                                <span class="text-xs font-bold uppercase tracking-wide text-slate-600">Session timeout</span>
                                <select v-model.number="settings.security.session_timeout_minutes"
                                    class="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-400">
                                    <option :value="30">30 minutes</option>
                                    <option :value="60">60 minutes</option>
                                    <option :value="120">120 minutes</option>
                                    <option :value="240">240 minutes</option>
                                </select>
                            </label>
                        </div>

                        <div class="mt-4 space-y-3">
                            <label class="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                                <div>
                                    <p class="font-semibold text-slate-800">Login alerts</p>
                                    <p class="text-xs text-slate-500">Notify me when a new session is detected.</p>
                                </div>
                                <input v-model="settings.security.login_alerts" type="checkbox"
                                    class="toggle toggle-success border-slate-400" />
                            </label>
                            <label class="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                                <div>
                                    <p class="font-semibold text-slate-800">Require verified email</p>
                                    <p class="text-xs text-slate-500">Recommended to keep account recovery secure.</p>
                                </div>
                                <input v-model="settings.security.require_verified_email" type="checkbox"
                                    class="toggle toggle-success border-slate-400" />
                            </label>
                        </div>
                    </section>
                </div>

                <div class="space-y-6">
                    <section class="rounded-3xl border border-slate-200 bg-white/95 p-5">
                        <h2 class="text-lg font-extrabold text-slate-900">Appearance</h2>
                        <p class="text-sm text-slate-600 mt-1">Choose your preferred color system and reading style.</p>

                        <div class="mt-4">
                            <p class="text-xs font-bold uppercase tracking-wide text-slate-600 mb-2">Theme</p>
                            <div class="grid grid-cols-2 gap-2">
                                <button v-for="option in themeOptions" :key="option.name" type="button"
                                    @click="applyTheme(option.name)"
                                    class="rounded-xl border px-3 py-2 text-sm font-semibold transition text-left"
                                    :class="theme.currentTheme === option.name
                                        ? 'border-cyan-500 bg-cyan-50 text-cyan-700'
                                        : 'border-slate-300 bg-white text-slate-600 hover:border-cyan-400'">
                                    <span :class="`inline-block size-3 rounded-full mr-2 ${option.bg}`"></span>
                                    {{ option.name }}
                                </button>
                            </div>
                        </div>

                        <div class="mt-4">
                            <p class="text-xs font-bold uppercase tracking-wide text-slate-600 mb-2">Font</p>
                            <div class="space-y-2">
                                <button v-for="option in fontOptions" :key="option.name" type="button"
                                    @click="applyFont(option.name)"
                                    class="w-full rounded-xl border px-3 py-2 text-sm transition flex items-center justify-between"
                                    :class="[
                                        option.font,
                                        theme.currentFont === option.name
                                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                            : 'border-slate-300 bg-white text-slate-600 hover:border-emerald-400'
                                    ]">
                                    <span>{{ option.name }}</span>
                                    <i v-if="theme.currentFont === option.name" class="pi pi-check-circle"></i>
                                </button>
                            </div>
                        </div>
                    </section>

                    <section class="rounded-3xl border border-slate-200 bg-white/95 p-5">
                        <h2 class="text-lg font-extrabold text-slate-900">Change Password</h2>
                        <p class="text-sm text-slate-600 mt-1">Update your password to keep your account secure.</p>

                        <div class="mt-4 space-y-3">
                            <label class="block">
                                <span class="text-xs font-bold uppercase tracking-wide text-slate-600">New password</span>
                                <input v-model="passwordForm.password" type="password" autocomplete="new-password"
                                    class="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-400" />
                            </label>
                            <label class="block">
                                <span class="text-xs font-bold uppercase tracking-wide text-slate-600">Confirm password</span>
                                <input v-model="passwordForm.confirmPassword" type="password" autocomplete="new-password"
                                    class="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-400" />
                            </label>
                        </div>

                        <div class="mt-4">
                            <CommonButton :button-text="isUpdatingPassword ? 'Updating...' : 'Update Password'"
                                :disabled="isUpdatingPassword" classes="w-full bg-amber-500 text-white hover:bg-amber-600"
                                :action="updatePassword" />
                        </div>
                    </section>

                    <section class="rounded-3xl border border-slate-200 bg-white/95 p-5">
                        <h2 class="text-lg font-extrabold text-slate-900">Actions</h2>
                        <div class="mt-4 space-y-2">
                            <CommonButton :button-text="isSaving ? 'Saving...' : 'Save All Settings'" :disabled="isSaving || isLoading"
                                classes="w-full bg-emerald-600 text-white hover:bg-emerald-700" :action="saveSettings" />
                            <CommonButton :button-text="isResetting ? 'Resetting...' : 'Reset To Defaults'" :disabled="isResetting || isLoading"
                                classes="w-full bg-white text-slate-700 border border-slate-300 hover:bg-slate-100"
                                :action="resetSettings" />
                            <CommonButton button-text="Reset Local App State"
                                classes="w-full bg-rose-500 text-white hover:bg-rose-600" :action="resetLocalApp" />
                        </div>
                    </section>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import axios from 'axios'
import CommonButton from '../components/Buttons/CommonButton.vue'
import Navigation from '../components/Navigation.vue'
import { useMainStore } from '../stores'
import { useThemeStore } from '../stores/Theme'
import { useAuthStore } from '../stores/authStore'

type ExamMode = 'exam' | 'tutor'
type FontSize = 'compact' | 'comfortable' | 'large'

interface NotificationSettings {
    email_notifications: boolean
    sms_alerts: boolean
    exam_reminders: boolean
    weekly_digest: boolean
    marketing_updates: boolean
}

interface PreferenceSettings {
    auto_save_progress: boolean
    default_exam_mode: ExamMode
    show_rationales_in_tutor: boolean
    enable_sounds: boolean
    question_font_size: FontSize
    timezone: string
    daily_reminder_time: string
}

interface SecuritySettings {
    login_alerts: boolean
    require_verified_email: boolean
    session_timeout_minutes: number
}

interface AppearanceSettings {
    theme: string
    font: string
}

interface UserSettingsPayload {
    notifications: NotificationSettings
    preferences: PreferenceSettings
    security: SecuritySettings
    appearance: AppearanceSettings
}

interface FeedbackState {
    type: 'success' | 'error'
    message: string
}

interface PasswordFormState {
    password: string
    confirmPassword: string
}

const mainStore = useMainStore()
const theme = useThemeStore()
const authStore = useAuthStore()
const user = computed(() => authStore.user || {})

const timezoneOptions = [
    'Africa/Nairobi',
    'UTC',
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'Europe/London',
]

const buildDefaultSettings = (): UserSettingsPayload => ({
    notifications: {
        email_notifications: true,
        sms_alerts: false,
        exam_reminders: true,
        weekly_digest: true,
        marketing_updates: false,
    },
    preferences: {
        auto_save_progress: true,
        default_exam_mode: 'exam',
        show_rationales_in_tutor: true,
        enable_sounds: true,
        question_font_size: 'comfortable',
        timezone: 'Africa/Nairobi',
        daily_reminder_time: '19:00',
    },
    security: {
        login_alerts: true,
        require_verified_email: true,
        session_timeout_minutes: 60,
    },
    appearance: {
        theme: 'Light',
        font: 'Exo',
    },
})

const settings = ref<UserSettingsPayload>(buildDefaultSettings())
const feedback = ref<FeedbackState>({ type: 'success', message: '' })
const passwordForm = ref<PasswordFormState>({ password: '', confirmPassword: '' })
const isLoading = ref(true)
const isSaving = ref(false)
const isResetting = ref(false)
const isUpdatingPassword = ref(false)

const themeOptions = computed(() => Object.values(theme.themes))
const fontOptions = computed(() => Object.values(theme.fonts))

const normalizeSettings = (payload: Partial<UserSettingsPayload> | null | undefined): UserSettingsPayload => {
    const defaults = buildDefaultSettings()

    return {
        notifications: { ...defaults.notifications, ...(payload?.notifications || {}) },
        preferences: { ...defaults.preferences, ...(payload?.preferences || {}) },
        security: { ...defaults.security, ...(payload?.security || {}) },
        appearance: { ...defaults.appearance, ...(payload?.appearance || {}) },
    }
}

const applyAppearanceFromSettings = () => {
    if (theme.themes[settings.value.appearance.theme]) {
        theme.setTheme(settings.value.appearance.theme)
    }
    if (theme.fonts[settings.value.appearance.font]) {
        theme.setFont(settings.value.appearance.font)
    }
}

const applyTheme = (themeName: string) => {
    if (!theme.themes[themeName]) return
    theme.setTheme(themeName)
    settings.value.appearance.theme = themeName
}

const applyFont = (fontName: string) => {
    if (!theme.fonts[fontName]) return
    theme.setFont(fontName)
    settings.value.appearance.font = fontName
}

const setFeedback = (message: string, type: 'success' | 'error' = 'success') => {
    feedback.value = { message, type }
}

const loadSettings = async () => {
    isLoading.value = true
    try {
        const response = await axios.get('/settings')
        const payload = response?.data?.data?.settings
        settings.value = normalizeSettings(payload)
        applyAppearanceFromSettings()
    } catch (error) {
        settings.value = normalizeSettings(null)
        setFeedback('Unable to load settings. Using defaults for now.', 'error')
        console.error('Error loading settings:', error)
    } finally {
        isLoading.value = false
    }
}

const saveSettings = async () => {
    if (isSaving.value || isLoading.value) return
    isSaving.value = true
    setFeedback('')

    try {
        settings.value.appearance.theme = theme.currentTheme
        settings.value.appearance.font = theme.currentFont

        const response = await axios.put('/settings', settings.value)
        const payload = response?.data?.data?.settings
        settings.value = normalizeSettings(payload)
        applyAppearanceFromSettings()
        setFeedback('Settings saved successfully.')
    } catch (error) {
        setFeedback('Unable to save settings. Please try again.', 'error')
        console.error('Error saving settings:', error)
    } finally {
        isSaving.value = false
    }
}

const resetSettings = async () => {
    if (isResetting.value || isLoading.value) return
    const proceed = window.confirm('Reset all settings to default values?')
    if (!proceed) return

    isResetting.value = true
    setFeedback('')
    try {
        const response = await axios.post('/settings/reset')
        const payload = response?.data?.data?.settings
        settings.value = normalizeSettings(payload)
        applyAppearanceFromSettings()
        setFeedback('Settings reset to defaults.')
    } catch (error) {
        setFeedback('Unable to reset settings. Please try again.', 'error')
        console.error('Error resetting settings:', error)
    } finally {
        isResetting.value = false
    }
}

const updatePassword = async () => {
    if (isUpdatingPassword.value) return

    const password = passwordForm.value.password
    const confirmation = passwordForm.value.confirmPassword

    if (!password || !confirmation) {
        setFeedback('Enter and confirm your new password.', 'error')
        return
    }

    if (password.length < 8) {
        setFeedback('Password must be at least 8 characters.', 'error')
        return
    }

    if (password !== confirmation) {
        setFeedback('Password confirmation does not match.', 'error')
        return
    }

    isUpdatingPassword.value = true
    setFeedback('')
    try {
        await axios.post('/account', {
            password,
            password_confirmation: confirmation,
        })

        passwordForm.value.password = ''
        passwordForm.value.confirmPassword = ''
        setFeedback('Password updated successfully.')
    } catch (error: any) {
        const message = error?.response?.data?.errors?.password?.[0]
            || error?.response?.data?.message
            || 'Unable to update password. Please try again.'
        setFeedback(message, 'error')
        console.error('Error updating password:', error)
    } finally {
        isUpdatingPassword.value = false
    }
}

const resetLocalApp = () => {
    mainStore.resetApp()
    theme.resetTheme()
    setFeedback('Local app state reset complete.')
}

onMounted(loadSettings)
</script>
