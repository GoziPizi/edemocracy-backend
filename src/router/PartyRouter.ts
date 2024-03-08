import express from 'express';

const PartyRouter = express.Router();

PartyRouter.post('/', async (req, res) => {
    //TODO
    try {
        //TODO
        //Accessible si connecté
        res.status(201)
    } catch (error) {
        console.log(error);
    }
});

PartyRouter.get('/:id', async (req, res) => {
    //TODO
    try {
        //TODO
        //Accessible si connecté
        res.status(200)
    } catch (error) {
        console.log(error);
    }
});

PartyRouter.get('/:id/private-infos', async (req, res) => {
    //TODO
    try {
        //TODO
        //Accessible seulement si l'on est membre du parti ou admin du parti
        res.status(200)
    } catch (error) {
        console.log(error);
    }
});

PartyRouter.put('/:id', async (req, res) => {
    //TODO
    try {
        //TODO
        //Accessible seulement si l'on est membre du parti / admin du parti
        res.status(200)
    } catch (error) {
        console.log(error);
    }
});