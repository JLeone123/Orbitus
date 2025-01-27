<script>
	import Navbar from './Navbar.svelte';
	import SongListComponent from './SongListComponent.svelte';
	import QueryForm from './QueryForm.svelte';
</script>

<Navbar />
<div class="container mt-3">
	<div class="row">
		<div class="col-4 query-form position-relative">
			<QueryForm />
		</div>

		<div class="col-8 mx-auto d-flex justify-content-center">
			<SongListComponent />
		</div>
	</div>
</div>
