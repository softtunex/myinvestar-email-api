 // This file is netlify/functions/send-email.js

import { Resend } from 'resend';

// The domain of your MAIN website. This is a crucial security step.
// The browser will only allow your website to call this function.
const ALLOWED_ORIGIN = 'http://127.0.0.1:5503/'; // <-- IMPORTANT: REPLACE WITH YOUR ACTUAL WEBSITE DOMAIN

export const handler = async (event) => {
  // Get the Resend API key from secure environment variables
  const resend = new Resend(process.env.RESEND_API_KEY);

  // --- START CORS CONFIGURATION ---
  // These headers give your main website permission to call this function
  const headers = {
    'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // The browser will send an 'OPTIONS' request first to check permissions.
  // We need to handle this and return a successful response.
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204, // No Content
      headers,
      body: ''
    };
  }
  // --- END CORS CONFIGURATION ---


  // Only allow POST requests for the actual logic
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: 'Method Not Allowed' };
  }

  try {
    const { firstName, email } = JSON.parse(event.body);

    const { data, error } = await resend.emails.send({
      from: 'MyInvestar Team <hello@myinvestar.ng>',
      to: [email],
      subject: 'Thank You for Your Star Ambassador Application',
      html: `
        <p>Hello ${firstName},</p>
        <p>Thank you for applying to become a Star Ambassador. We have received your application and our team will review it shortly.</p>
        <p>We appreciate your interest in representing our brand, and we will get back to you soon regarding the next steps.</p>
        <p>Best regards,<br>The MyInvestar Team</p>
      `,
    });

    if (error) {
      return { statusCode: 400, headers, body: JSON.stringify(error) };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'Email sent successfully!' }),
    };
  } catch (error) {
    return { statusCode: 500, headers, body: JSON.stringify({ message: error.message }) };
  }
};
