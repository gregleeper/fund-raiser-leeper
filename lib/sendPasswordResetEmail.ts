/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
const nodemailer = require('nodemailer');
const aws = require('@aws-sdk/client-ses');

export interface Envelope {
  from: string;
  to?: string[] | null;
}
export interface MailResponse {
  accepted?: string[] | null;
  rejected?: null[] | null;
  envelopeTime: number;
  messageTime: number;
  messageSize: number;
  response: string;
  envelope: Envelope;
  messageId: string;
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
const ses = new aws.SES({
  apiVersion: '2010-12-01',
  region: 'us-east-1',
});

function makeANiceEmail(text: string) {
  return `
    <div className="email" style="
      border: 1px solid black;
      padding: 20px;
      font-family: sans-serif;
      line-height: 2;
      font-size: 20px;
    ">
      <h2>Hello There!</h2>
      <p>${text}</p>
      <p>😘, Lupe and Stephanie</p>
    </div>
  `;
}

// create Nodemailer SES transporter

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
const transporter = nodemailer.createTransport({
  SES: { ses, aws },
  sendingRate: 1, // max 1 messages/second
});

// // Push next messages to Nodemailer
// transporter.once('idle', () => {
//   if (transporter.isIdle()) {
//       transporter.sendMail(...);
//   }
// });

// send some mail
export async function sendPasswordResetEmail(
  resetToken: string,
  to: string
): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const info = await transporter.sendMail({
    from: 'seleeper1@gmail.com',
    to,
    subject: "Password Reset for Lupe and Stephanie's Tamales",
    html: makeANiceEmail(`Your Password Reset Token is here!
     
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      <a href="${process.env.FRONTEND_URL}/reset?token=${resetToken}">Click Here to reset</a>
    `),
    // ses: {
    //   // optional extra arguments for SendRawEmail
    //   Tags: [
    //     {
    //       Name: 'Tamales',
    //       Value: 'reset password sent.',
    //     },
    //   ],
    // },
  });
}
