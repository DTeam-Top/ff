<script lang="ts">
	import { WARP_BASE } from '$lib/client/clientConsts';
	import UserAvatar from '../UserAvatar.svelte';
	import WarpIcon from '../ui/icons/WarpIcon.svelte';
	import { user } from '$lib/client/store';
</script>

<div class="px-6 pt-6 hover:bg-primary-hover-token">
	<header class="flex pb-4 border-b solid border-gray-700">
		<h3>Profile</h3>
	</header>
	<div class="py-4 flex 2xl:items-start w-full">
		<div class="object-cover">
			<UserAvatar url={$user.pft} width={'w-10'} />
		</div>
		<div class="pl-4 w-full">
			<div class="flex items-center justify-between w-full">
				<div class="text-white font-medium">{$user.displayName}</div>
				<div class="flex justify-center items-center cursor-pointer h-7 w-7">
					<a
						target="_blank"
						href={`${WARP_BASE}${$user.username}`}
						class="text-[#472A91] hover:text-secondary-900"
						><svelte:component this={WarpIcon} />
					</a>
				</div>
			</div>
			<p class="my-2 text-sm opacity-50">
				{$user.profile.bio.text}
			</p>
			<p class="text-right text-sm">
				Following: <span class="font-bold">{$user.followingCount}</span>, Follower:
				<span class="font-bold">{$user.followerCount}</span>
			</p>
		</div>
	</div>
</div>
