<script>
	import { Navbar, SongListComponent, QueryForm } from './Components/index.js';
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
