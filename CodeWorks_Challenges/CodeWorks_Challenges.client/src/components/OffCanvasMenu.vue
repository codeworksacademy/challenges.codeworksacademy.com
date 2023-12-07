
<template>
    <section class="container-fluid bg-dark">
        <div class="d-flex flex-row">
            <div class="sticky-top">
                <nav class="navbar navbar-dark">
                    <div class="container-fluid">
                        <button class="navbar-toggler btn-info ms-auto" type="button" data-bs-toggle="collapse"
                            data-bs-target="#collapseBody" aria-controls="navbarToggleExternalContent" aria-expanded="false"
                            aria-label="Toggle side navigation">
                            <span class="navbar-toggler-icon  text-info fs-5 "></span>
                        </button>
                    </div>
                </nav>
                <div class="">
                    <div class="collapse collapse-horizontal show" id="collapseBody">
                        <div class="p-3 text-nowrap">
                            <div class="mb-3 accordion">
                                <button href="#home" data-bs-toggle="collapse"
                                    class="d-flex accordion-button fs-4">Navigation</button>
                                <ul class="collapse show flex-column border-bottom bg-light text-dark rounded-bottom"
                                    id="home">
                                    <router-link to="/challenges">
                                        <h5>Challenges</h5>
                                    </router-link>
                                    <!-- <h5><a href="" class="text-dark">Challenges</a></h5> -->
                                    <!-- <h5><a href="" class="text-dark">Apple</a></h5>
                                    <h5><a href="" class="text-dark">Orange</a></h5> -->
                                </ul>
                            </div>
                            <!--NOTE Conditionally render different pages menus-->
                            <div class="mb-3 accordion"
                                v-if="route.name == 'ChallengeEditor' || route.name == 'GradeSubmissionsPage' || route.name == 'ChallengeSubmissionsPage' || route.name == 'ChallengeModeratorsPage'">
                                <button href="#editChallenge" data-bs-toggle="collapse"
                                    class="accordion-button collapsed fs-4" @click="">Edit Challenge</button>
                                <ul class="collapse flex-column border-bottom bg-light text-dark rounded-bottom"
                                    id="editChallenge">
                                    <h5 @click="changeRoute('Edit')">Edit Details</h5>
                                    <h5 @click="changeRoute('submissions')">Participants</h5>
                                    <h5>Notifications</h5>
                                    <h5 @click="changeRoute('grading')">Submissions</h5>
                                    <h5 @click="changeRoute('moderators')">Moderators</h5>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="bg-dark p-3 overflow-auto" style="height: 87vh">
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
        function changeRoute(route) {
            router.push({
                path: `${route}`
            })
        }
        const participant = computed(() => {
            return AppState.participants.find(p => p.accountId = AppState.activeParticipant?.accountId)
        })
        const participantId = computed(() => {
            return participant.value.id
        })
        return {
            AppState: computed(() => AppState),
            route,
            changeRoute,
            participant,
            participantId,
        };
    },
    components: { Login }
}
</script>