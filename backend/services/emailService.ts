// backend/services/emailService.ts

import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();
console.log("📌 RESEND_API_KEY:", process.env.RESEND_API_KEY);
console.log("📌 NOTIFICATION_EMAIL:", process.env.NOTIFICATION_EMAIL);


const resend = new Resend(process.env.RESEND_API_KEY);

const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || 'annonymosshacker123@gmail.com';

export async function sendNewUserEmail(email: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Nexus <onboarding@resend.dev>',
      to: NOTIFICATION_EMAIL,
      subject: '🚨 New User Registration',
      html: `
        <h2>New User Registered</h2>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
      `,
    });

    if (error) {
      console.error('Resend error (new user):', error);
      return;
    }

    console.log('New user email sent:', data);
  } catch (err) {
    console.error('Failed to send email:', err);
  }
}

export async function sendTopUpEmail(email: string, amount: number) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Nexus <onboarding@resend.dev>',
      to: NOTIFICATION_EMAIL,
      subject: '💰 User Top-Up Alert',
      html: `
        <h2>User Account Topped Up</h2>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Amount Added:</strong> ${amount}</p>
        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
      `,
    });

    if (error) {
      console.error('Resend error (top-up):', error);
      return;
    }

    console.log('Top-up email sent:', data);
  } catch (err) {
    console.error('Failed to send email:', err);
  }
}
export async function sendPurchaseEmail(email: string, amount: number) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Nexus <onboarding@resend.dev>',
      to: process.env.NOTIFICATION_EMAIL!,
      subject: '💳 Purchase Detected',
      html: `
        <h2>User Made a Purchase</h2>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Amount Spent:</strong> ${amount}</p>
        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
      `,
    });

    if (error) {
      console.error('Resend error (purchase):', error);
      return;
    }

    console.log('Purchase email sent:', data);
  } catch (err) {
    console.error('Failed to send purchase email:', err);
  }
}