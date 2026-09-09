<template>
    <div
        class="relative z-10 rounded-2xl min-h-[93.5vh] max-h-[93.5vh] 2xl:min-h-[94vh] 2xl:max-h-[94vh] overflow-y-scroll bg-slate-50 p-4 sm:p-6">
        <!-- Ambient background glow -->
        <div class="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl" aria-hidden="true">
            <div
                class="ui-drift absolute -top-24 -left-32 h-[520px] w-[520px] rounded-full bg-gradient-to-r from-cyan-300 via-sky-300 to-emerald-200 opacity-25 blur-[120px]">
            </div>
            <div
                class="ui-drift-slow absolute top-1/3 -right-24 h-[420px] w-[420px] rounded-full bg-gradient-to-r from-indigo-300 via-sky-200 to-cyan-200 opacity-25 blur-[110px]">
            </div>
        </div>

        <div class="relative mx-auto max-w-screen-2xl space-y-6">
            <Navigation />

            <!-- ================= HERO ================= -->
            <section
                class="ui-rise relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 text-slate-950 shadow-custom md:p-7 dark:border-transparent dark:bg-slate-950 dark:text-white dark:shadow-2xl dark:shadow-slate-900/25">
                <div class="pointer-events-none absolute inset-0" aria-hidden="true">
                    <div
                        class="absolute inset-0 bg-gradient-to-br from-white via-cyan-50/60 to-emerald-50/70 dark:from-slate-950 dark:via-slate-900 dark:to-cyan-950">
                    </div>
                    <div
                        class="ui-drift absolute -top-40 -right-20 h-96 w-96 rounded-full bg-cyan-300/40 blur-3xl dark:bg-cyan-500/30">
                    </div>
                    <div
                        class="ui-drift-slow absolute -bottom-48 -left-24 h-[28rem] w-[28rem] rounded-full bg-emerald-300/30 blur-3xl dark:bg-emerald-500/20">
                    </div>
                    <div
                        class="absolute inset-0 opacity-[0.35] [background-image:radial-gradient(circle_at_1px_1px,rgba(14,116,144,0.35)_1px,transparent_0)] [background-size:26px_26px] dark:opacity-[0.12] dark:[background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.9)_1px,transparent_0)]">
                    </div>
                </div>

                <div class="relative grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6 items-stretch">
                    <div class="min-w-0">
                        <div class="flex flex-wrap items-center gap-2">
                            <span
                                class="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-700 backdrop-blur dark:border-white/10 dark:bg-white/10 dark:text-cyan-200">
                                <span class="relative flex h-2 w-2">
                                    <span
                                        class="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-500 opacity-70 dark:bg-cyan-300"></span>
                                    <span class="relative inline-flex h-2 w-2 rounded-full bg-cyan-500 dark:bg-cyan-300"></span>
                                </span>
                                Profile &amp; Access
                            </span>
                            <span class="text-xs font-semibold text-slate-500 dark:text-slate-400">{{ todayLabel }}</span>
                        </div>

                        <h1 class="mt-4 text-3xl md:text-5xl font-black tracking-tight leading-[1.05]">
                            {{ greeting }},
                            <span
                                class="bg-gradient-to-r from-cyan-600 via-sky-500 to-emerald-500 bg-clip-text text-transparent dark:from-cyan-300 dark:via-sky-200 dark:to-emerald-300">
                                {{ firstName }}
                            </span>
                        </h1>
                        <p class="mt-3 max-w-2xl text-sm md:text-base text-slate-600 dark:text-slate-300">
                            Your profile, subscriptions, and study access, organized in one calm place.
                            {{ heroTagline }}
                        </p>

                        <div class="mt-6 flex flex-wrap gap-2">
                            <router-link v-for="action in heroActions" :key="action.to" :to="action.to"
                                class="group inline-flex min-h-10 items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-all duration-200"
                                :class="action.primary
                                    ? 'bg-slate-950 text-white shadow-lg shadow-cyan-500/20 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-cyan-400/30 dark:bg-white dark:text-slate-950 dark:hover:bg-cyan-50'
                                    : 'border border-slate-200 bg-white/70 text-slate-700 backdrop-blur hover:border-slate-300 hover:bg-white dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:border-white/30 dark:hover:bg-white/10'">
                                <i :class="action.icon"
                                    class="transition-transform duration-200 group-hover:scale-110"></i>
                                <span>{{ action.label }}</span>
                            </router-link>
                        </div>
                    </div>

                    <!-- Identity card -->
                    <aside
                        class="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/70 p-4 backdrop-blur-md dark:border-white/10 dark:bg-white/[0.06]">
                        <div
                            class="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-cyan-300/30 blur-2xl dark:bg-cyan-400/20">
                        </div>

                        <div class="relative flex items-center gap-3">
                            <div
                                class="relative shrink-0 rounded-2xl bg-gradient-to-br from-cyan-400 via-sky-500 to-emerald-400 p-[2px] dark:from-cyan-300 dark:via-sky-400 dark:to-emerald-300">
                                <div
                                    class="flex h-14 w-14 items-center justify-center overflow-hidden rounded-[14px] bg-white dark:bg-slate-900">
                                    <img v-if="hasAvatar" :src="avatarPreview" class="h-full w-full object-cover"
                                        alt="User avatar" />
                                    <span v-else class="text-base font-black text-slate-900 dark:text-white">{{ initials }}</span>
                                </div>
                                <span
                                    class="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white dark:border-slate-950"
                                    :class="isVerified ? 'bg-emerald-500 text-white dark:bg-emerald-400 dark:text-slate-950' : 'bg-amber-500 text-white dark:bg-amber-400 dark:text-slate-950'"
                                    :title="isVerified ? 'Verified account' : 'Verification pending'">
                                    <i :class="isVerified ? 'pi pi-check' : 'pi pi-exclamation-triangle'"
                                        class="text-[9px] font-black"></i>
                                </span>
                            </div>
                            <div class="min-w-0">
                                <p class="truncate text-base font-extrabold text-slate-950 dark:text-white">{{ formData.name || "Learner" }}</p>
                                <p class="truncate text-xs text-slate-500 dark:text-slate-400">{{ formData.email || "No email available" }}</p>
                                <p class="mt-1 inline-flex items-center gap-1.5 text-[11px] font-bold"
                                    :class="isVerified ? 'text-emerald-700 dark:text-emerald-300' : 'text-amber-700 dark:text-amber-300'">
                                    <span class="h-1.5 w-1.5 rounded-full"
                                        :class="isVerified ? 'bg-emerald-500 dark:bg-emerald-300' : 'bg-amber-500 dark:bg-amber-300'"></span>
                                    {{ isVerified ? "Verified" : "Needs review" }}
                                </p>
                            </div>
                        </div>

                        <div class="relative mt-4 grid grid-cols-2 gap-2">
                            <div class="rounded-2xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-950/40">
                                <p class="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Primary
                                </p>
                                <p class="mt-1 flex items-center gap-2 truncate text-sm font-extrabold text-slate-950 dark:text-white">
                                    <i :class="primaryProductCard.icon" class="text-cyan-600 dark:text-cyan-300"></i>
                                    <span class="truncate">{{ primaryProductCard.label }}</span>
                                </p>
                            </div>
                            <div class="rounded-2xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-950/40">
                                <p class="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Setup</p>
                                <p class="mt-1 text-sm font-extrabold text-slate-950 dark:text-white">
                                    {{ readinessPercent }}<span class="text-xs text-slate-500 dark:text-slate-400">% complete</span>
                                </p>
                            </div>
                        </div>

                        <div class="relative mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                            <div class="h-full rounded-full bg-gradient-to-r from-cyan-500 via-sky-400 to-emerald-400 transition-all duration-700 ease-out dark:from-cyan-400 dark:via-sky-300 dark:to-emerald-300"
                                :style="{ width: `${readinessPercent}%` }"></div>
                        </div>
                    </aside>
                </div>
            </section>

            <!-- ================= METRICS ================= -->
            <section class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <article v-for="(metric, index) in accountMetrics" :key="metric.label"
                    class="ui-rise group relative overflow-hidden rounded-3xl border bg-white p-4 shadow-custom transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                    :class="metric.borderClass" :style="{ animationDelay: `${120 + index * 70}ms` }">
                    <div class="pointer-events-none absolute -top-10 -right-10 h-28 w-28 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
                        :class="metric.glowClass"></div>

                    <div class="relative flex items-start justify-between gap-3">
                        <div>
                            <p class="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">{{ metric.label }}
                            </p>
                            <p class="mt-2 text-3xl font-black tabular-nums tracking-tight text-slate-950">
                                {{ metric.value }}
                            </p>
                        </div>
                        <span
                            class="inline-flex h-11 w-11 items-center justify-center rounded-2xl text-white shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                            :class="metric.iconClass">
                            <i :class="metric.icon"></i>
                        </span>
                    </div>
                    <p class="relative mt-2 text-sm text-slate-600">{{ metric.helper }}</p>
                </article>
            </section>

            <!-- ================= FEEDBACK ================= -->
            <Transition name="ui-fade-slide">
                <div v-if="feedbackText"
                    class="flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold shadow-sm" :class="feedbackType === 'success'
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                        : 'border-rose-200 bg-rose-50 text-rose-800'">
                    <span class="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
                        :class="feedbackType === 'success' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'">
                        <i :class="feedbackType === 'success' ? 'pi pi-check' : 'pi pi-times'" class="text-xs"></i>
                    </span>
                    <span class="flex-1">{{ feedbackText }}</span>
                    <button type="button" class="text-xs opacity-60 transition hover:opacity-100"
                        @click="setFeedback('')" aria-label="Dismiss message">
                        <i class="pi pi-times"></i>
                    </button>
                </div>
            </Transition>

            <div class="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
                <div class="xl:col-span-2 space-y-6">
                    <!-- ================= PROFILE ================= -->
                    <section
                        class="ui-rise relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-custom md:p-6"
                        style="animation-delay: 220ms">

                        <div class="flex flex-wrap items-start justify-between gap-3">
                            <div>
                                <p class="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">Profile</p>
                                <h2 class="mt-1 text-xl font-black text-slate-950">Personal Information</h2>
                                <p class="mt-1 text-sm text-slate-600">
                                    Update the name and image attached to your learner account.
                                </p>
                            </div>
                            <span
                                class="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold transition-colors"
                                :class="isDirty
                                    ? 'border-amber-200 bg-amber-50 text-amber-700'
                                    : 'border-emerald-200 bg-emerald-50 text-emerald-700'">
                                <i :class="isDirty ? 'pi pi-pencil' : 'pi pi-lock'"></i>
                                {{ isDirty ? "Unsaved changes" : "Secure update" }}
                            </span>
                        </div>

                        <form @submit.prevent="saveSettings" class="mt-5 grid grid-cols-1 lg:grid-cols-[230px_1fr] gap-5">
                            <div
                                class="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-4 text-center">
                                <div
                                    class="pointer-events-none absolute -top-12 left-1/2 h-32 w-48 -translate-x-1/2 rounded-full bg-emerald-200/50 blur-2xl">
                                </div>

                                <div
                                    class="group relative mx-auto h-32 w-32 rounded-3xl bg-gradient-to-br from-emerald-400 via-cyan-400 to-sky-500 p-[3px] shadow-lg shadow-cyan-500/20 transition-transform duration-300 hover:scale-[1.03]">
                                    <div class="h-full w-full overflow-hidden rounded-[21px] bg-white">
                                        <img :src="avatarPreview"
                                            class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            alt="User avatar" />
                                    </div>
                                    <label
                                        class="absolute -bottom-1 -right-1 inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-[3px] border-white bg-slate-950 text-white shadow-lg transition-all duration-200 hover:scale-110 hover:bg-cyan-600"
                                        title="Change profile photo">
                                        <input type="file" accept="image/*" class="hidden" @change="handleAvatarUpload" />
                                        <i class="pi pi-camera text-sm"></i>
                                    </label>
                                </div>

                                <p class="relative mt-4 text-sm font-extrabold text-slate-900">
                                    {{ formData.name || "Learner" }}
                                </p>
                                <p class="relative mt-1 inline-flex items-center gap-1.5 text-xs font-semibold"
                                    :class="fileUrl ? 'text-cyan-700' : 'text-slate-500'">
                                    <i :class="fileUrl ? 'pi pi-sparkles' : 'pi pi-image'" class="text-[11px]"></i>
                                    {{ fileUrl ? "New image ready to save" : "JPG or PNG under 2 MB" }}
                                </p>
                            </div>

                            <div class="space-y-4">
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <label class="block">
                                        <span
                                            class="mb-2 block text-[11px] font-bold uppercase tracking-[0.14em] text-slate-600">
                                            Name
                                        </span>
                                        <div class="relative">
                                            <i
                                                class="pi pi-user pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400"></i>
                                            <input v-model="formData.name" type="text"
                                                class="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm font-semibold text-slate-800 shadow-sm transition-all duration-200 placeholder:font-normal hover:border-slate-300 focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-100"
                                                placeholder="Enter your name" />
                                        </div>
                                    </label>

                                    <label class="block">
                                        <span
                                            class="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-600">
                                            Email
                                            <span
                                                class="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-black tracking-wide text-slate-500">Locked</span>
                                        </span>
                                        <div class="relative">
                                            <i
                                                class="pi pi-envelope pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400"></i>
                                            <input v-model="formData.email" type="email" disabled
                                                class="w-full cursor-not-allowed rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm font-semibold text-slate-500"
                                                placeholder="Email address" />
                                        </div>
                                    </label>
                                </div>

                                <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <div v-for="detail in profileDetails" :key="detail.label"
                                        class="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 transition-colors hover:border-slate-300 hover:bg-white">
                                        <span
                                            class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm"
                                            :class="detail.iconClass">
                                            <i :class="detail.icon"></i>
                                        </span>
                                        <span class="min-w-0">
                                            <span
                                                class="block text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                                                {{ detail.label }}
                                            </span>
                                            <span class="block truncate text-sm font-extrabold text-slate-900">
                                                {{ detail.value }}
                                            </span>
                                        </span>
                                    </div>
                                </div>

                                <div
                                    class="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 to-white px-4 py-3">
                                    <p class="flex items-center gap-2 text-sm text-slate-600">
                                        <i class="pi pi-history text-slate-400"></i>
                                        Last saved:
                                        <strong class="text-slate-800">{{ lastSavedAt || "Not saved yet" }}</strong>
                                    </p>
                                    <button type="submit" :disabled="isSaving"
                                        class="group inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-2 text-sm font-bold text-white shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-emerald-500/40 active:translate-y-0 disabled:pointer-events-none disabled:opacity-60">
                                        <i :class="isSaving ? 'pi pi-spin pi-spinner' : 'pi pi-save'"></i>
                                        <span>{{ isSaving ? "Saving..." : "Save Profile" }}</span>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </section>

                    <!-- ================= SUBSCRIPTIONS ================= -->
                    <section
                        class="ui-rise relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-custom md:p-6"
                        style="animation-delay: 300ms">

                        <div class="flex flex-wrap items-start justify-between gap-3">
                            <div>
                                <p class="text-xs font-bold uppercase tracking-[0.16em] text-indigo-700">Access</p>
                                <h2 class="mt-1 text-xl font-black text-slate-950">Subscriptions</h2>
                                <p class="mt-1 text-sm text-slate-600">
                                    See which prep products are active, expiring, or ready to renew.
                                </p>
                            </div>
                            <router-link to="/subscription"
                                class="group inline-flex min-h-10 items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-slate-900/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-800">
                                <i class="pi pi-wallet"></i>
                                <span>Manage Billing</span>
                                <i
                                    class="pi pi-arrow-right text-xs transition-transform duration-200 group-hover:translate-x-0.5"></i>
                            </router-link>
                        </div>

                        <div class="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-4">
                            <article v-for="(product, index) in subscriptionCards" :key="product.code"
                                class="ui-rise group relative flex flex-col overflow-hidden rounded-3xl border bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                                :class="[product.cardBorderClass, product.cardRingClass]"
                                :style="{ animationDelay: `${360 + index * 80}ms` }">
                                <div class="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b to-transparent"
                                    :class="product.tintClass"></div>
                                <div class="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full opacity-40 blur-2xl transition-opacity duration-300 group-hover:opacity-70"
                                    :class="product.glowClass"></div>

                                <div class="relative flex items-start justify-between gap-3">
                                    <div class="flex items-center gap-3">
                                        <span
                                            class="inline-flex h-11 w-11 items-center justify-center rounded-2xl text-white shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3"
                                            :class="product.iconClass">
                                            <i :class="product.icon"></i>
                                        </span>
                                        <div>
                                            <p class="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                                                {{ product.code.toUpperCase() }}
                                            </p>
                                            <h3 class="text-base font-black leading-tight text-slate-950">
                                                {{ product.label }}
                                            </h3>
                                        </div>
                                    </div>
                                    <span
                                        class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold"
                                        :class="product.badgeClass">
                                        <span class="relative flex h-1.5 w-1.5">
                                            <span v-if="product.accessState === 'active' || product.accessState === 'trial'"
                                                class="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                                                :class="product.dotClass"></span>
                                            <span class="relative inline-flex h-1.5 w-1.5 rounded-full"
                                                :class="product.dotClass"></span>
                                        </span>
                                        {{ product.statusLabel }}
                                    </span>
                                </div>

                                <p class="relative mt-4 text-sm font-bold text-slate-800">{{ product.statusText }}</p>
                                <p class="relative mt-1 min-h-8 text-xs text-slate-500">{{ product.helperText }}</p>

                                <div class="relative mt-4">
                                    <div
                                        class="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                                        <span>Access Runway</span>
                                        <span class="tabular-nums" :class="product.progressTextClass">{{
                                            product.progressLabel }}</span>
                                    </div>
                                    <div class="mt-2 h-2 overflow-hidden rounded-full bg-slate-100 ring-1 ring-slate-200/70">
                                        <div class="relative h-full overflow-hidden rounded-full transition-all duration-700 ease-out"
                                            :class="product.progressClass" :style="{ width: product.progressWidth }">
                                            <span v-if="product.accessState === 'active' || product.accessState === 'trial'"
                                                class="ui-shimmer absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"></span>
                                        </div>
                                    </div>
                                </div>

                                <div class="relative mt-auto flex flex-wrap gap-2 pt-4">
                                    <router-link :to="product.dashboardPath"
                                        class="inline-flex min-h-9 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50">
                                        <i class="pi pi-th-large"></i>
                                        <span>Dashboard</span>
                                    </router-link>
                                    <router-link :to="product.pricingPath"
                                        class="inline-flex min-h-9 items-center justify-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                                        :class="product.ctaClass">
                                        <i class="pi pi-credit-card"></i>
                                        <span>{{ product.primaryCta }}</span>
                                    </router-link>
                                </div>
                            </article>
                        </div>
                    </section>
                </div>

                <!-- ================= SIDEBAR ================= -->
                <aside class="space-y-6">
                    <section
                        class="ui-rise relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-custom"
                        style="animation-delay: 260ms">
                        <div class="flex items-center justify-between gap-3">
                            <div>
                                <p class="text-xs font-bold uppercase tracking-[0.16em] text-cyan-700">Next Actions</p>
                                <h2 class="mt-1 text-lg font-black text-slate-950">Account Shortcuts</h2>
                            </div>
                            <span
                                class="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600">
                                <i class="pi pi-compass text-lg"></i>
                            </span>
                        </div>

                        <div class="mt-4 space-y-2">
                            <router-link v-for="action in accountActions" :key="action.to + action.label" :to="action.to"
                                class="group flex min-h-14 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 transition-all duration-200 hover:border-cyan-200 hover:bg-cyan-50/60 hover:pl-4">
                                <span
                                    class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl transition-transform duration-200 group-hover:scale-110"
                                    :class="action.iconClass">
                                    <i :class="action.icon"></i>
                                </span>
                                <span class="min-w-0">
                                    <span class="block text-sm font-extrabold text-slate-900">{{ action.label }}</span>
                                    <span class="block truncate text-xs text-slate-500">{{ action.helper }}</span>
                                </span>
                                <i
                                    class="pi pi-arrow-right ml-auto text-xs text-slate-400 transition-all duration-200 group-hover:translate-x-1 group-hover:text-cyan-600"></i>
                            </router-link>
                        </div>
                    </section>

                    <section
                        class="ui-rise relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-custom"
                        style="animation-delay: 340ms">
                        <div class="flex items-center justify-between gap-3">
                            <div>
                                <p class="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">Readiness</p>
                                <h2 class="mt-1 text-lg font-black text-slate-950">Account Setup</h2>
                            </div>

                            <!-- Progress ring -->
                            <div class="relative h-14 w-14 shrink-0">
                                <svg class="h-14 w-14 -rotate-90" viewBox="0 0 48 48" aria-hidden="true">
                                    <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" stroke-width="5"
                                        class="text-slate-100" />
                                    <circle cx="24" cy="24" r="20" fill="none" stroke="url(#readinessGradient)"
                                        stroke-width="5" stroke-linecap="round" :stroke-dasharray="ringCircumference"
                                        :stroke-dashoffset="ringOffset"
                                        class="transition-[stroke-dashoffset] duration-700 ease-out" />
                                    <defs>
                                        <linearGradient id="readinessGradient" x1="0" y1="0" x2="1" y2="1">
                                            <stop offset="0%" stop-color="#34d399" />
                                            <stop offset="100%" stop-color="#06b6d4" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                                <span
                                    class="absolute inset-0 flex items-center justify-center text-xs font-black tabular-nums text-slate-900">
                                    {{ readinessComplete }}/{{ readinessItems.length }}
                                </span>
                            </div>
                        </div>

                        <div class="mt-4 space-y-2.5">
                            <div v-for="item in readinessItems" :key="item.label"
                                class="flex items-start gap-3 rounded-2xl border p-3 transition-colors" :class="item.complete
                                    ? 'border-emerald-100 bg-emerald-50/50'
                                    : 'border-amber-100 bg-amber-50/50'">
                                <span
                                    class="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white shadow-sm"
                                    :class="item.complete ? 'bg-emerald-500' : 'bg-amber-500'">
                                    <i :class="item.complete ? 'pi pi-check' : 'pi pi-exclamation-triangle'"
                                        class="text-[10px]"></i>
                                </span>
                                <span class="min-w-0">
                                    <span class="block text-sm font-extrabold text-slate-900">{{ item.label }}</span>
                                    <span class="block text-xs text-slate-500">{{ item.helper }}</span>
                                </span>
                            </div>
                        </div>
                    </section>

                    <section
                        class="ui-rise relative overflow-hidden rounded-3xl p-5 text-white shadow-xl transition-transform duration-300"
                        :class="[primaryProductCard.heroClass, primaryProductCard.heroShadowClass]"
                        style="animation-delay: 420ms">
                        <div class="pointer-events-none absolute inset-0" aria-hidden="true">
                            <div
                                class="ui-drift absolute -top-16 -right-10 h-44 w-44 rounded-full bg-white/20 blur-2xl"></div>
                            <div
                                class="absolute -bottom-20 -left-10 h-40 w-40 rounded-full bg-black/10 blur-2xl"></div>
                            <div
                                class="absolute inset-0 opacity-[0.10] [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.9)_1px,transparent_0)] [background-size:20px_20px]">
                            </div>
                        </div>

                        <div class="relative">
                            <p class="text-xs font-bold uppercase tracking-[0.16em] text-white/80">Primary Workspace</p>
                            <div class="mt-3 flex items-center gap-3">
                                <span
                                    class="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/15 text-lg backdrop-blur">
                                    <i :class="primaryProductCard.icon"></i>
                                </span>
                                <div class="min-w-0">
                                    <h2 class="truncate text-lg font-black">{{ primaryProductCard.label }}</h2>
                                    <p class="text-xs text-white/80">{{ primaryProductCard.statusLabel }} access</p>
                                </div>
                            </div>
                            <p class="mt-4 text-sm text-white/90">{{ primaryProductCard.helperText }}</p>
                            <router-link :to="primaryProductCard.dashboardPath"
                                class="group mt-4 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-900 shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-50">
                                <span>Open Dashboard</span>
                                <i
                                    class="pi pi-arrow-right text-xs transition-transform duration-200 group-hover:translate-x-1"></i>
                            </router-link>
                        </div>
                    </section>
                </aside>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onBeforeUnmount, ref, watch } from "vue";
