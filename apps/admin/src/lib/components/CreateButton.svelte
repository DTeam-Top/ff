<script lang="ts">
	import { goto } from '$app/navigation';

	const gotoCreate = () => {
		goto('/create');
	};
</script>

<button
	class="text-white bg-gray-700 p-2 ml-2 flex items-center gap-2 rounded-lg"
	on:click={gotoCreate}
>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="20"
		height="20"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
	>
		<rect x="3" y="3" width="7" height="7" />
		<rect x="14" y="3" width="7" height="7" />
		<rect x="14" y="14" width="7" height="7" />
		<rect x="3" y="14" width="7" height="7" />
	</svg>
	Create Flow
</button>
