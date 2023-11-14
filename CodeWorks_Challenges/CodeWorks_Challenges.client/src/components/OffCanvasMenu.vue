
<template>
    <section class="container-fluid bg-dark">
        <div class="d-flex flex-row">
            <div class="sticky-top">
                <nav class="navbar navbar-dark">
                    <div class="container-fluid">
                        <button class="navbar-toggler btn-info ms-auto" type="button" data-bs-toggle="collapse" data-bs-target="#collapseBody" aria-controls="navbarToggleExternalContent" aria-expanded="false" aria-label="Toggle side navigation">
                        <span class="navbar-toggler-icon  text-info fs-5 "></span>
                        </button>
                    </div>
                </nav>
                <div class="">
                    <div class="collapse collapse-horizontal show" id="collapseBody">
                        <div class="p-3 text-nowrap">
                            <div class="mb-3 accordion">
                                <button href="#home" data-bs-toggle="collapse" class="d-flex accordion-button fs-4"><i class="mdi mdi-home fs-3"></i>Home</button>
                                <ul class="collapse show flex-column border-bottom bg-light text-dark rounded-bottom" id="home">
                                    <h5><a href="" class="text-dark">Banana</a></h5>
                                    <h5><a href="" class="text-dark">Apple</a></h5>
                                    <h5><a href="" class="text-dark">Orange</a></h5>
                                </ul>
                            </div>
                                <!--NOTE Conditionally render different pages menus-->
                                <div class="mb-3 accordion" v-if="route.name != 'Home'">
                                    <button href="#editChallenge" data-bs-toggle="collapse" class="accordion-button collapsed fs-4">Edit Challenge</button>
                                    <ul class="collapse flex-column border-bottom bg-light text-dark rounded-bottom" id="editChallenge">
                                        <h5><a href="" class="text-dark">Banana</a></h5>
                                        <h5><a href="" class="text-dark">Apple</a></h5>
                                        <h5><a href="" class="text-dark">Orange</a></h5>
                                        <h1 v-if="route.name == 'Home'">here</h1>
                                    </ul>
                                </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="bg-dark p-3">
                <slot></slot>
            </div>
        </div>
    </section>
</template>

<style scoped>
.collapse-horizontal {
    transition: width 0.3s ease;
}


</style>

<script>
import { computed } from 'vue'
import { AppState } from '../AppState'
import { useRoute, useRouter } from 'vue-router';
import Login from '../components/Login.vue';

export default {
    setup() {
        const route = useRoute();
        const router = useRouter();
        return {
            AppState: computed(() => AppState),
            route,
        };
    },
    components: { Login }
}
</script>