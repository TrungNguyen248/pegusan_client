<script setup>
import { ref, onMounted, computed } from 'vue'
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
const numQues = ref([])
const nameExams = ref('')

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
    nameExams.value = res.data.metadata.title
    //console.log(listQuestions.value)
}

function numQuestion() {
    for (let i = 0; i < listQuestions.value.length; i++) {
        if (
            listQuestions.value[i]?.dokkai_ask &&
            listQuestions.value[i].dokkai_ask.length > 0
        ) {
            for (
                let j = 1;
                j <= listQuestions.value[i].dokkai_ask.length;
                j++
            ) {
                numQues.value.push(`${i + 1}.${j}`)
            }
        } else {
            numQues.value.push(`${i + 1}`)
        }
    }
}

function handleUserAnswer(ques_id, answer) {
    userAnswers.value[ques_id] = answer
}

function handleAnswerDokkai(dokkai_id, ques_id, answer) {
    console.log(dokkai_id, ques_id, answer)
    userAnswers.value[`${dokkai_id}.${ques_id + 1}`] = answer
}

onMounted(async () => {
    await fetchExamQuestion()
    numQuestion()
})
</script>

<template>
    <div class="relative container mx-auto max-w-7xl mt-[72px]">
        <p
            class="text-center sm:text-left text-2xl text-black font-bold px-10 py-4 sm:py-10"
        >
            Bài test: {{ nameExams }}
        </p>
        <div class="flex sm:py-10">
            <div class="w-full lg:w-3/4 px-2 sm:px-10">
                <div
                    v-for="(question, index) in listQuestions"
                    :key="index"
                    class="mb-4"
                >
                    <h3
                        v-if="question.content_text"
                        class="text-black text-lg"
                        :id="'question_' + (index + 1)"
                    >
                        Câu {{ index + 1 }}:
                        <span>{{ question.content_text }}</span>
                    </h3>
                    <h3
                        v-if="question.dokkai_text.length > 0"
                        class="text-black text-lg"
                    >
                        Câu {{ index + 1 }}:
                        {{ question.dokkai_text }}
                    </h3>
                    <div v-if="question.quiz.length > 0" class="flex flex-wrap">
                        <div
                            v-for="(q, i) in question.quiz"
                            :key="q"
                            class="w-full sm:w-1/2 p-2"
                        >
                            <input
                                :id="`${index + 1}.${i}`"
                                type="radio"
                                :name="'value_' + index"
                                :value="i"
                                class="hidden"
                                @change="handleUserAnswer(index + 1, i)"
                            />
                            <div
                                class="group border-2 border-gray-500 rounded-full hover:bg-[#38576a]"
                                :class="
                                    userAnswers[index + 1] === i
                                        ? 'bg-[#38576a] text-white'
                                        : ''
                                "
                            >
                                <label
                                    class="flex items-center"
                                    :for="`${index + 1}.${i}`"
                                >
                                    <div class="ml-2">
                                        <div
                                            :class="
                                                userAnswers[index + 1] === i
                                                    ? 'bg-white'
                                                    : ''
                                            "
                                            class="flex justify-center items-center border-2 w-5 h-[20px] group-hover:bg-white rounded-full"
                                        >
                                            <div
                                                :class="
                                                    userAnswers[index + 1] === i
                                                        ? 'bg-white'
                                                        : ''
                                                "
                                                class="border-2 w-3 h-[12px] rounded-full group-hover:bg-white"
                                            ></div>
                                        </div>
                                    </div>
                                    <div
                                        class="pl-2 py-4 text-left font-medium group-hover:text-white"
                                    >
                                        {{ q }}
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div
                        v-if="question.dokkai_ask.length > 0"
                        class="w-full flex flex-wrap"
                    >
                        <div
                            v-for="(ques, idx) in question.dokkai_ask"
                            :key="idx"
                            class="w-full"
                        >
                            <h3
                                :id="
                                    'question_' + (index + 1) + '.' + (idx + 1)
                                "
                                v-if="question.dokkai_text.length > 0"
                                class="text-black text-lg"
                            >
                                {{ idx + 1 }}.
                                {{ ques.content_text }}
                            </h3>
                            <div class="flex flex-wrap">
                                <div
                                    v-for="(q, i) in ques.quiz"
                                    :key="q"
                                    class="w-full sm:w-1/2 p-2"
                                >
                                    <input
                                        :id="`${index + 1}.${idx + 1}.${i}`"
                                        type="radio"
                                        :name="`value_${index + 1}.${idx + 1}`"
                                        :value="i"
                                        class="hidden"
                                        @change="
                                            handleAnswerDokkai(
                                                index + 1,
                                                idx,
                                                i,
                                            )
                                        "
                                    />
                                    <div
                                        class="group border-2 border-gray-500 rounded-full hover:bg-[#38576a]"
                                        :class="
                                            userAnswers[
                                                `${index + 1}.${idx + 1}`
                                            ] === i
                                                ? 'bg-[#38576a] text-white'
                                                : ''
                                        "
                                    >
                                        <label
                                            class="flex items-center"
                                            :for="`${index + 1}.${idx + 1}.${i}`"
                                        >
                                            <div class="ml-2">
                                                <div
                                                    :class="
                                                        userAnswers[
                                                            `${index + 1}.${idx + 1}`
                                                        ] === i
                                                            ? 'bg-white'
                                                            : ''
                                                    "
                                                    class="flex justify-center items-center border-2 w-5 h-[20px] group-hover:bg-white rounded-full"
                                                >
                                                    <div
                                                        :class="
                                                            userAnswers[
                                                                `${index}.${idx}`
                                                            ] === i
                                                                ? 'bg-white'
                                                                : ''
                                                        "
                                                        class="border-2 w-3 h-[12px] rounded-full group-hover:bg-white"
                                                    ></div>
                                                </div>
                                            </div>
                                            <div
                                                class="pl-2 py-4 text-left font-medium group-hover:text-white"
                                            >
                                                {{ q }}
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="lg:hidden mt-5 w-full py-5">
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
            <div
                class="hidden lg:block lg:w-1/4 fixed top-[200px] right-0 h-[80%]"
            >
                <div class="px-10 block w-full">
                    <div
                        class="customs_scroll w-full h-[200px] bg-white/60 rounded-xl p-2 overflow-y-auto border-2"
                    >
                        <div class="flex flex-wrap">
                            <div
                                v-for="(q, idx) in numQues"
                                :key="idx"
                                class="p-1"
                            >
                                <div
                                    class="select-none w-8 h-[32px] rounded-md flex justify-center items-center font-bold text-sm border-[1px] border-solid border-[#e6e6e6]"
                                    :class="
                                        userAnswers[q] !== undefined
                                            ? 'bg-[#153448] text-white'
                                            : 'bg-white'
                                    "
                                >
                                    <a :href="'#question_' + q">
                                        <p>{{ q }}</p></a
                                    >
                                </div>
                            </div>
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

<style scoped>
.customs_scroll::-webkit-scrollbar {
    width: 6px;
}

.customs_scroll::-webkit-scrollbar-track {
    background-color: #ffffff;
}
.customs_scroll::-webkit-scrollbar-thumb {
    background-image: linear-gradient(-45deg, #153448, #153448);
    border-radius: 50px;
}
</style>
