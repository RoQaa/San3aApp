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
let diffMins = Math.floor(diffMs/60000); // minutes
let diffHrs = Math.floor(diffMins/60); // hours
let diffDays = Math.floor(diffHrs / 24); // days




if(diffDays>=1){
    let date=this._id.getTimestamp();
    date=date.toString();
   return date.substring(4,15);
}
  else if(diffMins>=0&&diffMins<=59){
   return `${diffMins} min`;
   }
   else if(diffHrs>=1&&diffHrs<=23){
    return `${diffHrs} hours`
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


