import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength:2,
        maxlength:255,
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
                return value>= this.startDate},
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
    contact:{
        type: String,
        required:false,
        default:'No contact info'
    }

},{timestamps:true});

subscriptionSchema.pre('save', function(next){
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
    if(this.endDate< new Date() && this.feesPaid<this.price){
        this.status='pending and expired'
    }

    next();
})

const Subscription = mongoose.model('Subscription', subscriptionSchema)

export default Subscription;