import { useAuthStore } from "../stores/authStore";
import defaultAvatar from "@/assets/images/avatar.png";
import axios from "axios";
import Navigation from "../components/Navigation.vue";

const authStore = useAuthStore();
const user = computed(() => authStore.user || {});

const fileUrl = ref(null);
const isSaving = ref(false);
const feedbackText = ref("");
const feedbackType = ref("success");
const lastSavedAt = ref("");

const formData = ref({
    name: "",
    email: "",
    avatar: null,
});

const products = [
    {
        code: "teas",
        label: "TEAS 7 Prep",
        icon: "pi pi-file-edit",
        dashboardPath: "/teas",
        iconClass: "bg-gradient-to-br from-cyan-500 to-sky-600 shadow-cyan-500/30",
        progressClass: "bg-gradient-to-r from-cyan-400 to-sky-500",
        progressTextClass: "text-cyan-700",
        ctaClass: "bg-gradient-to-r from-cyan-600 to-sky-600 shadow-cyan-500/25 hover:shadow-cyan-500/40",
        tintClass: "from-cyan-50",
        glowClass: "bg-cyan-300",
        cardBorderClass: "border-cyan-100",
        heroClass: "bg-gradient-to-br from-cyan-500 via-sky-600 to-blue-700",
        heroShadowClass: "shadow-cyan-600/30",
    },
    {
        code: "nursing",
        label: "Nursing Test Bank",
        icon: "pi pi-briefcase",
        dashboardPath: "/nursing",
        iconClass: "bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-500/30",
        progressClass: "bg-gradient-to-r from-emerald-400 to-teal-500",
        progressTextClass: "text-emerald-700",
        ctaClass: "bg-gradient-to-r from-emerald-600 to-teal-600 shadow-emerald-500/25 hover:shadow-emerald-500/40",
        tintClass: "from-emerald-50",
        glowClass: "bg-emerald-300",
        cardBorderClass: "border-emerald-100",
        heroClass: "bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700",
        heroShadowClass: "shadow-emerald-600/30",
    },
    {
        code: "nclex",
        label: "NCLEX Prep",
        icon: "pi pi-bolt",
        dashboardPath: "/nclex",
        iconClass: "bg-gradient-to-br from-indigo-500 to-blue-600 shadow-indigo-500/30",
        progressClass: "bg-gradient-to-r from-indigo-500 to-blue-500",
        progressTextClass: "text-indigo-700",
        ctaClass: "bg-gradient-to-r from-indigo-600 to-blue-600 shadow-indigo-500/25 hover:shadow-indigo-500/40",
        tintClass: "from-indigo-50",
        glowClass: "bg-indigo-300",
        cardBorderClass: "border-indigo-100",
        heroClass: "bg-gradient-to-br from-indigo-500 via-blue-600 to-violet-700",
        heroShadowClass: "shadow-indigo-600/30",
    },
];

