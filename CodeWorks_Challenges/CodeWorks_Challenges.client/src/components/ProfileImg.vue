<template>
	<img :src="profile.picture"
		@error="(e) => e.target.src = `https://ui-avatars.com/api/?name=${profile.nickname || profile.name}&background=random`"
		:title="`Click to Visit ${profile.nickname || profile.name}'s Profile Page`" class="profile-picture rounded-circle"
		height="35" width="35" />
</template>

<script>
import { Account } from '../models/Account.js';
import { Profile } from '../models/Profile.js';

export default {
	props: {
		profile: { type: [Account, Profile] }
	}
}
</script>

<style scoped lang="scss">
.profile-picture {
	border-radius: 50%;
	object-fit: cover;
	object-position: center;
}
</style>