const nodemailer = require("nodemailer");

module.exports = function sendMail(
	email,
	subject = "lorem ipsum dolor sit amet",
	message
) {
	const html = ` <!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background: #ffffff;
      border: 1px solid #dddddd;
      border-radius: 5px;
      overflow: hidden;
    }
    .header {
      background: #007bff;
      color: #ffffff;
      padding: 20px;
      text-align: center;
    }
    .body {
      padding: 20px;
      text-align: left;
    }
    .footer {
      text-align: center;
      padding: 10px;
      background: #f4f4f4;
      font-size: 12px;
      color: #888888;
    }
    .button {
      display: inline-block;
      padding: 10px 20px;
      margin: 20px auto;
      color: #ffffff;
      background: #007bff;
      text-decoration: none;
      border-radius: 5px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to Our Service!</h1>
    </div>
    <div class="body">
      <p>Hi there,</p>
      <p>${message}</p>
      <p>If you have any questions, feel free to contact us at Ftpelitegroup@gmail.com</p>
    </div>
    <div class="footer">
      &copy; 2024 Your Company Name. All rights reserved.
    </div>
  </div>
</body>
</html>
`;
	const transporter = nodemailer.createTransport({
		host: process.env.BREVO_HOST,
		port: process.env.BREVO_PORT,
		auth: {
			user: process.env.BREVO_LOGIN,
			pass: process.env.BREVO_PASSWORD,
		},
	});

	transporter
		.sendMail({
			from: "ftpelitegroup@gmail.com",
			to: email,
			subject: subject,
			html: html,
		})
		.then((info) => {
			console.log(info.messageId);
		})
		.catch((e) => {
			console.log(e);
		});
};
//  const mailOptions = {
//from: "your-email@gmail.com",
// to: email,
// subject: "Upcoming Zoom Meeting Reminder",
//text: `Hi, you have a Zoom meeting scheduled at ${meetingDetails.time}.
//Here is your meeting link: ${meetingDetails.link}`,
//}

// from: '"Your App" <your-email@gmail.com>',
// to: email,
// subject: `Zoom Meeting Scheduled: ${appointment.title}`,
// html: `
//   <p>Dear ${email === appointment.hostEmail ? "Host" : "Participant"},</p>
//   <p>Your meeting has been scheduled:</p>
//   <p><strong>Title:</strong> ${appointment.title}</p>
//   <p><strong>Date & Time:</strong> ${new Date(appointment.startTime).toLocaleString()}</p>
//   <p><strong>Zoom Link:</strong> <a href="${appointment.zoomLink}">${appointment.zoomLink}</a></p>
// `,
// };
