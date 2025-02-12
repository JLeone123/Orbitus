<script>
	import axios from 'axios';
	import { SongStore } from '../stores-folder/store.js';
	import { Mp3Store } from '../stores-folder/mp3Store.js';
	import { SongCoverStore } from '../stores-folder/songCoverStore.js';

	let mp3Audio = new File([], '');
	let songCover = new File([], '');

	Mp3Store.subscribe((_mp3) => {
		mp3Audio = _mp3;
	});

	SongCoverStore.subscribe((_songCover) => {
		songCover = _songCover;
	});

	const selectMp3Audio = (e) => {
		let mp3 = e.target.files[0];
		Mp3Store.set(mp3);
	};

	const selectSongCover = (e) => {
		let selectedSongCoverArt = e.target.files[0];
		SongCoverStore.set(selectedSongCoverArt);
	};

	const handleAddForm = async () => {
		let genre = document.getElementById('a-genre-input').value;

		// For the genre input, trim the first two characters off of the input
		// I named the genre inputs in the form of a-"genre" to avoid matching
		// values and types of other input tags - just a precaution but probably
		// one that I do not need to take.

		// If the genre is not a supported type, then do not submit
		// the form and just return.
		if (genre !== 'Choose genre...') {
			genre = genre.slice(2);
		} else {
			console.log('The genre provided is not a supported type');
			return;
		}

		const formData = new FormData();
		formData.append('genre', genre);
		formData.append('songName', document.getElementById('a-song-name-input').value);
		formData.append('artistName', document.getElementById('a-artist-name-input').value);
		formData.append('positivity', document.getElementById('a-song-positivity-score').value);
		formData.append('energy', document.getElementById('a-song-energy-score').value);
		formData.append('rhythm', document.getElementById('a-song-rhythm-score').value);
		formData.append('liveliness', document.getElementById('a-song-liveliness-score').value);
		formData.append('mp3Audio', mp3Audio);
		formData.append('songCover', songCover);
		formData.append('eventType', 'SongCreated');

		let res = await fetch('http://localhost:4002/api/song', {
			method: 'POST',
			mode: 'cors',
			body: formData
		});

		document.getElementById('a-genre-input').value = '';
		document.getElementById('a-song-name-input').value = '';
		document.getElementById('a-artist-name-input').value = '';
		document.getElementById('a-mp3-audio-input').value = '';
		document.getElementById('a-song-cover-input').value = '';
		document.getElementById('a-song-positivity-score').value = '';
		document.getElementById('a-song-energy-score').value = '';
		document.getElementById('a-song-rhythm-score').value = '';
		document.getElementById('a-song-liveliness-score').value = '';
	};
</script>

<!-- Add Song Modal Component -->

<div
	class="modal fade"
	id="addSongModal"
	tabindex="-1"
	aria-labelledby="addSongModalLabel"
	aria-hidden="true"
