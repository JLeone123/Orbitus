<script>
	import { Navbar, SongListComponent, QueryForm } from './Components/index.js';
	import { onMount } from 'svelte';
	let innerWidth = 0;

	onMount(() => {
		innerWidth = window.innerWidth;
	});
</script>

<svelte:window bind:innerWidth />

<Navbar />
<div class={`container mt-3 main-layout ${innerWidth ? 'ready' : ''}`}>
	{#if innerWidth > 1000}
		<div class="row g-3 main-layout-row">
			<div class="col-4 query-form-section d-flex justify-content-center">
				<QueryForm position={'position-fixed'} />
			</div>

			<!-- <div class="col-8 mx-auto d-flex justify-content-center"> -->
			<div class="col-8">
				<SongListComponent />
			</div>
		</div>
	{:else}
		<div class="row main-layout-row">
			<div class="col query-form-section d-flex justify-content-center">
				<QueryForm position={'position-static'} />
			</div>
		</div>
		<div class="row">
			<div class="col">
				<SongListComponent />
			</div>
		</div>
	{/if}
</div>

<style>
	.container {
		visibility: hidden;
	}

	.ready {
		visibility: visible;
	}
</style>
