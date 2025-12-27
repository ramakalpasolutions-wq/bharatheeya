// src/app/api/contact/route.js
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    console.log("📧 Contact API called with:", { name, email, messageLength: message?.length });

    // Validate input
    if (!name || !email || !message) {
      console.error("❌ Validation failed: Missing fields");
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error("❌ Validation failed: Invalid email");
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Check environment variables
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.error("❌ Missing EMAIL_USER or EMAIL_PASSWORD in environment variables");
      return NextResponse.json(
        { error: "Email service not configured. Please contact administrator." },
        { status: 500 }
      );
    }

    console.log("✅ Environment variables found");
    console.log("📧 EMAIL_USER:", process.env.EMAIL_USER);
    console.log("📧 EMAIL_TO:", process.env.EMAIL_TO || process.env.EMAIL_USER);

    // Create transporter with detailed config
    let transporter;
    
    try {
      transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
        // Add debug options
        debug: true,
        logger: true,
      });

      console.log("✅ Transporter created");

      // Verify transporter
      await transporter.verify();
      console.log("✅ Transporter verified successfully");
    } catch (verifyError) {
      console.error("❌ Transporter verification failed:", verifyError);
      return NextResponse.json(
        { 
          error: "Email service configuration error",
          details: verifyError.message 
        },
        { status: 500 }
      );
    }

    // Email to admin/organization
    const mailOptionsToAdmin = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_TO || process.env.EMAIL_USER,
      replyTo: email,
      subject: `New Contact Message - The Bharatheeya Seva Welfare Society`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0a0612;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            
            <!-- Header with Gradient -->
            <div style="background: linear-gradient(135deg, #0a0612 0%, #120920 50%, #8B1A5A 100%); padding: 40px 20px; border-radius: 20px 20px 0 0; text-align: center; border: 2px solid rgba(212, 175, 55, 0.3); border-bottom: none;">
              <h1 style="margin: 0; color: #D4AF37; font-size: 32px; font-weight: bold; text-shadow: 0 0 20px rgba(212, 175, 55, 0.3);">
                📬 New Contact Message
              </h1>
              <p style="margin: 10px 0 0 0; color: #f5f5f1; font-size: 16px; opacity: 0.9;">
                The Bharatheeya Seva Welfare Society
              </p>
            </div>
            
            <!-- Content Body -->
            <div style="background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(10px); padding: 30px; border-radius: 0 0 20px 20px; border: 2px solid rgba(212, 175, 55, 0.3); border-top: none;">
              
              <!-- Contact Details Section -->
              <div style="margin-bottom: 25px;">
                <h2 style="color: #D4AF37; margin: 0 0 15px 0; font-size: 22px; border-bottom: 2px solid rgba(212, 175, 55, 0.3); padding-bottom: 10px;">
                  👤 Contact Details
                </h2>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #d5c08a; font-weight: 600; width: 100px;">Name:</td>
                    <td style="padding: 8px 0; color: #f5f5f1;">${name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #d5c08a; font-weight: 600;">Email:</td>
                    <td style="padding: 8px 0;">
                      <a href="mailto:${email}" style="color: #D4AF37; text-decoration: none; font-weight: 500;">${email}</a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #d5c08a; font-weight: 600;">Date:</td>
                    <td style="padding: 8px 0; color: #f5f5f1;">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</td>
                  </tr>
                </table>
              </div>
              
              <!-- Message Section -->
              <div>
                <h2 style="color: #D4AF37; margin: 0 0 15px 0; font-size: 22px; border-bottom: 2px solid rgba(212, 175, 55, 0.3); padding-bottom: 10px;">
                  💬 Message
                </h2>
                <div style="background: rgba(0, 0, 0, 0.3); padding: 20px; border-left: 4px solid #D4AF37; border-radius: 8px;">
                  <p style="margin: 0; color: #f5f5f1; white-space: pre-wrap; line-height: 1.6; font-size: 15px;">${message}</p>
                </div>
              </div>
              
              <!-- Action Button -->
              <div style="margin-top: 30px; text-align: center;">
                <a href="mailto:${email}" style="display: inline-block; background: linear-gradient(135deg, #D4AF37 0%, #8B1A5A 100%); color: white; padding: 14px 32px; border-radius: 50px; text-decoration: none; font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);">
                  Reply to ${name}
                </a>
              </div>
              
              <!-- Footer -->
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(212, 175, 55, 0.2); text-align: center;">

                <p style="margin: 5px 0 0 0; color: #f5f5f1; opacity: 0.7; font-size: 12px;">
                  D.No 12-128, Opp. Govt Hospital, Addanki, Bapatla District, AP - 523201
                </p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    // Email to user (confirmation)
    const mailOptionsToUser = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Thank you for contacting The Bharatheeya Seva Welfare Society",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0a0612;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            
            <!-- Header with Gradient -->
            <div style="background: linear-gradient(135deg, #0a0612 0%, #120920 50%, #8B1A5A 100%); padding: 40px 20px; border-radius: 20px 20px 0 0; text-align: center; border: 2px solid rgba(212, 175, 55, 0.3); border-bottom: none;">
              <div style="font-size: 60px; margin-bottom: 10px;">🙏</div>
              <h1 style="margin: 0; color: #D4AF37; font-size: 32px; font-weight: bold;">
                Thank You for Reaching Out!
              </h1>
              <p style="margin: 10px 0 0 0; color: #f5f5f1; font-size: 16px; opacity: 0.9;">
                The Bharatheeya Seva Welfare Society
              </p>
            </div>
            
            <!-- Content Body -->
            <div style="background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(10px); padding: 30px; border-radius: 0 0 20px 20px; border: 2px solid rgba(212, 175, 55, 0.3); border-top: none;">
              
              <!-- Greeting -->
              <p style="margin: 0 0 20px 0; color: #f5f5f1; font-size: 16px; line-height: 1.6;">
                Dear <strong style="color: #D4AF37;">${name}</strong>,
              </p>
              
              <p style="margin: 0 0 20px 0; color: #f5f5f1; font-size: 15px; line-height: 1.6;">
                Thank you for contacting <strong style="color: #D4AF37;">The Bharatheeya Seva Welfare Society</strong>. We have received your message and will get back to you as soon as possible.
              </p>
              
              <p style="margin: 0 0 25px 0; color: #f5f5f1; font-size: 15px; line-height: 1.6;">
                Our team reviews all inquiries carefully and strives to respond within 24-48 hours during business days.
              </p>
              
              <!-- Message Recap -->
              <div style="background: rgba(0, 0, 0, 0.3); padding: 20px; border-left: 4px solid #D4AF37; border-radius: 8px; margin-bottom: 25px;">
                <p style="margin: 0 0 10px 0; color: #D4AF37; font-weight: 600; font-size: 15px;">
                  📝 Your Message:
                </p>
                <p style="margin: 0; color: #f5f5f1; white-space: pre-wrap; line-height: 1.6; font-size: 14px; opacity: 0.9;">${message}</p>
              </div>
              
              <!-- What to Expect -->
              <div style="background: rgba(212, 175, 55, 0.1); padding: 20px; border-radius: 12px; margin-bottom: 25px;">
                <h3 style="margin: 0 0 15px 0; color: #D4AF37; font-size: 18px;">
                  What happens next?
                </h3>
                <ul style="margin: 0; padding-left: 20px; color: #f5f5f1; font-size: 14px; line-height: 1.8;">
                  <li>We review your inquiry carefully</li>
                  <li>The appropriate team member will respond</li>
                  <li>You'll receive a detailed reply via email</li>
                  <li>For urgent matters, we prioritize responses</li>
                </ul>
              </div>
              
              <!-- Call to Action -->
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://bharatheeyaseva.org'}" style="display: inline-block; background: linear-gradient(135deg, #D4AF37 0%, #8B1A5A 100%); color: white; padding: 14px 32px; border-radius: 50px; text-decoration: none; font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);">
                  Visit Our Website
                </a>
              </div>
              
              <!-- About Section -->
              <div style="background: rgba(139, 26, 90, 0.1); padding: 20px; border-radius: 12px; margin-bottom: 25px;">
                <h3 style="margin: 0 0 12px 0; color: #D4AF37; font-size: 16px;">
                  About Our Society
                </h3>
                <p style="margin: 0; color: #f5f5f1; font-size: 13px; line-height: 1.6; opacity: 0.9;">
                  The Bharatheeya Seva Welfare Society is a registered non-profit organization  dedicated to promoting education, human rights, and social welfare across Andhra Pradesh through specialized wings serving diverse community needs.
                </p>
              </div>
              
              <!-- Signature -->
              <div style="margin-top: 25px;">
                <p style="margin: 0 0 5px 0; color: #f5f5f1; font-size: 15px;">
                  Best regards,
                </p>
                <p style="margin: 0; color: #D4AF37; font-weight: bold; font-size: 16px;">
                  The Bharatheeya Seva Welfare Society Team
                </p>
              </div>
              
              <!-- Footer -->
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(212, 175, 55, 0.2);">
                <p style="margin: 0 0 8px 0; color: #d5c08a; font-size: 13px; text-align: center;">
                  <strong>Contact Information</strong>
                </p>
                <p style="margin: 0; color: #f5f5f1; opacity: 0.8; font-size: 12px; text-align: center; line-height: 1.6;">
                  D.No 12-128, Opp. Govt Hospital, Rev Ward No. 14<br>
                  Addanki, Bapatla District, Andhra Pradesh - 523201<br>
                  <a href="mailto:contact@bharatheeyaseva.org" style="color: #D4AF37; text-decoration: none;">contact@bharatheeyaseva.org</a>
                </p>
                
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    console.log("📤 Sending email to admin...");
    await transporter.sendMail(mailOptionsToAdmin);
    console.log("✅ Admin email sent successfully");

    console.log("📤 Sending confirmation email to user...");
    await transporter.sendMail(mailOptionsToUser);
    console.log("✅ User confirmation email sent successfully");

    return NextResponse.json(
      { 
        success: true, 
        message: "Message sent successfully! Check your email for confirmation." 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Contact API Error:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      command: error.command,
      stack: error.stack,
    });
    
    return NextResponse.json(
      { 
        error: "Failed to send message. Please try again later.",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