watch(
    user,
    (nextUser) => {
        formData.value.name = nextUser?.name || "";
        formData.value.email = nextUser?.email || "";
    },
    { immediate: true },
);

const avatarPreview = computed(() => {
    if (fileUrl.value) return fileUrl.value;
    if (user.value?.avatar) return "/storage/" + user.value.avatar;
    return defaultAvatar;
});

const hasAvatar = computed(() => Boolean(fileUrl.value || user.value?.avatar));

const initials = computed(() => {
    const source = String(formData.value.name || formData.value.email || "Learner").trim();
    return source
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join("") || "L";
});

const firstName = computed(() => {
    const name = String(formData.value.name || "").trim();
    if (!name) return "Learner";
    return name.split(/\s+/)[0];
});

const greeting = computed(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
});

const todayLabel = computed(() =>
    new Date().toLocaleDateString(undefined, {
        weekday: "long",
        month: "short",
        day: "numeric",
    }),
);

const isVerified = computed(() => Boolean(user.value?.email_verified_at || user.value?.verified));

const isDirty = computed(() => {
    const savedName = String(user.value?.name || "").trim();
    const currentName = String(formData.value.name || "").trim();
    return currentName !== savedName || formData.value.avatar instanceof File;
});

const formatDate = (value) => {
    if (!value) return "Not available";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Not available";

    return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};

