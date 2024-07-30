<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../stores/auth'
import { useCourseStore } from '../stores/course'
import { useRouter } from 'vue-router'
import KanjivgAnimate from '../assets/js/KanjivgAnimate.min.js'
import AudioIcon from '../components/Icons/audio.vue'
import NextArrow from '../components/Icons/next_arrow.vue'
import PenWriting from '../components/Icons/pen_writing.vue'
import Correct from '../components/Icons/correct.vue'
import Wrong from '../components/Icons/wrong.vue'
import NextHeliumIcon from '../components/Icons/next_helium.vue'

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
const svgContent = ref(null)
const elSvg = ref(null)
const isDisable = ref(false)

const audioEl = ref(null)

const authStore = useAuthStore()
const user = authStore.user
const courseStore = useCourseStore()
const lessonLastView = courseStore.lastLesson

async function showKanjiDetail(unicode) {
    svgContent.value = null
    const res = await axios.post(
        'http://localhost:5000/v1/api/kanji/svg',
        {
            kanji: unicode,
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
    hanlderSvgContent(res.data.metadata)
    await nextTick()
    addIdToSvg()
}

function hanlderSvgContent(svgData) {
    const startIndex = svgData.indexOf('<svg')
    const endIndex = svgData.indexOf('</svg>') + '</svg>'.length
    const svgStr = svgData.substring(startIndex, endIndex)
    svgContent.value = svgStr //svgContent
}

function addIdToSvg() {
    const svgElement = elSvg.value.querySelector('svg')
    if (svgElement) {
        svgElement.id = 'animateMe'
        new KanjivgAnimate('.kanjivg-button', 600)
        svgElement.setAttribute('width', 230)
        svgElement.setAttribute('height', 230)
        document.querySelectorAll('#animateMe path').forEach((path) => {
            const newStrokeWidth = 4
            path.setAttribute('stroke-width', newStrokeWidth)
        })
    }
}

function waitForAnimation(stroke_num) {
    isDisable.value = true
    setTimeout(() => {
        isDisable.value = false
    }, stroke_num * 600)
}

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
const currentCard = computed(() => {
    if (wordList.value[currentCardIndex.value].svg_path) {
        showKanjiDetail(wordList.value[currentCardIndex.value].svg_path)
    }
    return wordList.value[currentCardIndex.value]
})

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

function playAudio() {
    audioEl.value.play()
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
</script>

<template>
    <div v-if="isLoading" class="text-3xl font-bold">Loading ....</div>
    <div
        class="flex justify-center w-full text-white min-h-screen sm:py-4 py-0 bg-[#eee]"
        v-else-if="!end"
    >
        <div
            class="relative sm:border-2 bg-[#153448] w-[768px] sm:rounded-3xl overflow-hidden p-4"
        >
            <div class="px-4">
                <div
                    class="w-full h-[16px] bg-[#3c5b6f] mt-2 rounded-2xl overflow-hidden"
                >
                    <div
                        class="h-[16px] bg-gradient-to-r from-[#72edad] to-emerald-600 transition-all"
                        :style="{ width: progress + '%' }"
                    ></div>
                </div>
            </div>
            <div class="mt-20" v-if="!isLoading && wordList.length > 0">
                <div
                    v-if="!currentCard.content"
                    class="flex justify-center w-full"
                >
                    <div class="items-center flex flex-col">
                        <div
                            class="bg-svg-background bg-cover w-[230px] h-[230px] border-2 rounded-2xl bg-white font-bold mb-4"
                            v-html="svgContent"
                            ref="elSvg"
                        ></div>
                        <div class="flex">
                            <button
                                class="kanjivg-button mr-4 flex items-center justify-center w-12 h-[48px] bg-white rounded-xl hover:cursor-pointer hover:*:transition-all"
                                data-kanjivg-target="#animateMe"
                                @click="waitForAnimation(4)"
                                :disabled="isDisable"
                            >
                                <PenWriting class="w-10 h-[40px]" />
                            </button>
                            <button
                                @click="playAudio"
                                class="w-12 h-[48px] flex items-center justify-center bg-white hover:*:transition-all hover:cursor-pointer rounded-xl overflow-hidden"
                            >
                                <AudioIcon class="w-10 h-[40px]" />
                            </button>
                        </div>
                    </div>
                </div>
                <audio
                    ref="audioEl"
                    class="hidden"
                    :src="
                        `https://d28at3pxt9wnoo.cloudfront.net/` +
                        currentCard.audio
                    "
                    controls
                ></audio>
                <p v-if="currentCard.content" class="font-semibold px-4">
                    Hãy chọn đáp án đúng tương ứng với cách phát âm:
                </p>
                <div
                    :class="currentCard.content ? 'mt-4 sm:mt-20' : ''"
                    class="text-center font-normal text-3xl py-7"
                >
                    <p>
                        {{ currentCard.word || currentCard.content }}
                    </p>
                </div>
                <div
                    class="absolute right-0 bottom-0 p-4 w-full flex flex-wrap hover:*:cursor-pointer hover:*:bg-emerald-600 hover:*:text-white hover:*:transition-all *:transition-all *:font-bold *:text-lg *:text-black *:text-center *:bg-[#dee2e6]"
                >
                    <div
                        class="relative w-full sm:w-1/2 md:w-1/2 lg:w-1/2 sm:max-w-[350px] border-2 m-2 border-[#ccc] hover:border-emerald-600 rounded-[14px] h-[56px] flex items-center justify-center"
                        v-for="(item, index) in currentCard.quiz"
                        :key="index"
                        @click="checkAnswer"
                    >
                        <span
                            class="absolute left-[2%] select-none font-extrabold rounded-lg w-8 border-2 border-[#ccc]"
                            >{{ index + 1 }}
                        </span>

                        {{ item }}
                    </div>
                </div>
            </div>
            <div v-if="!currentCard.content">
                <div class="text-center py-4">
                    <button
                        @click="nextCard"
                        class="bg-green-400 *:hover:animate-next-icon-trans hover:*:transition-all hover:bg-green-600 transition-all hover:text-white px-5 rounded-full font-medium text-lg"
                    >
                        <NextHeliumIcon class="w-16 h-[64px] px-2" />
                    </button>
                </div>
            </div>
            <div
                class="absolute w-full right-0 h-[350px] sm:h-[300px] max-h-[300px] bottom-0 p-4 flex z-10"
                :class="isCorrect ? 'bg-emerald-400' : 'bg-[#ff6969]'"
                v-else-if="cardAnswer"
            >
                <div
                    class="relative text-lg text-black p-4 w-1/2 sm:w-[40%] h-[80%] sm:h-[100%]"
                >
                    <div class="w-8 h-8 sm:w-10" v-if="isCorrect">
                        <Correct class="w-full h-[100%]" />
                    </div>
                    <div v-else class="w-8 h-8 sm:w-10">
                        <Wrong class="w-full h-[100%]" />
                    </div>
                    <div class="absolute top-1/3 w-full">
                        <p
                            class="sm:px-5 text-base sm:text-lg text-slate-700 font-medium"
                        >
                            Đáp án: /{{ currentCard.value }}/
                        </p>
                        <p
                            class="sm:px-5 text-base sm:text-lg text-slate-700 font-medium"
                            v-if="currentCard.sentence"
                        >
                            Nghĩa: {{ currentCard.sentence }}
                        </p>
                    </div>
                </div>
                <div
                    v-if="currentCard.image"
                    class="w-1/2 flex justify-center sm:w-[40%] overflow-hidden p-4 h-[80%] sm:h-[100%]"
                >
                    <img
                        class="object-cover rounded-lg"
                        :src="currentCard.image"
                    />
                </div>
                <div class="hidden sm:flex w-[20%] p-4 flex-col justify-center">
                    <button
                        class="bg-[#fff5e1] px-7 rounded-3xl py-2 text-[#0C1844] font-bold"
                        @click="nextCard"
                    >
                        Next
                    </button>
                </div>
                <div
                    class="absolute left-0 bottom-0 sm:hidden w-full block p-4"
                >
                    <button
                        class="bg-[#fff5e1] w-full px-7 rounded-3xl py-2 text-[#0C1844] font-bold"
                        @click="nextCard"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    </div>
    <div v-else>
        <div
            class="flex flex-col justify-center items-center min-h-screen bg-[#153448]"
        >
            <div>
                <img class="w-40" src="../assets/images/penguin-logo.svg" />
            </div>
            <p class="text-lg font-bold text-white">Hoàn thành bài học!</p>
            <p class="text-white font-bold px-2 rounded-full bg-[#948979]">
                {{ (percentCorrect / numQuestions) * 100 }} %
            </p>
            <p
                class="text-white font-bold mt-3 text-lg underline transition-all hover:transition-all hover:text-[#ccc] hover:cursor-pointer"
                @click="router.go(0)"
            >
                Học lại
            </p>
            <!-- Next lesson button -->
            <div
                @click="nextLesson"
                class="mt-16 px-5 py-2 bg-[#fff5e1] text-lg font-bold rounded-full"
            >
                Bài tiếp theo
            </div>
            <!-- Next lesson button -->
            <router-link
                class="text-white mt-3 text-base underline"
                :to="{
                    name: 'CourseDetail',
                    params: { id: props.course_id },
                }"
            >
                Danh sách bài học</router-link
            >
        </div>
    </div>
</template>
