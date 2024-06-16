<script lang="ts">
	import { Avatar } from '@skeletonlabs/skeleton';
	export let url = '';
	export let width = 'w-8';
</script>

<Avatar src={url} {width} rounded="rounded-full" />