const parseExpiry = (value) => {
    if (!value) return null;
    const date = new Date(`${value}T23:59:59`);
    return Number.isNaN(date.getTime()) ? null : date;
};

const getPlans = (code) => {
    const plans = user.value?.subscriptions?.[code];
    return Array.isArray(plans) ? plans : [];
};

const getFuturePlans = (code) => {
    const now = new Date();
    return getPlans(code)
        .map((plan) => ({ ...plan, _expiry: parseExpiry(plan.expires) }))
        .filter((plan) => plan._expiry && plan._expiry > now)
        .sort((a, b) => a._expiry - b._expiry);
};

const getLatestPlan = (code) => {
    return getPlans(code)
        .map((plan) => ({ ...plan, _expiry: parseExpiry(plan.expires) }))
        .filter((plan) => plan._expiry)
        .sort((a, b) => b._expiry - a._expiry)[0] || null;
};

const getRunwayProgress = (days) => {
    if (!days) return "0%";
    return `${Math.min(100, Math.max(10, Math.round((days / 30) * 100)))}%`;
};

const subscriptionCards = computed(() => {
    return products.map((product) => {
        const code = product.code;
        const plans = getPlans(code);
        const futurePlans = getFuturePlans(code);
        const latestPlan = getLatestPlan(code);
        const hasPlans = plans.length > 0;
        const isTrial = authStore.isTrial(code);
        const isActive = authStore.isActive(code);
        const wasTrial = authStore.wasTrial(code);
        const days = Number(authStore.daysLeft(code) || 0);
        const nextExpiry = futurePlans[0]?._expiry || null;
        const lastExpiry = latestPlan?._expiry || null;

        let statusLabel = "No Plan";
        let statusText = "No active subscription found.";
        let helperText = "Subscribe to unlock full practice access and analytics.";
        let primaryCta = "Subscribe";
        let badgeClass = "bg-slate-100 text-slate-700";
        let dotClass = "bg-slate-400";
        let cardRingClass = "";
        let accessState = "none";

        if (isTrial && days > 0) {
            statusLabel = "Trial";
            statusText = `${days} day${days === 1 ? "" : "s"} left on trial.`;
            helperText = nextExpiry ? `Trial ends ${formatDate(nextExpiry)}.` : "Upgrade anytime to keep access.";
            primaryCta = "Upgrade";
            badgeClass = "bg-amber-100 text-amber-800";
            dotClass = "bg-amber-500";
            cardRingClass = "ring-1 ring-amber-100";
            accessState = "trial";
        } else if (isActive) {
            statusLabel = "Active";
            statusText = `${days} day${days === 1 ? "" : "s"} remaining.`;
            helperText = nextExpiry ? `Renews or expires ${formatDate(nextExpiry)}.` : "Renew early to extend access.";
            primaryCta = "Extend";
            badgeClass = "bg-emerald-100 text-emerald-800";
            dotClass = "bg-emerald-500";
            cardRingClass = "ring-1 ring-emerald-100";
            accessState = "active";
        } else if (hasPlans || wasTrial) {
            statusLabel = "Expired";
            statusText = "Access has expired.";
            helperText = lastExpiry ? `Last access ended ${formatDate(lastExpiry)}.` : "Renew to continue practice.";
            primaryCta = "Renew";
            badgeClass = "bg-rose-100 text-rose-800";
            dotClass = "bg-rose-500";
            cardRingClass = "ring-1 ring-rose-100";
            accessState = "expired";
        }

        return {
            ...product,
            statusLabel,
            statusText,
            helperText,
            primaryCta,
            badgeClass,
            dotClass,
            cardRingClass,
            accessState,
            pricingPath: authStore.pricingRoute(code),
            progressLabel: days > 0 ? `${days}d left` : "Inactive",
            progressWidth: getRunwayProgress(days),
        };
    });
});

