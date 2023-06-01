const Tour=require(`${__dirname}/../models/tourModel`);
const APIFeatures=require(`${__dirname}/../utils/apiFeatures`);
const {catchAsync}=require(`${__dirname}/../utils/catchAsync`);
const AppError=require(`../utils/appError`);
// const fs=require('fs');
// const tours = JSON.parse(
//     fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf-8')
//   );
// exports.CheckBody=(req,res,next)=>{
//   if(!req.body.name||!req.body.price){
//    return res.status(404).json({
//       status:"Fail",
//       message:"cannot find name & price property"
//     })
//   }
//   next();
  
// }
// exports.checkId=(req,res,next,val)=>{
//   if(val>tours.length){
//   return  res.status(404).json({
//       status:"fail",
//       message:"Invalid ID"
//     });
//   }
//   next();
// }
exports.aliasTop5=(req,res,next)=>{
  req.query.limit='5';
  req.query.sort='-ratingsAverage,price';
  req.query.fields='name,duration,difficulty,price';
  
  next();

}


 exports.GetAllTours = catchAsync(async(req, res,next) => {


//     //filtering
//     const queryObj={...req.query};
//     console.log(queryObj);
//     excludedFileds=['page','sort','limit','fields'];
//      excludedFileds.forEach(element => {
//       delete queryObj[element];
//    });

// // Advanced filtering
// let queryStr=JSON.stringify(queryObj);
// queryStr=queryStr.replace(/\b(gte|gt|lt|lte)\b/g,match=>`$${match}`);
//  console.log(queryObj);
// console.log(JSON.parse(queryStr));
//    //gte gt lt lte

//    let query= Tour.find().find(JSON.parse(queryStr));
    
 
 
   //Sorting

// if(req.query.sort){
  
//   //query=query.sort(req.query.sort)
 
//   let sortBy=req.query.sort.split(',').join(' ');
//   console.log(sortBy);
// query=query.sort(sortBy) //if sort = -price is descending order
// }else{
//   query=query.sort('-createdAt');
// }

//field limiting
// if(req.query.fields){
//   req.query.fields=req.query.fields.split(',').join(' ');
//   query=query.select(req.query.fields);
// }
// else{
//   query=query.select('-__v');
// }

//Pagintion
// const page=req.query.page *1||1;
// const limit=req.query.limit*1||100;
// const skip=(page-1)*limit;
// if(req.query.page){
//   const numTours=await Tour.countDocuments();
//   if(skip>=numTours){
//     throw new Error(`these page doesn't exist`);
//   }
// }
// else{
// //page=2&limit=10 1-10 page1 11-20 page2 21-30 page3
// query=query.skip(skip).limit(limit);
// //page=3&limit=10 1-10 page1 11-20 page2 21-30 page3
// //query=query.skip(20).limit(10);
// }

//Execute 3

const features=new APIFeatures(Tour.find(),req.query)
.filter()
.sort()
.limitFields()
.paginate();
//console.log(req.query);
const tours=await features.query;


    //  const tours=await Tour.find({
    //   duration:5,
    //   difficulty:'easy'
    //  });


    // const tours=await Tour.find()
    // .where('duration')
    // .equals(5)
    // .where('difficulty')
    // .equals('easy');

    res.status(200).json({
      status: 'success',
      requestedTime: req.requestTime,
       results: tours.length,
       data: { tours },
    });
  });
  /* exports. AddTour = (req, res) => {
   const newId = tours[tours.length - 1].id + 1;
     const newTour = Object.assign({ id: newId }, req.body); //req.body json transformed to JS using app.use()
     tours.push(newTour);
     fs.writeFile(
       `${__dirname}/../dev-data/data/tours-simple.json`,
       JSON.stringify(tours),
       (err) => { 
         if (err) {
           console.log(err);
         }
  
         res.status(201).json({
           status: 'Success',
           data: {
             tour: newTour,
           },
         });
       }
     );
   };*/
  exports.GetTour =catchAsync(async (req, res,next) => {

      const foundedtour=await Tour.findById(req.params.id)
      if(!foundedtour){
       return  next(new AppError('no tour found with that ID',404))
      }
    // const id = req.params.id * 1;
    // const tour = tours.find((el) => el.id === id);
    // if(tours.length<id)
   
      res.status(200).json({
        status: 'success',
        data: {
          tour: foundedtour,
        },
      });
    });
  
  exports. UpdateTour = catchAsync(async(req, res,next) => {

    const tour = await Tour.findByIdAndUpdate(req.params.id,req.body,{
      new:true, // bool property set true to  return  modified data
      runValidators:true
    })
    if(!tour){
      return  next(new AppError('no tour found with that ID',404))
     }
    res.status(200).json({
      status: 'success',
      data: tour //modified tour
    });
   });



  exports. DeleteTour =catchAsync(async (req, res,next) => {

    const tour = await Tour.findByIdAndDelete(req.params.id);

  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }
    res.status(204).json({
      status: 'success',
      data: null
    });
  }
);
  exports.createTour= catchAsync(async(req,res)=>{

    const newTour= await Tour.create(req.body); //=>const newTour= new Tour({}); newTour.save();
    
    res.status(201).json({
      status:"Success",
      data:{
        newTour
      }
    })
  }
 
);


exports.getTourStats=catchAsync(async (req,res,next) => {
 
    const stats= await Tour.aggregate([// stages
       {
       $match:{
         ratingsAverage:{$gte:4.7}
       }},
      {
      $group:{
        //_id:null, => all
        // _id:'$difficulty',
         _id:{$toUpper:'$difficulty'},
         numberOfTours:{$sum:1},
         numRatingS:{$sum:'$ratingsAverage'},
         avgRating:{$avg:'$ratingsAverage'},
         avgPrice:{$avg:"$price"},
         minPrice:{$min:"$price"},
         maxPrice:{$max:"$price"},
       // _id:null,
        //tourName:{$push:"$name"}
       
      }
      },
      {
      $sort:{avgPrice:1} // for ascending for 1 and -1 for descending
        
      },
      // {
      //   $match:{_id:{$ne:"EASY"}} // ne is not equal
      // }

    
    
  ]);
    res.status(200).json({
      status:"Success",
      data:{
        stats
      }
    })

  })
exports.getMonthlyPlan=catchAsync(async (req,res,next) => {

  const year= req.params.year*1;
  const plan= await Tour.aggregate([
    {
      $unwind:'$startDates'
    },
     {
       $match:{
         startDates:{
           $gte:new Date(`${year}-01-01`),
           $lte:new Date(`${year}-12-31`),
         }
       }
     },
     {
      $group:{
        _id:{$month:'$startDates'},
        numberOfTours:{$sum:1},
        tourName:{$push:'$name'}, // array
        tourPrice:{$push:'$price'} // array
      }
     },
     {
     $addFields:{month:'$_id'}
     },
     {
     $project:{_id:0} // unshow id if equal 1  just show id
     },
     {
      $sort:{numberOfTours:-1}
    },
    {
      $limit:3
    }
  ])

  res.status(200).json({
    status:"Success",
    data:{
      plan
    }
  })

})


  


