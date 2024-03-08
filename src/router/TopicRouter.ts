import express from 'express';

const TopicRouter = express.Router();

TopicRouter.post('/', async (req, res) => {
    //TODO
    try {
        //TODO
        //Accessible si connecté
        res.status(201)
    } catch (error) {
        console.log(error);
    }
});

TopicRouter.get('/:id', async (req, res) => {
    //TODO
    try {
        //TODO
        //Accessible si connecté
        res.status(200)
    } catch (error) {
        console.log(error);
    }
});

TopicRouter.get('/:id/children', async (req, res) => {
    //TODO
    try {
        //TODO
        //Accessible si connecté
        res.status(200)
    } catch (error) {
        console.log(error);
    }
});