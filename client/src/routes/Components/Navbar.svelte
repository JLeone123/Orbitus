<script>
	import AddSongComponent from './AddSongComponent.svelte';
	import DeleteSongComponent from './DeleteSongComponent.svelte';
	import UpdateSongComponent from './UpdateSongComponent.svelte';
	import AddPlaylistModeModal from './AddPlaylistModeModal.svelte';
	import { generateModeId } from '../modules/createModeId.js';

	import { ModeStore } from '../stores-folder/index.js';
	import { SongStore } from '../stores-folder/store.js';
	import { onMount } from 'svelte';

	let modeList = [];
	ModeStore.set([]);

	ModeStore.subscribe((_modeList) => {
		modeList = _modeList;
	});

	onMount(async () => {
		// Send a GET request to the mode service to
		// get a list of all the modes in the modes database
		// modes service endpoint to get all songs
		const res = await fetch('http://localhost:4003/api/modes', {
			method: 'GET',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			}
		});
		let resJson = await res.json();

		// Get list of all of the modes
		// by parsing the JSON response
		if (resJson === undefined) {
			ModeStore.set([]);
		} else {
			ModeStore.set(resJson['modes']);
		}

		// fix reactivity here
		ModeStore.set(resJson);
	});

	const updateSongList = async (e) => {
		let modeName = e.target.text;
		let mode = modeList.find((mode) => mode['name'] === modeName);

		// can add error checking again here
		let positivity = Number(mode['positivity']);
		let energy = Number(mode['energy']);
		let rhythm = Number(mode['rhythm']);
		let liveliness = Number(mode['liveliness']);
		let positivitySign = mode['positivitySign'];
		let energySign = mode['energySign'];
		let rhythmSign = mode['rhythmSign'];
		let livelinessSign = mode['livelinessSign'];
		let eventType = 'ModeGenerated';

		console.log(mode);

		let body = {
			data: {
				modeName,
				positivity,
				energy,
				rhythm,
				liveliness,
				positivitySign,
				energySign,
				rhythmSign,
				livelinessSign,
				eventType
			}
		};

		console.log(body);

		let res = await fetch('http://localhost:4005/events/mode', {
			method: 'POST',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			},
			body: JSON.stringify(body)
		});

		let data = await res.json();
		SongStore.set(data['foundSongs']);
	};

	const deleteMode = async (e, id) => {
		console.log(id);
		e.preventDefault();
		let res = await fetch(`http://localhost:4005/events`, {
			method: 'DELETE',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			},
			body: JSON.stringify({
				event: {
					id: id,
					type: 'ModeDeleted'
				}
			})
		});

		let resJson = await res.json();
		ModeStore.update((_modeList) => {
			let newModeList = _modeList.filter((mode) => mode['id'] !== id);
			return newModeList;
		});
	};

	$: modeList = modeList;
</script>

<nav class="navbar navbar-expand-lg sticky-top bg-body-tertiary">
	<div class="container-fluid">
		<a class="navbar-brand dawning-of-a-new-day-regular" href="#/">Orbitus</a>
		<button
			class="navbar-toggler"
			type="button"
			data-bs-toggle="collapse"
			data-bs-target="#navbarNavDropdown"
			aria-controls="navbarNavDropdown"
			aria-expanded="false"
			aria-label="Toggle navigation"
		>
			<span class="navbar-toggler-icon"></span>
		</button>
		<div class="collapse navbar-collapse" id="navbarNavDropdown">
			<ul class="navbar-nav">
				<li class="nav-item">
					<a
						class="nav-link"
						aria-current="page"
						href="#/"
						data-bs-toggle="modal"
						data-bs-target="#addSongModal">Add Song</a
					>
				</li>
				<li class="nav-item">
					<a
						class="nav-link"
						aria-current="page"
						href="#/"
						data-bs-toggle="modal"
						data-bs-target="#updateSongModal">Update Song</a
					>
				</li>
				<li class="nav-item">
					<a
						class="nav-link"
						aria-current="page"
						href="#/"
						data-bs-toggle="modal"
						data-bs-target="#deleteSongModal">Delete Song</a
					>
				</li>
				<li class="nav-item dropdown">
					<a
						class="nav-link dropdown-toggle dropdown-menu-button"
						href="#/"
						role="button"
						data-bs-toggle="dropdown"
						aria-expanded="false"
					>
						Playlist Modes
					</a>
					<!-- modeList -->
					<ul class="dropdown-menu">
						{#each modeList as mode (mode['id'])}
							<li class="modelist--mode">
								<!-- on:click={getPlaylistMode} -->
								<a
									class="dropdown-item"
									id="mode-{generateModeId(mode['name'])}"
									href="#/"
									on:click={updateSongList}>{mode['name']}</a
								>
								<button class="modelist-mode__button" on:click={(e) => deleteMode(e, mode['id'])}>
									<i class="bi bi-trash modelist-mode__icon"></i>
								</button>
							</li>
						{/each}

						<!-- Add playlist mode, delete playlist mode -->
						<li><hr class="dropdown-divider" /></li>
						<li>
							<a
								class="dropdown-item"
								id="add-playlist-mode"
								href="#/"
								data-bs-toggle="modal"
								data-bs-target="#addPlaylistModeModal">Add playlist mode</a
							>
						</li>
					</ul>
				</li>
			</ul>
		</div>
	</div>
</nav>

<AddSongComponent />
<UpdateSongComponent />
<DeleteSongComponent />
<AddPlaylistModeModal {modeList} />

<style>
	a:hover,
	a.dropdown-menu-button:hover,
	a.dropdown-item:hover,
	.modelist-mode__icon:hover {
		color: rgb(230, 230, 230);
	}

	a.dropdown-item {
		color: rgba(255, 255, 255, 0.65);
	}

	.modelist--mode {
		display: flex;
		color: rgba(255, 255, 255, 0.65);
		align-items: center;
		padding: 0.1rem 1rem 0.25rem 0.25rem;
		cursor: pointer;
	}

	.modelist-mode__button {
		background-color: transparent;
		padding: 0;
		margin: 0;
		border: none;
		color: rgba(255, 255, 255, 0.65);
	}

	.dawning-of-a-new-day-regular {
		font-family: 'Dawning of a New Day', cursive;
		font-weight: 800;
		font-style: normal;
		font-size: 32px;
		margin-left: 10px;
	}
</style>
