// checkEvent(e: object, t: string, d: string, r: object): boolean
// checkEvent checks if the event that the event-bus is handling is
// one of the supported types and has valid data.
// e = event object, t = type, d = data, r = Express HTTP response
import { logger } from "./logger.js";

export const checkEvent = (e, t, d, r) => {
     // if the event-type or event-data is undefined,
    // send a 400 status code.
    if (t === undefined || d === undefined) {
        logger.error('EventType Error: The event, event-type, and event-data must be defined');
        r.status(400).send({ msg: 'The event, event-type, and event-data must be defined' });
        return false;
    }
    
    
    if (r === undefined) {
        logger.error('EventType Error: The HTTP response must be passed to the checkEvent function');
        r.status(400).send({ msg: 'The HTTP response must be passed to the checkEvent function'});
        return false;
    }

    console.log(t);
    
    // If the event, event-type, or event-data is not
    // of the types, "object", "string", and "object" respectively,
    // send a 400 status code
    if (typeof e !== "object" || typeof t !== "string" || typeof d !== "object") {
        logger.error('EventType Error: The event, event-type, and event-data must be object types');
        r.status(400).send({ msg: 'The event, event-type, and event-data must be object types'});
        return false;
    }
    
    // If the event type is an empty string,
    // send a 400 status code
    if (t.trim().length === 0) {
        logger.error('EventType Error: The event-type is an empty string');
        r.status(400).send({ msg: 'The event-type is an empty string' });
        return false;
    }
    
    if (t === "ModeCreated") {
        if (d.newModeName === undefined || typeof d.newModeName !== "string" || d.newModeName.trim().length === 0) {
            logger.error('EventType Error: Please provide a newModeName');
            r.status(400).send({ msg: 'Please provide a newModeName'});
            return;
        }
        
        
        if (d.positivityScore === undefined || typeof d.positivityScore !== "number" || 
        d.positivityScore < 0 || d.positivityScore > 100) {
            logger.error('EventType Error: Please provide a positivityScore');
            r.status(400).send({ msg: 'Please provide a positivityScore'});
            return false;
        }
        
        if (d.energyScore === undefined || typeof d.energyScore !== "number" || 
        d.energyScore < 0 || d.energyScore > 100) {
            logger.error('EventType Error: Please provide an energyScore');
            r.status(400).send({ msg: 'Please provide an energyScore'});
            return false;
        }
        
        if (d.rhythmScore === undefined || typeof d.rhythmScore !== "number" || 
        d.rhythmScore < 0 || d.rhythmScore > 100) {
            logger.error('EventType Error: Please provide a rhythmScore');
            r.status(400).send({ msg: 'Please provide a rhythmScore'});
            return false;
        }
        
        if (d.livelinessScore === undefined || typeof d.livelinessScore !== "number" || 
        d.livelinessScore < 0 || d.livelinessScore > 100) {
            logger.error('EventType Error: Please provide a livelinessScore');
            r.status(400).send({ msg: 'Please provide a livelinessScore'});
            return false;
        }
        
        if (d.positivitySign === undefined || typeof d.positivitySign !== "string" || 
        (d.positivitySign !== ">" && d.positivitySign !== ">=" &&
        d.positivitySign !== "<" && d.positivitySign !== "<=")
        ) {
            logger.error('EventType Error: Please provide a valid positivitySign');
            r.status(400).send({ msg: 'Please provide a valid positivitySign'});
            return false;
        }

        console.log(d.energySign);
        
        if (d.energySign === undefined || typeof d.energySign !== "string" || 
            (d.energySign !== '>' && d.energySign !== '>=' &&
             d.energySign !== '<' && d.energySign !== '<=')
            ) {
            logger.error('EventType Error: Please provide a valid energySign');
            r.status(400).send({ msg: 'Please provide a valid energySign'});
            return false;
        }
        
        if (d.rhythmSign === undefined || typeof d.rhythmSign !== "string" || 
        (d.rhythmSign !== ">" && d.rhythmSign !== ">=" &&
        d.rhythmSign !== "<" && d.rhythmSign !== "<=")
        ) {
            logger.error('EventType Error: Please provide a valid rhythmSign');
            r.status(400).send({ msg: 'Please provide a valid rhythmSign'});
            return false;
        }
        
        if (d.livelinessSign === undefined || typeof d.livelinessSign !== "string" || 
        (d.livelinessSign !== ">" && d.livelinessSign !== ">=" &&
        d.livelinessSign !== "<" && d.livelinessSign !== "<=")
        ) {
            logger.error('EventType Error: Please provide a valid livelinessSign');
            r.status(400).send({ msg: 'Please provide a valid livelinessSign'});
            return false;
        }
    }
    
    if (t === "SongDeleted") {
        if (d.songName === undefined || typeof d.songName !== "string" || d.songName.trim().length === 0) {
            logger.error('EventType Error: Please provide a songName');
            r.status(400).send({ msg: 'Please provide a songName'});
            return false;
        }
        
        if (d.artistName === undefined || typeof d.artistName !== "string" || d.artistName.trim().length === 0) {
            logger.error('EventType Error: Please provide an artistName');
            r.status(400).send({ msg: 'Please provide an artistName' });
            return false;
        }
    }
    
    // Error handling for different events later on.
    if (t === "SongCreated" || t === "SongUpdated") {
        if (d.genre === undefined || typeof d.genre !== "string" || d.genre.trim().length === 0){
            logger.error('EventType Error: Please provide a genre');
            r.status(400).send({ msg: 'Please provide a genre' });
            return false;
        }
        
        // genre, songName, artistName, mp3File, positivity, energy, rhythm, liveliness
        if (d.songName === undefined || typeof d.songName !== "string" || d.songName.trim().length === 0) {
            logger.error('EventType Error: Please provide a songName');
            r.status(400).send({ msg: 'Please provide a songName'});
            return false;
        }
        
        if (d.artistName === undefined || typeof d.artistName !== "string" || d.artistName.trim().length === 0) {
            logger.error('EventType Error: Please provide an artistName');
            r.status(400).send({ msg: 'Please provide an artistName' });
            return false;
        }
        
        if (d.mp3File === undefined || typeof d.mp3File !== "string" || d.artistName.trim().length === 0) {
            logger.error('EventType Error: Please provide an mp3 file');
            r.status(400).send({ msg: 'Please provide an mp3 file'});
            return false;
        }
        
        if (d.imageArt === undefined || typeof d.imageArt !== "string" || d.imageArt.trim().length === 0) {
            logger.error('EventType Error: Please provide image artwork');
            r.status(400).send({ msg: 'Please provide image artwork'});
            return false;
        }
        
        if (d.positivity === undefined || typeof d.positivity !== "number" || 
            d.positivity < 0 || d.positivity > 100) {
                logger.error('EventType Error: Please provide a song positivity score between 0 and 100');
                r.status(400).send({ msg: 'Please provide a song positivity score between 0 and 100'});
                return false;
        }

        if (d.energy === undefined || typeof d.energy !== "number" || 
            d.energy < 0 || d.energy > 100) {
                logger.error('EventType Error: Please provide a song energy score between 0 and 100');
                r.status(400).send({ msg: 'Please provide a song energy score between 0 and 100'});
                return false;
        }

        if (d.rhythm === undefined || typeof d.rhythm !== "number" || 
            d.rhythm < 0 || d.rhythm > 100) {
                logger.error('EventType Error: Please provide a song rhythm score between 0 and 100');
                r.status(400).send({ msg: 'Please provide a song rhythm score between 0 and 100'});
                return false;
        }

        if (d.liveliness === undefined || typeof d.liveliness !== "number" || 
            d.liveliness < 0 || d.liveliness > 100) {
                logger.error('EventType Error: Please provide a song liveliness score between 0 and 100');
                r.status(400).send({ msg: 'Please provide a song liveliness score between 0 and 100'});
                return false;
        }
    }

    // The event based off of the above error-handling
    // is valid and contains correct data 
    return true;
}