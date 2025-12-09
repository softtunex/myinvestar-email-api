const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

// Define CORS headers to allow requests from anywhere
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

exports.handler = async (event, context) => {
  // 1. Handle Preflight (Browser checks permission first)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // 2. Only allow POST
  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      headers,
      body: 'Method Not Allowed' 
    };
  }

  try {
    const data = JSON.parse(event.body);

    const title = data.title;
    const surname = data.surname;
    const othernames = data.other_names;
    const email = data.email;
    const mobile = data.mobile;
    const bvn = data.bvn;
    const address = data.address;

    const package_name = data.package.name;
    const amount = data.amount;
    
    const acc_bank = data.package.account.bank;
    const acc_name = data.package.account.name;
    const acc_no = data.package.account.number;

    const b_surname = data.b_surname;
    const b_names = data.b_names;
    const b_email = data.b_email;
    const b_mobile = data.b_mobile;

    const dateStr = new Date().toLocaleString('en-GB', { timeZone: 'Africa/Lagos', hour12: true });
    const firstName = othernames.split(' ')[0];

    // --- CONTENT ---
    const mailBody = `<p>Title: <strong>${title}</strong><br>
                    Surname: <strong>${surname}</strong><br>
                    Other Names: <strong>${othernames}</strong><br>
                    Email Address: <strong>${email}</strong><br>
                    Mobile Number: <strong>${mobile}</strong><br>
                    BVN: <strong>${bvn}</strong><br>
                    Address: <strong>${address}</strong></p>

                    <h3>Package</h3>
                    <p>Name: <strong>${package_name}</strong><br>
                    Amount: <strong>${amount}</strong><br>
                    Channel: <strong>Bank transfer</strong></p>

                    <h3>Beneficiary</h3>
                    <p>Surname: <strong>${b_surname}</strong><br>
                    Other Names: <strong>${b_names}</strong><br>
                    Email Address: <strong>${b_email}</strong><br>
                    Mobile Number: <strong>${b_mobile}</strong></p>
                    
                    <p>Date/Time: ${dateStr}</p>`;
        
    const staffMail = `<p>Dear team,<br><br> A new customer has just purchased a gift box (Bank transfer) with details below:</p>
        <h3>Giftor</h3>` + mailBody;

    const customerMail = `<p>Dear ${title} ${firstName},<br><br> Thank you for gifting a package, your order has been received and will be processed once payment is received. 
        Proceed to make payment by bank transfer or deposit to the account below and send evidence of payment to olatunji.buari@first-ally.com.</p>
        
        <h4>Bank account</h4>
        <p>${acc_no}<br>
        ${acc_bank}<br>
        ${acc_name}<p><br>
        
        <p>Find details of the package below:</p>
        <h3>Your details</h3>` + mailBody + `<br><br>Thank you.`;

    // --- SENDING ---

    // 1. Send to Staff
    await resend.emails.send({
      from: 'First Ally Asset Management <olatunji.buari@first-allyasset.com>',
      to: ['otega.ovie@first-ally.com', 'olatunji.buari@first-ally.com'],
      cc: ['olatunji.buari@first-ally.com'],
      subject: 'FAAM Gift Box Purchase',
      html: staffMail
    });

    // 2. Send to Customer
    await resend.emails.send({
      from: 'First Ally Asset Management <olatunji.buari@first-allyasset.com>',
      to: [email],
      cc: ['olatunji.buari@first-ally.com'], 
      subject: 'FAAM Gift Box Purchase',
      html: customerMail
    });

    return {
      statusCode: 200,
      headers, // <--- IMPORTANT: Send headers back with success
      body: JSON.stringify({ success: true })
    };

  } catch (error) {
    console.error('Transfer Email Error:', error);
    return { 
      statusCode: 500, 
      headers, // <--- IMPORTANT: Send headers back with error
      body: JSON.stringify({ error: 'Failed to send email' }) 
    };
  }
};