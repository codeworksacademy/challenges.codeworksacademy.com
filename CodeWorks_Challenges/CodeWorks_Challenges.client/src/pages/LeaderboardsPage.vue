<!-- 
"PARTICIPANT"
id: "6585fba41030d091dce52670"
challengeId: "65849e08061869ca65236926"
accountId: "6561824c14505e60de787445"

  "PARTICIPANT.CHALLENGE" - ALL AVAILABLE CHALLENGE INFORMATION FOR A PARTICIPANT THAT HAS COMPLETED A CHALLENGE
  challenge: {}
    answer: ""
    autoGrade: false
    badge: undefined
    category: "full stack"
    completedCount: 1
    coverImg: "https://raw.githubusercontent.com/rmznkapar/pinterest-web-clone/master/src/assets/pinterest-clone.png"
    createdAt: "Dec 21, 2023 1:20 PM"
    creatorId: "652e1d7c5f8130f180e79a05"
    description: "Keeper but harder"
    difficulty: 1
    difficultyStr: {
      html: <img src="../assets/img/easy-difficulty…height: 1.5rem; margin-right: .25rem;"/>
      text: 'easy'
    }
    id: "65849e08061869ca65236926"
    isCancelled: false
    name: "Keepr 3.0"
    participantCount: 2
    reputationIds: Array(0)
    length: 0
    [[Prototype]]: Array(0)
    requirements: (3) ['build server', 'build client', 'BOOM. Keeper 3.0']
    status: "published"
    supportLinks: []
    updatedAt: "Dec 21, 2023 1:21 PM" //The time the participant was graded.
    valid: undefined
    challengeId: "65849e08061869ca65236926"
    createdAt: "2023-12-22T21:12:04.779Z" //The time the participant was created or 'joined' the challenge. If you wanted to how long it took a participant to complete a challenge, you would subtract the createdAt time from the updatedAt time.
    grade: 3
    id: "6585fba41030d091dce52670"

    "PARTICIPANT.PROFILE" - ALL AVAILABLE PROFILE INFORMATION FOR A PARTICIPANT THAT HAS COMPLETED A CHALLENGE
    profile: {}
      coverImg: "https://images.unsplash.com/photo-1484820986637-7ec3e85b394f?q=80&w=2082&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      experience: undefined
      id: "6561824c14505e60de787445"
      name: "codemasterflex"
      picture: "https://s.gravatar.com/avatar/abf802120de564903159817b1b15677f?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fco.png"
      rank: undefined
      reputation: 0
      title: undefined
      [[Prototype]]: Object
      requirements: (3) [{…}, {…}, {…}]
      status: "completed"
      submission: "https://github.com/ajvancattenburch"
      updatedAt: "2023-12-22T21:13:43.043Z"

    "PARTICIPANT.CHALLENGE.CREATOR" - ALL AVAILABLE CREATOR INFORMATION FOR A PARTICIPANT THAT HAS COMPLETED A CHALLENGE
    creator: {}
      badges: []
      createdAt: "2023-12-21T17:55:31.350Z"
      email: "12345678901112@gmail.com"
      experience: 0
      id: "652e1d7c5f8130f180e79a05"
      name: "12345678901112"
      picture: "https://s.gravatar.com/avatar/cc8d3d26d7f5b3aab30a83c8c8bae6f2?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2F12.png"
      rank: 215
      reputation: 0
      subs: ['auth0|652e1d7cbbe3e1d5342ce228']
      totalExperience: 245
      updatedAt: "2024-01-14T16:44:01.109Z"
      __v: 0
      _id: "652e1d7c5f8130f180e79a05"

      //Assuming this is just one instance within an array of participants, some of the best calculations for the leaderboard would be:
      //1. Which participants have the most experience by participant.profile.experience
        Example:
        mostExperience: computed(() => {
          return AppState.ChallengeState.participants.sort((a, b) => b.profile.experience - a.profile.experience)
        }),
      //2. Which participants have the most reputation
        Example:
        mostReputation: computed(() => {
          return AppState.ChallengeState.participants.sort((a, b) => b.profile.reputation - a.profile.reputation)
        }),
      //3. Which participants have the most badges
        Example:
        mostBadges: computed(() => {
          const challengeHasBadge = AppState.ProfileState.participation.filter(p.challenge.badge !== undefined)

        }),
      //4. Which participants have the most completed challenges
      //5. Which participants have the most completed challenges in a specific category
 -->

<template>
  <div class="text-white fs-5" style="height: 100%; overflow-y: auto;">
    <div class="d-flex flex-wrap justify-content-center">
      <div class="col-12">
        <h1 class="text-center">Leaderboards</h1>
      </div>
      <div class="col-12">
        <h3 class="text-center">All Badges</h3>
      </div>
      <div v-for="participant in challenges" :key="participant.id">
        <p class="text-white"> {{ participant.profile.name }} </p>
        <ChallengeBadgeCard :challenge="participant.challenge" />
      </div>
      <div class="col-12">
        <h3 class="text-center">Most Experience</h3>
      </div>
      <div v-for="participant in mostExperience" :key="participant.id">
        <p class="text-white"> {{ participant.profile.name }} </p>
        <p class="text-white"> {{ participant.profile.experience }} </p>
      </div>
      <div class="col-12">
        <h3 class="text-center">Most Reputation</h3>
      </div>
      <div v-for="participant in mostReputation" :key="participant.id">
        <p class="text-white"> {{ participant.profile.name }} </p>
        <p class="text-white"> {{ participant.profile.reputation }} </p>
      </div>
      <div class="col-12">
        <h3 class="text-center">Most Badges</h3>
      </div>
      <div v-for="participant in mostBadges" :key="participant.id">
        <p class="text-white"> {{ participant.challenge.name }} </p>
        <p class="text-white"> {{ participant.challenge.badge }} </p>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue'
import { AppState } from '../AppState'
import { logger } from '../utils/Logger'
import { participantsService } from "../services/ParticipantsService.js"
import ChallengeBadgeCard from "../components/ChallengePage/ChallengeBadgeCard.vue"

export default {
  setup() {
    const filterBy = ref('')

    async function getParticipantsLeaderboards() {
      try {
        await participantsService.getParticipantsLeaderboards()
      } catch (error) {
        logger.error(error)
        logger.log('')
      }
    }

    onMounted(() => {
      getParticipantsLeaderboards()
    })

    return {
      filterBy,
      participants: computed(() => {
        return AppState.profiles
      }),
      challenges: computed(() => {
        return AppState.ChallengeState.participants
      }),
      mostReputation: computed(() => {
        return AppState.ChallengeState.participants.sort((a, b) => b.profile.reputation - a.profile.reputation)
      }),
      mostExperience: computed(() => {
        return AppState.ChallengeState.participants.sort((a, b) => b.profile.experience - a.profile.experience)
      }),
      mostBadges: computed(() => {
        return AppState.ChallengeState.participants.sort((a, b) => b.challenge.badge - a.challenge.badge)
      })
    }
  },
  components: {
    ChallengeBadgeCard
  }
}
</script>