import twilio from 'twilio'

export interface SendWhatsAppParams {
  to: string // Phone number in E.164 format (e.g., +1234567890)
  message: string
}

export async function sendWhatsApp(params: SendWhatsAppParams): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    // Validate environment variables
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
      console.error('Twilio credentials not configured')
      return { success: false, error: 'WhatsApp service not configured' }
    }

    if (!process.env.TWILIO_WHATSAPP_FROM) {
      console.error('TWILIO_WHATSAPP_FROM is not configured')
      return { success: false, error: 'WhatsApp service not configured' }
    }

    // Initialize Twilio client
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    )

    // Format phone number for WhatsApp
    const toWhatsApp = params.to.startsWith('whatsapp:')
      ? params.to
      : `whatsapp:${params.to}`

    // Send WhatsApp message
    const message = await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_FROM,
      to: toWhatsApp,
      body: params.message
    })

    console.log('WhatsApp message sent successfully:', message.sid)
    return { success: true, messageId: message.sid }

  } catch (error: any) {
    console.error('Error sending WhatsApp message:', error)

    // Handle Twilio-specific errors
    if (error.code) {
      return {
        success: false,
        error: `Twilio error ${error.code}: ${error.message}`
      }
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

export async function sendBulkWhatsApp(messages: SendWhatsAppParams[]): Promise<{
  success: boolean
  results: Array<{ to: string; success: boolean; messageId?: string; error?: string }>
}> {
  const results = await Promise.all(
    messages.map(async (msg) => {
      const result = await sendWhatsApp(msg)
      return {
        to: msg.to,
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

/**
 * Format phone number to E.164 format if needed
 * E.164 format: +[country code][number]
 */
export function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters except +
  let cleaned = phone.replace(/[^\d+]/g, '')

  // If doesn't start with +, assume it needs country code
  if (!cleaned.startsWith('+')) {
    // Default to US country code if no + prefix
    // You may want to make this configurable
    cleaned = '+1' + cleaned
  }

  return cleaned
}
