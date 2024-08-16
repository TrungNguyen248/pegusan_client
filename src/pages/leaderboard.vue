<script setup>
import moment from 'moment'
moment().format()
import { onMounted, ref } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../stores/auth'
import TrophyIcon from '../components/Icons/trophy.vue'

const authStore = useAuthStore()
const user = authStore.user

const isLoading = ref(true)
const leaderList = ref({})

function convertFromUnicode(inputStr) {
    let outputStr = ''
    let unicodeChars = inputStr.split('\\u')
    for (let i = 1; i < unicodeChars.length; i++) {
        let charCode = parseInt(unicodeChars[i], 16)
        outputStr += String.fromCharCode(charCode)
    }
    return outputStr
}

async function fetchLeaderBoard() {
    const res = await axios.get('http://localhost:5000/v1/api/leader', {
        headers: {
            'x-api-key':
                'f19a5a8992310cd9dfcc8ce99fca99a2a1e5f28a4f3049f83c112565992066270310a4e5628169ad6e0ed6b113386f8a2a1be3e1c3ba0b6c61ceeb97f0ec8b61',
            'x-client-id': user._id,
            authorization: authStore.accessToken,
        },
    })
    isLoading.value = false
    leaderList.value = res.data.metadata
}

onMounted(async () => {
    await fetchLeaderBoard()
})
</script>

<template>
    <div v-if="leaderList == null">Chưa có dữ liệu!</div>
    <div
        v-else
        class="container mx-auto max-w-7xl py-10 mt-[72px] min-h-[100svh]"
    >
        <p class="text-2xl text-black font-bold px-10 py-4">Bảng xếp hạng</p>
        <p class="text-2xl text-black font-bold px-10 py-4">
            <span>Tuần: </span>
            <span>{{ moment().week() }}</span>
            <span> - Năm: {{ moment().year() }}</span>
        </p>
        <div class="w-full sm:p-20 p-2 flex flex-wrap">
            <div
                v-for="(usr, idx) in leaderList"
                :key="idx"
                :class="
                    idx == 0
                        ? 'w-full'
                        : idx == 1 || idx == 2
                          ? 'w-1/2'
                          : 'w-full'
                "
            >
                <div v-if="idx == 0" class="w-full *:text-center">
                    <div class="w-full flex justify-center">
                        <TrophyIcon class="w-[60px] h-[60px] p-1" />
                    </div>
                    <div
                        v-if="usr.avatar == ''"
                        class="w-full flex justify-center"
                    >
                        <img
                            class="w-[70px] h-[70px] rounded-full"
                            src="https://i.pinimg.com/originals/d5/c7/4a/d5c74a708278195b831780b9065a0abf.jpg"
                        />
                    </div>
                    <div v-else class="w-full flex justify-center">
                        <img
                            class="w-[70px] h-[70px] rounded-full"
                            :src="usr.avatar"
                        />
                    </div>
                    <p class="text-lg text-black font-medium">
                        {{ convertFromUnicode(usr.name) }}
                    </p>
                    <p class="text-black text-sm font-bold">
                        {{ usr.score }}
                    </p>
                </div>
                <div v-if="idx == 1" class="flex flex-col *:text-center">
                    <div class="w-full flex justify-center">
                        <TrophyIcon class="w-[60px] h-[60px] p-1" />
                    </div>
                    <div
                        v-if="usr.avatar == ''"
                        class="w-full flex justify-center"
                    >
                        <img
                            class="w-[70px] h-[70px] rounded-full"
                            src="https://i.pinimg.com/originals/d5/c7/4a/d5c74a708278195b831780b9065a0abf.jpg"
                        />
                    </div>
                    <div v-else class="w-full flex justify-center">
                        <img
                            class="w-[70px] h-[70px] rounded-full"
                            :src="usr.avatar"
                        />
                    </div>
                    <p class="text-lg text-black font-medium">
                        {{ convertFromUnicode(usr.name) }}
                    </p>
                    <p class="text-black text-sm font-bold">
                        {{ usr.score }}
                    </p>
                </div>
                <div v-if="idx == 2" class="flex flex-col *:text-center">
                    <div class="w-full flex justify-center">
                        <TrophyIcon class="w-[60px] h-[60px] p-1" />
                    </div>
                    <div
                        v-if="usr.avatar == ''"
                        class="w-full flex justify-center"
                    >
                        <img
                            class="w-[70px] h-[70px] rounded-full"
                            src="https://i.pinimg.com/originals/d5/c7/4a/d5c74a708278195b831780b9065a0abf.jpg"
                        />
                    </div>
                    <div v-else class="w-full flex justify-center">
                        <img
                            class="w-[70px] h-[70px] rounded-full"
                            :src="usr.avatar"
                        />
                    </div>
                    <p class="text-lg text-black font-medium">
                        {{ convertFromUnicode(usr.name) }}
                    </p>
                    <p class="text-black text-sm font-bold">
                        {{ usr.score }}
                    </p>
                </div>
                <div class="mt-4"></div>
                <div v-if="idx > 2" class="mt-2 sm:px-28">
                    <div class="flex border-2 sm:py-1">
                        <p
                            class="w-1/4 flex justify-center items-center font-bold text-2xl"
                        >
                            {{ idx }}
                        </p>
                        <div
                            v-if="usr.avatar == ''"
                            class="w-1/4 flex items-center justify-center"
                        >
                            <img
                                class="w-[40px] h-[40px] rounded-full"
                                src="https://i.pinimg.com/originals/d5/c7/4a/d5c74a708278195b831780b9065a0abf.jpg"
                            />
                        </div>
                        <div
                            v-else
                            class="w-2/4 flex items-center justify-center"
                        >
                            <img
                                class="w-[40px] h-[40px] rounded-full"
                                :src="usr.avatar"
                            />
                        </div>
                        <p
                            class="text-base text-black font-medium w-1/4 flex items-center justify-center"
                        >
                            {{ convertFromUnicode(usr.name) }}
                        </p>
                        <p
                            class="w-1/4 text-black text-sm font-bold flex items-center justify-center"
                        >
                            {{ usr.score }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
