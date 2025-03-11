<script>
	import { SongStore } from '../stores-folder/store.js';
	import { FetchingStore } from '../stores-folder/fetchingStore.js';
	import { fetchSongs } from '../hooks/fetchSongs.js';

	const handleDeleteForm = async () => {
		FetchingStore.set(true);

		let songNameInput = document.getElementById('d-song-name-input').value;
		let artistNameInput = document.getElementById('d-artist-name-input').value;

		if (songNameInput.trim().length === 0 || artistNameInput.trim().length === 0) {
			return;
		}

		let body = {
			event: {
				data: {
					songName: songNameInput,
					artistName: artistNameInput,
					type: 'SongDeleted'
				}
			}
		};

		// Sending the SongDeleted event to the query service
		let sentEvent = await fetch('http://localhost:4005/api/events', {
			method: 'DELETE',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			},
			body: JSON.stringify(body)
		});

		await fetchSongs();
		FetchingStore.set(false);
	};
</script>

<!-- Delete Song Modal Component -->
<div
	class="modal fade"
	id="deleteSongModal"
	tabindex="-1"
	aria-labelledby="deleteSongModalLabel"
	aria-hidden="true"
>
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<h1 class="modal-title fs-5" id="deleteSongModalLabel">Delete a song</h1>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
			</div>
			<div class="modal-body">
				<div class="input-group mb-3">
					<span class="input-group-text" id="d-song-name-icon">
						<i class="bi bi-music-player-fill"></i>
					</span>
					<div class="form-floating">
						<input
							type="text"
							class="form-control"
							id="d-song-name-input"
							placeholder="Song name"
							aria-label="Song name"
							aria-describedby="d-song-name-input"
							required
						/>
						<label for="d-song-name-input">Song name</label>
					</div>
				</div>
				<div class="input-group mb-3">
					<span class="input-group-text" id="d-artist-name-icon">
						<i class="bi bi-rocket-takeoff-fill"></i>
					</span>
					<div class="form-floating">
						<input
							type="text"
							class="form-control"
							id="d-artist-name-input"
							placeholder="Artist name"
							aria-label="Song name"
							aria-describedby="d-artist-name-input"
							required
						/>
						<label for="d-artist-name-input">Artist name</label>
					</div>
				</div>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
				<button
					type="button"
					class="btn btn-primary"
					data-bs-dismiss="modal"
					on:click={handleDeleteForm}>Save changes</button
				>
			</div>
		</div>
	</div>
</div>
