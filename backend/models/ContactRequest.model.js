import mongoose from 'mongoose';

const contactRequestSchema  = new mongoose.Schema({
    deal : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'Deal'
    },
    farmer : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'User'
    },
    buyer : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'User'
    },
    crop : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'Crop'
    },
    status : {
        type : String,
        required : true,
        enum : ['pending','approved','rejected'],
        default : 'pending'
    }
}, {timestamps : true});

const ContactRequest = new mongoose.model('ContactRequest',contactRequestSchema);
export default ContactRequest;