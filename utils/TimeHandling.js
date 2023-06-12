const TimeHandle=function(timeStamp){
let now =  Date.now();
let date=timeStamp;
let diffMs = (now - date); // milliseconds between now & Christmas
let diffMins = Math.floor(diffMs/60000); // minutes
let diffHrs = Math.floor(diffMins/60); // hours
let diffDays = Math.floor(diffHrs / 24); // days

if(diffDays>=1){
    let date=timeStamp;
    date=date.toString();
   return date.substring(4,15);
}
  else if(diffMins>=0&&diffMins<=59){
   return `${diffMins}m`;
   }
   else if(diffHrs>=1&&diffHrs<=23){
    return `${diffHrs}h`
   }
}

module.exports=TimeHandle;