const primaryProductCard = computed(() => {
    const activeCard = subscriptionCards.value.find((card) => card.accessState === "active");
    if (activeCard) return activeCard;

    const trialCard = subscriptionCards.value.find((card) => card.accessState === "trial");
    if (trialCard) return trialCard;

    const usedCard = subscriptionCards.value.find((card) => card.accessState === "expired");
    if (usedCard) return usedCard;

    return subscriptionCards.value[0];
});

const heroTagline = computed(() => {
    const card = primaryProductCard.value;
    if (card.accessState === "active") return `${card.label} is live and ready when you are.`;
    if (card.accessState === "trial") return `Your ${card.label} trial is running. Make it count.`;
    if (card.accessState === "expired") return `Pick up where you left off in ${card.label}.`;
    return "Choose a plan to start practicing today.";
});

const heroActions = computed(() => [
    {
        label: "Open Dashboard",
        to: primaryProductCard.value.dashboardPath,
        icon: "pi pi-th-large",
        primary: true,
    },
    {
        label: "Subscriptions",
        to: "/subscription",
        icon: "pi pi-wallet",
        primary: false,
    },
    {
        label: "Settings",
        to: "/settings",
        icon: "pi pi-cog",
        primary: false,
    },
]);

const accountMetrics = computed(() => {
    const activeCount = subscriptionCards.value.filter((card) => card.accessState === "active").length;
    const trialCount = subscriptionCards.value.filter((card) => card.accessState === "trial").length;
    const expiringCount = subscriptionCards.value.filter((card) => {
        const days = Number(authStore.daysLeft(card.code) || 0);
        return ["active", "trial"].includes(card.accessState) && days > 0 && days <= 7;
    }).length;
    const expiredCount = subscriptionCards.value.filter((card) => card.accessState === "expired").length;

    return [
        {
            label: "Active Plans",
            value: activeCount,
            helper: activeCount ? "Paid products ready to use." : "No paid plan is active.",
            icon: "pi pi-check-circle",
            iconClass: "bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-500/30",
            glowClass: "bg-emerald-300",
            borderClass: "border-emerald-100",
        },
        {
            label: "Trials",
            value: trialCount,
            helper: trialCount ? "Trial access currently running." : "No trial is running.",
            icon: "pi pi-clock",
            iconClass: "bg-gradient-to-br from-amber-400 to-orange-500 shadow-amber-500/30",
            glowClass: "bg-amber-300",
            borderClass: "border-amber-100",
        },
        {
            label: "Expiring Soon",
            value: expiringCount,
            helper: expiringCount ? "Renew soon to avoid interruption." : "No access expires this week.",
            icon: "pi pi-calendar",
            iconClass: "bg-gradient-to-br from-cyan-500 to-sky-600 shadow-cyan-500/30",
            glowClass: "bg-cyan-300",
            borderClass: "border-cyan-100",
        },
        {
            label: "Needs Renewal",
            value: expiredCount,
            helper: expiredCount ? "Expired product access found." : "No expired product needs action.",
            icon: "pi pi-refresh",
            iconClass: "bg-gradient-to-br from-rose-500 to-pink-600 shadow-rose-500/30",
            glowClass: "bg-rose-300",
            borderClass: "border-rose-100",
        },
    ];
});

