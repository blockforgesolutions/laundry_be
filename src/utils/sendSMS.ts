import twilio from 'twilio';
import dotenv from 'dotenv';
dotenv.config();

const client = twilio(process.env.TWILIO_SID!, process.env.TWILIO_AUTH_TOKEN!);


export const sendSMS = async (to: string, message: string) => {
  console.log(`📲 (Dummy SMS) To: ${to} — Message: ${message}`);
  return;
};

//export const sendSMS = async (to: string, message: string) => {
  //try {
  //  const response = await client.messages.create({
    //  from: process.env.TWILIO_PHONE_NUMBER!,
     // to,
     // body: message,
   // });
   // console.log('✅ SMS gönderildi:', response.sid);
 // } catch (err) {
  //  console.error('❌ SMS gönderilemedi:', err);
 // }
//};
