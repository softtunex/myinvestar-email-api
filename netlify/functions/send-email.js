// netlify/functions/send-email.js
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

// Email template function
const getConfirmationEmailTemplate = (applicantData) => {
  const { firstName, lastName, email } = applicantData;
  
  return {
    from: 'MyInvestar <hello@myinvestar.ng>', // Now using your verified domain
    to: [email],
    subject: 'Star Ambassador Application Received - MyInvestar',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { 
              font-family: Arial, sans-serif; 
              line-height: 1.6; 
              color: #333; 
              max-width: 600px; 
              margin: 0 auto; 
              padding: 20px;
              background-color: #f4f4f4;
            }
            .container {
              background: white;
              padding: 30px;
              border-radius: 8px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo {
              max-width: 180px;
              margin-bottom: 20px;
            }
            .highlight {
              background: #f8f9ff;
              padding: 15px;
              border-left: 4px solid #6366f1;
              margin: 20px 0;
            }
            .button {
              display: inline-block;
              background: #6366f1;
              color: white;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 5px;
              margin: 10px 0;
            }
            .footer {
              text-align: center;
              font-size: 14px;
              color: #666;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #eee;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <img src="https://myinvestar.ng/images/myinvestar_logo_gold.webp" alt="MyInvestar" class="logo">
              <h1 style="color: #6366f1; margin: 0;">Thank You, ${firstName}!</h1>
            </div>
            
            <div class="content">
              <p>Dear ${firstName} ${lastName},</p>
              
              <p>Thank you for your interest in becoming a MyInvestar Star Ambassador! We have successfully received your application and are excited about the possibility of having you join our team.</p>
              
              <div class="highlight">
                <h3 style="margin-top: 0; color: #6366f1;">What happens next?</h3>
                <ul>
                  <li><strong>Review Process:</strong> Our team will carefully review your application within 3-5 business days</li>
                  <li><strong>Evaluation:</strong> We'll assess your profile, experience, and motivation</li>
                  <li><strong>Next Steps:</strong> If selected, we'll contact you for the next phase of the application process</li>
                </ul>
              </div>
              
              <p>As a Star Ambassador, you'll have the opportunity to:</p>
              <ul>
                <li>Master the art of investing and financial literacy</li>
                <li>Build wealth while expanding your professional network</li>
                <li>Earn lucrative commissions through our competitive structure</li>
                <li>Join a thriving community of driven individuals</li>
                <li>Develop essential skills in sales, marketing, and financial communication</li>
              </ul>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://play.google.com/store/apps/details?id=com.firstally.myinvestar&pli=1" class="button">Download Android App</a>
                <a href="https://apps.apple.com/ng/app/myInvester/id1620126521" class="button">Download iOS App</a>
              </div>
            </div>
            
            <div class="footer">
              <p>If you have any questions, feel free to contact us at <a href="mailto:hello@myinvestar.ng">hello@myinvestar.ng</a></p>
              
              <p>Best regards,<br>
              <strong>The MyInvestar Team</strong><br>
              Powered by First Ally Asset Management</p>
              
              <p style="font-size: 12px; color: #999; margin-top: 20px;">
                This email was sent to ${email}. If you didn't apply to become a Star Ambassador, please ignore this email.
              </p>
            </div>
          </div>
        </body>
      </html>
    `
  };
};

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
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({ 
        success: false, 
        error: 'Failed to send confirmation email' 
      })
    };
  }
};