<script>
    import { SongStore } from "./store.js";
    
    let songPositivityScore = 50.00;
    let songEnergyScore = 50.00;
    let songRhythmScore = 50.00;
    let songLivelinessScore = 50.00;
    
    const updateRangeValue = (event) => {
        let elementId = event.target.id;
        let rangeValue = event.target.value;

        switch (elementId) {
            case 'positivityRange':
                songPositivityScore = rangeValue;
                break;
            case 'energyRange':
                songEnergyScore = rangeValue;
                break;
            case 'rhythmRange':
                songRhythmScore = rangeValue;
                break;
            case 'livelinessRange':
                songLivelinessScore = rangeValue;
                break;
        }
    }

    const generatePlaylist = async () => {
      let genre = document.getElementById('genre-select').value;

      let positivityRange = Number(document.getElementById('positivityRange').value);
      let energyRange = Number(document.getElementById('energyRange').value);
      let rhythmRange = Number(document.getElementById('rhythmRange').value);
      let livelinessRange = Number(document.getElementById('livelinessRange').value);

      if (genre !== 'Select Genre' && genre !== 'indie' && 
          genre !=='folk' && genre !== 'country' && genre !== 'classical') {
            console.log('The genre input provided is not one of the supported types');
            return;
      }

      if (positivityRange === undefined || energyRange === undefined ||
          rhythmRange === undefined || livelinessRange === undefined) {
            console.log('The positivityRange, energyRange, rhythmRange, or livelinessRange is undefined');
            return;
      }

      if (typeof positivityRange !== "number" || typeof energyRange !== "number" ||
          typeof rhythmRange !== "number" || typeof livelinessRange !== "number") {
            console.log('The positivityRange, energyRange, rhythmRange, or livelinessRange is not a number');
            return;
      }
      
      if (positivityRange < 0 || positivityRange > 100 || 
          energyRange < 0 || energyRange > 100 ||
          rhythmRange < 0 || rhythmRange > 100 ||
          livelinessRange < 0 || livelinessRange > 100) {
            console.log('The positivityRange, energyRange, rhythmRange, or livelinessRange is not in the range 0-100');
            return;
      }

      let url = '';

      if (genre === "Select Genre") {
        url = `http://localhost:4002/getSongsByCharacteristics/${positivityRange}/${energyRange}/${rhythmRange}/${livelinessRange}`;
      } 
      
      if (genre === "indie" || genre === "folk" || genre === "country" || genre === "classical") {
        url = `http://localhost:4002/getSongsByCharacteristicsAndGenre/${genre}/${positivityRange}/${energyRange}/${rhythmRange}/${livelinessRange}`;
      }

      let res = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });
      
      let resJson = await res.json();
      let foundSongs = [];

      if (resJson === undefined || resJson['foundSongs'] === undefined) {
        console.log('The server could not generate a foundSongs playlist right now');
        foundSongs = [];
      } 
      
      else if (resJson.hasOwnProperty('msg') && 
               resJson['msg'] === 'The query service could not return the requested foundSongs playlist right now') {
        
        console.log('500: The query service could not return the requested foundSongs playlist right now');
        foundSongs = [];
      } 
      
      else if (res.json.hasOwnProperty('msg') && 
               resJson['msg'] === 'There are no songs that meet the criteria for the foundSongs playlist') {
            
            console.log('There are no songs that meet the criteria for the foundSongs playlist');
            foundSongs = [];
      }
      
      else {
        foundSongs = resJson['foundSongs'];
      }

      SongStore.update(_songs => {
        let div = document.getElementById('default-header');
        let possibleExistingHeader = document.getElementById('possible-existing-header');

        if (possibleExistingHeader !== null) {
          div.removeChild(possibleExistingHeader);
        }
          
        if (foundSongs.length === 0) {
          let div = document.getElementById('default-header');
          let h1 = document.createElement('h1');
          h1.setAttribute('id', 'possible-existing-header');
          
          let content = document.createTextNode('There are no songs that meet the specified criteria!');
          h1.appendChild(content);
          div.appendChild(h1);
        }
        return foundSongs;
      });

      // add default text header
      // make second endpoint to handle genre
    }

    $: songPositivityScore = songPositivityScore;
    $: songEnergyScore = songEnergyScore;
    $: songRhythmScore = songRhythmScore;
    $: songLivelinessScore = songLivelinessScore;
</script>

<form>
    <fieldset>
      <legend>Generate Playlist</legend>
      <select id="genre-select" class="form-select form-select-lg mb-3" aria-label="Large select example">
        <option selected>Select Genre</option>
        <option value="indie">Indie</option>
        <option value="folk">Folk</option>
        <option value="country">Country</option>
        <option value="classical">Classical</option>
      </select>
      <div class="mb-3">
        <label for="positivityRange" class="form-label">Positivity: {songPositivityScore}</label>
        <input type="range" class="form-range" step="0.25" min="0" max="100" id="positivityRange" on:input={updateRangeValue} required>
      </div>
      <div class="mb-3">
        <label for="energyRange" class="form-label">Energy: {songEnergyScore}</label>
        <input type="range" class="form-range" step="0.25" min="0" max="100" id="energyRange" on:input={updateRangeValue} required>
      </div>
      <div class="mb-3">
        <label for="rhythmRange" class="form-label">Rhythm: {songRhythmScore}</label>
        <input type="range" class="form-range" step="0.25" min="0" max="100" id="rhythmRange" on:input={updateRangeValue} required>
      </div>
      <div class="mb-3">
        <label for="livelinessRange" class="form-label">Liveliness: {songLivelinessScore}</label>
        <input type="range" class="form-range" step="0.25" min="0" max="100" id="livelinessRange" on:input={updateRangeValue} required>
      </div>
      <div class="mb-3">
        <button type="submit" class="btn btn-primary" on:click={generatePlaylist}>Submit</button>
      </div>
    </fieldset>
  </form>