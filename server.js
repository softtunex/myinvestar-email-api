// server.js - Express.js server with Resend integration
const express = require('express');
const { Resend } = require('resend');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY);

app.use(cors());
app.use(express.json());

// Email templates
const getConfirmationEmailTemplate = (applicantData) => {
  const { firstName, lastName, email, areYouAStudent } = applicantData;
  
  return {
    from: 'MyInvestar <hello@myinvestar.ng>', // Use your verified domain
    to: [email],
    subject: 'Star Ambassador Application Received - MyInvestar',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Application Confirmation</title>
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
            .content {
              margin-bottom: 30px;
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
            .social-links {
              margin: 20px 0;
            }
            .social-links a {
              margin: 0 10px;
              color: #6366f1;
              text-decoration: none;
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
              
              <p>In the meantime, we encourage you to:</p>
              <ul>
                <li>Download the MyInvestar app and explore our platform</li>
                <li>Follow us on social media for updates and financial tips</li>
                <li>Read our blog for investment insights and success stories</li>
              </ul>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://play.google.com/store/apps/details?id=com.firstally.myinvestar&pli=1" class="button">Download Android App</a>
                <a href="https://apps.apple.com/ng/app/myInvester/id1620126521" class="button">Download iOS App</a>
              </div>
            </div>
            
            <div class="footer">
              <div class="social-links">
                <a href="https://www.facebook.com/profile.php?id=100080170355072">Facebook</a>
                <a href="https://twitter.com/myinvestar">Twitter</a>
                <a href="https://www.instagram.com/myinvestarng/">Instagram</a>
                <a href="https://myinvestar.ng/blog/">Blog</a>
              </div>
              
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

// Internal notification email template
const getInternalNotificationTemplate = (applicantData) => {
  const { 
    firstName, 
    lastName, 
    email, 
    phone, 
    areYouAStudent, 
    institution, 
    courseOfStudy, 
    level,
    employmentType,
    industry,
    ambassadorReason,
    registrationDate 
  } = applicantData;

  return {
    from: 'MyInvestar System <hello@myinvestar.ng>',
    to: ['hello@myinvestar.ng'], // Replace with your team's email
    subject: `New Star Ambassador Application - ${firstName} ${lastName}`,
    html: `
      <h2>New Star Ambassador Application</h2>
      <p><strong>Application Date:</strong> ${registrationDate}</p>
      
      <h3>Personal Information</h3>
      <p><strong>Name:</strong> ${firstName} ${lastName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      
      <h3>Background</h3>
      <p><strong>Student Status:</strong> ${areYouAStudent === 'yes' ? 'Yes' : 'No'}</p>
      
      ${areYouAStudent === 'yes' ? `
        <p><strong>Institution:</strong> ${institution || 'N/A'}</p>
        <p><strong>Course of Study:</strong> ${courseOfStudy || 'N/A'}</p>
        <p><strong>Level:</strong> ${level || 'N/A'}</p>
      ` : `
        <p><strong>Employment Type:</strong> ${employmentType || 'N/A'}</p>
        <p><strong>Industry:</strong> ${industry || 'N/A'}</p>
      `}
      
      <h3>Motivation</h3>
      <p><strong>Why they want to be an ambassador:</strong></p>
      <blockquote>${ambassadorReason}</blockquote>
      
      <p>Please review the full application in your admin dashboard.</p>
    `
  };
};

// API endpoint to send confirmation email
app.post('/api/send-confirmation-email', async (req, res) => {
  try {
    const applicantData = req.body;
    
    // Validate required fields
    if (!applicantData.email || !applicantData.firstName) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields' 
      });
    }

    // Send confirmation email to applicant
    const confirmationEmail = getConfirmationEmailTemplate(applicantData);
    const confirmationResult = await resend.emails.send(confirmationEmail);
    
    // Send internal notification
    const notificationEmail = getInternalNotificationTemplate(applicantData);
    const notificationResult = await resend.emails.send(notificationEmail);

    console.log('Confirmation email sent:', confirmationResult);
    console.log('Internal notification sent:', notificationResult);
    
    res.json({ 
      success: true, 
      confirmationId: confirmationResult.data?.id,
      notificationId: notificationResult.data?.id
    });
    
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to send confirmation email' 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;