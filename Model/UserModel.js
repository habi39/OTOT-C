import mongoose from 'mongoose';

const UserModelSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
    },
    role: {
        type: String,
        required: true,
        enum: ["Admin", "User"]
    },
    accessToken: {
        type: String
    }
});


export default mongoose.model('UserModel', UserModelSchema)