const profileDetails = computed(() => [
    {
        label: "Joined",
        value: formatDate(user.value?.created_at),
        icon: "pi pi-calendar",
        iconClass: "bg-sky-100 text-sky-700",
    },
    {
        label: "Verification",
        value: isVerified.value ? "Verified" : "Pending",
        icon: isVerified.value ? "pi pi-verified" : "pi pi-clock",
        iconClass: isVerified.value ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700",
    },
    {
        label: "Role",
        value: user.value?.roles?.[0] || "Learner",
        icon: "pi pi-id-card",
        iconClass: "bg-indigo-100 text-indigo-700",
    },
]);

const accountActions = computed(() => [
    {
        label: "Study Settings",
        helper: "Notifications, display, and exam behavior",
        to: "/settings",
        icon: "pi pi-sliders-h",
        iconClass: "bg-cyan-100 text-cyan-700",
    },
    {
        label: "Plans and Billing",
        helper: "Compare plans or renew subscriptions",
        to: "/subscription",
        icon: "pi pi-credit-card",
        iconClass: "bg-emerald-100 text-emerald-700",
    },
    {
        label: "Notifications",
        helper: "Review account and subscription notices",
        to: "/notifications",
        icon: "pi pi-bell",
        iconClass: "bg-amber-100 text-amber-700",
    },
    {
        label: `${primaryProductCard.value.label} Dashboard`,
        helper: "Jump back into your primary workspace",
        to: primaryProductCard.value.dashboardPath,
        icon: primaryProductCard.value.icon,
        iconClass: `${primaryProductCard.value.iconClass} text-white`,
    },
]);

