import { defineStore } from 'pinia'
import { ref } from 'vue'
import { generateUUID } from '../utils/uuid.js'

/* 
r    title: String,
o    sub_title: String,
r    type: String, // 'info', 'warning', 'error', 'success', 'detail'
o    setTime: Boolean, // default = false
o    timeout: Number
*/

export const useNotificationStore = defineStore('notification', () => {
    // State
    const notifications = ref([])
    const defaultTimeout = 4000
    const classToast = {
        info: 'text-blue-500',
        warning: 'text-yellow-500',
        success: 'text-green-500',
        error: 'text-red-500',
        detail: 'text-black-500',
    }

    // Actions
    function addNotification(notification) {
        notification.id = generateUUID()
        notification.class = classToast[notification.type]

        notifications.value.push(notification)
        if (notification.setTime && notification.setTime == true) {
            setTimeout(() => {
                notifications.value = notifications.value.filter(
                    (t) => t.id !== notification.id,
                )
            }, notification.timeout ?? defaultTimeout)
        }
    }

    function removeNotification(notificationId) {
        notifications.value = notifications.value.filter(
            (notification) => notification.id !== notificationId,
        )
    }

    function clearNotifications() {
        notifications.value = []
    }

    return {
        notifications,
        addNotification,
        removeNotification,
        clearNotifications,
    }
})
