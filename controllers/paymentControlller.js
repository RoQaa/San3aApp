const axios = require('axios');
const crypto = require('crypto');

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
      "email": "claudette09@exa.com", 
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
exports.callback = async (req, res)=> {
  //const data = {"id": 112710059, "pending": false, "amount_cents": 10000, "success": false, "is_auth": false, "is_capture": false, "is_standalone_payment": true, "is_voided": false, "is_refunded": false, "is_3d_secure": false, "integration_id": 3823371, "profile_id": 791483, "has_parent_transaction": false, "order": {"id": 129394977, "created_at": "2023-06-15T13:25:37.415980", "delivery_needed": false, "merchant": {"id": 791483, "created_at": "2023-05-18T13:09:45.984324", "phones": ["+201126909842"], "company_emails": ["SohilaWahed@gmail.com"], "company_name": "Sohila Wahed", "state": "", "country": "EGY", "city": "Cairo", "postal_code": "", "street": ""}, "collector": null, "amount_cents": 100, "shipping_data": {"id": 63632212, "first_name": "Mohamed Ahmed", "last_name": "NA", "street": "NA", "building": "NA", "floor": "NA", "apartment": "NA", "city": "NA", "state": "NA", "country": "NA", "email": "m@gmail.com", "phone_number": "+201207117878", "postal_code": "NA", "extra_description": "", "shipping_method": "UNK", "order_id": 129394977, "order": 129394977}, "currency": "EGP", "is_payment_locked": true, "is_return": false, "is_cancel": false, "is_returned": false, "is_canceled": false, "merchant_order_id": null, "wallet_notification": null, "paid_amount_cents": 0, "notify_user_with_email": false, "items": [], "order_url": "https://accept.paymob.com/standalone/?ref=i_LRR2S252R3BDc05semtjOFFnWm9IMERrZz09X1JDaXJ1SzN6UnlZalJVRXNkVnY2eFE9PQ", "commission_fees": 0, "delivery_fees_cents": 0, "delivery_vat_cents": 0, "payment_method": "tbc", "merchant_staff_tag": null, "api_source": "OTHER", "data": {}}, "created_at": "2023-06-15T13:26:21.303221", "transaction_processed_callback_responses": [], "currency": "EGP", "source_data": {"type": "card", "pan": "2346", "sub_type": "MasterCard", "tenure": null}, "api_source": "IFRAME", "terminal_id": null, "merchant_commission": 0, "installment": null, "discount_details": [], "is_void": false, "is_refund": false, "data": {}, "is_hidden": false, "payment_key_claims": {"user_id": 1370514, "amount_cents": 10000, "currency": "EGP", "integration_id": 3823371, "order_id": 129394977, "billing_data": {"first_name": "Mohamed Ahmed", "last_name": "NA", "street": "NA", "building": "NA", "floor": "NA", "apartment": "NA", "city": "NA", "state": "NA", "country": "NA", "email": "m@gmail.com", "phone_number": "+201207117878", "postal_code": "NA", "extra_description": "NA"}, "lock_order_when_paid": false, "extra": {}, "single_payment_attempt": false, "exp": 1686828337, "pmk_ip": "105.196.224.128"}, "error_occured": false, "is_live": false, "other_endpoint_reference": null, "refunded_amount_cents": 0, "source_id": -1, "is_captured": false, "captured_amount": 0, "merchant_staff_tag": null, "updated_at": "2023-06-15T13:26:21.388106", "is_settled": false, "bill_balanced": false, "is_bill": false, "owner": 1370514, "parent_transaction": null}

  const Request = {...req.body}
  const data = Request.obj
  const hmac = req.query.hmac;

  const sortedArray = Object.entries(data).sort();
  const sortedData = Object.fromEntries(sortedArray);

  console.log(sortedData)
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

  console.log("connectedString " + connectedString)

  const secret = process.env.PAYMOB_HMAC;

  const hashed = crypto.createHmac('SHA512', secret).update(connectedString).digest('hex');

  console.log("hashed "+ hashed)
  console.log("hmac "+ hmac)
  
  if (hashed === hmac) {
 
    res.send('secure');

    return;
  }
    res.send('not secure');
}


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