const readinessItems = computed(() => [
    {
        label: "Profile name",
        helper: formData.value.name ? "Your account has a display name." : "Add your name for a better account profile.",
        complete: Boolean(formData.value.name),
    },
    {
        label: "Profile photo",
        helper: user.value?.avatar || fileUrl.value ? "Your avatar is ready." : "Add a profile photo when you are ready.",
        complete: Boolean(user.value?.avatar || fileUrl.value),
    },
    {
        label: "Verified email",
        helper: isVerified.value ? "Your email is verified." : "Verify your email to protect account recovery.",
        complete: isVerified.value,
    },
    {
        label: "Learning access",
        helper: subscriptionCards.value.some((card) => ["active", "trial"].includes(card.accessState))
            ? "At least one product has access."
            : "Choose a plan to unlock full practice.",
        complete: subscriptionCards.value.some((card) => ["active", "trial"].includes(card.accessState)),
    },
]);

const readinessComplete = computed(() => readinessItems.value.filter((item) => item.complete).length);

const readinessPercent = computed(() => {
    const total = readinessItems.value.length || 1;
    return Math.round((readinessComplete.value / total) * 100);
});

const ringCircumference = 2 * Math.PI * 20;
const ringOffset = computed(() => ringCircumference * (1 - readinessPercent.value / 100));

