const mongoose=require('mongoose');
const slugify=require('slugify');
const validator=require('validator');
//const User = require('./userModel'); //for  embded
const tourSchema=new mongoose.Schema({
    name:{
        type:String,
        unique: true,
        required:[true,'Tour must has name'], //validator
        trim:true,
        maxlength:[40,'Tour name must have less or equal 40 char'], //validator
        minlength:[10,'Tour must have more than 10 char'], //validator
       // validate:[validator.isAlpha,'there must  not have white spaces']
       
    },
    slug:String,
    start:Date,
    duration:{
        type:Number,
        required:[true,'Tour must has duration']
    },
    maxGroupSize:{
        type:Number,
        required:[true,'Tour must has maxGroupSize']
    },
    difficulty:{
        type:String,
        required:[true,'Tour must has difficulty'],
        enum:{ // for strings
            values:['easy','medium','difficult'],
            message:"Diffculty must be either: easy or medium, difficult"
            }
    },
    ratingsAverage:{
        type:Number,
        default:4.5,
        min:[1.0,'rate  must at least 1.0'], //for number and dates
        max:[5.0,'rate  not more than 5.0'],
    },
    ratingsQuantity:{
        type:Number,
        default:0
    },
    price:{
        type:Number,
        required:[true,'Tour must has price']
    },
    priceDiscount:{
        type:Number,
        //this validator only for save and create doucment but not working in update 
        validate:{
            validator:function(val){ //return true or false
            return val<this.price
        },
        message:"Price must greater than discount"
    }
    },
    summary:{
        type:String,
        trim:true,
        required:[true,'Tour must has Summary']
    },
    description:{
        type:String,
        trim:true,
        required:[true,'Tour must has Description']
    },
    imageCover:{
        type:String,
        required:[true,"Tour must has imageCover"]
    },
    images:[String],
    createdAt:{
        type:Date,
        default:Date.now(),
        select:false
    },
    startDates:[Date],
    secretTour:{ 
        type:Boolean,
        default:false

    },
    //GeoJSON
    startLoction:{ //sub document
        type:{
            type:String,
            default:'Point',
            enum:['Point']
        },
        Coordinates:[Number],
        address:String,
        description:String,
    },
    locations:[{
        type:{
            type:String,
            default:'Point',
            enum:['Point']
        },
        Coordinates:[Number],
        address:String,
        description:String,
        day:Number
    }],
    guides:[{
        type:mongoose.Schema.ObjectId,
        ref:'User'
    }]
},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
});
tourSchema.virtual('durationWeeks').get(function(){
    return this.duration /7;
}); 
// tourSchema.pre('save',function(next){ // DOCUMENT MIDDLEWARE: runs before .save() and .create()
//    this.slug=slugify(this.name,{lower:true}); //this refers to the document
//     next();
// })
// tourSchema.pre('save',function(next){
//     console.log("we will save document")
//     next();
// })
// tourSchema.post('save',function(doc,next){ //EXECUTE AFTER ALL PRE MIDDLEWARES
//     console.log(doc);
//     next();
// })
// tourSchema.pre('save', async function(next){ //embded dataModel
//     const guidePromises=this.guides.map( async id=>await User.findById(id));
    
//     this.guides=await Promise.all(guidePromises);
//     console.log(guidePromises);
//     next();
// })

//EXECUTE  QUERY MIDDLEWARE
//tourSchema.pre('find',function(next){
// tourSchema.pre(/^find/,function(next){ // this refres to query
//     this.find({secretTour:{$ne:true}}) // find be true bs loo 7att false mo4 by48al el query
//     this.start=Date.now();
//     next();
// })
// tourSchema.post(/^find/,function(docs,next){
//     console.log(`Query took ${Date.now()-this.start} milliseconds`)
//     console.log(docs);
//     next();
// }) 
//AGGREGATION MIDDLEWARE
// tourSchema.pre('aggregate',function(next){
//     this.pipeline().unshift({$match:{secretTour:{$ne:true}}});
//     console.log(this.pipeline()) // this refers to aggregation
//     next();
// })
const Tour=mongoose.model('Tour',tourSchema);

module.exports=Tour;
//trim property remove all white spaces at the end and beginnig