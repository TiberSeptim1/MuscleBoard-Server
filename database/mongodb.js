import mongoose from 'mongoose';
import { DB_URI, NODE_ENV } from '../config/env.js';
import Subscription from '../models/subscription.model.js';
import History from '../models/histort.model.js';

if (!DB_URI){
    throw new Error('Please define MongoDB URI!');
}

const connectToDatabase = async()=>{
    try{
        await mongoose.connect(DB_URI);
        console.log(`connected to ${NODE_ENV}`);
        await Subscription.syncIndexes();
        await History.syncIndexes();
    }
    catch(error){
        console.error('Error!', error);
        process.exit(1);
    }
}

export default connectToDatabase;