const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();
const { UserRegister, login, logout, getUserById, getAllUsers, updateUser, useractivitylogpost, userActivityById, allUserActiviyLog } = require('../controllers/userController');
// const router = Router();

router.post('/register', UserRegister);
router.post('/login', login);
router.post('/logout', logout);
router.get('/profile/:id', getUserById);
router.get('/users', getAllUsers);
router.put('/profile/:id', updateUser);
// user Activity log
router.post('/useractivity', useractivitylogpost)
router.get('/alluseractivity', allUserActiviyLog)
router.get('/useractivity/:userid', userActivityById)

// router.post('/email-visit-data', async (req, res) => {
//   try {
//     const { email, visitedPages } = req.body;

//     // Create email transporter
//     // const transporter = nodemailer.createTransport({
//     //   service: 'gmail', // or your email service
//     //   auth: {
//     //     user: process.env.EMAIL_USER,
//     //     pass: process.env.EMAIL_PASS,
//     //   },
//     // });
//     const transporter = nodemailer.createTransport({
//       host: '204.11.59.88:2096', // or the SMTP server provided by your hosting
//       port: 465, // or 587 depending on your provider
//       secure: true, // true for port 465, false for 587
//       auth: {
//         user: "abhishek.jaiswal@gyaat.in", // e.g., info@yourdomain.com
//         pass: "@asbhshek123", // your email password or app password
//       },
//     });

//     transporter.verify(function (error, success) {
//       if (error) {
//         console.error('SMTP connection failed:', error);
//       } else {
//         console.log('Server is ready to send messages');
//       }
//     });


//     // Format visited pages list
//     const pagesList = visitedPages.map(page => `- ${page}`).join('\n');

//     // Email options
//     const mailOptions = {
//       from: "abhishek.jaiswal@gyaat.in",
//       to: email,
//       subject: 'Your Visit Record',
//       text: `Here are the pages you visited:\n\n${pagesList}\n\nThank you for using our service!`,
//       html: `
//         <h1>Your Visit Record</h1>
//         <p>Here are the pages you visited:</p>
//         <ul>
//           ${visitedPages.map(page => `<li>${page}</li>`).join('')}
//         </ul>
//         <p>Thank you for using our service!</p>
//       `,
//     };

//     // Send email
//     await transporter.sendMail(mailOptions);

//     res.status(200).json({ message: 'Email sent successfully', mailOptions });
//   } catch (error) {
//     console.error('Error sending email:', error);
//     res.status(500).json({ error: 'Failed to send email' });
//   }
// });



router.post('/email-visit-data', async (req, res) => {
  try {

    const transporter = nodemailer.createTransport({
  host: '204.11.59.88', // fallback to IP
  port: 465,
  secure: true,
  auth: {
    user: 'connect@gyaat.in',
    pass: 'Y7l=4bS&Aa7g',
  },
  tls: {
    rejectUnauthorized: false
  },
  logger: true,
  debug: true
});



    // const transporter = nodemailer.createTransport({
    //   host: 'smtp.gyaat.in',         // ✅ use domain, not IP
    //   port: 465,                     // ✅ SSL port
    //   secure: true,                  // ✅ SSL/TLS
    //   auth: {
    //     user: 'abhishek.jaiswal@gyaat.in',   // ✅ your full email address
    //     pass: '@asbhshek123',    // ❗ use the exact password you set in cPanel
    //   },
    //   logger: true,   // ✅ Enable logs
    //   debug: true     // ✅ Enable debug output
    // });

    const mailOptions = {
      from: 'connect@gyaat.in',
      to: 'aj478631@gmail.com',
      subject: 'Test Email from Nodemailer',
      text: 'This is a test email sent from Node.js using secure SMTP.',
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.error('❌ Error sending email:', error);
      }
      console.log('✅ Email sent:', info.response);
    });






    //   const { email, visitedPages } = req.body;

    //   const transporter = nodemailer.createTransport({
    //     host: '204.11.59.88',
    //     port: 465,
    //     secure: true,
    //     auth: {
    //       user: 'abhishek.jaiswal@gyaat.in',
    //       pass: '@asbhshek123',
    //     },
    //       tls: {
    //   rejectUnauthorized: false, // ⚠️ insecure, only for testing
    // },
    //   });

    //   const mailOptions = {
    //     from: '"Gyaat Visit Report" <abhishek.jaiswal@gyaat.in>',
    //     to: email,
    //     subject: 'Your Visit Record',
    //     text: `You visited these pages:\n\n${visitedPages.map(p => `- ${p}`).join('\n')}`,
    //     html: `
    //       <h3>Your Visit Record</h3>
    //       <ul>${visitedPages.map(page => `<li>${page}</li>`).join('')}</ul>
    //       <p>Thanks for visiting!</p>
    //     `,
    //   };

    //   await transporter.sendMail(mailOptions);
    //   res.status(200).json({ message: 'Email sent successfully' });

  } catch (error) {
    console.error('❌ Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});








module.exports = router;