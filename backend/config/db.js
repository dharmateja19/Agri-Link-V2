import mongoose from "mongoose";
const MONGODB_URI = process.env.MONGODB_URI

const connectdb = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("mongodb connected succesfully");
    } catch (error) {
        console.log(error);
    } 
}

export default connectdb