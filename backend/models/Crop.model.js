import mongoose from "mongoose";

const cropSchena = new mongoose.Schema({
    name : {
        type: String,
        required: [true, "Name is required."],
        minlength: [2, "Name must be at least 2 characters long."],
        trim: true,
    },
    imageUrl : {
        type : String,
    },
    farmer : {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    quantity : {
        type : Number,
        required : true
    },
    price : {
        type : Number,
        required : true
    },
    description : {
        type : String
    }
}, {timestamps: true});

const Crop = new mongoose.model('Crop',cropSchena);
export default Crop;