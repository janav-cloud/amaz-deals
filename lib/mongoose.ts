import mongoose from 'mongoose';

let isConnected = false;

export const connectToDB = async() => {
    mongoose.set('strictQuery', true);

    if(!process.env.MONGODB_URI) {
        return console.log("MONGODB_URI does not exist!");
    }

    if(isConnected) {
        return console.log("=> database connection : existing session...");
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        isConnected = true;
        console.log("=> database connected successfully!");
    } catch (error) {
        console.log(error);
    }
}