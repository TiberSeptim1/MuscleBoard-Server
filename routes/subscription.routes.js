import {Router} from 'express';
import { createSubscription, deleteAllHistory, deleteHistoryById, deleteSubscription, getAllUserHistory, getAllUserSubscriptions, getUserSubscriptionsById, updateSubscription } from '../controller/subscriptions.controller.js';
import authorize from '../middlewares/auth.middleware.js';

const subscriptionRouter = Router();

subscriptionRouter.get('/', authorize, getAllUserSubscriptions);

// subscriptionRouter.get('/:id', (req,res)=>res.send({'title':'GET user subscription details'}));

subscriptionRouter.post('/', authorize , createSubscription);

subscriptionRouter.put('/:id',authorize, updateSubscription);

subscriptionRouter.delete('/:id',authorize, deleteSubscription);

subscriptionRouter.delete('/history/:id', authorize, deleteHistoryById);

subscriptionRouter.delete('/history/subscription/:id', authorize, deleteAllHistory);

subscriptionRouter.get('/history/:id', authorize, getAllUserHistory);

subscriptionRouter.get('/:id', authorize, getUserSubscriptionsById);


export default subscriptionRouter;  