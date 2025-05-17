import mongoose from 'mongoose';
import { DB_URI, NODE_ENV } from '../config/env.js';

if (!DB_URI){
    throw new Error('Please define MongoDB URI!');
}

const connectToDatabase = async()=>{
    try{
        await mongoose.connect(DB_URI);
        console.log(`connected to ${NODE_ENV}`);
    }
    catch(error){
        console.error('Error!', error);
        process.exit(1);
    }
}

export default connectToDatabase;