import mongoose from 'mongoose'

const { Schema } = mongoose

export const PREMIUMCONTENT_STATUS_ACTIVE = 'ACTIVE';
export const PREMIUMCONTENT_STATUS_DELETED = 'DELETED';
export const LEGAL_AGE = 'LEGAL_AGE';
export const MINOR = 'MINOR';

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
    age:{
        type: String,
        enum: [LEGAL_AGE, MINOR],
        default: MINOR,
    },
    /*
    To Do 
    see if exist a better way to add conditions dinamically 

    conditions:[
        {
            conditionType:{
                type: String
            },
            condition:{
                type:String,
            }
        }
    ],
    */
    status: {
        type: String,
        required: true,
        enum: [PREMIUMCONTENT_STATUS_ACTIVE, PREMIUMCONTENT_STATUS_DELETED]
    }
})

export default mongoose.model('PremiumContent', PremiumContentSchema);
