<template>
    <div
        class="relative z-10 rounded-2xl min-h-[93.5vh] max-h-[93.5vh] 2xl:max-h-[94vh] 2xl:min-h-[94vh] overflow-y-scroll bg-slate-50 p-4 sm:p-6">
        <!-- Ambient glow -->
        <div class="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl" aria-hidden="true">
            <div
                class="ui-drift absolute -top-32 -left-40 h-[560px] w-[560px] rounded-full bg-gradient-to-r from-rose-200 via-orange-100 to-amber-100 opacity-50 blur-[120px]">
            </div>
            <div
                class="ui-drift-slow absolute top-1/4 -right-32 h-[460px] w-[460px] rounded-full bg-gradient-to-r from-cyan-200 via-sky-100 to-emerald-100 opacity-50 blur-[110px]">
            </div>
        </div>

        <div class="relative mx-auto max-w-screen-2xl space-y-6">
            <!-- ================= COMPACT HEADER (replaces Navigation) ================= -->
            <header class="ui-rise flex flex-wrap items-center justify-between gap-3">
                <router-link :to="primaryProduct.to"
                    class="group inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-sm font-bold text-slate-700 shadow-sm transition-all duration-200 hover:border-slate-300 hover:shadow-md">
                    <i class="pi pi-arrow-left text-xs transition-transform duration-200 group-hover:-translate-x-0.5"></i>
                    <span>Back to {{ primaryProduct.label }}</span>
                </router-link>

                <nav class="flex items-center gap-1 rounded-full border border-slate-200 bg-white p-1 shadow-sm"
                    aria-label="Switch workspace">
                    <router-link v-for="item in workspaces" :key="item.to" :to="item.to"
                        class="group inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold transition-all duration-200"
                        :class="item.to === primaryProduct.to
                            ? `${item.activeClass} text-white shadow-md`
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'">
                        <i :class="item.icon" class="text-[11px]"></i>
                        <span class="hidden sm:inline">{{ item.label }}</span>
                    </router-link>
                </nav>
            </header>

            <!-- ================= HERO ================= -->
            <section
                class="ui-rise relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-custom md:p-8"
                style="animation-delay: 60ms">
                <div class="pointer-events-none absolute inset-0" aria-hidden="true">
                    <div class="absolute inset-0 bg-gradient-to-br from-white via-rose-50/40 to-cyan-50/60"></div>
                    <div class="ui-drift absolute -top-32 right-1/3 h-72 w-72 rounded-full bg-rose-200/40 blur-3xl">
                    </div>
                    <div
                        class="absolute inset-0 opacity-[0.35] [background-image:radial-gradient(circle_at_1px_1px,rgba(190,24,93,0.28)_1px,transparent_0)] [background-size:26px_26px]">
                    </div>
                </div>

                <div class="relative grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 items-center">
                    <div class="min-w-0">
                        <span
                            class="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-rose-700">
                            <span class="relative flex h-2 w-2">
                                <span
                                    class="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-500 opacity-70"></span>
                                <span class="relative inline-flex h-2 w-2 rounded-full bg-rose-500"></span>
                            </span>
                            Referral Program
                        </span>

                        <h1
                            class="mt-4 text-3xl md:text-5xl font-black tracking-tight leading-[1.05] text-slate-950">
                            Study together.
                            <span
                                class="bg-gradient-to-r from-rose-600 via-pink-500 to-orange-500 bg-clip-text text-transparent">
                                Earn {{ REWARD_DAYS }} free days
                            </span>
                            together.
                        </h1>
                        <p class="mt-4 max-w-xl text-sm md:text-base text-slate-600">
                            Share your link with classmates. When a friend subscribes, you both unlock
                            <strong class="text-slate-900">{{ REWARD_DAYS }} days</strong> of free access to every
                            exam bank and study lesson.
                        </p>

                        <div class="mt-6 flex flex-wrap items-center gap-2">
                            <button type="button" @click="copyLink"
                                class="group inline-flex min-h-11 items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
                                :class="copied
                                    ? 'bg-emerald-600 shadow-emerald-500/30'
                                    : 'bg-slate-950 shadow-slate-900/25 hover:bg-slate-800'">
                                <i :class="copied ? 'pi pi-check ui-pop' : 'pi pi-copy'"></i>
                                <span>{{ copied ? "Link copied!" : "Copy my link" }}</span>
                            </button>
                            <button type="button" @click="shareNative"
                                class="group inline-flex min-h-11 items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-800 shadow-sm transition-all duration-200 hover:border-slate-300 hover:shadow-md">
                                <i class="pi pi-share-alt transition-transform duration-200 group-hover:scale-110"></i>
                                <span>Share</span>
                            </button>
                            <span class="inline-flex items-center gap-2 text-xs font-semibold text-slate-500">
                                <i class="pi pi-shield text-emerald-500"></i>
                                Rewards unlock after your friend's first payment.
                            </span>
                        </div>
                    </div>

                    <!-- Invite ticket -->
                    <div class="relative mx-auto w-full max-w-[400px]">
                        <span
                            class="ui-float absolute -top-4 -right-3 z-20 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-black text-rose-600 shadow-lg ring-1 ring-rose-100">
                            <i class="pi pi-gift"></i>
                            +{{ REWARD_DAYS }} days
                        </span>

                        <div class="ui-tilt relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-500 via-pink-500 to-orange-400 p-5 text-white shadow-2xl shadow-rose-500/30"
                            role="group" aria-label="Your invite ticket">
                            <div class="pointer-events-none absolute inset-0" aria-hidden="true">
                                <div class="absolute -top-20 -right-16 h-52 w-52 rounded-full bg-white/25 blur-2xl"></div>
                                <div class="absolute -bottom-24 -left-10 h-48 w-48 rounded-full bg-orange-300/40 blur-2xl">
                                </div>
                                <div
                                    class="absolute inset-0 opacity-[0.14] [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.95)_1px,transparent_0)] [background-size:18px_18px]">
                                </div>
                            </div>

                            <div class="relative">
                                <div class="flex items-start justify-between gap-3">
                                    <div>
                                        <p class="text-[10px] font-bold uppercase tracking-[0.22em] text-white/80">
                                            NurseNex Invite
                                        </p>
                                        <p class="mt-1 text-lg font-black leading-tight">{{ displayName }}</p>
                                    </div>
                                    <span
                                        class="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/30 bg-white/15 text-base backdrop-blur">
                                        <i class="pi pi-users"></i>
                                    </span>
                                </div>

                                <div class="mt-6">
                                    <p class="text-[10px] font-bold uppercase tracking-[0.22em] text-white/80">Referral
                                        code</p>
                                    <div class="mt-1.5 flex items-center justify-between gap-3">
                                        <p class="font-mono text-3xl font-black tracking-[0.18em]">{{ referralCode }}</p>
                                        <button type="button" @click="copyCode"
                                            class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/30"
                                            :title="codeCopied ? 'Copied' : 'Copy code'">
                                            <i :class="codeCopied ? 'pi pi-check ui-pop' : 'pi pi-clone'"
                                                class="text-sm"></i>
                                        </button>
                                    </div>
                                </div>

                                <div class="mt-5 grid grid-cols-2 gap-2">
                                    <div class="rounded-2xl border border-white/20 bg-white/10 p-3 backdrop-blur-sm">
                                        <p class="text-[10px] font-bold uppercase tracking-[0.16em] text-white/75">You get
                                        </p>
                                        <p class="mt-0.5 text-sm font-black">{{ REWARD_DAYS }} free days</p>
                                    </div>
                                    <div class="rounded-2xl border border-white/20 bg-white/10 p-3 backdrop-blur-sm">
                                        <p class="text-[10px] font-bold uppercase tracking-[0.16em] text-white/75">They
                                            get</p>
                                        <p class="mt-0.5 text-sm font-black">{{ REWARD_DAYS }} free days</p>
                                    </div>
                                </div>
                            </div>

                            <!-- Perforation -->
                            <div class="relative my-5 flex items-center" aria-hidden="true">
                                <span class="absolute -left-8 h-6 w-6 rounded-full bg-white"></span>
                                <span class="mx-2 h-px w-full border-t-2 border-dashed border-white/50"></span>
                                <span class="absolute -right-8 h-6 w-6 rounded-full bg-white"></span>
                            </div>

                            <!-- Stub -->
                            <div class="relative flex items-center gap-3">
                                <div class="min-w-0 flex-1">
                                    <p class="text-[10px] font-bold uppercase tracking-[0.16em] text-white/75">Invite link
                                    </p>
                                    <p class="truncate font-mono text-xs text-white/95">{{ referralLink }}</p>
                                </div>
                                <button type="button" @click="copyLink"
                                    class="inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-black text-rose-600 shadow transition hover:bg-rose-50">
                                    <i :class="copied ? 'pi pi-check' : 'pi pi-copy'"></i>
                                    {{ copied ? "Copied" : "Copy" }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- ================= STATS ================= -->
            <section class="grid grid-cols-2 xl:grid-cols-4 gap-4">
                <article v-for="(stat, index) in stats" :key="stat.label"
                    class="ui-rise group relative overflow-hidden rounded-3xl border bg-white p-4 shadow-custom transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                    :class="stat.borderClass" :style="{ animationDelay: `${140 + index * 70}ms` }">
                    <div class="pointer-events-none absolute -top-10 -right-10 h-28 w-28 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
                        :class="stat.glowClass"></div>
                    <div class="relative flex items-start justify-between gap-3">
                        <div>
                            <p class="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">{{ stat.label }}
                            </p>
                            <p class="mt-2 text-3xl font-black tabular-nums tracking-tight text-slate-950">
                                {{ stat.value }}<span v-if="stat.suffix"
                                    class="ml-1 text-sm font-bold text-slate-500">{{ stat.suffix }}</span>
                            </p>
                        </div>
                        <span
                            class="inline-flex h-11 w-11 items-center justify-center rounded-2xl text-white shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                            :class="stat.iconClass">
                            <i :class="stat.icon"></i>
                        </span>
                    </div>
                    <p class="relative mt-2 text-xs text-slate-600">{{ stat.helper }}</p>
                </article>
            </section>

            <div class="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
                <div class="xl:col-span-2 space-y-6">
                    <!-- ================= HOW IT WORKS ================= -->
                    <section
                        class="ui-rise relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-custom md:p-6"
                        style="animation-delay: 240ms">
                        <div class="flex flex-wrap items-end justify-between gap-3">
                            <div>
                                <p class="text-xs font-bold uppercase tracking-[0.16em] text-rose-700">How it works</p>
                                <h2 class="mt-1 text-xl font-black text-slate-950">Three steps to free access</h2>
                            </div>
                            <span
                                class="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">
                                <i class="pi pi-clock"></i>
                                Takes under a minute
                            </span>
                        </div>

                        <div class="relative mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <svg class="pointer-events-none absolute left-[16%] right-[16%] top-7 hidden h-2 w-[68%] md:block"
                                viewBox="0 0 100 4" preserveAspectRatio="none" aria-hidden="true">
                                <line x1="0" y1="2" x2="100" y2="2" stroke="#fda4af" stroke-width="2" class="ui-dash" />
                            </svg>

                            <div v-for="(step, index) in steps" :key="step.title"
                                class="group relative rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-all duration-200 hover:border-rose-200 hover:bg-white">
                                <div class="flex items-center gap-3">
                                    <span
                                        class="relative z-10 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-white shadow-lg transition-transform duration-300 group-hover:scale-110"
                                        :class="step.iconClass">
                                        <i :class="step.icon"></i>
                                    </span>
                                    <span
                                        class="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">Step
                                        {{ index + 1 }}</span>
                                </div>
                                <h3 class="mt-3 text-sm font-extrabold text-slate-900">{{ step.title }}</h3>
                                <p class="mt-1 text-xs text-slate-600">{{ step.body }}</p>
                            </div>
                        </div>
                    </section>

                    <!-- ================= SHARE ================= -->
                    <section id="share"
                        class="ui-rise relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-custom md:p-6"
                        style="animation-delay: 320ms">
                        <div class="flex flex-wrap items-end justify-between gap-3">
                            <div>
                                <p class="text-xs font-bold uppercase tracking-[0.16em] text-cyan-700">Spread the word</p>
                                <h2 class="mt-1 text-xl font-black text-slate-950">Share your invite</h2>
                                <p class="mt-1 text-sm text-slate-600">
                                    Tweak the message if you like. Your link is already inside.
                                </p>
                            </div>
                            <button type="button" @click="resetMessage"
                                class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50">
                                <i class="pi pi-refresh"></i>
                                Reset message
                            </button>
                        </div>

                        <div class="mt-5 grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-4">
                            <div class="relative">
                                <textarea v-model="shareMessage" rows="5"
                                    class="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pb-12 text-sm font-medium leading-relaxed text-slate-800 shadow-sm transition-all duration-200 hover:border-slate-300 focus:border-cyan-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-cyan-100"></textarea>
                                <div class="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
                                    <span class="text-[11px] font-semibold text-slate-400 tabular-nums">
                                        {{ shareMessage.length }} characters
                                    </span>
                                    <button type="button" @click="copyMessage"
                                        class="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5"
                                        :class="messageCopied ? 'bg-emerald-600' : 'bg-cyan-600 hover:bg-cyan-700'">
                                        <i :class="messageCopied ? 'pi pi-check ui-pop' : 'pi pi-copy'"></i>
                                        {{ messageCopied ? "Copied" : "Copy message" }}
                                    </button>
                                </div>
                            </div>

                            <div class="grid grid-cols-3 lg:grid-cols-2 gap-2">
                                <a v-for="channel in shareChannels" :key="channel.label" :href="channel.href"
                                    target="_blank" rel="noopener noreferrer"
                                    class="group flex flex-col items-center justify-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-2 py-3 text-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                                    :class="channel.hoverClass">
                                    <span
                                        class="inline-flex h-9 w-9 items-center justify-center rounded-xl text-white shadow transition-transform duration-200 group-hover:scale-110"
                                        :class="channel.iconClass">
                                        <i :class="channel.icon"></i>
                                    </span>
                                    <span class="text-[11px] font-bold text-slate-700">{{ channel.label }}</span>
                                </a>
                            </div>
                        </div>
                    </section>

                    <!-- ================= REFERRED FRIENDS ================= -->
                    <section
                        class="ui-rise relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-custom md:p-6"
                        style="animation-delay: 400ms">
                        <div class="flex flex-wrap items-end justify-between gap-3">
                            <div>
                                <p class="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">Your circle</p>
                                <h2 class="mt-1 text-xl font-black text-slate-950">Referred friends</h2>
                            </div>
                            <span class="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">
                                {{ referredUsers.length }} {{ referredUsers.length === 1 ? "friend" : "friends" }}
                            </span>
                        </div>

                        <ul v-if="referredUsers.length > 0" class="mt-5 space-y-2">
                            <li v-for="(friend, index) in referredUsers" :key="friend.email"
                                class="ui-rise group flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 transition-all duration-200 hover:border-slate-300 hover:bg-white"
                                :style="{ animationDelay: `${440 + index * 50}ms` }">
                                <span
                                    class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-sm font-black text-white shadow"
                                    :class="avatarClass(index)">
                                    {{ initialsOf(friend.name) }}
                                </span>
                                <span class="min-w-0 flex-1">
                                    <span class="block truncate text-sm font-extrabold text-slate-900">{{ friend.name
                                    }}</span>
                                    <span class="block truncate text-xs text-slate-500">{{ friend.email }}</span>
                                </span>
                                <span class="hidden sm:block text-xs text-slate-500">{{ formatDate(friend.joined_at)
                                }}</span>
                                <span class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold"
                                    :class="friend.status === 'subscribed'
                                        ? 'bg-emerald-100 text-emerald-800'
                                        : 'bg-amber-100 text-amber-800'">
                                    <span class="h-1.5 w-1.5 rounded-full"
                                        :class="friend.status === 'subscribed' ? 'bg-emerald-500' : 'bg-amber-500'"></span>
                                    {{ friend.status === "subscribed" ? `+${REWARD_DAYS} days` : "Awaiting payment" }}
                                </span>
                            </li>
                        </ul>

                        <div v-else
                            class="mt-5 relative overflow-hidden rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
                            <div class="pointer-events-none absolute -top-16 left-1/2 h-40 w-64 -translate-x-1/2 rounded-full bg-rose-200/40 blur-2xl">
                            </div>
                            <div class="relative mx-auto flex w-fit -space-x-3">
                                <span v-for="(cls, i) in placeholderAvatars" :key="i"
                                    class="inline-flex h-11 w-11 items-center justify-center rounded-full border-4 border-white text-white shadow"
                                    :class="cls">
                                    <i class="pi pi-user text-sm"></i>
                                </span>
                                <span
                                    class="inline-flex h-11 w-11 items-center justify-center rounded-full border-4 border-white bg-white text-rose-600 shadow ring-1 ring-rose-100">
                                    <i class="pi pi-plus text-sm"></i>
                                </span>
                            </div>
                            <p class="relative mt-4 text-sm font-extrabold text-slate-900">Your circle is empty for now
                            </p>
                            <p class="relative mt-1 text-xs text-slate-500">
                                Invite your first friend and you'll both get {{ REWARD_DAYS }} free days.
                            </p>
                            <button type="button" @click="copyLink"
                                class="relative mt-4 inline-flex min-h-10 items-center gap-2 rounded-full bg-gradient-to-r from-rose-600 to-orange-500 px-5 py-2 text-sm font-bold text-white shadow-lg shadow-rose-500/25 transition-all duration-200 hover:-translate-y-0.5">
                                <i :class="copied ? 'pi pi-check ui-pop' : 'pi pi-copy'"></i>
                                {{ copied ? "Link copied!" : "Copy invite link" }}
                            </button>
                        </div>
                    </section>
                </div>

                <!-- ================= SIDEBAR ================= -->
                <aside class="space-y-6">
                    <!-- Milestones -->
                    <section
                        class="ui-rise relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-custom"
                        style="animation-delay: 280ms">
                        <div class="flex items-center justify-between gap-3">
                            <div>
                                <p class="text-xs font-bold uppercase tracking-[0.16em] text-amber-700">Milestones</p>
                                <h2 class="mt-1 text-lg font-black text-slate-950">Your referral journey</h2>
                            </div>
                            <span
                                class="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                                <i class="pi pi-trophy text-lg"></i>
                            </span>
                        </div>

                        <div class="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                            <div class="flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                                <span>Next: {{ nextMilestone.title }}</span>
                                <span class="tabular-nums text-amber-700">{{ subscribedCount }}/{{ nextMilestone.count }}</span>
                            </div>
                            <div class="mt-2 h-2 overflow-hidden rounded-full bg-white ring-1 ring-slate-200/70">
                                <div class="relative h-full overflow-hidden rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-700 ease-out"
                                    :style="{ width: `${milestoneProgress}%` }">
                                    <span
                                        class="ui-shimmer absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"></span>
                                </div>
                            </div>
                            <p class="mt-2 text-xs text-slate-600">{{ milestoneHint }}</p>
                        </div>

                        <ol class="mt-4 space-y-2">
                            <li v-for="milestone in milestones" :key="milestone.count"
                                class="flex items-center gap-3 rounded-2xl border p-3 transition-colors" :class="milestone.count <= subscribedCount
                                    ? 'border-emerald-100 bg-emerald-50/60'
                                    : 'border-slate-200 bg-white'">
                                <span
                                    class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm shadow-sm"
                                    :class="milestone.count <= subscribedCount
                                        ? 'bg-emerald-500 text-white'
                                        : 'bg-slate-100 text-slate-500'">
                                    <i :class="milestone.count <= subscribedCount ? 'pi pi-check' : milestone.icon"></i>
                                </span>
                                <span class="min-w-0 flex-1">
                                    <span class="block text-sm font-extrabold text-slate-900">{{ milestone.title }}</span>
                                    <span class="block text-xs text-slate-500">{{ milestone.count }} subscribed
                                        {{ milestone.count === 1 ? "friend" : "friends" }}</span>
                                </span>
                                <span class="text-xs font-bold tabular-nums"
                                    :class="milestone.count <= subscribedCount ? 'text-emerald-700' : 'text-slate-400'">
                                    +{{ milestone.count * REWARD_DAYS }}d
                                </span>
                            </li>
                        </ol>
                    </section>

                    <!-- FAQ -->
                    <section
                        class="ui-rise relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-custom"
                        style="animation-delay: 360ms">
                        <div class="flex items-center justify-between gap-3">
                            <div>
                                <p class="text-xs font-bold uppercase tracking-[0.16em] text-cyan-700">Good to know</p>
                                <h2 class="mt-1 text-lg font-black text-slate-950">Questions</h2>
                            </div>
                            <span
                                class="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600">
                                <i class="pi pi-question-circle text-lg"></i>
                            </span>
                        </div>

                        <div class="mt-4 space-y-2">
                            <details v-for="faq in faqs" :key="faq.q"
                                class="group rounded-2xl border border-slate-200 bg-slate-50 transition-colors open:border-cyan-200 open:bg-white">
                                <summary
                                    class="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-extrabold text-slate-900 [&::-webkit-details-marker]:hidden">
                                    <span>{{ faq.q }}</span>
                                    <i
                                        class="pi pi-chevron-down shrink-0 text-xs text-slate-400 transition-transform duration-200 group-open:rotate-180"></i>
                                </summary>
                                <p class="px-4 pb-4 text-xs leading-relaxed text-slate-600">{{ faq.a }}</p>
                            </details>
                        </div>
                    </section>

                    <!-- Reward card -->
                    <section
                        class="ui-rise relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-500 via-sky-600 to-indigo-600 p-5 text-white shadow-xl shadow-sky-600/30"
                        style="animation-delay: 440ms">
                        <div class="pointer-events-none absolute inset-0" aria-hidden="true">
                            <div class="ui-drift absolute -top-16 -right-10 h-44 w-44 rounded-full bg-white/20 blur-2xl">
                            </div>
                            <div
                                class="absolute inset-0 opacity-[0.10] [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.9)_1px,transparent_0)] [background-size:20px_20px]">
                            </div>
                        </div>
                        <div class="relative">
                            <p class="text-xs font-bold uppercase tracking-[0.16em] text-white/80">Days earned</p>
                            <p class="mt-2 text-5xl font-black tabular-nums tracking-tight">
                                {{ totalRewardDays }}<span class="ml-1 text-lg font-bold text-white/80">days</span>
                            </p>
                            <p class="mt-2 text-sm text-white/90">
                                {{ totalRewardDays
                                    ? "Free access already added to your account."
                                    : `Your first subscribed friend adds ${REWARD_DAYS} days.` }}
                            </p>
                            <router-link to="/subscription"
                                class="group mt-4 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-sky-700 shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-sky-50">
                                <span>View my access</span>
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

<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from "vue";
import { useAuthStore } from "../stores/authStore";

type ReferralStatus = "joined" | "subscribed";
interface ReferredUser {
    name: string;
    email: string;
    status?: ReferralStatus;
    joined_at?: string;
}

/** Days of free access granted to both sides once the referred friend pays. */
const REWARD_DAYS = 15;

const authStore = useAuthStore();
const user = computed<any>(() => authStore.user || {});

/* ---------- Workspace header ---------- */
const workspaces = [
    { code: "teas", to: "/teas", label: "TEAS", icon: "pi pi-file-edit", activeClass: "bg-gradient-to-r from-cyan-500 to-sky-500" },
    { code: "nursing", to: "/nursing", label: "Nursing", icon: "pi pi-briefcase", activeClass: "bg-gradient-to-r from-emerald-500 to-teal-500" },
    { code: "nclex", to: "/nclex", label: "NCLEX", icon: "pi pi-bolt", activeClass: "bg-gradient-to-r from-blue-500 to-indigo-500" },
];

const primaryProduct = computed(() => {
    const active = workspaces.find((w) => authStore.isActive?.(w.code));
    if (active) return active;
    const trial = workspaces.find((w) => authStore.isTrial?.(w.code));
    return trial || workspaces[0];
});

/* ---------- Identity & link ---------- */
const displayName = computed(() => String(user.value?.name || "").trim() || "NurseNex Learner");

const hashString = (input: string) => {
    let hash = 2166136261;
    for (let i = 0; i < input.length; i += 1) {
        hash ^= input.charCodeAt(i);
        hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0).toString(36).toUpperCase();
};

const referralCode = computed(() => {
    const seed = String(user.value?.id ?? user.value?.email ?? "guest");
    return `NX-${hashString(seed).padStart(6, "0").slice(0, 6)}`;
});

const referralLink = computed(() => `https://app.nursenex.com/register?ref=${referralCode.value}`);

/* ---------- Referred friends (wire to API when available) ---------- */
const referredUsers = ref<ReferredUser[]>([]);

const subscribedCount = computed(() => referredUsers.value.filter((f) => f.status === "subscribed").length);
const pendingCount = computed(() => referredUsers.value.length - subscribedCount.value);
const totalRewardDays = computed(() => subscribedCount.value * REWARD_DAYS);

const stats = computed(() => [
    {
        label: "Friends invited",
        value: referredUsers.value.length,
        helper: referredUsers.value.length ? "People who joined with your link." : "Nobody has joined yet.",
        icon: "pi pi-users",
        iconClass: "bg-gradient-to-br from-rose-500 to-pink-600 shadow-rose-500/30",
        glowClass: "bg-rose-300",
        borderClass: "border-rose-100",
    },
    {
        label: "Subscribed",
        value: subscribedCount.value,
        helper: subscribedCount.value ? "Friends whose payment cleared." : "Rewards start at the first payment.",
        icon: "pi pi-verified",
        iconClass: "bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-500/30",
        glowClass: "bg-emerald-300",
        borderClass: "border-emerald-100",
    },
    {
        label: "Days earned",
        value: totalRewardDays.value,
        suffix: "days",
        helper: `${REWARD_DAYS} days per subscribed friend.`,
        icon: "pi pi-gift",
        iconClass: "bg-gradient-to-br from-cyan-500 to-sky-600 shadow-cyan-500/30",
        glowClass: "bg-cyan-300",
        borderClass: "border-cyan-100",
    },
    {
        label: "Pending",
        value: pendingCount.value,
        helper: pendingCount.value ? "Joined, waiting on first payment." : "No invites waiting.",
        icon: "pi pi-hourglass",
        iconClass: "bg-gradient-to-br from-amber-400 to-orange-500 shadow-amber-500/30",
        glowClass: "bg-amber-300",
        borderClass: "border-amber-100",
    },
]);

/* ---------- How it works ---------- */
const steps = [
    {
        title: "Share your link",
        body: "Send it in a group chat, a story, or an email. Your code travels with it.",
        icon: "pi pi-send",
        iconClass: "bg-gradient-to-br from-rose-500 to-pink-600 shadow-rose-500/30",
    },
    {
        title: "A friend signs up",
        body: "They create an account through your link and pick the prep they need.",
        icon: "pi pi-user-plus",
        iconClass: "bg-gradient-to-br from-amber-400 to-orange-500 shadow-amber-500/30",
    },
    {
        title: "You both get rewarded",
        body: `Once their first payment clears, ${REWARD_DAYS} free days land on both accounts.`,
        icon: "pi pi-gift",
        iconClass: "bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-500/30",
    },
];

/* ---------- Milestones ---------- */
const milestones = [
    { count: 1, title: "First invite", icon: "pi pi-star" },
    { count: 3, title: "Study squad", icon: "pi pi-users" },
    { count: 5, title: "High five", icon: "pi pi-thumbs-up" },
    { count: 10, title: "Perfect ten", icon: "pi pi-crown" },
];

const nextMilestone = computed(
    () => milestones.find((m) => m.count > subscribedCount.value) || milestones[milestones.length - 1],
);

const milestoneProgress = computed(() =>
    Math.min(100, Math.round((subscribedCount.value / nextMilestone.value.count) * 100)),
);

const milestoneHint = computed(() => {
    const remaining = nextMilestone.value.count - subscribedCount.value;
    if (remaining <= 0) return "You've reached every milestone. Keep sharing!";
    return `${remaining} more subscribed ${remaining === 1 ? "friend" : "friends"} to reach ${nextMilestone.value.title}.`;
});

/* ---------- FAQ ---------- */
const faqs = [
    {
        q: "When do I get my free days?",
        a: `As soon as your friend's first subscription payment clears, ${REWARD_DAYS} days are added to your account and to theirs.`,
    },
    {
        q: "Is there a limit on referrals?",
        a: "No. Every subscribed friend adds another reward, so keep sharing.",
    },
    {
        q: "What if my friend already has an account?",
        a: "Referrals only count for new accounts created through your link.",
    },
];

/* ---------- Share ---------- */
const buildDefaultMessage = () =>
    `I've been prepping with NurseNex and it's been a game changer. Sign up with my link and we both get ${REWARD_DAYS} days of free access: ${referralLink.value}`;

const shareMessage = ref(buildDefaultMessage());
const resetMessage = () => {
    shareMessage.value = buildDefaultMessage();
};

const shareChannels = computed(() => {
    const text = encodeURIComponent(shareMessage.value);
    const url = encodeURIComponent(referralLink.value);
    const subject = encodeURIComponent(`${REWARD_DAYS} free days of NurseNex prep`);
    return [
        { label: "WhatsApp", href: `https://wa.me/?text=${text}`, icon: "pi pi-whatsapp", iconClass: "bg-[#25D366]", hoverClass: "hover:border-green-200" },
        { label: "Telegram", href: `https://t.me/share/url?url=${url}&text=${text}`, icon: "pi pi-telegram", iconClass: "bg-[#229ED9]", hoverClass: "hover:border-sky-200" },
        { label: "X", href: `https://twitter.com/intent/tweet?text=${text}`, icon: "pi pi-twitter", iconClass: "bg-slate-900", hoverClass: "hover:border-slate-300" },
        { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${url}`, icon: "pi pi-facebook", iconClass: "bg-[#1877F2]", hoverClass: "hover:border-blue-200" },
        { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`, icon: "pi pi-linkedin", iconClass: "bg-[#0A66C2]", hoverClass: "hover:border-blue-200" },
        { label: "Email", href: `mailto:?subject=${subject}&body=${text}`, icon: "pi pi-envelope", iconClass: "bg-gradient-to-br from-rose-500 to-orange-500", hoverClass: "hover:border-rose-200" },
    ];
});

/* ---------- Clipboard ---------- */
const copied = ref(false);
const codeCopied = ref(false);
const messageCopied = ref(false);
const timers: ReturnType<typeof setTimeout>[] = [];

const flash = (flag: typeof copied) => {
    flag.value = true;
    timers.push(setTimeout(() => (flag.value = false), 2200));
};

const writeClipboard = async (value: string) => {
    try {
        if (navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(value);
            return true;
        }
    } catch (error) {
        console.warn("Clipboard API unavailable, falling back.", error);
    }
    try {
        const helper = document.createElement("textarea");
        helper.value = value;
        helper.setAttribute("readonly", "");
        helper.style.position = "fixed";
        helper.style.opacity = "0";
        document.body.appendChild(helper);
        helper.select();
        const ok = document.execCommand("copy");
        document.body.removeChild(helper);
        return ok;
    } catch (error) {
        console.error("Failed to copy:", error);
        return false;
    }
};

const copyLink = async () => {
    if (await writeClipboard(referralLink.value)) flash(copied);
};
const copyCode = async () => {
    if (await writeClipboard(referralCode.value)) flash(codeCopied);
};
const copyMessage = async () => {
    if (await writeClipboard(shareMessage.value)) flash(messageCopied);
};

const shareNative = async () => {
    const nav = navigator as Navigator & { share?: (data: ShareData) => Promise<void> };
    if (typeof nav.share === "function") {
        try {
            await nav.share({ title: "Join me on NurseNex", text: shareMessage.value, url: referralLink.value });
            return;
        } catch (error) {
            // User dismissed the sheet or sharing failed; fall through to the share section.
        }
    }
    document.getElementById("share")?.scrollIntoView({ behavior: "smooth", block: "start" });
};

/* ---------- Display helpers ---------- */
const avatarPalette = [
    "bg-gradient-to-br from-rose-500 to-pink-600",
    "bg-gradient-to-br from-cyan-500 to-sky-600",
    "bg-gradient-to-br from-emerald-500 to-teal-600",
    "bg-gradient-to-br from-amber-400 to-orange-500",
    "bg-gradient-to-br from-indigo-500 to-violet-600",
];
const avatarClass = (index: number) => avatarPalette[index % avatarPalette.length];
const placeholderAvatars = avatarPalette.slice(0, 3);

const initialsOf = (name: string) =>
    String(name || "")
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join("") || "?";

const formatDate = (value?: string) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

onBeforeUnmount(() => {
    timers.forEach((t) => clearTimeout(t));
});
</script>
