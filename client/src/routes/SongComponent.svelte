<script>
    export let song = [];
    export let songImage = 'cozy-concert-and-microphone-2-pixabey.jpeg';

    // If the MP3 File is not stored locally, then
    // use the default MP3 file that for now is
    // 'Early Hours' by 'Justin Lee'
    export let songMp3 = 'stored_songs/indie/early-hours-justin-lee-main-version-21967-01-54.mp3';

    // import object stores
    import { imageStore } from './images.js';
    import { mp3Store } from './songs.js';

    // import module to get correct file locations
    // can change this or remove it if migrating
    // binary files to Amazon S3
    import { getFilePaths } from "./updateFilePaths.js";

    let id = `${song['song_name']}-${song['artist_name']}`;
    id = id.trim().split(' ').join('').toLowerCase();
    
    // let updatedFilePaths = getFilePaths(song, songImage, songMp3, imageStore, mp3Store);
    // let imageName = updatedFilePaths[0][0];
    // let mp3File = updatedFilePaths[1][1];

    let updatedFilePaths;
    let imageName;
    let mp3File;

    // Need reactive block here to update the image and mp3 file paths for any updated songs
    // to properly re-render the screen.
    $: {
        song = song;
        updatedFilePaths = getFilePaths(song, songImage, songMp3, imageStore, mp3Store);
        imageName = updatedFilePaths[0][0];
        mp3File = updatedFilePaths[1][1];
    }

    
    let playingSong = new Audio(mp3File);

    $: {
        mp3File = mp3File;
        playingSong = new Audio(mp3File);
    }

    const togglePlay = () => {
        let a = document.getElementById(`${id}-tag`);
        let isPlaying = a.getAttribute('is-playing');
        let isPlayingBoolean = false;
        
        if (isPlaying === "false") {
            isPlayingBoolean = false;
        } else {
            isPlayingBoolean = true;
        }

        if (!isPlayingBoolean) {
            playingSong.play();
        } else {
            playingSong.pause();;
        }
        
        a.setAttribute('is-playing', !isPlayingBoolean);
        return;
    }
</script>
    <div class="row">
        <div class="col-4">
            <a id={`${id}-tag`} href="#/" is-playing=false on:click={togglePlay}>
                <img src={imageStore[`${imageName}`]} fetchPriority = "high" {id} alt='song image for the song {song['song_name']}'>
            </a>
        </div>
        <div class="col-8">
            <p>"{song['song_name']}" by {song['artist_name']} ({song['genre']})</p>
            <p class="characteristics-text">Characteristics</p>
            <ul>
                <li>Positivity: {song['positivity']}</li>
                <li>Energy: {song['energy']}</li>
                <li>Rhythm: {song['rhythm']}</li>
                <li>Liveliness: {song['liveliness']}</li>
            </ul>
        </div>
    </div>

<style>
    img {
        width: 150px;
        height: auto;
        border-radius: 8%;
    }

    img:hover {
        transform: translateY(-3px);
        animation-name: move;
        animation-duration: 0.25s;
        box-shadow: 5px 5px 5px rgb(28, 28, 28);
    }

    @keyframes move {
        0% {
            transform: translateY(0px);
        }

        100% {
            translate: translateY(-3px);
        }
    }

    img:not(hover) {
        transform: translateY(3px);
        animation-name: leave;
        animation-duration: 0.25s;
    }

    @keyframes leave {
        0% {
            transform: translateY(-3px);
        }

        100% {
            translate: translateY(0px);
        } 
    }

    .characteristics-text {
        margin: 0;
    }
</style>