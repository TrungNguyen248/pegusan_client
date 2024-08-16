<script setup>
import LeaderIcon from '../Icons/leader.vue'
</script>

<template>
    <div class="fixed left-0 top-1/2 z-50">
        <router-link to="/leaderboard">
            <div
                class="group flex justify-center border-black bg-white transition-all hover:bg-[#fff4e5] hover:border-[#c7801d] items-center border-2 rounded-r-lg"
            >
                <LeaderIcon class="w-10 h-[40px]" />
                <div
                    class="transition-all -translate-x-full group-hover:translate-x-0 text-sm font-medium"
                >
                    <p class="hidden group-hover:block px-1">Bảng xếp hạng</p>
                </div>
            </div>
        </router-link>
    </div>
</template>
