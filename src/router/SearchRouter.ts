import SearchService from '@/services/SearchService';
import express, { NextFunction, Request, Response } from 'express'

const SearchRouter = express.Router();

SearchRouter.get('/all/:query', async (req: Request, res: Response, next: NextFunction) => {
    /**
        #swagger.tags = ['Search']
        #swagger.description = 'Get all search results'
        #swagger.parameters['query'] = {
            description: 'Query to search',
            required: true
        }
        #swagger.responses[200] = {
            description: 'Search results found',
            schema: { $ref: "#/definitions/SearchResultDefinition" }
        }
     */
    try {
        const query = req.params.query;
        const results = await SearchService.textSearch(query);
        res.status(200).send(results);
    } catch (error) {
        next(error);
    }
});

SearchRouter.get('/topic/:query', async (req: Request, res: Response, next: NextFunction) => {
    /**
        #swagger.tags = ['Search']
        #swagger.description = 'Get all search results'
        #swagger.parameters['query'] = {
            description: 'Query to search',
            required: true
        }
        #swagger.responses[200] = {
            description: 'Search results found',
            schema: { $ref: "#/definitions/SearchResultDefinition" }
        }
     */
    try {
        const query = req.params.query;
        const results = await SearchService.textSearchByType(query, 'topic');
        res.status(200).send(results);
    } catch (error) {
        next(error);
    }
});

export default SearchRouter;