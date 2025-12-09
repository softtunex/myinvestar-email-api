// netlify/functions/send-giftbox-transfer.js
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

// Email template for staff notification (Bank Transfer)
const getStaffEmailTemplate = (orderData) => {
  const { 
    title, surname, othernames, email, mobile, bvn, address,
    package_name, amount, acc_bank, acc_name, acc_no,
    b_surname, b_names, b_email, b_mobile, dateTime 
  } = orderData;
  
  return {
    from: 'First Ally Asset Management <hello@myinvestar.ng>',
    to: ['sales@first-ally.com', 'olatunji.buari@first-ally.com'],
    cc: ['operations@first-ally.com'],
    subject: 'FAAM Gift Box Purchase',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333333; margin: 0; padding: 0; background-color: #f8f9fa;">
        <div style="max-width: 700px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          
          <!-- Header Section -->
          <div style="background-color: #323e48; padding: 30px 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Gift Box Purchase Alert</h1>
          </div>

          <!-- Main Content -->
          <div style="padding: 40px 30px;">
            <p style="font-size: 16px; color: #333; margin: 0 0 20px 0;">Dear team,</p>
            <p style="font-size: 16px; color: #555; margin: 0 0 30px 0;">A new customer has just purchased a gift box (Bank transfer) with details below:</p>

            <!-- Giftor Information -->
            <div style="margin-bottom: 30px;">
              <h3 style="color: #d0af2b; font-size: 20px; margin: 0 0 15px 0; border-bottom: 2px solid #d0af2b; padding-bottom: 10px;">Giftor</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #666; width: 150px;"><strong>Title:</strong></td>
                  <td style="padding: 8px 0; color: #333;">${title}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Surname:</strong></td>
                  <td style="padding: 8px 0; color: #333;">${surname}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Other Names:</strong></td>
                  <td style="padding: 8px 0; color: #333;">${othernames}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Email:</strong></td>
                  <td style="padding: 8px 0; color: #333;">${email}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Mobile:</strong></td>
                  <td style="padding: 8px 0; color: #333;">${mobile}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>BVN:</strong></td>
                  <td style="padding: 8px 0; color: #333;">${bvn}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Address:</strong></td>
                  <td style="padding: 8px 0; color: #333;">${address}</td>
                </tr>
              </table>
            </div>

            <!-- Package Information -->
            <div style="margin-bottom: 30px;">
              <h3 style="color: #d0af2b; font-size: 20px; margin: 0 0 15px 0; border-bottom: 2px solid #d0af2b; padding-bottom: 10px;">Package</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #666; width: 150px;"><strong>Name:</strong></td>
                  <td style="padding: 8px 0; color: #333;">${package_name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Amount:</strong></td>
                  <td style="padding: 8px 0; color: #333;">${amount}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Channel:</strong></td>
                  <td style="padding: 8px 0; color: #333;"><strong style="color: #d0af2b;">Bank transfer</strong></td>
                </tr>
              </table>
            </div>

            <!-- Beneficiary Information -->
            <div style="margin-bottom: 30px;">
              <h3 style="color: #d0af2b; font-size: 20px; margin: 0 0 15px 0; border-bottom: 2px solid #d0af2b; padding-bottom: 10px;">Beneficiary</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #666; width: 150px;"><strong>Surname:</strong></td>
                  <td style="padding: 8px 0; color: #333;">${b_surname}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Other Names:</strong></td>
                  <td style="padding: 8px 0; color: #333;">${b_names}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Email:</strong></td>
                  <td style="padding: 8px 0; color: #333;">${b_email}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Mobile:</strong></td>
                  <td style="padding: 8px 0; color: #333;">${b_mobile}</td>
                </tr>
              </table>
            </div>

            <!-- Date/Time -->
            <div style="padding: 15px; background-color: #f8f9fa; border-radius: 5px;">
              <p style="margin: 0; color: #666; font-size: 14px;"><strong>Date/Time:</strong> ${dateTime}</p>
            </div>
          </div>

          <!-- Footer -->
          <div style="background-color: #323e48; padding: 20px; text-align: center;">
            <p style="color: #ffffff; margin: 0; font-size: 13px;">First Ally Asset Management</p>
          </div>

        </div>
      </body>
      </html>
    `
  };
};

// Email template for customer confirmation (Bank Transfer)
const getCustomerEmailTemplate = (orderData) => {
  const { 
    title, surname, othernames, email, mobile, bvn, address,
    package_name, amount, acc_bank, acc_name, acc_no,
    b_surname, b_names, b_email, b_mobile, dateTime 
  } = orderData;
  
  const firstName = othernames.split(' ')[0];
  
  return {
    from: 'First Ally Asset Management <hello@myinvestar.ng>',
    to: [email],
    subject: 'FAAM Gift Box Purchase',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333333; margin: 0; padding: 0; background-color: #f8f9fa;">
        <div style="max-width: 700px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          
          <!-- Header Section -->
          <div style="background-color: #323e48; padding: 30px 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Gift Box Order Confirmation</h1>
          </div>

          <!-- Main Content -->
          <div style="padding: 40px 30px;">
            <p style="font-size: 16px; color: #333; margin: 0 0 10px 0;"><strong>Dear ${title} ${firstName},</strong></p>
            <p style="font-size: 16px; color: #555; margin: 0 0 20px 0;">Thank you for gifting a package, your order has been received and will be processed once payment is received.</p>
            
            <div style="background-color: #fff3cd; border-left: 4px solid #d0af2b; padding: 15px 20px; margin: 0 0 30px 0; border-radius: 5px;">
              <p style="margin: 0 0 10px 0; color: #856404; font-size: 15px;"><strong>Payment Instructions:</strong></p>
              <p style="margin: 0; color: #856404; font-size: 14px;">Proceed to make payment by bank transfer or deposit to the account below and send evidence of payment to <strong>sales@first-ally.com</strong></p>
            </div>

            <!-- Bank Account Details -->
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
              <h4 style="color: #ffffff; margin: 0 0 15px 0; font-size: 18px;">Bank Account Details</h4>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #ffffff; font-size: 15px;"><strong>Account Number:</strong></td>
                  <td style="padding: 8px 0; color: #ffffff; font-size: 15px; text-align: right;"><strong>${acc_no}</strong></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #ffffff; font-size: 15px;"><strong>Bank:</strong></td>
                  <td style="padding: 8px 0; color: #ffffff; font-size: 15px; text-align: right;"><strong>${acc_bank}</strong></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #ffffff; font-size: 15px;"><strong>Account Name:</strong></td>
                  <td style="padding: 8px 0; color: #ffffff; font-size: 15px; text-align: right;"><strong>${acc_name}</strong></td>
                </tr>
              </table>
            </div>

            <!-- Order Details -->
            <p style="font-size: 16px; color: #333; margin: 0 0 20px 0;">Find details of the package below:</p>

            <!-- Your Details -->
            <div style="margin-bottom: 30px;">
              <h3 style="color: #d0af2b; font-size: 20px; margin: 0 0 15px 0; border-bottom: 2px solid #d0af2b; padding-bottom: 10px;">Your Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #666; width: 150px;"><strong>Title:</strong></td>
                  <td style="padding: 8px 0; color: #333;">${title}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Surname:</strong></td>
                  <td style="padding: 8px 0; color: #333;">${surname}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Other Names:</strong></td>
                  <td style="padding: 8px 0; color: #333;">${othernames}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Email:</strong></td>
                  <td style="padding: 8px 0; color: #333;">${email}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Mobile:</strong></td>
                  <td style="padding: 8px 0; color: #333;">${mobile}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>BVN:</strong></td>
                  <td style="padding: 8px 0; color: #333;">${bvn}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Address:</strong></td>
                  <td style="padding: 8px 0; color: #333;">${address}</td>
                </tr>
              </table>
            </div>

            <!-- Package -->
            <div style="margin-bottom: 30px;">
              <h3 style="color: #d0af2b; font-size: 20px; margin: 0 0 15px 0; border-bottom: 2px solid #d0af2b; padding-bottom: 10px;">Package</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #666; width: 150px;"><strong>Name:</strong></td>
                  <td style="padding: 8px 0; color: #333;">${package_name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Amount:</strong></td>
                  <td style="padding: 8px 0; color: #333;">${amount}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Channel:</strong></td>
                  <td style="padding: 8px 0; color: #333;">Bank transfer</td>
                </tr>
              </table>
            </div>

            <!-- Beneficiary -->
            <div style="margin-bottom: 30px;">
              <h3 style="color: #d0af2b; font-size: 20px; margin: 0 0 15px 0; border-bottom: 2px solid #d0af2b; padding-bottom: 10px;">Beneficiary</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #666; width: 150px;"><strong>Surname:</strong></td>
                  <td style="padding: 8px 0; color: #333;">${b_surname}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Other Names:</strong></td>
                  <td style="padding: 8px 0; color: #333;">${b_names}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Email:</strong></td>
                  <td style="padding: 8px 0; color: #333;">${b_email}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Mobile:</strong></td>
                  <td style="padding: 8px 0; color: #333;">${b_mobile}</td>
                </tr>
              </table>
            </div>

            <!-- Date/Time -->
            <div style="padding: 15px; background-color: #f8f9fa; border-radius: 5px;">
              <p style="margin: 0; color: #666; font-size: 14px;"><strong>Date/Time:</strong> ${dateTime}</p>
            </div>

            <p style="font-size: 16px; color: #555; margin: 30px 0 0 0;">Thank you.</p>
          </div>

          <!-- Footer -->
          <div style="background-color: #323e48; padding: 20px; text-align: center;">
            <p style="color: #ffffff; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">First Ally Asset Management</p>
            <p style="color: #d0af2b; margin: 0; font-size: 13px;">Building your financial future, one investment at a time</p>
          </div>

        </div>
      </body>
      </html>
    `
  };
};

// Main handler function
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
    const orderData = JSON.parse(event.body);
    
    // Validate required fields
    const requiredFields = ['title', 'surname', 'othernames', 'email', 'mobile', 'bvn', 'address', 
                           'package_name', 'amount', 'acc_bank', 'acc_name', 'acc_no',
                           'b_surname', 'b_names', 'b_email', 'b_mobile'];
    
    for (const field of requiredFields) {
      if (!orderData[field]) {
        return {
          statusCode: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type'
          },
          body: JSON.stringify({ 
            success: false, 
            error: `Missing required field: ${field}` 
          })
        };
      }
    }

    // Add date/time
    const dateTime = new Date().toLocaleString('en-GB', { 
      timeZone: 'Africa/Lagos',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    orderData.dateTime = dateTime;

    // Send staff notification email
    const staffEmailTemplate = getStaffEmailTemplate(orderData);
    const staffResult = await resend.emails.send(staffEmailTemplate);
    console.log('Staff email sent:', staffResult);

    // Send customer confirmation email
    const customerEmailTemplate = getCustomerEmailTemplate(orderData);
    const customerResult = await resend.emails.send(customerEmailTemplate);
    console.log('Customer email sent:', customerResult);
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST'
      },
      body: JSON.stringify({ 
        success: true,
        message: 'Emails sent successfully',
        staffEmailId: staffResult.data?.id,
        customerEmailId: customerResult.data?.id
      })
    };
    
  } catch (error) {
    console.error('Error sending emails:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({ 
        success: false, 
        error: 'Failed to send emails',
        details: error.message
      })
    };
  }
};