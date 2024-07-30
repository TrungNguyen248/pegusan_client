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
            <div class="w-full lg:w-3/4 px-10">
                <div
                    v-for="(question, index) in listQuestions"
                    :key="index"
                    :id="'question_' + (index + 1)"
                >
                    <h3 class="text-white/90 font-medium text-lg">
                        Câu {{ index + 1 }}:
                        <span>{{ question.content_text }}</span>
                    </h3>
                    <div class="flex flex-wrap">
                        <div
                            v-for="(q, i) in question.quiz"
                            :key="q"
                            class="w-full sm:w-1/2 p-4"
                        >
                            <input
                                :id="index + '_' + i"
                                type="radio"
                                :name="'value_' + index"
                                :value="i"
                                class="hidden"
                                @change="handleUserAnswer(index, i)"
                            />
                            <div
                                class="border-2 rounded-lg"
                                :class="
                                    userAnswers[index] === i
                                        ? 'bg-[#153448] text-white '
                                        : ''
                                "
                            >
                                <label
                                    class="flex items-center"
                                    :for="index + '_' + i"
                                >
                                    <div class="ml-2">O</div>
                                    <div
                                        class="pl-2 py-4 text-left font-medium"
                                    >
                                        {{ q }}
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div
                class="hidden lg:block lg:w-1/4 fixed top-[150px] right-0 h-[80%]"
            >
                <div class="px-[15px] mb-5 block float-left w-full">
                    <div
                        class="w-full float-left max-h-[100px] overflow-hidden overflow-y-auto"
                    >
                        <div
                            class="select-none w-8 h-[32px] rounded-md mb-1 mr-1 float-left text-center font-bold leading-8 text-sm border-[1px] border-solid border-[#e6e6e6]"
                            v-for="i in listQuestions.length"
                            :key="i"
                            :class="
                                userAnswers[i - 1] !== undefined
                                    ? 'bg-[#153448] text-white'
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
                            <button
                                class="w-full text-[#153448] bg-[#e8c9af] font-bold py-2 rounded-xl"
                            >
                                Nộp bài
                            </button>
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
