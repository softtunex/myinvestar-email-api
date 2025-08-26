// netlify/functions/send-email.js
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

// Email template function with the new, modern UI
const getConfirmationEmailTemplate = (applicantData) => {
  const { firstName, email } = applicantData;
  
  return {
    from: 'The MyInvestar Team <hello@myinvestar.ng>',
    to: [email],
    subject: 'Thank You for Your Star Ambassador Application',
    // UPDATED MODERN DESIGN
    html: `
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333333; margin: 0; padding: 0; background-color: #f8f9fa;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          
          <!-- Header Section with Logo -->
          <div style="background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%); padding: 40px 20px; text-align: center;">
            <img src="https://myinvestar.ng/images/myinvestar_logo_white.png" alt="MyInvestar Logo" style="width: 200px; height: auto; margin-bottom: 10px;">
          </div>

          <!-- Main Content Section -->
          <div style="padding: 40px 30px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <h1 style="color: #2196F3; font-size: 28px; font-weight: 700; margin: 0 0 10px 0;">Application Received!</h1>
              <p style="color: #666; font-size: 16px; margin: 0;">Thank you for your interest in becoming a Star Ambassador</p>
            </div>

            <div style="background: #f8f9fa; border-radius: 12px; padding: 30px; margin-bottom: 30px; border-left: 4px solid #2196F3;">
              <p style="font-size: 18px; color: #333; margin: 0 0 15px 0;"><strong>Hello ${firstName},</strong></p>
              <p style="font-size: 16px; color: #555; margin: 0 0 15px 0;">We have successfully received your Star Ambassador application and our team is excited to review it.</p>
              <p style="font-size: 16px; color: #555; margin: 0 0 15px 0;">We appreciate your enthusiasm for representing the MyInvestar brand. Our team will carefully evaluate your application and get back to you soon with the next steps.</p>
              <p style="font-size: 16px; color: #555; margin: 0;">
                <strong>Best regards,</strong><br>
                <span style="color: #2196F3;">The MyInvestar Team</span>
              </p>
            </div>

            <!-- Call to Action Section -->
            <div style="text-align: center; margin-bottom: 30px;">
              <p style="color: #666; margin-bottom: 20px; font-size: 16px;">While you wait, why not explore our app?</p>
              <div style="display: inline-block;">
                <a href="https://apps.apple.com/ng/app/myInvester/id1620126521" style="display: inline-block; margin: 0 8px;">
                  <img src="https://ci3.googleusercontent.com/proxy/d7y-K4292uA9k-2-xM-D19KWDm2yv2-D2oPLk2z_DkUF2sW3Uo-H8j_vA-2HVJp2lD-Y2g=s0-d-e1-ft#https://gallery.mailchimp.com/27aac56736a0b4b6de43548e6/images/8410b968-12c8-4712-a898-25e6833a6f7c.png" alt="Download on the App Store" style="height: 45px; border-radius: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                </a>
                <a href="https://play.google.com/store/apps/details?id=com.firstally.myinvestar&pli=1" style="display: inline-block; margin: 0 8px;">
                  <img src="https://ci3.googleusercontent.com/proxy/2-X_4NtmHi2sQ_I9857BwI6A7-2oLa-dSoR42bJPf9nvn34BlETDIqf-9-9b4w1-Q20XQ=s0-d-e1-ft#https://gallery.mailchimp.com/27aac56736a0b4b6de43548e6/images/3f20e4b8-a6fe-4d51-89a1-a67bcebe7ceb.png" alt="Get it on Google Play" style="height: 45px; border-radius: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                </a>
              </div>
            </div>

          </div>

          <!-- Footer Section -->
          <div style="background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%); padding: 30px 20px; text-align: center; color: white;">
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