<script>
  import AddSongComponent from "./AddSongComponent.svelte";
  import DeleteSongComponent from "./DeleteSongComponent.svelte";
	import UpdateSongComponent from "./UpdateSongComponent.svelte";
  import AddPlaylistModeModal from "./AddPlaylistModeModal.svelte";
  import { generateModeId } from "./createModeId.js";

  import { ModeStore } from "./modeStore.js";
  import { SongStore } from "./store.js";
  import { onMount } from 'svelte';

  let modeList = [];

  onMount(async () => {
        // Send a GET request to the mode service to
        // get a list of all the modes in the modes database

        // query service endpoint to get all songs
        const res = await fetch('http://localhost:4003/readAllModes', {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
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
    });


    ModeStore.subscribe((_modeList) => {
        modeList = _modeList;
    });

    const getPlaylistMode = async (event) => {
      let modeName = event.target.text;

      let res = await fetch(`http://localhost:4003/readModeByName/${modeName}`, {
        method: 'GET',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
      });

      // error handling here

      let resJson = await res.json();
      let foundMode = resJson['foundMode'][0];
      
      let positivity = Number(foundMode['positivity']);
      let energy = Number(foundMode['energy']);
      let rhythm = Number(foundMode['rhythm']);
      let liveliness = Number(foundMode['liveliness']);

      let positivitySign = foundMode['positivity_sign'];
      let energySign = foundMode['energy_sign'];
      let rhythmSign = foundMode['rhythm_sign'];
      let livelinessSign = foundMode['liveliness_sign'];

      let queryUrl = `http://localhost:4002/getSongsByMode` +
                    `/${positivity}/${energy}/${rhythm}/${liveliness}` +
                    `/${positivitySign}/${energySign}/${rhythmSign}/${livelinessSign}`;

      // make request here
      let resTwo = await fetch(queryUrl, {
        method: 'GET',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
      });

      let resTwoJson = await resTwo.json();

      // then update SongStore
      SongStore.update(_songs => {
        let div = document.getElementById('default-header');
        let possibleExistingHeader = document.getElementById('possible-existing-header');

        if (possibleExistingHeader !== null) {
          div.removeChild(possibleExistingHeader);
        }

        if (resTwoJson['foundSongs'].length === 0) {
          let h1 = document.createElement('h1');
          h1.setAttribute('id', 'possible-existing-header');
          
          let content = document.createTextNode('There are no songs that meet the specified criteria!');
          h1.appendChild(content);
          div.appendChild(h1);
        }

        return resTwoJson['foundSongs'];
      });

    }
</script>

  <nav class="navbar navbar-expand-lg sticky-top bg-body-tertiary">
    <div class="container-fluid">
      <a class="navbar-brand dawning-of-a-new-day-regular" href="#/">Orbitus</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNavDropdown">
        <ul class="navbar-nav">
          <li class="nav-item">
            <a class="nav-link" aria-current="page" href="#/" data-bs-toggle="modal" data-bs-target="#addSongModal">Add Song</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" aria-current="page" href="#/" data-bs-toggle="modal" data-bs-target="#updateSongModal">Update Song</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" aria-current="page" href="#/" data-bs-toggle="modal" data-bs-target="#deleteSongModal">Delete Song</a>
          </li>
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle dropdown-menu-button" href="#/" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              Playlist Modes
            </a>
            <ul class="dropdown-menu">
              {#each modeList as mode (mode['id'])}
                <li>
                  <a class="dropdown-item" id="mode-{generateModeId(mode['name'])}" href="#/" on:click={getPlaylistMode}>{mode['name']}</a>
                </li>
              {/each}
              
              <!-- Add playlist mode, delete playlist mode -->
              <li><hr class="dropdown-divider"></li>
              <li>
                <a class="dropdown-item" id="add-playlist-mode" href="#/"
                   data-bs-toggle="modal" data-bs-target="#addPlaylistModeModal">Add playlist mode</a>
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
<AddPlaylistModeModal />

  <style>
    a:hover, a.dropdown-menu-button:hover, a.dropdown-item:hover {
        color: rgb(230, 230, 230);
    }

    a.dropdown-item {
        /* color: rgba(var(--bs-link-color-rgb), var(--bs-link-opacity, 1)); */
        color: rgba(255,255,255 , 0.65);
    }

    .dawning-of-a-new-day-regular {
      font-family: "Dawning of a New Day", cursive;
      font-weight: 800;
      font-style: normal;
      font-size: 32px;
      margin-left: 10px;
    }


  </style>