<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../stores/auth'

const props = defineProps({
    id: {
        type: String,
        required: true,
    },
})

const isLoading = ref(true)
const listQuestions = ref([])
const userAnswers = ref({})

const authStore = useAuthStore()
const user = authStore.user

async function fetchExamQuestion() {
    const res = await axios.post(
        `http://localhost:5000/v1/api/exams/${props.id}`,
        {},
        {
            headers: {
                'x-api-key':
                    'f19a5a8992310cd9dfcc8ce99fca99a2a1e5f28a4f3049f83c112565992066270310a4e5628169ad6e0ed6b113386f8a2a1be3e1c3ba0b6c61ceeb97f0ec8b61',
                'x-client-id': user._id,
                authorization: authStore.accessToken,
            },
        },
    )
    isLoading.value = false
    listQuestions.value = res.data.metadata.contents
}

function handleUserAnswer(ques_index, answer) {
    userAnswers.value[ques_index] = answer
    console.log(userAnswers.value)
}

onMounted(() => {
    fetchExamQuestion()
})
</script>

<template>
    <div class="relative container mx-auto max-w-7xl mt-12">
        <div class="flex py-10">
            <div class="w-3/4 border-2 border-gray-500 px-10">
                <div
                    v-for="(question, index) in listQuestions"
                    :key="index"
                    :id="'question_' + (index + 1)"
                >
                    <h3>{{ index + 1 }}. {{ question.content_text }}</h3>
                    <div class="grid lg:grid-cols-2 sm:grid-cols-1 gap-4">
                        <div
                            v-for="(q, i) in question.quiz"
                            :key="q"
                            class="border-2 border-gray-400"
                        >
                            <input
                                :id="index + '_' + i"
                                type="radio"
                                :name="'value_' + index"
                                :value="i"
                                @change="handleUserAnswer(index, i)"
                            />
                            <label class="" :for="index + '_' + i">
                                <div>O</div>
                                <div class="pl-2 py-4 text-left">{{ q }}</div>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            <div
                class="w-1/4 border-2 border-gray-500 fixed top-[150px] right-0 h-[80%]"
            >
                <div class="px-[15px] mb-5 block float-left w-full">
                    <div
                        class="w-full float-left max-h-[100px] overflow-hidden overflow-y-auto"
                    >
                        <div
                            class="select-none w-8 h-[32px] rounded-md mb-1 mr-1 float-left text-center text-gray-600 font-medium leading-8 text-sm border-[1px] border-solid border-[#e6e6e6]"
                            v-for="i in listQuestions.length"
                            :key="i"
                            :class="
                                userAnswers[i - 1] !== undefined
                                    ? 'bg-blue-300'
                                    : 'bg-white'
                            "
                        >
                            <a :href="'#question_' + i">{{ i }}</a>
                        </div>
                    </div>
                    <div class="mt-20 w-full bottom-0">
                        <router-link
                            :to="{
                                name: 'ExamsResult',
                                params: {
                                    id: props.id,
                                },
                            }"
                        >
                            <button class="w-full bg-blue-200">Nop bai</button>
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
