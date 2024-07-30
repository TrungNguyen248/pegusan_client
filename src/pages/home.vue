<template>
    <div class="">
        <div class="">
            <section
                class="container flex items-center justify-center h-screen m-auto mb-12 bg-fixed bg-center bg-cover custom-img"
            >
                <div class="p-5 text-2xl text-white bg-opacity-50 rounded-xl">
                    <div class="flex justify-center">
                        <img
                            class="lg:w-svw absolute top-0"
                            src="../assets/images/Inaka-Project-temple.avif"
                        />
                    </div>
                </div>
            </section>

            <div class="flex absolute top-1/2 left-1/2 -translate-x-1/2 z-10">
                <router-link
                    class="text-white bg-black/40 text-lg text-center font-bold px-4 rounded-lg w-40 h-[60px] leading-10 py-2 border-2 hover:scale-104 hover:border-[#a38a75] hover:transition-colors transition-colors"
                    to="/login"
                    >Bắt đầu nào
                </router-link>
            </div>
        </div>
    </div>
</template>
