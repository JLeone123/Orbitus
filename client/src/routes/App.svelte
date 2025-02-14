<script>
	import { Navbar, SongListComponent, QueryForm } from './Components/index.js';
</script>

<Navbar />
<div class="container mt-3 main-layout">
	<div class="row g-3">
		<div class="col-4 query-form-container d-flex justify-content-center">
			<QueryForm />
		</div>

		<!-- <div class="col-8 mx-auto d-flex justify-content-center"> -->
		<div class="col-8">
			<SongListComponent />
		</div>
	</div>
</div>
