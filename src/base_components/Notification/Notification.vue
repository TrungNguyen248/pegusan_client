<script setup>
import { computed } from 'vue'
import { useNotificationStore } from '../../stores/notify'

const notificationStore = useNotificationStore()

function remove(notificationId) {
    notificationStore.removeNotification(notificationId)
}

const value = computed(() => notificationStore.notifications)
</script>

<template>
    <div v-if="value.length > 0" class="fixed top-5 z-[51] right-0">
        <div
            v-for="notification in value"
            :key="notification.id"
            class="animate-text-fade"
        >
            <div
                class="flex w-full max-w-sm py-5 px-6 bg-white rounded-xl border border-gray-200 shadow-sm mb-4 gap-4"
            >
                <div class="block">
                    <h5 :class="notification.class" class="font-medium mb-1">
                        {{ notification.title }}
                    </h5>
                    <p class="text-sm font-medium text-gray-600">
                        {{ notification.sub_title }}
                    </p>
                    <div
                        v-if="notification.link"
                        v-html="notification.link"
                    ></div>
                </div>
                <button
                    @click="remove(notification.id)"
                    type="button"
                    class="inline-flex flex-shrink-0 justify-center text-gray-400 transition-all duration-150"
                >
                    <svg
                        class="w-6 h-6"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M7 17L17 7M17 17L7 7"
                            stroke="currentColor"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                    </svg>
                </button>
            </div>
        </div>
    </div>
</template>
