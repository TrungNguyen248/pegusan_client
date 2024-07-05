<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../stores/auth'
import { useCourseStore } from '../stores/course'
import { useRouter } from 'vue-router'

const props = defineProps({
    id: {
        type: String,
        required: true,
    },
    course_id: {
        type: String,
        required: true,
    },
})

const router = useRouter()

const wordList = ref([])
const numQuestions = ref(0)
const isLoading = ref(true)
const currentCardIndex = ref(0)
const cardAnswer = ref(false)
const isCorrect = ref(null)
const percentCorrect = ref(0)
const end = ref(false)
const learnt = ref(null)

const authStore = useAuthStore()
const user = authStore.user
const courseStore = useCourseStore()
const lessonLastView = courseStore.lastLesson

async function submitProgress() {
    const res = await axios.post(
        'http://localhost:5000/v1/api/progress',
        {
            course: props.course_id,
            lesson: lessonLastView,
            lessonType: 'Hina',
        },
        {
            headers: {
                'x-api-key':
                    'f19a5a8992310cd9dfcc8ce99fca99a2a1e5f28a4f3049f83c112565992066270310a4e5628169ad6e0ed6b113386f8a2a1be3e1c3ba0b6c61ceeb97f0ec8b61',
                'x-client-id': user._id,
                authorization: authStore.accessToken,
            },
        },
    )
}

async function fetchLessonContent() {
    currentCardIndex.value = 0
    end.value = false
    percentCorrect.value = 0
    cardAnswer.value = false
    isLoading.value = true

    const res = await axios.post(
        'http://localhost:5000/v1/api/hina/run',
        {
            lesson_id: props.id,
            course_id: props.course_id,
        },
        {
            headers: {
                'x-api-key':
                    'f19a5a8992310cd9dfcc8ce99fca99a2a1e5f28a4f3049f83c112565992066270310a4e5628169ad6e0ed6b113386f8a2a1be3e1c3ba0b6c61ceeb97f0ec8b61',
                'x-client-id': user._id,
                authorization: authStore.accessToken,
            },
        },
    )
    console.log(res.data)

    learnt.value = res.data.metadata?.learnt
    numQuestions.value = res.data.metadata.questions.length
    wordList.value = [
        ...res.data.metadata.words,
        ...res.data.metadata.questions,
    ]
    isLoading.value = false
}

const progress = computed(() => {
    return (currentCardIndex.value / wordList.value.length) * 100
})
const currentCard = computed(() => wordList.value[currentCardIndex.value])

function nextCard() {
    if (currentCardIndex.value < wordList.value.length - 1) {
        cardAnswer.value = false
        isCorrect.value = null
        currentCardIndex.value++
    } else {
        end.value = true
        if (learnt.value != true) {
            submitProgress()
        }
    }
}

function nextLesson() {
    const lesson_id = props.id
    const nextLessonNum = parseInt(lesson_id.split('_')[1]) + 1

    const nextLessonId = 'bai_'.concat(nextLessonNum)
    router.push({
        name: 'LessonHina',
        params: {
            id: nextLessonId,
            course_id: props.course_id,
        },
    })
}

function checkAnswer(event) {
    let textAnswer = event.target.textContent
    textAnswer = textAnswer.split(' ')[1]
    cardAnswer.value = true

    if (currentCard.value.value === textAnswer) {
        percentCorrect.value++
        isCorrect.value = true
    } else {
        isCorrect.value = false
    }
}

onMounted(async () => {
    await fetchLessonContent()
})

watch(
    () => props.id,
    async (newId, oldId) => {
        if (newId !== oldId) {
            await fetchLessonContent()
        }
    },
)

//lam tien trinh cau hoi
//xac nhan khi an tro ve d/s lesson
</script>

<template>
    <div v-if="isLoading" class="text-3xl font-bold">Loading ....</div>
    <div
        class="flex justify-center w-full text-white min-h-screen bg-slate-800"
        v-else-if="!end"
    >
        <div
            class="relative sm:border-2 w-[768px] rounded-2xl overflow-hidden p-4"
        >
            <div
                class="w-full h-[10px] bg-gray-100 mt-2 rounded-2xl overflow-hidden"
            >
                <div
                    class="h-[10px] bg-indigo-600 transition-all"
                    :style="{ width: progress + '%' }"
                ></div>
            </div>
            <div class="mt-24" v-if="!isLoading && wordList.length > 0">
                <div class="flex justify-center w-full">
                    <img
                        class="w-48"
                        src="https://i.pinimg.com/564x/3d/aa/a5/3daaa580c31c86277d13f55594895f8a.jpg"
                    />
                </div>
                <audio
                    :src="
                        `https://d28at3pxt9wnoo.cloudfront.net/` +
                        currentCard.audio
                    "
                    controls
                ></audio>
                <div class="text-center font-medium text-lg py-4">
                    <p>{{ currentCard.word || currentCard.content }}</p>
                </div>
                <div
                    class="absolute bottom-20 w-full px-4 grid grid-cols-2 gap-4 hover:*:bg-indigo-400 *:transition-colors *:font-bold *:text-lg *:text-center *:bg-gray-500"
                >
                    <div
                        class="relative border-2 border-indigo-400 px-3 py-4 rounded-lg"
                        v-for="(item, index) in currentCard.quiz"
                        :key="index"
                        @click="checkAnswer"
                    >
                        <span
                            class="absolute -top-3 left-0 bg-slate-200 text-gray-600 font-extrabold rounded-lg px-4 border-2 border-gray-400"
                            >{{ index + 1 }}
                        </span>
                        {{ item }}
                    </div>
                </div>
            </div>
            <div v-if="!currentCard.content">
                <div class="text-center">
                    <button
                        @click="nextCard"
                        class="w-40 bg-green-300 hover:bg-green-500 transition-all hover:text-white px-7 rounded-full py-2 text-indigo-700 font-medium text-lg"
                    >
                        OK
                    </button>
                </div>
            </div>
            <div
                class="absolute w-full px-10 pt-5 flex justify-between z-10"
                :class="isCorrect ? 'bg-green-200' : 'bg-red-400'"
                v-else-if="cardAnswer"
            >
                <div class="text-xl text-black">
                    <p v-if="isCorrect">Dung</p>
                    <p v-else>Sai</p>
                    <p>Dap an: {{ currentCard.value }}</p>
                    <p v-if="currentCard.sentence">
                        Nghia: {{ currentCard.sentence }}
                    </p>
                </div>
                <div class="w-40 h-40">
                    <img
                        src="https://i.pinimg.com/564x/3d/aa/a5/3daaa580c31c86277d13f55594895f8a.jpg"
                    />
                </div>
                <div class="flex flex-col justify-end">
                    <button
                        class="bg-red-300 px-7 rounded-3xl py-2"
                        @click="nextCard"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    </div>
    <div v-if="end">
        <p>Xong</p>
        <!-- Next lesson button -->
        <div @click="nextLesson" class="text-5xl">Next lesson</div>
        <!-- Next lesson button -->
        <p>{{ percentCorrect }} / {{ numQuestions }}</p>
        <router-link to="/course">Danh sach bai</router-link>
    </div>
</template>
