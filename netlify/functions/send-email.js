// netlify/functions/send-email.js
const { Resend } = require('resend');

exports.handler = async (event, context) => {
  // Replace with your actual domain - this is crucial!
  const ALLOWED_ORIGIN = 'https://myinvestar.ng'; // or wherever your site is hosted
  
  const headers = {
    'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Max-Age': '86400', // 24 hours
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ message: 'Method Not Allowed' })
    };
  }

  try {
    // Initialize Resend with environment variable
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Parse request body
    const { firstName, email } = JSON.parse(event.body);

    // Validate required fields
    if (!firstName || !email) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          message: 'Missing required fields: firstName and email' 
        })
      };
    }

    // Send email
    const { data, error } = await resend.emails.send({
      from: 'MyInvestar Team <hello@myinvestar.ng>',
      to: [email],
      subject: 'Thank You for Your Star Ambassador Application',
      html: generateEmailHTML(firstName),
    });

    if (error) {
      console.error('Resend API error:', error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          message: 'Failed to send email',
          error: error.message 
        })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        message: 'Email sent successfully!',
        id: data.id 
      })
    };

  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        message: 'Internal server error',
        error: error.message 
      })
    };
  }
};

function generateEmailHTML(firstName) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to MyInvestar Star Ambassador Program</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 0;">
            <!-- Header with Logo -->
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
                <img src="https://myinvestar.ng/images/myinvestar_logo_white.png" alt="MyInvestar Logo" style="width: 180px; height: auto;">
            </div>
            
            <!-- Main Content -->
            <div style="padding: 40px 30px;">
                <h1 style="color: #333; font-size: 28px; margin-bottom: 20px; text-align: center;">
                    Thank You, ${firstName}!
                </h1>
                
                <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                    We have successfully received your application to become a <strong>MyInvestar Star Ambassador</strong>!
                </p>
                
                <div style="background: #f8f9fa; padding: 25px; border-radius: 10px; margin: 30px 0; border-left: 4px solid #667eea;">
                    <h3 style="color: #333; margin-top: 0; margin-bottom: 15px;">What happens next?</h3>
                    <ul style="color: #666; margin: 0; padding-left: 20px;">
                        <li style="margin-bottom: 10px;">Our team will review your application carefully</li>
                        <li style="margin-bottom: 10px;">We'll contact you within 5-7 business days</li>
                        <li style="margin-bottom: 10px;">If selected, you'll receive onboarding materials and next steps</li>
                    </ul>
                </div>
                
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 10px; text-align: center; margin: 30px 0;">
                    <h3 style="color: white; margin: 0; font-size: 18px;">Ready to Start Your Financial Journey?</h3>
                    <p style="color: white; margin: 10px 0; font-size: 14px;">While you wait, download the MyInvestar app and start building wealth today!</p>
                    
                    <div style="margin-top: 20px;">
                        <a href="https://apps.apple.com/ng/app/myInvester/id1620126521" style="display: inline-block; margin: 0 10px;">
                            <img src="https://myinvestar.ng/images/apple_white.png" alt="Download on App Store" style="height: 40px;">
                        </a>
                        <a href="https://play.google.com/store/apps/details?id=com.firstally.myinvestar&pli=1" style="display: inline-block; margin: 0 10px;">
                            <img src="https://myinvestar.ng/images/google_white.png" alt="Get it on Google Play" style="height: 40px;">
                        </a>
                    </div>
                </div>
                
                <p style="color: #666; font-size: 16px; line-height: 1.6; text-align: center;">
                    Have questions? Reply to this email or contact us at 
                    <a href="mailto:hello@myinvestar.ng" style="color: #667eea; text-decoration: none;">hello@myinvestar.ng</a>
                </p>
            </div>
            
            <!-- Footer -->
            <div style="background: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #eee;">
                <p style="color: #999; font-size: 14px; margin: 0;">
                    © ${new Date().getFullYear()} MyInvestar. All rights reserved.<br>
                    Powered by <a href="https://first-allyasset.com/" style="color: #667eea; text-decoration: none;">First Ally Asset Management</a>
                </p>
                
                <div style="margin: 20px 0;">
                    <a href="https://www.facebook.com/profile.php?id=100080170355072" style="margin: 0 10px; color: #667eea; text-decoration: none;">Facebook</a>
                    <a href="https://twitter.com/myinvestar" style="margin: 0 10px; color: #667eea; text-decoration: none;">Twitter</a>
                    <a href="https://www.instagram.com/myinvestarng/" style="margin: 0 10px; color: #667eea; text-decoration: none;">Instagram</a>
                </div>
            </div>
        </div>
    </body>
    </html>
  `;
}