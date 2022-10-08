import nodemailer, { TransportOptions } from "nodemailer";

const port = parseInt(process.env.EMAIL_SERVER_PORT!);

const config = {
    host: process.env.EMAIL_SERVER_HOST,
    port,
    secure: false,
    auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
    },
    // secure: port === 465,
    // tls: {
    //     rejectUnauthorized: process.env.NODE_ENV === "development" ? false : true,
    // },
}

export const transporter = nodemailer.createTransport(config);
