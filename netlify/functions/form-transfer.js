const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

exports.handler = async (event, context) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const data = JSON.parse(event.body);

    // Map the incoming JSON data to variables matching your PHP code
    const title = data.title;
    const surname = data.surname;
    const othernames = data.other_names;
    const email = data.email;
    const mobile = data.mobile;
    const bvn = data.bvn;
    const address = data.address;

    // Package details
    const package_name = data.package.name;
    const amount = data.amount;
    
    // Bank details (extracted from the package object)
    const acc_bank = data.package.account.bank;
    const acc_name = data.package.account.name;
    const acc_no = data.package.account.number;

    // Beneficiary details
    const b_surname = data.b_surname;
    const b_names = data.b_names;
    const b_email = data.b_email;
    const b_mobile = data.b_mobile;

    // Get Date and First Name
    const dateStr = new Date().toLocaleString('en-GB', { timeZone: 'Africa/Lagos', hour12: true });
    const firstName = othernames.split(' ')[0];

    // --- EXACT CONTENT FROM YOUR PHP FILE ---

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
        Proceed to make payment by bank transfer or deposit to the account below and send evidence of payment to sales@first-ally.com.</p>
        
        <h4>Bank account</h4>
        <p>${acc_no}<br>
        ${acc_bank}<br>
        ${acc_name}<p><br>
        
        <p>Find details of the package below:</p>
        <h3>Your details</h3>` + mailBody + `<br><br>Thank you.`;

    // --- SENDING LOGIC (Matching your PHP recipients) ---

    // 1. Send to Staff (Otega & Sales) with CC to Operations
    await resend.emails.send({
      from: 'First Ally Asset Management <sales@first-allyasset.com>', // Verify this domain in Resend
      to: ['otega.ovie@first-ally.com', 'sales@first-ally.com'],
      cc: ['operations@first-ally.com'],
      subject: 'FAAM Gift Box Purchase',
      html: staffMail
    });

    // 2. Send to Customer with CC to Operations (Matching your PHP headers)
    await resend.emails.send({
      from: 'First Ally Asset Management <sales@first-allyasset.com>',
      to: [email],
      cc: ['operations@first-ally.com'], 
      subject: 'FAAM Gift Box Purchase',
      html: customerMail
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };

  } catch (error) {
    console.error('Transfer Email Error:', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Failed to send email' }) };
  }
};