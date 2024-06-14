import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { Shootmail, type ShootMailConfig } from "shootmail";

let shootmail: Shootmail;

const getShootmailClient = (env: any) => {
    const config: ShootMailConfig = {
        shootmailApiKey: env.SHOOTMAIL_API,
        providers: [
            {
                "provider": "zoho",
                "apiKey": env.ZOHO
            },
            {
                "provider": "resend",
                "apiKey": env.RESEND
            },
            {
                "provider": "sendgrid",
                "apiKey": env.SENDGRID_KEY
            },
            {
                "provider": "postmark",
                "apiKey": env.POSTMARK_KEY
            }
        ],
        brand: {
            color: "#ff3e00",
            logo: {
                default: "https://res.cloudinary.com/curead/image/upload/c_scale,f_auto,q_auto,w_343/v1712843877/Shootmail/logos/shootm-logo-with-name_jgdq2l.png"
            }
        }
    }

    shootmail = new Shootmail(config);
    return shootmail;
}

export const POST: RequestHandler = async ({platform}) => {
    const shootmail = getShootmailClient(platform?.env);
    const response = await shootmail.shoot({
        from: { name: "Subhendu", email: platform?.env.POSTMARK_MAIL },
        provider: "postmark",
        subject: "Shootmail SDK Test - CF Workers",
        templateId: "jljowhfehdrgkrc",
        to: [
            {
                email: platform?.env.POSTMARK_MAIL
            }
        ],
        variables: [
            {
                type: "preHeader",
                text: "Your OTP signing up on Shootmail",
            },
            {
                type: "heading",
                text: "Your one time password!",
                align: "center",
                level: "2",
            },
            {
                type: "text",
                text: "Your OTP signing up on Shootmail",
                align: "center",
            },
            {
                type: "otp",
                otp: "007007",
                displayBoxes: true,
                align: "center",
            },
            {
                type: "paragraphs",
                text: [
                    "This OTP is valid for 5 minutes. Please do not share this OTP with anyone.",
                ],
                align: "center",
            },
        ],
    });

    return json(response);
};