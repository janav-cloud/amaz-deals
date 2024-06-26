"use server"

import { EmailContent, EmailProductInfo, NotificationType } from "@/types"
import nodemailer from 'nodemailer';

const Notification = {
    WELCOME: 'WELCOME',
    CHANGE_OF_STOCK: 'CHANGE_OF_STOCK',
    LOWEST_PRICE: 'LOWEST_PRICE',
    THRESHOLD_MET: 'THRESHOLD_MET',
}

export async function generateEmailBody (product: EmailProductInfo, type: NotificationType) {
    const shortenedTitle = product.title.length > 20? `${product.title.substring(0,20)}...` : product.title;

    let subject = ''
    let body = ''

    switch(type) {
        case Notification.WELCOME:
            subject = `Welcome to AmazDeals! 🤝`
            body = `
                <h2>Welcome to AmazDeals!</h2>
                <p>We're excited to have you on board! 🎉</p>
                <p>Get ready to discover amazing deals on your favorite products.</p>
                <p>Item added to tracklist! - ${shortenedTitle}</p>
                <p>URL: ${product.url}</p>
            `
            break;

        case Notification.CHANGE_OF_STOCK:
            subject = `📊 Stock Update! 📊`
            body = `
                <h2>Stock Update: ${shortenedTitle}</h2>
                <p>The stock level for ${shortenedTitle} has changed.</p>
                <p>Check the current availability and price <a href="${product.url}">here</a>.</p>
            `
            break;

        case Notification.LOWEST_PRICE:
            subject = `🥳 Price Drop Alert! ✅`
            body = `
                <h2>Price Drop Alert: ${shortenedTitle}</h2>
                <p>The price for ${shortenedTitle} has dropped!</p>
                <p>Grab this amazing deal before it's gone <a href="${product.url}">here</a>.</p>
            `
            break;

        case Notification.THRESHOLD_MET:
            subject = `⭐ Lowest Price Ever! ⭐`
            body = `
                <h2>Lifetime Low: ${shortenedTitle}</h2>
                <p>The price for ${shortenedTitle} has reached an all-time low!</p>
                <p>Don't miss out on this incredible deal <a href="${product.url}">here</a>.</p>
            `
            break;

        default:
            break;
    }

    return { subject, body }
}

const transporter = nodemailer.createTransport({
    pool: true,
    service: 'hotmail',
    port: 2525,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    maxConnections: 1
});

export const sendEmail = async(emailContent: EmailContent, sendTo: string[]) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: sendTo,
        html: emailContent.body,
        subject: emailContent.subject,
    }

    transporter.sendMail(mailOptions, (error: any, info: any) => {
        if(error) {
            console.log(error);
            return null;
        }

        console.log('Email sent: ', info);
    })
}