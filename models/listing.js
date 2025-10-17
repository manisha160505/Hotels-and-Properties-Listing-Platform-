const mongoose=require('mongoose');
const schema=mongoose.Schema;
const Review=require('./review.js');

const listingSchema=new schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
    },
    image: {
        filename: String,
        url: {
            type: String,
            default: "https://unsplash.com/photos/a-person-holding-a-wine-glass-in-their-hand-zGhAjW3pfKs",
            set: v =>
                v === "" ? "https://unsplash.com/photos/a-person-holding-a-wine-glass-in-their-hand-zGhAjW3pfKs" : v
        }
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
});
listingSchema.post('findOneAndDelete', async function (lisitng) {
    if(lisitng) {
        await Review.deleteMany({
            _id: {
                $in: lisitng.reviews
            }
        });
    }
});
const Listing=mongoose.model('Listing',listingSchema);
module.exports=Listing;