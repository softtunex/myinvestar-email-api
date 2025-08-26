// netlify/functions/send-email.js
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

// Email template function with the new, clean UI
const getConfirmationEmailTemplate = (applicantData) => {
  const { firstName, email } = applicantData;
  
  return {
    from: 'The MyInvestar Team <hello@myinvestar.ng>',
    to: [email],
    subject: 'Thank You for Your Star Ambassador Application',
    // THIS IS THE ONLY SECTION THAT HAS BEEN UPDATED
    html: `
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333333; margin: 0; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto;">
          
          <!-- Main Body Content -->
          <p>Hello ${firstName},</p>
          <p>Thank you for applying to become a Star Ambassador. We have received your application and our team will review it shortly.</p>
          <p>We appreciate your interest in representing our brand, and we will get back to you soon regarding the next steps.</p>
          <p>
            Best regards,<br>
            The MyInvestar Team
          </p>

          <!-- Divider -->
          <hr style="border: none; border-top: 1px solid #dddddd; margin: 30px 0;">

          <!-- Footer Section -->
          <div style="text-align: center; font-size: 12px; color: #888888;">
            
            <!-- Logo -->
            <img src="https://myinvestar.ng/images/myinvestar_logo_gold.webp" alt="MyInvestar Logo" style="width: 150px; margin-bottom: 20px;">
            
            <!-- App Download Buttons -->
            <p style="margin: 0 0 20px 0;">Get the MyInvestar App:</p>
            <div style="margin-bottom: 20px;">
              <a href="https://apps.apple.com/ng/app/myInvester/id1620126521" style="display: inline-block; margin: 0 5px;">
                <img src="https://ci3.googleusercontent.com/proxy/d7y-K4292uA9k-2-xM-D19KWDm2yv2-D2oPLk2z_DkUF2sW3Uo-H8j_vA-2HVJp2lD-Y2g=s0-d-e1-ft#https://gallery.mailchimp.com/27aac56736a0b4b6de43548e6/images/8410b968-12c8-4712-a898-25e6833a6f7c.png" alt="Download on the App Store" style="height: 40px;">
              </a>
              <a href="https://play.google.com/store/apps/details?id=com.firstally.myinvestar&pli=1" style="display: inline-block; margin: 0 5px;">
                <img src="https://ci3.googleusercontent.com/proxy/2-X_4NtmHi2sQ_I9857BwI6A7-2oLa-dSoR42bJPf9nvn34BlETDIqf-9-9b4w1-Q20XQ=s0-d-e1-ft#https://gallery.mailchimp.com/27aac56736a0b4b6de43548e6/images/3f20e4b8-a6fe-4d51-89a1-a67bcebe7ceb.png" alt="Get it on Google Play" style="height: 40px;">
              </a>
            </div>
            
            <!-- Company Details -->
            <p style="margin: 5px 0;">Powered by First Ally Asset Management</p>
            <p style="margin: 5px 0;">
              <a href="https://myinvestar.ng/static/router.html?id=SP02" style="color: #888888; text-decoration: underline;">Privacy Policy</a> | 
              <a href="https://myinvestar.ng" style="color: #888888; text-decoration: underline;">Visit our website</a>
            </p>
            
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