>
	<div class="modal-dialog modal-lg">
		<div class="modal-content">
			<div class="modal-header">
				<h1 class="modal-title fs-5" id="addSongModalLabel">Add a song</h1>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
			</div>
			<div class="modal-body">
				<div class="input-group mb-3">
					<label class="input-group-text" for="a-genre-input">
						<i class="bi bi-disc-fill"></i>
					</label>
					<select class="form-select" id="a-genre-input">
						<option selected>Choose genre...</option>
						<option value="a-indie">Indie</option>
						<option value="a-folk">Folk</option>
						<option value="a-country">Country</option>
						<option value="a-classical">Classical</option>
						<option value="a-rock">Rock</option>
						<option value="a-chillhop / lofi">Chillhop / Lofi</option>
						<option value="a-punk">Punk</option>
					</select>
				</div>
				<!-- Song Metadata -->
				<div class="row g-2">
					<div class="col-md">
						<div class="input-group mb-3">
							<span class="input-group-text" id="a-song-name-icon">
								<i class="bi bi-music-player-fill"></i>
							</span>
							<div class="form-floating">
								<input
									type="text"
									class="form-control"
									id="a-song-name-input"
									placeholder="Song name"
									aria-label="Song name"
									aria-describedby="a-song-name-icon"
									required
								/>
								<label for="a-song-name-input">Song name</label>
							</div>
						</div>
					</div>
					<div class="col-md">
						<div class="input-group mb-3">
							<span class="input-group-text" id="a-artist-name-icon">
								<i class="bi bi-rocket-takeoff-fill"></i>
							</span>
							<div class="form-floating">
								<input
									type="text"
									class="form-control"
									id="a-artist-name-input"
									placeholder="Artist name"
									aria-label="Artist name"
									aria-describedby="a-artist-name-icon"
									required
								/>
								<label for="a-artist-name-input">Artist name</label>
							</div>
						</div>
					</div>
				</div>

				<hr />

				<!-- Song characteristics -->
				<div class="row g-2">
					<div class="col-md">
						<div class="input-group mb-3">
							<span class="input-group-text" id="a-song-positivity-score-icon">
								<i class="bi bi-sun-fill"></i>
							</span>
							<div class="form-floating">
								<input
									type="text"
									class="form-control"
									id="a-song-positivity-score"
									placeholder="Positivity"
									aria-label="Positivity"
									aria-describedby="a-song-positivity-score"
									required
								/>
								<label for="a-song-positivity-score">Positivity</label>
							</div>
						</div>
					</div>
					<div class="col-md">
						<div class="input-group mb-3">
							<span class="input-group-text" id="a-song-energy-score-icon">
								<i class="bi bi-lightning-charge-fill"></i>
							</span>
							<div class="form-floating">
								<input
									type="text"
									class="form-control"
									id="a-song-energy-score"
									placeholder="Energy"
									aria-label="Energy"
									aria-describedby="a-song-energy-score"
									required
								/>
								<label for="a-song-energy-score">Energy</label>
							</div>
						</div>
					</div>
				</div>

				<div class="row g-2">
					<div class="col-md">
						<div class="input-group mb-3">
							<span class="input-group-text" id="a-song-rhythm-score-icon">
								<i class="bi bi-fire"></i>
							</span>
							<div class="form-floating">
								<input
									type="text"
									class="form-control"
									id="a-song-rhythm-score"
									placeholder="Rhythm"
									aria-label="Rhythm"
									aria-describedby="a-song-rhythm-score"
									required
								/>
								<label for="a-song-rhythm-score">Rhythm</label>
							</div>
						</div>
					</div>
					<div class="col-md">
						<div class="input-group mb-3">
							<span class="input-group-text" id="a-song-liveliness-score-icon">
								<i class="bi bi-speaker"></i>
							</span>
							<div class="form-floating">
								<input
									type="text"
									class="form-control"
									id="a-song-liveliness-score"
									placeholder="liveliness"
									aria-label="liveliness"
									aria-describedby="a-song-liveliness-score"
									required
								/>
								<label for="a-song-liveliness-score">Liveliness</label>
							</div>
						</div>
					</div>
				</div>

				<hr />

				<div class="row g-2">
					<div class="col-md">
						<div class="mb-3">
							<label for="formFile" class="form-label">Upload MP3 audio</label>
							<input
								on:change={selectMp3Audio}
								class="form-control"
								type="file"
								accept="audio/*"
								id="a-mp3-audio-input"
							/>
						</div>
					</div>
					<div class="col-md">
						<div class="mb-3">
							<label for="formFile" class="form-label">Upload Song Cover</label>
							<input
								on:change={selectSongCover}
								class="form-control"
								type="file"
								accept="image/*"
								id="a-song-cover-input"
							/>
						</div>
					</div>
				</div>

				<!-- Modal footer and submit button -->
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
				<button
					type="button"
					class="btn btn-primary"
					data-bs-dismiss="modal"
					on:click={handleAddForm}>Save changes</button
				>
			</div>
		</div>
	</div>
</div>

<style>
</style>
