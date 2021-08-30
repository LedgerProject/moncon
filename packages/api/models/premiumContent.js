import mongoose from 'mongoose'

const { Schema } = mongoose

export const PREMIUMCONTENT_STATUS_ACTIVE = 'ACTIVE';
export const PREMIUMCONTENT_STATUS_DELETED = 'DELETED';

const PremiumContentSchema = new Schema({
    publisherId: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
    domain: {
        type: String,
    },
    status: {
        type: String,
        required: true,
        enum: [PREMIUMCONTENT_STATUS_ACTIVE, PREMIUMCONTENT_STATUS_DELETED]
    }
})

export default mongoose.model('PremiumContent', PremiumContentSchema);
