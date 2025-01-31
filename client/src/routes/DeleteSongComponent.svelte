<script>
	import { SongStore } from './store.js';

	const handleDeleteForm = async () => {
		let songNameInput = document.getElementById('d-song-name-input').value;
		let artistNameInput = document.getElementById('d-artist-name-input').value;

		if (songNameInput.trim().length === 0 || artistNameInput.trim().length === 0) {
			return;
		}

		let eventType = 'SongDeleted';

		let body = {
			songName: songNameInput,
			artistName: artistNameInput,
			eventType
		};

		// Sending the event to the query mode
		let sentEvent = await fetch('http://localhost:4002/api/song', {
			method: 'DELETE',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			},
			body: JSON.stringify(body)
		});

		console.log('Success');
		return;

		// Sending the event to the event-bus

		// Define event object to send to the event-bus
		let event = {
			event: {
				data: {
					songName: songNameInput,
					artistName: artistNameInput
				},
				type: 'SongDeleted'
			}
		};

		// Send 'SongDeleted event to the event-bus'
		let sentEventClient = await fetch('http://localhost:4005/events', {
			method: 'DELETE',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			},
			body: JSON.stringify(event)
		});

		// Can do client-side error handling here
		let sentEventClientJson = await sentEventClient.json();

		if (sentEventClientJson === undefined) {
			console.log('ISE: The song could not be deleted in the database');
			return;
		}

		if (
			sentEventClientJson.hasOwnProperty('msg') &&
			sentEventClientJson['msg'] === 'The song with ID undefined was not found in the database'
		) {
			console.log('404: The song was not found in the database');
			return;
		}

		if (
			sentEventClientJson.hasOwnProperty('msg') &&
			sentEventClientJson['msg'] === 'The Event Bus did not receive a response from port 4002'
		) {
			console.log('500: ISE - The song could not be deleted due to an internal service error');
			return;
		}

		// if deleting the song is successful,
		// then update the SongStore to re-render client

		// query service endpoint to get all songs
		let allSongs = await fetch('http://localhost:4002/allSongs', {
			method: 'GET',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			}
		});

		// Get list of all of the songs
		// with their image and mp3 file paths
		// by parsing the JSON response
		const allSongsData = await allSongs.json();

		// If allSongsData is undefined, then
		// do not update the store to maintain data
		// integrity

		// If allSongsData is defined, then update
		// the SongStore to maintain data integrity

		if (allSongsData !== undefined) {
			let index = -1;

			SongStore.update((_songs) => {
				let songStore = _songs;
				let sn = document.getElementById('d-song-name-input').value;
				let an = document.getElementById('d-artist-name-input').value;

				songStore.forEach((s, i) => {
					if (s['song_name'] === sn && s['artist_name'] === an) {
						index = i;
					}
				});

				songStore.splice(index, 1);
				return songStore;
			});
		}

		document.getElementById('d-song-name-input').value = '';
		document.getElementById('d-artist-name-input').value = '';
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
