import express from 'express';
import 'dotenv/config';
import Store from './store-2.js';
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.get('/songs', async (req, res) => {
    const currentSongs = await Store.read();
    console.log(currentSongs);
    res.status(200).send({ currentSongs });
});

app.post('/addSong', async (req, res) => {
    const { id, song_name } = req.body;
    const addSong = await Store.createSong(id, song_name);
    res.status(200).send({ addSong });
});

app.listen(4001, () => {
    console.log("This works");
});