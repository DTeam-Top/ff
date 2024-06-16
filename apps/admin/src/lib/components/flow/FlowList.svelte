<script lang="ts">
	import { goto } from '$app/navigation';
	import { getFlows, deleteFlowById } from '$lib/client/flowService';
	import { user, signed } from '$lib/client/store';
	import Button from '$lib/components/Button.svelte';
	import ETH from '$lib/components/ETH.svelte';
	import { Paginator, getModalStore, type PaginationSettings } from '@skeletonlabs/skeleton';
	import { LIMIT_MAX } from '$lib/client/clientConsts';
	import { modal } from '$lib/client/popup';
	const modalStore = getModalStore();
	let list: any[] = [];
	let offset = 0;
	let currentPage = 0;
	let total = 0;
	export let type = 'done';
	$: if (!$signed) {
		goto('/');
	}

	$: if ($user) {
		getFlowList();
	}
	let paginationSettings = {};

	const getFlowList = async () => {
		const result = await getFlows($user.fid, type, offset);
		total = result.total;
		paginationSettings = {
			page: currentPage,
			limit: LIMIT_MAX,
			size: total,
			amounts: [5, 10]
		} satisfies PaginationSettings;
		list = result.list;
	};
	const actionHandler = (id: number, type: string) => {
		goto(`/flows/${type}/${id}`);
	};

	const delHandler = async (id: number) => {
		modal.confirm(
			modalStore,
			'Delete Confirm',
			'Are you sure to delete?',
			'w-[500px]',
			async (r: boolean) => {
				if (r) {
					await deleteFlowById(id);
					getFlowList();
				}
			}
		);
	};
	const traceHandler = (id: number) => {
		goto(`/flows/trace/${id}`);
	};

	const onPageChange = (e: CustomEvent): void => {
		offset = e.detail * LIMIT_MAX;
		currentPage = e.detail;
		getFlowList();
	};
</script>

<div class="table-container mt-4">
	{#if list.length > 0}
		<table class="table table-hover">
			<thead>
				<tr>
					<th>Name</th>
					<th>Price</th>
					{#if type !== 'draft'}
						<th>Trace Count</th>
					{/if}
					<th class="lg:block hidden">Action</th>
				</tr>
			</thead>
			<tbody>
				{#each list as row, i}
					<tr>
						<td>{row.name}</td>
						<td>{row.input.price} <ETH /></td>
						{#if type !== 'draft'}
							<td><span class="badge variant-soft-primary">{row.traceCount}</span></td>
						{/if}

						<td class="lg:block hidden">
							{#if row.status === 0}
								<Button
									title="Edit"
									on:click={() => actionHandler(row.id, 'edit')}
									cssClass="bg-tertiary-500 mr-4"
								/>
								<Button
									title="Delete"
									on:click={() => delHandler(row.id)}
									cssClass="bg-error-500"
								/>
							{:else if row.status === 2}
								<Button
									title="Delete"
									on:click={() => delHandler(row.id)}
									cssClass="bg-error-500"
								/>
							{:else}
								<Button
									title="View"
									on:click={() => actionHandler(row.id, 'view')}
									cssClass="bg-warning-500 mr-4"
								/>

								{#if row.traceCount > 0}
									<Button
										title="Trace"
										on:click={() => traceHandler(row.id)}
										cssClass="bg-secondary-500"
									/>
								{/if}
							{/if}
						</td>
					</tr>
				{/each}
			</tbody>
			<tfoot>
				<tr>
					<th colspan="2">Total: {total}</th>
					<td colspan="3">
						{#if total > LIMIT_MAX}
							<Paginator
								bind:settings={paginationSettings}
								showNumerals
								maxNumerals={1}
								showFirstLastButtons={true}
								showPreviousNextButtons={true}
								on:page={onPageChange}
							/>
						{/if}
					</td>
				</tr>
			</tfoot>
		</table>
	{:else}
		<div class="w-full text-center text-2xl my-8 text-white">
			There is no flow, please create it.
		</div>
	{/if}
</div>
