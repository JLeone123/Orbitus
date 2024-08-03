<script>
    import SongComponent from "./SongComponent.svelte";
    import { onMount } from 'svelte';
    import { SongStore } from './store.js';

    export let songList = [];

    onMount(async () => {
        // Send a GET request to the query service to
        // get a list of all the songs in the database
        // with their image and mp3 file paths

        // query service endpoint to get all songs
        const res = await fetch('http://localhost:4002/allSongs', {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        });

        // Get list of all of the songs
        // with their image and mp3 file paths
        // by parsing the JSON response
        const data = await res.json();

        if (data === undefined) {
            SongStore.set([]);
        } else {
            SongStore.set(data['songs']);
        }
    });


    SongStore.subscribe((_songList) => {
        songList = _songList;
    });
</script>

<div class="row">
    <div class="col-12" id="default-header">
        <ul>
            {#each songList as song (song['id'])}
                <!-- If the song is the last song in the playlist, 
                    then do not include the horizontal linebreak -->
                {#if songList.indexOf(song) === songList.length - 1}
                    <div class="row">
                        <div class="col-12">
                            <li class="mt-1 mb-1">
                                <SongComponent song={song} 
                                songImage={song['image_art'] !== "" 
                                ? song['image_art'] 
                                : "cozy-concert-and-microphone-2-pixabey.jpeg"}
                                songMp3={song['mp3_file'] !== "" 
                                ? song['mp3_file'] 
                                : "stored_songs/indie/early-hours-justin-lee-main-version-21967-01-54.mp3"}/>
                            </li>
                        </div>
                    </div>
                {:else }
                    <div class="row">
                        <div class="col-12">
                            <li class="mt-1 mb-1">
                                <SongComponent song={song} 
                                songImage={song['image_art'] !== "" 
                                ? song['image_art'] 
                                : "cozy-concert-and-microphone-2-pixabey.jpeg"}
                                songMp3={song['mp3_file'] !== "" 
                                ? song['mp3_file'] 
                                : "stored_songs/indie/early-hours-justin-lee-main-version-21967-01-54.mp3"}/>
                                <hr />
                            </li>
                        </div>
                    </div>
                {/if}
            {/each}
        </ul>
    </div>
</div>


<style>
    ul {
        list-style: none;
    }
</style>