const updatePreviewFromFile = (file) => {
    if (fileUrl.value) {
        URL.revokeObjectURL(fileUrl.value);
    }
    fileUrl.value = URL.createObjectURL(file);
};

const setFeedback = (message, type = "success") => {
    feedbackText.value = message;
    feedbackType.value = type;
};

const handleAvatarUpload = (event) => {
    const file = event?.target?.files?.[0];
    if (!file) return;

    if (!file.type?.startsWith("image/")) {
        setFeedback("Choose a valid image file.", "error");
        event.target.value = "";
        return;
    }

    if (file.size > 2 * 1024 * 1024) {
        setFeedback("Profile photo must be under 2 MB.", "error");
        event.target.value = "";
        return;
    }

    formData.value.avatar = file;
    updatePreviewFromFile(file);
    setFeedback("");
};

const getErrorMessage = (error) => {
    const validationErrors = error?.response?.data?.errors;
    if (validationErrors && typeof validationErrors === "object") {
        const firstKey = Object.keys(validationErrors)[0];
        if (firstKey && validationErrors[firstKey]?.[0]) {
            return validationErrors[firstKey][0];
        }
    }

    return error?.response?.data?.message || "Profile update failed. Please try again.";
};

const saveSettings = async () => {
    if (isSaving.value) return;

    const name = String(formData.value.name || "").trim();
    if (!name) {
        setFeedback("Enter your name before saving.", "error");
        return;
    }

    setFeedback("");
    isSaving.value = true;

    try {
        const data = new FormData();
        data.append("name", name);

        if (formData.value.avatar instanceof File) {
            data.append("avatar", formData.value.avatar);
        }

        const response = await axios.post("/account", data, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        const updatedUser = response?.data?.data?.data || response?.data?.data || null;
        if (updatedUser && typeof updatedUser === "object") {
            authStore.updateUser({ ...(authStore.user || {}), ...updatedUser });
        }

        formData.value.name = name;
        formData.value.avatar = null;
        if (fileUrl.value) {
            URL.revokeObjectURL(fileUrl.value);
            fileUrl.value = null;
        }

        lastSavedAt.value = new Date().toLocaleString();
        setFeedback("Account updated successfully.");
    } catch (error) {
        setFeedback(getErrorMessage(error), "error");
        console.error("Error updating profile:", error);
    } finally {
        isSaving.value = false;
    }
};

onBeforeUnmount(() => {
    if (fileUrl.value) {
        URL.revokeObjectURL(fileUrl.value);
    }
});
</script>

