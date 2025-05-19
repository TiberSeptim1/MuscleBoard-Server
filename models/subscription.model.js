import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minLength:2,
        maxLength:255,
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
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
        index: true,    
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
    next();
})

const Subscription = mongoose.model('Subscription', subscriptionSchema)

export default Subscription;