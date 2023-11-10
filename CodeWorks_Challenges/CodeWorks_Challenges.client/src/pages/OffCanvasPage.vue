
<template>
    <section class="container-fluid bg-dark">
        <div class="d-flex flex-row">
            <div class="pe-0">
                <nav class="navbar navbar-dark">
                    <div class="container-fluid">
                        <button class="navbar-toggler btn-info" type="button" data-bs-toggle="collapse" data-bs-target="#collapseBody" aria-controls="navbarToggleExternalContent" aria-expanded="false" aria-label="Toggle side navigation">
                        <span class="navbar-toggler-icon ps-3 text-info"></span>
                        </button>
                    </div>
                </nav>
                <div style="min-height: 120px;" class="">
                    <div class="collapse collapse-horizontal" id="collapseBody">
                        <div class="p-3">
                            <h3 href="#home" data-bs-toggle="collapse" class="d-flex border-bottom"><i class="mdi mdi-home"></i>Home</h3>
                            <ul class="collapse show flex-column" id="home">
                                <h3>Hey</h3>
                                <h3>Here</h3>
                                <h3>Are</h3>
                                <h3>Some</h3>
                                <h3>Items</h3>
                            </ul>
                            <h3 href="#editChallenge" data-bs-toggle="collapse" class="border-bottom">Edit Challenge</h3>
                            <ul class="collapse flex-column" id="editChallenge">
                                <h3>Details</h3>
                                <h3>Steps</h3>
                                <h3>Answers</h3>
                                <h3>Gnomes</h3>
                            </ul>
                            <Login/>
                        </div>
                    </div>
                </div>
            </div>
            <div class="bg-dark">
                <h1>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nobis, nostrum quis! Enim eveniet, commodi pariatur fuga perspiciatis sit alias sint natus vero quisquam nobis obcaecati cum nemo ipsa sunt. Ratione!</h1>
            </div>
        </div>
    </section>
</template>

<style scoped>
.collapse-horizontal {
    transition: width 0.4s ease;
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