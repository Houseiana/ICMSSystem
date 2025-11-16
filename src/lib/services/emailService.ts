import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export interface SendEmailParams {
  to: string
  subject: string
  html: string
  text?: string
}

export async function sendEmail(params: SendEmailParams): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    // Validate environment variables
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured')
      return { success: false, error: 'Email service not configured' }
    }

    if (!process.env.RESEND_FROM_EMAIL) {
      console.error('RESEND_FROM_EMAIL is not configured')
      return { success: false, error: 'Email service not configured' }
    }

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: params.to,
      subject: params.subject,
      html: params.html,
      text: params.text
    })

    if (error) {
      console.error('Resend error:', error)
      return { success: false, error: error.message || 'Failed to send email' }
    }

    console.log('Email sent successfully:', data?.id)
    return { success: true, messageId: data?.id }

  } catch (error) {
    console.error('Error sending email:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

export async function sendBulkEmails(emails: SendEmailParams[]): Promise<{
  success: boolean
  results: Array<{ to: string; success: boolean; messageId?: string; error?: string }>
}> {
  const results = await Promise.all(
    emails.map(async (email) => {
      const result = await sendEmail(email)
      return {
        to: email.to,
        ...result
      }
    })
  )

  const allSuccessful = results.every(r => r.success)

  return {
    success: allSuccessful,
    results
  }
}
