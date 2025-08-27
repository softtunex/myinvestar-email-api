// netlify/functions/send-email.js
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

// Email template function with the new, clean UI
const getConfirmationEmailTemplate = (applicantData) => {
  const { firstName, email } = applicantData;
  
  return {
    from: 'MyInvestar <hello@myinvestar.ng>',
    to: [email],
    subject: 'Thank You for Your Star Ambassador Application',
    // UPDATED MODERN DESIGN
    html: `
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333333; margin: 0; padding: 0; background-color: #f8f9fa;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          
          <!-- Header Section with Logo -->
          <div style="background-color:#323e48; padding: 40px 20px; text-align: center;">
            <img src="https://myinvestar.ng/images/myinvestar_logo_white.png" alt="MyInvestar Logo" style="width: 200px; height: auto; margin-bottom: 10px;">
          </div>

          <!-- Main Content Section -->
          <div style="padding: 4px">
            <div style="text-align: center; margin-bottom: 30px;">
             
              <!-- <h1 style="color: #d0af2b; font-size: 28px; font-weight: 700; margin: 0 0 10px 0;">Application Received!</h1>-->
              <p style="color: #d0af2b; font-size: 16px; margin: 0;">Thank You for Your Star Ambassador Application</p>
            </div>

            <div style="background: #ffffff; padding: 5px; margin-bottom: 30px;">
              <p style="font-size: 18px; color: #333; margin: 0 0 15px 0;"><strong>Hello ${firstName},</strong></p>
              <p style="font-size: 16px; color: #555; margin: 0 0 15px 0;">Thank you for applying to become a Star Ambassador. We have received your application and our team will review it shortly.
</p>
              <p style="font-size: 16px; color: #555; margin: 0 0 15px 0;">We appreciate your interest in representing our brand, and we will get back to you soon regarding the next steps.</p>
              <p style="font-size: 16px; color: #555; margin: 0;">
                <strong>Best regards,</strong><br>
                <span style="color: #d0af2b;">The MyInvestar Team</span>
              </p>
            </div>
 <!-- Footer Section -->
          <div style="background-color:#323e48; padding: 30px 20px; text-align: center; color:#ffffff">
            <!-- Call to Action Section -->
            <div style="text-align: center; margin-bottom: 30px;">
              <p style="margin-bottom: 20px; font-size: 16px;">While you wait, why not explore our app?</p>
              <div style="display: inline-block;">
                <a href="https://apps.apple.com/ng/app/myInvester/id1620126521" style="display: inline-block; margin: 0 8px;">
                  <img src="https://myinvestar.ng/images/apple_white.png" alt="Download on the App Store" style="height: 45px; border-radius: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                </a>
                <a href="https://play.google.com/store/apps/details?id=com.firstally.myinvestar&pli=1" style="display: inline-block; margin: 0 8px;">
                  <img src="https://myinvestar.ng/images/google_white.png" alt="Get it on Google Play" style="height: 45px; border-radius: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                </a>
              </div
            </div>

          </div>

         
            <p style="margin: 0 0 15px 0; font-size: 16px; font-weight: 600;">Powered by First Ally Asset Management</p>
            <p style="margin: 0 0 20px 0; font-size: 14px; opacity: 0.9;">Building your financial future, one investment at a time</p>
            <div style="border-top: 1px solid rgba(255,255,255,0.2); padding-top: 20px; margin-top: 20px;">
              <p style="margin: 0; font-size: 13px; opacity: 0.8;">
                <a href="https://myinvestar.ng/static/router.html?id=SP02" style="color: white; text-decoration: none; margin: 0 10px;">Privacy Policy</a> | 
                <a href="https://myinvestar.ng" style="color: white; text-decoration: none; margin: 0 10px;">Visit Website</a>
              </p>
            </div>
          </div>

        </div>
      </body>
    `
  };
};


// YOUR ORIGINAL HANDLER LOGIC IS FULLY RESTORED BELOW
exports.handler = async (event, context) => {
  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*', // Or your specific domain
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
    const applicantData = JSON.parse(event.body);
    
    // Validate required fields
    if (!applicantData.email || !applicantData.firstName) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          success: false, 
          error: 'Missing required fields' 
        })
      };
    }

    // Send confirmation email
    const emailTemplate = getConfirmationEmailTemplate(applicantData);
    const result = await resend.emails.send(emailTemplate);

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