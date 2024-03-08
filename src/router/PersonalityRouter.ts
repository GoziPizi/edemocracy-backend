import express from 'express';

const PersonalityRouter = express.Router();

PersonalityRouter.post('/', async (req, res) => {
    //TODO
    try {
        //TODO
        //Accessible si connecté
        res.status(201)
    } catch (error) {
        console.log(error);
    }
});

PersonalityRouter.get('/:id', async (req, res) => {
    //TODO
    try {
        //TODO
        //Accessible si connecté
        res.status(200)
    } catch (error) {
        console.log(error);
    }
});

PersonalityRouter.get('/:id/private-infos', async (req, res) => {
    //TODO
    try {
        //TODO
        //Accessible seulement si l'on est la personalité
        res.status(200)
    } catch (error) {
        console.log(error);
    }
});

PersonalityRouter.put('/:id', async (req, res) => {
    //TODO
    try {
        //TODO
        //Accessible seulement si l'on est la personalité
        res.status(200)
    } catch (error) {
        console.log(error);
    }
});