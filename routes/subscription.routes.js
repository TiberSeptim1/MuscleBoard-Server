import {Router} from 'express';
import { createSubscription, deleteSubscription, getAllUserSubscriptions, getUserSubscriptionsById, updateSubscription } from '../controller/subscriptions.controller.js';
import authorize from '../middlewares/auth.middleware.js';

const subscriptionRouter = Router();

subscriptionRouter.get('/', authorize, getAllUserSubscriptions);

subscriptionRouter.get('/:id', (req,res)=>res.send({'title':'GET user subscription details'}));

subscriptionRouter.post('/', authorize , createSubscription);

subscriptionRouter.put('/:id',authorize, updateSubscription);

subscriptionRouter.delete('/:id',authorize, deleteSubscription);

subscriptionRouter.get('/user/:id', authorize, getUserSubscriptionsById);



export default subscriptionRouter;  