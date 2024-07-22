import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter user name"]
    },
    email: {
        type: String,
        required: [true, "Please enter user email"]
    },
    phone: {
        type: String,
        required: [true, "Please enter user phone number"]
    },
    password: {
        type: String,
        required: [true, "Please enter password"]
    },
    address: {
        type: String,
        required: [true, "Please enter address"]
    },
    street: {
        type: String,
    },
    city: {
        type: String,
        required: [true, "Please enter city"]
    },
    country: {
        type: String,
        required: [true, "Please enter country"]
    },
    isUser: {
        type: Boolean,
        default: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export { User };
