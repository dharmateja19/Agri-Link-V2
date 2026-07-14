import User from "../models/User.model.js";

export const getUsers = async (req, res) => {
    try {
        const users = await User.find({role:['farmer','buyer']}).select('-password');
        res.status(200).json({message : "Users found successfully",users});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "error while fetching users"});
    }
};

export const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findOne({_id : userId}).select('-password');
        if(!user) return res.status(404).json({message: "user not found"});
        res.status(200).json({message: "User found successfully" , user});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "error while fetching user"});
    }
};
