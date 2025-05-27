import mongoose from "mongoose";
import Subscription from "./subscription.model.js";

const historySchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minLength:2,
        maxLength:255,
    },
    subscriptionId:{
         type: mongoose.Schema.Types.ObjectId, ref: Subscription, required: true 
    },
    price:{
        type: Number,
        required: [true, 'Price is required'],
        min:[0, 'must be greater than 0'],
    },
    frequency:{
        type: Number,
        required: true,
        min: 1,
        max:24,
        default:1,
    },
    status:{
        type: String,
        enum:['active','pending','expired'],
        default:'active',
    },
    startDate:{
        type:Date,
        required:true,
        validate:{
            validator:(value)=> value< new Date(),
            message:'start date cant be of future'
        }
    },
    endDate:{
        type:Date,
        validate:{
            validator:function (value){ 
                return value> this.startDate},
            message:'renewal date must be after start date'
        },
    },
    userId:{
        type: String,
        required:true,
        index: true,    
    },
    feesPaid:{
        type: Number,
        required: [true, 'Fees paid is required'],
        min:[0, 'must be greater than 0'],
    },
    updatedAt: { type: Date, default: Date.now },

},{timestamps:true});

historySchema.pre('save', function(next){
    if (this.startDate && this.frequency){
        const endDate =new Date(this.startDate);
        endDate.setMonth(endDate.getMonth()+this.frequency);
        this.endDate=endDate;
    }

    if (this.endDate< new Date()){
        this.status='expired';
    }
    if (this.feesPaid<this.price){
        this.status='pending'
    }
    next();
})

const History = mongoose.model('History', historySchema)

export default History;