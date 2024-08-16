<script setup>
//class="w-24 h-[96px]"
</script>

<template>
    <div class="bg-[#FFF7F1] h-[100vh]">
        <div class="w-full">
            <div class="flex fixed z-50">
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
