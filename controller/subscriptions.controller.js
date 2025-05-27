
import Subscription from "../models/subscription.model.js";
import History from "../models/histort.model.js";
import { calculateStatus } from "../services/subscriptionService.js";

export const createSubscription = async (req, res, next)=>{
    try {
        const {name, price, frequency, feesPaid, startDate, userId, contact} = req.body;
        const newSubscription = new Subscription({name, price, frequency, feesPaid, startDate, userId, contact})
        await newSubscription.save();
        res.status(201).json({success: true, Subscription: newSubscription})
    } catch (error) {
        next(error);
    }
}

export const getAllUserSubscriptions = async (req, res, next)=>{
    try {
        const userId = req.user.id;
        const subscriptions = await Subscription.find({userId});
        res.status(200).json({success:true, data:subscriptions});
    } catch (error) {
        next(error)
    }
}

export const getAllUserHistory = async (req, res, next)=>{
    try {
        const subscriptionId = req.params.id;
        const subs = await Subscription.findById(subscriptionId);
        if(!subs) return res.status(404).json({message:'not found'})
            const history = await History.find({subscriptionId}).sort({updatedAt:-1});
        res.json({data:{...subs.toObject(), history}})
    } catch (error) {
        next(error)
    }
}

export const getUserSubscriptionsById = async (req, res, next)=>{
    try {

        const subscriptions = await Subscription.findById(req.params.id);
        if(!subscriptions){
            return res.status(404).json({message: 'not found'})
        }
        res.status(200).json({success:true, data:subscriptions});
    } catch (error) {
        next(error)
    }
}

export const deleteSubscription = async (req,res,next)=>{
    try {
        const{userId}=req.body;

        const subscription = await Subscription.findById(req.params.id);
        if (!subscription) return res.status(404).json({error: 'not found'});
        if(subscription.userId!==userId) return res.status(403).json({error:'Unauthorized'});

        await Subscription.findByIdAndDelete(req.params.id)
        res.json({message:'Deleted'})
    } catch (error) {
        next(error);
    }
}

export const deleteHistoryById = async (req,res,next)=>{
    try {
        const history = await History.findByIdAndDelete(req.params.id)
        if(!history) return res.status(404).json({error:'history not found'})
        res.json({success:true, message:"history deleted successfully"})
    } catch (error) {
        next(error)
    }
}

export const deleteAllHistory = async(req,res,next)=>{
    try {
        const { id } = req.params;
      
        const result = await History.deleteMany({ subscriptionId: id });
    
        if (result.deletedCount === 0) {
          return res.status(404).json({ success: false, message: 'No history found to delete' });
        }
    
        res.json({ success: true, message: `Deleted ${result.deletedCount} history records.` });
      } catch (error) {
        next(error);
      }
    };


export const updateSubscription = async (req, res, next)=>{
    try {
        const {name, price, frequency, feesPaid, startDate, userId, contact} = req.body;

        const subscription = await Subscription.findById(req.params.id);
        if (!subscription) return res.status(404).json({error: 'not found'});
        if(subscription.userId!==userId) return res.status(403).json({error:'Unauthorized'});

        const shouldSaveHistory =
        (startDate && startDate !== subscription.startDate) ||
        (frequency && frequency !== subscription.frequency);
    
      if (shouldSaveHistory) {

        await History.create({
            subscriptionId: subscription._id,
            name: subscription.name,
            price: subscription.price,
            frequency: subscription.frequency,
            feesPaid: subscription.feesPaid,
            startDate: subscription.startDate,
            userId: subscription.userId,
            contact: subscription.contact,
            updatedAt: new Date(),
          });
        }

        const updatedvalues = {
        name : name??subscription.name,
        price : price?? subscription.price,
        frequency:frequency??subscription.frequency,
        feesPaid :feesPaid??subscription.feesPaid,
        startDate : startDate??subscription.startDate,
        contact :contact??subscription.contact,
        }
        const{status, endDate} = calculateStatus(updatedvalues)
        Object.assign(subscription, updatedvalues, {status, endDate})
        
        await subscription.save();
        res.json({message:"Info Updated", subscription})
    } catch (error) {
        next(error)
    }
}