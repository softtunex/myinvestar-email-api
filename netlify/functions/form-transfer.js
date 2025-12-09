// netlify/functions/form-transfer.js
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

// Helper to format currency
const formatMoney = (amount) => 
  new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);

// 1. Email Template Function (Modern Design like MyInvestar)
const getEmailTemplates = (data) => {
  const { 
    title, other_names, email, 
    package, amount, 
    giftor_name 
  } = data;

  const firstName = other_names.split(' ')[0];
  const formattedAmount = formatMoney(amount);
  const dateStr = new Date().toLocaleString('en-GB', { timeZone: 'Africa/Lagos', hour12: true });

  // Common Header/Footer styles matching your example
  const headerStyle = 'background-color:#323e48; padding: 40px 20px; text-align: center;';
  const footerStyle = 'background-color:#323e48; padding: 30px 20px; text-align: center; color:#ffffff;';
  const bodyStyle = "font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333333; margin: 0; padding: 0; background-color: #f8f9fa;";

  // --- CUSTOMER EMAIL HTML ---
  const customerHtml = `
    <body style="${bodyStyle}">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        
        <!-- Header -->
        <div style="${headerStyle}">
          <img src="https://first-allyasset.com/assets/imgs/faam-logo-white.png" alt="FAAM Logo" style="width: 200px; height: auto; margin-bottom: 10px;">
        </div>

        <!-- Main Content -->
        <div style="padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <p style="color: #d0af2b; font-size: 18px; font-weight: 600; margin: 0; text-transform: uppercase;">Order Received</p>
          </div>

          <div style="background: #ffffff; padding: 10px; margin-bottom: 30px;">
            <p style="font-size: 16px; margin: 0 0 15px 0;"><strong>Hello ${title} ${firstName},</strong></p>
            <p style="font-size: 16px; color: #555; margin: 0 0 15px 0;">
              Thank you for gifting a package. Your order has been received and will be processed once payment is confirmed.
            </p>

            <!-- Bank Details Box -->
            <div style="background-color: #f8f9fa; padding: 20px; border-left: 4px solid #d0af2b; margin: 25px 0;">
              <p style="margin: 0 0 10px 0; font-size: 14px; text-transform: uppercase; color: #777;">Please pay to:</p>
              <p style="margin: 0 0 5px 0; font-size: 16px;"><strong>${package.account.bank}</strong></p>
              <p style="margin: 0 0 5px 0; font-size: 16px;">${package.account.name}</p>
              <p style="margin: 10px 0 0 0; font-size: 24px; font-weight: 700; color: #323e48; letter-spacing: 1px;">${package.account.number}</p>
              <p style="margin: 15px 0 0 0; font-size: 13px; color: #666;">* Send proof of payment to sales@first-ally.com</p>
            </div>

            <p style="font-size: 16px; color: #555; margin: 0;">
              <strong>Best regards,</strong><br>
              <span style="color: #d0af2b;">The First Ally Team</span>
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div style="${footerStyle}">
           <p style="margin: 0 0 15px 0; font-size: 16px; font-weight: 600;">First Ally Asset Management</p>
           <p style="margin: 0; font-size: 13px; opacity: 0.8;">
              <a href="https://first-allyasset.com" style="color: white; text-decoration: none;">Visit Website</a>
           </p>
        </div>
      </div>
    </body>
  `;

  // --- STAFF EMAIL HTML (Internal Use) ---
  const staffHtml = `
    <h3>New Gift Box (Bank Transfer)</h3>
    <p>A new customer has placed an order via Bank Transfer.</p>
    <ul>
      <li><strong>Giftor:</strong> ${giftor_name}</li>
      <li><strong>Email:</strong> ${email}</li>
      <li><strong>Amount:</strong> ${formattedAmount}</li>
      <li><strong>Package:</strong> ${package.name}</li>
      <li><strong>Date:</strong> ${dateStr}</li>
    </ul>
  `;

  return { customerHtml, staffHtml };
};


// 2. The Handler (Exact structure from your example)
exports.handler = async (event, context) => {
  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*', 
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const data = JSON.parse(event.body);

    // Construct full name for internal log
    data.giftor_name = `${data.surname} ${data.other_names}`;
    
    // Generate Templates
    const { customerHtml, staffHtml } = getEmailTemplates(data);

    // --- SEND STAFF EMAIL ---
    await resend.emails.send({
      from: 'FAAM Alerts <onboarding@resend.dev>', // Use verified domain in production
      to: ['olatunjibuari8@gmail.com'], // Your test email
      subject: 'New Order (Transfer)',
      html: staffHtml
    });

    // --- SEND CUSTOMER EMAIL ---
    const result = await resend.emails.send({
      from: 'First Ally <onboarding@resend.dev>', // Use verified domain in production
      to: [data.email],
      subject: 'Order Received - FAAM Gift Box',
      html: customerHtml
    });

    console.log('Email sent:', result);
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST'
      },
      body: JSON.stringify({ 
        success: true, 
        id: result.data?.id 
      })
    };
    
  } catch (error) {
    console.error('Error sending email:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-TYPE'
      },
      body: JSON.stringify({ 
        success: false, 
        error: 'Failed to send confirmation email' 
      })
    };
  }
};