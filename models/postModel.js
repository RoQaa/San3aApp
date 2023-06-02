const mongoose=require('mongoose');
const validator =require('validator');
const moment = require('moment');
const postSchema=mongoose.Schema({
    user:{
        type:mongoose.Schema.ObjectId, //population data
        ref:'User',
        required:[true,"create post must has user to post"]
    },
    description:{
        type:String,
    },
    image:{
        type:String,
       
    },
    Activity:{
        type:Boolean,
        default:true
    },
    job:{
        type:String
    }
   
},{
    timestamps:true,
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})

// postSchema.virtual('Date').get(function(){
//    let date=this._id.getTimestamp();
//    date=date.toString();
//   return date.substring(4,15);
// }); 

postSchema.virtual('Date').get(function(){
let now =  Date.now();
let date=this._id.getTimestamp();
let diffMs = (now - date); // milliseconds between now & Christmas
let diffDays = Math.floor(diffMs / 86400000); // days
let diffHrs = Math.floor((diffMs % 86400000) / 3600000)+1; // hours
let diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000)+1; // minutes
if(diffDays>=1){
    let date=this._id.getTimestamp();
    date=date.toString();
   return date.substring(4,15);
}
  else if(diffMins>0&&diffMins<=59){
   return `${diffMins-1} min`;
   }
   else if(diffHrs>=1&&diffHrs<=23){
    return `${diffHrs-1} hours`
   }
   
}); 

// postSchema.virtual('Time').get(function(){
//     let date=this._id.getTimestamp();
//     date=date.toString();
//    return date.substring(16,21);
//  }); 
postSchema.pre(/^find/,function(next){//populting by ref
     
    this.find({Activity:{$ne:false}}).populate(
        {
            path:'user',
           
             select:'name role photo '
        }
    ).select('-Activity').select('-__v');
    next();
})




const Post=mongoose.model('Post',postSchema);

module.exports=Post;


