import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCourseStore = defineStore('course', () => {
    const lastLesson = ref(localStorage.getItem('lastLesson') || null)

    const setLastLessonView = (lesson) => {
        lastLesson.value = lesson
        localStorage.setItem('lastLesson', lesson)
    }

    return {
        lastLesson,
        setLastLessonView,
    }
})
