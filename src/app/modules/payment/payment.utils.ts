import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const initiatePayment = async (paymentData:any) => {
  console.log('STORE_ID:', process.env.STORE_ID); // Log to check if it's loaded correctly
  console.log('SIGNATURE_KEY:', process.env.SIGNATURE_KEY); // Log to check if it's loaded correctly
  console.log('PAYMENT_URL:', process.env.PAYMENT_URL);

  try {
    const response = await axios.post(process.env.PAYMENT_URL!, {
      store_id: process.env.STORE_ID,
      signature_key: process.env.SIGNATURE_KEY, // Using corrected variable
      tran_id: paymentData.transactionId,
      success_url: 'http://localhost:3000/api/payment/confirmation',
      fail_url: 'http://www.merchantdomain.com/failedpage.html',
      cancel_url: 'http://www.merchantdomain.com/cancellpage.html',
      amount: paymentData.totalAmount,
      currency: 'BDT',
      desc: 'Merchant Registration Payment',
      cus_name: paymentData.customerName,
      cus_email: paymentData.customerEmail,
      cus_add1: paymentData.customerAddress,
      cus_add2: 'N/A',
      cus_city: 'N/A',
      cus_state: 'N/A',
      cus_postcode: '1206',
      cus_country: 'Bangladesh',
      cus_phone: paymentData.customerPhone,
      type: 'json',
    });

     return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.response?.data || error.message);
    } else {
      console.error('Unexpected error:', error);
    }
  }

};
