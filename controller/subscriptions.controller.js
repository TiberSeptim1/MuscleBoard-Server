
import Subscription from "../models/subscription.model.js";
import History from "../models/histort.model.js";

export const createSubscription = async (req, res, next)=>{
    try {
        const {name, price, frequency, feesPaid, startDate, userId} = req.body;
        const newSubscription = new Subscription({name, price, frequency, feesPaid, startDate, userId})
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

        await subscription.remove();
        res.json({message:'Deleted'})
    } catch (error) {
        next(error);
    }
}

export const updateSubscription = async (req, res, next)=>{
    try {
        const {name, price, frequency, feesPaid, startDate, userId} = req.body;

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
            updatedAt: new Date(),
          });
        }
        
        subscription.name = name??subscription.name;
        subscription.price = price?? subscription.price;
        subscription.frequency = frequency??subscription.frequency;
        subscription.feesPaid = feesPaid??subscription.feesPaid;
        subscription.startDate = startDate??subscription.startDate;

        await subscription.save();
        res.json({message:"Info Updated", subscription})
    } catch (error) {
        next(error)
    }
}