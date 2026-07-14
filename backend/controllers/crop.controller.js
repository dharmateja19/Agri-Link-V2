import Crop from "../models/Crop.model.js";
import fetchCropImage from "../utils/fetchCropImage.js";
import ContactRequest from "../models/ContactRequest.model.js";
import mongoose from "mongoose";

export const getCrops = async (req, res) => {
    try {
        const crops = await Crop.find().populate('farmer','name location mobile');
        for(let crop of crops){
            if(!crop.imageUrl) {
                const imageUrl= await fetchCropImage(crop.name);
                if(imageUrl){
                    crop.imageUrl = imageUrl;
                    await crop.save();
                }
            }
        }
        res.status(200).json({message: "crops found successfully",crops});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "error while fetching crops"});
    }
};

export const getFarmerCrops = async (req, res) => {
    try {
        const farmerId = req.user.id;
        const crops = await Crop.find({farmer : farmerId}).populate('farmer','name');
        res.status(200).json({message: "crops found successfully",crops});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "error while fetching crops"});
    }
};

export const getCropById = async (req, res) => {
    try {
        const cropId = req.params.id;
        const crop = await Crop.find({_id : cropId});
        res.status(200).json({message: "crop found successfully",crop});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "error while fetching crop"});
    }
};

export const addCrop = async (req, res) => {
    try {
        let {name, imageUrl, quantity, price, description} = req.body;
        if(!imageUrl) {
            imageUrl = await fetchCropImage(name)
        }
        const crop = new Crop({name,imageUrl, quantity, price, description, farmer: req.user.id});
        await crop.save();
        res.status(201).json({
            message: "Crop added successfully",
            crop
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "error while adding crop"});
    }
};

export const updateCrop = async (req, res) => {
    try {
        const cropId = req.params.id;
        const farmerId = req.user.id;
        const crop = await Crop.findOne({_id:cropId, farmer:farmerId});
        if(!crop) return res.status(404).json({message:"Crop not found or unauthorized"});
        let {name,imageUrl, quantity,price,description} = req.body;
        const currCropName = crop.name;
        if(currCropName !== name){
            imageUrl = await fetchCropImage(name);
        }
        crop.name =  name ?? crop.name;
        crop.imageUrl = imageUrl ?? crop.imageUrl;
        crop.quantity = quantity ?? crop.quantity;
        crop.price = price ?? crop.price;
        crop.description = description ?? crop.description ;

        await crop.save();
        res.status(200).json({message:"Crop updated successfully",crop});
    } catch (error) {
        console.log(error);
        res.status(500).json({message : "Error while updating crop"});
    }
};

export const deleteCrop = async (req, res) => {
    try {
        const cropId = req.params.id;
        const farmerId = req.user.id;
        const deleted = await Crop.findOneAndDelete({_id:cropId,farmer:farmerId});
        if(!deleted) return res.status(404).json({message : "crop not found or unauthorized"});
        const cropObjectId = new mongoose.Types.ObjectId(cropId);
        await Order.deleteMany({crop : cropObjectId});
        await ContactRequest.deleteMany({crop : cropObjectId})
        res.status(200).json({message: "Crop deleted successfully"});
    } catch (error) {
        console.log(error);
        res.status(500).json({message : "Error while updating crop"});
    }
};
