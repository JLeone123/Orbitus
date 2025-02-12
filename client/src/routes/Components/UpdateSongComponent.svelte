<script>
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

	const handleUpdateForm = async () => {
		let genre = document.getElementById('u-genre-input').value;
		if (genre !== 'Choose genre...') {
			genre = genre.slice(2);
		} else {
			console.log('The genre provided is not a supported type');
			return;
		}

		const formData = new FormData();
		formData.append('genre', genre);
		formData.append('songName', document.getElementById('u-song-name-input').value);
		formData.append('artistName', document.getElementById('u-artist-name-input').value);
		formData.append('positivity', document.getElementById('u-song-positivity-score').value);
		formData.append('energy', document.getElementById('u-song-energy-score').value);
		formData.append('rhythm', document.getElementById('u-song-rhythm-score').value);
		formData.append('liveliness', document.getElementById('u-song-liveliness-score').value);
		formData.append('mp3Audio', mp3Audio);
		formData.append('songCover', songCover);
		formData.append('eventType', 'SongCreated');

		let res = await fetch('http://localhost:4002/api/song', {
			method: 'PUT',
			mode: 'cors',
			body: formData
		});

		let resJson = await res.json();

		document.getElementById('u-genre-input').value = '';
		document.getElementById('u-song-name-input').value = '';
		document.getElementById('u-artist-name-input').value = '';
		document.getElementById('u-mp3-audio-input').value = '';
		document.getElementById('u-song-cover-input').value = '';
		document.getElementById('u-song-positivity-score').value = '';
		document.getElementById('u-song-energy-score').value = '';
		document.getElementById('u-song-rhythm-score').value = '';
		document.getElementById('u-song-liveliness-score').value = '';
	};
</script>

<!-- Update Song Modal Component -->

<div
	class="modal fade"
	id="updateSongModal"
	tabindex="-1"
	aria-labelledby="updateSongModalLabel"
	aria-hidden="true"
>
	<div class="modal-dialog modal-lg">
		<div class="modal-content">
			<div class="modal-header">
				<h1 class="modal-title fs-5" id="updateSongModalLabel">Update a song</h1>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
			</div>
			<div class="modal-body">
				<div class="input-group mb-3">
					<label class="input-group-text" for="u-genre-input">
						<i class="bi bi-disc-fill"></i>
					</label>
					<select class="form-select" id="u-genre-input">
						<option selected>Choose genre...</option>
						<option value="u-indie">Indie</option>
						<option value="u-folk">Folk</option>
						<option value="u-country">Country</option>
						<option value="u-classical">Classical</option>
						<option value="u-rock">Rock</option>
						<option value="u-chillhop / lofi">Chillhop / Lofi</option>
						<option value="u-punk">Punk</option>
					</select>
				</div>
				<!-- Song Metadata -->
				<div class="row g-2">
					<div class="col-md">
						<div class="input-group mb-3">
							<span class="input-group-text" id="u-song-name-icon">
								<i class="bi bi-music-player-fill"></i>
							</span>
							<div class="form-floating">
								<input
									type="text"
									class="form-control"
									id="u-song-name-input"
									placeholder="Song name"
									aria-label="Song name"
									aria-describedby="u-song-name-icon"
									required
								/>
								<label for="u-song-name-input">Song name</label>
							</div>
						</div>
					</div>
					<div class="col-md">
						<div class="input-group mb-3">
							<span class="input-group-text" id="u-artist-name-icon">
								<i class="bi bi-rocket-takeoff-fill"></i>
							</span>
							<div class="form-floating">
								<input
									type="text"
									class="form-control"
									id="u-artist-name-input"
									placeholder="Artist name"
									aria-label="Artist name"
									aria-describedby="u-artist-name-icon"
									required
								/>
								<label for="u-artist-name-input">Artist name</label>
							</div>
						</div>
					</div>
				</div>

				<hr />

				<!-- Song characteristics -->
				<div class="row g-2">
					<div class="col-md">
						<div class="input-group mb-3">
							<span class="input-group-text" id="u-song-positivity-score-icon">
								<i class="bi bi-sun-fill"></i>
							</span>
							<div class="form-floating">
								<input
									type="text"
									class="form-control"
									id="u-song-positivity-score"
									placeholder="Positivity"
									aria-label="Positivity"
									aria-describedby="u-song-positivity-score"
									required
								/>
								<label for="u-song-positivity-score">Positivity</label>
							</div>
						</div>
					</div>
					<div class="col-md">
						<div class="input-group mb-3">
							<span class="input-group-text" id="u-song-energy-score-icon">
								<i class="bi bi-lightning-charge-fill"></i>
							</span>
							<div class="form-floating">
								<input
									type="text"
									class="form-control"
									id="u-song-energy-score"
									placeholder="Energy"
									aria-label="Energy"
									aria-describedby="u-song-energy-score"
									required
								/>
								<label for="u-song-energy-score">Energy</label>
							</div>
						</div>
					</div>
				</div>

				<div class="row g-2">
					<div class="col-md">
						<div class="input-group mb-3">
							<span class="input-group-text" id="u-song-rhythm-score-icon">
								<i class="bi bi-fire"></i>
							</span>
							<div class="form-floating">
								<input
									type="text"
									class="form-control"
									id="u-song-rhythm-score"
									placeholder="Rhythm"
									aria-label="Rhythm"
									aria-describedby="u-song-rhythm-score"
									required
								/>
								<label for="u-song-rhythm-score">Rhythm</label>
							</div>
						</div>
					</div>
					<div class="col-md">
						<div class="input-group mb-3">
							<span class="input-group-text" id="u-song-liveliness-score-icon">
								<i class="bi bi-speaker"></i>
							</span>
							<div class="form-floating">
								<input
									type="text"
									class="form-control"
									id="u-song-liveliness-score"
									placeholder="liveliness"
									aria-label="liveliness"
									aria-describedby="u-song-liveliness-score"
									required
								/>
								<label for="u-song-liveliness-score">Liveliness</label>
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
								id="u-mp3-audio-input"
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
								id="u-song-cover-input"
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
					on:click={handleUpdateForm}>Save changes</button
				>
			</div>
		</div>
	</div>
</div>
