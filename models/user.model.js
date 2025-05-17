import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required: [true, 'User name is required!'],
            trim: true,
            minLength: 2,
            maxLength:30,
        },
        email:{
            type: String,
            required:[true, 'Email is required!'],
            trim: true,
            unique: true,
            match: [/\s+@\s+\.\s+/, 'Email not valid!'],
        },
        password:{
            type: String,
            required:[true, 'Please enter password'],
            minLength:6
        }
    }, {timestamps:true});

const User = mongoose.model('User', userSchema)

export default User;