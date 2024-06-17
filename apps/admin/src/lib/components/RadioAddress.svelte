<script lang="ts">
	export let options: string = '';
	export let value: string = '';
	export let label: string = '';
</script>

<label class:checked={options === value} class="flex items-center space-x-2">
	<input bind:group={options} type="radio" class="radio mr-2" {value} />
	{label}
</label>
