import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy_key_for_build")

function escapeHTML(str: string): string {
    if (!str) return ""
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;")
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { name, email, phone, message } = body

        // Basic validation — only name, email, phone are required
        if (!name || !email || !phone) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        const ADMIN_EMAILS = ["basmalublin@gmail.com", "basmamezzestaff@gmail.com"]

        // 1. Send confirmation to customer
        if (process.env.RESEND_API_KEY && email) {
            await resend.emails.send({
                from: "Basma Mezze & Grill <zamowienia@basmamezze.pl>",
                replyTo: "basmalublin@gmail.com",
                to: email,
                subject: "Dziękujemy za zapytanie o Party Box — Basma Mezze & Grill",
                html: `
                <!DOCTYPE html>
                <html>
                <head><meta charset="utf-8"></head>
                <body style="margin: 0; padding: 0; background-color: #f5f5f5;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
                        <tr>
                            <td align="center">
                                <table width="600" cellpadding="0" cellspacing="0" style="background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
                                    <tr>
                                        <td style="background: linear-gradient(135deg, #597FB1, #326096); padding: 40px 30px; text-align: center;">
                                            <h1 style="margin: 0; font-family: Arial, sans-serif; font-size: 28px; color: #BA9D76; letter-spacing: 2px;">BASMA MEZZE & GRILL</h1>
                                            <p style="margin: 8px 0 0; font-family: Arial, sans-serif; font-size: 13px; color: rgba(255,255,255,0.7); letter-spacing: 1px;">ZAPYTANIE O PARTY BOX</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 30px 30px 10px;">
                                            <p style="font-family: Arial, sans-serif; font-size: 16px; color: #333; margin: 0;">Dzień dobry <strong>${escapeHTML(name)}</strong>,</p>
                                            <p style="font-family: Arial, sans-serif; font-size: 14px; color: #666; margin: 10px 0 0;">Dziękujemy za zainteresowanie naszym Party Boxem! Potwierdzamy otrzymanie Twojego zapytania. Nasz zespół skontaktuje się z Tobą wkrótce.</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 15px 30px;">
                                            <table width="100%" cellpadding="0" cellspacing="0" style="background: #f8f6f3; border-radius: 12px; border-left: 4px solid #BA9D76; padding: 20px;">
                                                <tr>
                                                    <td>
                                                        <p style="margin: 0 0 10px; font-family: Arial, sans-serif; font-size: 14px; color: #555;"><strong>Imię:</strong> ${escapeHTML(name)}</p>
                                                        <p style="margin: 0 0 10px; font-family: Arial, sans-serif; font-size: 14px; color: #555;"><strong>Telefon:</strong> ${escapeHTML(phone)}</p>
                                                        <p style="margin: 0; font-family: Arial, sans-serif; font-size: 14px; color: #555;"><strong>Wiadomość:</strong><br/>${escapeHTML(message || "")}</p>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="background: #2B2B2B; padding: 25px 30px; text-align: center;">
                                            <p style="margin: 0; font-family: Arial, sans-serif; font-size: 12px; color: #BA9D76;">Basma Mezze & Grill — Do zobaczenia! 🥙</p>
                                            <p style="margin: 6px 0 0; font-family: Arial, sans-serif; font-size: 11px; color: rgba(255,255,255,0.4);">Ta wiadomość została wysłana automatycznie.</p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
                `,
            })
        }

        // 2. Send alert to admin emails
        if (process.env.RESEND_API_KEY) {
            for (const adminEmail of ADMIN_EMAILS) {
                await resend.emails.send({
                    from: "Basma Event Alert <zamowienia@basmamezze.pl>",
                    to: adminEmail,
                    subject: `🎉 NOWE ZAPYTANIE: Party Box — ${name}`,
                    html: `
                    <div style="font-family: sans-serif; padding: 20px; border: 2px solid #BA9D76; border-radius: 12px; background-color: #fff;">
                        <h1 style="color: #BA9D76; margin-top: 0; font-size: 24px;">🎉 Nowe Zapytanie o Party Box!</h1>
                        <div style="background: #fdfaf6; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 5px solid #BA9D76;">
                            <p style="font-size: 16px; margin: 0;"><strong>Typ:</strong> Party Box Inquiry</p>
                        </div>
                        <p><strong>Imię:</strong> ${escapeHTML(name)}</p>
                        <p><strong>Email:</strong> ${escapeHTML(email)}</p>
                        <p><strong>Telefon:</strong> ${escapeHTML(phone)}</p>
                        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                        <p style="font-weight: bold; text-transform: uppercase; font-size: 12px; color: #999; margin-bottom: 10px;">Wiadomość:</p>
                        <p style="font-size: 15px; line-height: 1.6;">${escapeHTML(message || "Brak dodatkowej wiadomości.")}</p>
                        <div style="margin-top: 30px; text-align: center;">
                            <a href="mailto:${email}" style="display: inline-block; background: #BA9D76; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">ODPOWIEDZ KLIENTOWI</a>
                        </div>
                    </div>
                    `,
                })
            }
        }

        return NextResponse.json({ success: true, message: "Party Box inquiry sent successfully" }, { status: 200 })
    } catch (error: any) {
        console.error("Party Box inquiry error:", error)
        return NextResponse.json({ error: "Failed to send inquiry" }, { status: 500 })
    }
}
