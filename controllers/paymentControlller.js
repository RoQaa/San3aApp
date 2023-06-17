const axios = require('axios');
const crypto = require('crypto');
const User = require('../models/userModel');
const { catchAsync } = require('../utils/catchAsync');

exports.initiateCredit = async (req,res)=>{
  try {
    const token = await getToken();
    const order = await createOrder(token);
    const paymentToken = await getPaymentToken(order, token);
    const redirectUrl = `https://portal.weaccept.co/api/acceptance/iframes/${process.env.PAYMOB_IFRAME_ID}?payment_token=${paymentToken}`;
    
    res.end(redirectUrl); //res.json
  
  }catch(error){
    console.log(error)
  }
}

const getToken = async ()=>{

    dataBody = { "api_key":process.env.PAYMOB_API_KEY }
    
    try{

      const result = await axios.post('https://accept.paymob.com/api/auth/tokens', dataBody ,{
      headers: {
        'Content-Type': 'application/json'
      }})

      return result.data.token 

    }catch(error){
      if (error.response) { // the server returned an error status code
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
      } else if (error.request) { // request was sent but no response was received
          console.log(error.request);
      } else {
          console.log('Error', error.message);
      }
          console.log(error.config);
    }     
}

const createOrder = async (token)=>{
  
  const data = {
    "auth_token": token,
    "delivery_needed": "false",
    "amount_cents": "100",
    "currency": "EGP",
    "items": [],
  }

  try{

    const result = await axios.post('https://accept.paymob.com/api/ecommerce/orders', data ,{
    headers: {
      'Content-Type': 'application/json',
    }})

    return result.data.id

  }catch(error){
    if (error.response) { // the server returned an error status code
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
    } else if (error.request) { // request was sent but no response was received
        console.log(error.request);
    } else {
        console.log('Error', error.message);
    }
        console.log(error.config);
  }
}

const getPaymentToken = async (order, token)=> {
  const data = {
    "auth_token": token,
    "amount_cents": "100", 
    "expiration": 3600, 
    "order_id": order,
    "billing_data": {
      "apartment": "NA", 
      "email": "test@gmail.com", 
      "floor": "NA", 
      "first_name": "Clifford", 
      "street": "NA", 
      "building":"NA", 
      "phone_number": "+86(8)9135210487", 
      "shipping_method": "NA", 
      "postal_code": "NA", 
      "city": "NA", 
      "country": "NA", 
      "last_name": "Nicolas", 
      "state": "NA"
    }, 
    "currency": "EGP", 
    "integration_id": process.env.PAYMOB_INTEGRATION_ID ,
    "lock_order_when_paid": "false"
  }

  try{

    const result = await axios.post('https://accept.paymob.com/api/acceptance/payment_keys', data ,{
    headers: {
      'Content-Type': 'application/json',
    }})

    return result.data.token

  }catch(error){
    if (error.response) { // the server returned an error status code
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
    } else if (error.request) { // request was sent but no response was received
        console.log(error.request);
    } else {
        console.log('Error', error.message);
    }
        console.log(error.config);
  }
}

// when press pay send to paymob and return with data 
exports.callback = catchAsync(async (req, res,next)=> {

  const Request = {...req.body}
  const data = Request.obj
  const hmac = req.query.hmac;

  const sortedArray = Object.entries(data).sort();
  const sortedData = Object.fromEntries(sortedArray);

  const array = [
    'amount_cents',
    'created_at',
    'currency',
    'error_occured',
    'has_parent_transaction',
    'id',
    'integration_id',
    'is_3d_secure',
    'is_auth',
    'is_capture',
    'is_refunded',
    'is_standalone_payment',
    'is_voided',
    'order',
    'owner',
    'pending',
    'source_data',
    'success',
  ];

  let connectedString = '';

  Object.keys(sortedData).forEach(function(key) {
    if (array.includes(key)) {
      if(key == 'order'){
         connectedString += sortedData.order.id
      }else if(key == 'source_data'){
        connectedString += sortedData.source_data.pan
        connectedString += sortedData.source_data.sub_type
        connectedString += sortedData.source_data.type
      }else{
        connectedString += sortedData[key];
      }  
    }
  })

  const secret = process.env.PAYMOB_HMAC;

  const hashed = crypto.createHmac('SHA512', secret).update(connectedString).digest('hex');

  const email = sortedData.order.shipping_data.email

  if (hashed === hmac) {

    const user = await User.findOneAndUpdate({email:email},{ isPaid: true, paidTime: Date.now() },
    { runValidators: true, new: true })

    if(!user){
      return next(" no user with this email ",404)
    }

    res.send('secure');

    return;
  }
    res.send('not secure');
})


exports.initiateWallet =  async (req, res)=> {
  try {
    const token = await getToken();
    const order = await createOrder(token);
    const paymentToken = await getPaymentToken(order.id, token);
    const payWalletData = await payWallet(paymentToken)
    console.log(payWalletData)
  } catch (error) {
    console.log(error);
  }
}

const payWallet = async ( getPaymentToken)=>{

  dataBody = {
    "source": {
      "identifier": "wallet mobile number", 
      "subtype": "WALLET"
    },
    "payment_token": getPaymentToken  // token obtained in step 3
  }
  
  try{

    const result = await axios.post(' https://accept.paymob.com/api/acceptance/payments/pay', dataBody ,{
    headers: {
      'Content-Type': 'application/json'
    }})

    return result

  }catch(error){
    if (error.response) { // the server returned an error status code
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
    } else if (error.request) { // request was sent but no response was received
        console.log(error.request);
    } else {
        console.log('Error', error.message);
    }
        console.log(error.config);
  }     
}