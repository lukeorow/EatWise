import { VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js";
import { mailtrapClient, sender } from "./mailtrap.config.js";

// sends email verification code when a new account has been created
export const sendVerificationEmail = async (email, verificationToken) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Verify your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
      ),
      category: "Email verification",
    });

    console.log("Email sent success", response);
  } catch (error) {
    console.error(`Error sending verification email`, error);
    throw new Error(`Error sending verification email: ${error}`);
  }
};

// sends a welcome email after a new account is created + email verified
export const sendWelcomeEmail = async (email, name) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      template_uuid: "3a612391-1e90-4feb-9092-be4f88c6575c",
      template_variables: {
        company_info_name: "EatWise",
        name: name,
      },
    });

    console.log("Welcome email sent successfully", response);
  } catch (error) {
    console.error(`Error sending welcome email`, error);

    throw new Error(`Error sending welcome email: ${error.message}`);
  }
};
