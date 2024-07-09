<script setup>
//class="w-24 h-[96px]"
</script>

<template>
    <div class="bg-[#3c5b6f] h-[100vh]">
        <div class="w-full">
            <div class="flex">
                <img
                    class="w-24 h-[96px]"
                    src="../assets/images/penguin-logo.svg"
                    alt="logo"
                />
                <span
                    class="relative -left-[15px] flex justify-center items-center"
                >
                    <p class="text-white text-lg font-bold">PEGUSAN</p>
                </span>
            </div>
        </div>
        <slot />
    </div>
</template>
