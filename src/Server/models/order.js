import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    shippingInfo: {
        type: String,
        required: true,
    },
    clientRef: {
        type: String,
        required: true,
    },
    userid: {
        type: String,
        required: true,
    }
    ,
    orderItems: [{
        image: {  // Update field name to match the data
            type: String,
            required: true
        },
        product: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        quantity: {
            type: String,
            required: true
        },
    }],
    amountPaid: {
        type: Number,
        require: true
    },
    orderStatus: {
        type: String,
        default: 'Processing'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

export { Order };
