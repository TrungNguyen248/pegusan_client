<script setup>
import LeaderIcon from '../Icons/leader.vue'
</script>

<template>
    <div class="fixed left-0 top-1/2 z-50">
        <router-link to="/leaderboard">
            <div
                class="w-full flex justify-center p-1 bg-[#153448] hover:border-[#e8ca9f] hover:bg-[#153448]/80 items-center border-2 rounded-r-lg"
            >
                <LeaderIcon class="w-10 h-[40px]" />
            </div>
        </router-link>
    </div>
</template>
