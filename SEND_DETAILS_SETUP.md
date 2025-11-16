# Send Details Feature - Setup Guide

## Overview

The Send Details feature allows you to send travel information to passengers via **Email** and **WhatsApp**. This feature is now fully integrated and requires API keys from two services:

1. **Resend** - For email delivery
2. **Twilio** - For WhatsApp messaging

---

## 🎯 What's Already Complete

✅ **UI Component** - [SendDetailsDialog.tsx](src/components/travel/SendDetailsDialog.tsx)
✅ **API Endpoint** - [send-details/route.ts](src/app/api/travel/passengers/send-details/route.ts)
✅ **Email Service** - [emailService.ts](src/lib/services/emailService.ts)
✅ **WhatsApp Service** - [whatsappService.ts](src/lib/services/whatsappService.ts)
✅ **Database Schema** - TripCommunication table with tracking
✅ **Integration** - Already integrated into travel detail page

**Status: 100% Complete** - Just needs API keys configuration!

---

## 📧 Step 1: Set Up Resend (Email Service)

### 1.1 Create Resend Account

1. Go to [resend.com](https://resend.com)
2. Sign up for a free account
3. Free tier includes: **100 emails/day** and **3,000 emails/month**

### 1.2 Get API Key

1. After logging in, go to **API Keys** section
2. Click **Create API Key**
3. Name it (e.g., "Travel Management System")
4. Copy the API key (starts with `re_...`)

### 1.3 Add Domain (Optional but Recommended)

For production use, you should verify your domain:

1. Go to **Domains** section
2. Click **Add Domain**
3. Enter your domain (e.g., `yourdomain.com`)
4. Add the DNS records provided by Resend
5. Wait for verification (usually 15-30 minutes)

**For testing:** You can use the default sandbox domain, but emails will only be sent to verified email addresses.

### 1.4 Update .env File

```env
# Email Service (Resend)
RESEND_API_KEY=re_your_actual_api_key_here
RESEND_FROM_EMAIL=noreply@yourdomain.com
```

If using sandbox for testing:
```env
RESEND_FROM_EMAIL=onboarding@resend.dev
```

---

## 📱 Step 2: Set Up Twilio (WhatsApp Service)

### 2.1 Create Twilio Account

1. Go to [twilio.com](https://www.twilio.com)
2. Sign up for a free trial account
3. Free trial includes **$15 credit**

### 2.2 Get Account Credentials

1. After logging in, you'll see your **Account SID** and **Auth Token** on the dashboard
2. Copy both values

### 2.3 Set Up WhatsApp Sandbox (For Testing)

For testing, Twilio provides a WhatsApp Sandbox:

1. In Twilio Console, go to **Messaging** → **Try it out** → **Send a WhatsApp message**
2. Follow the instructions to join the sandbox:
   - Send a WhatsApp message with the code to the provided number
   - Usually: Send "join [code]" to `+1 415 523 8886`
3. The sandbox number is: `whatsapp:+14155238886`

### 2.4 Set Up Production WhatsApp (Optional)

For production:

1. Apply for WhatsApp Business API access through Twilio
2. Get your WhatsApp-enabled phone number approved
3. This process can take several days

### 2.5 Update .env File

```env
# WhatsApp Service (Twilio)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
```

For production, update `TWILIO_WHATSAPP_FROM` to your approved WhatsApp number.

---

## 🔧 Step 3: Complete .env Configuration

Your complete `.env` file should look like this:

```env
# Database
DATABASE_URL="postgresql://neondb_owner:npg_SHIug5tRb2Mn@ep-icy-river-aegy6go9.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require"

# Email Service (Resend)
RESEND_API_KEY=re_your_actual_api_key_here
RESEND_FROM_EMAIL=noreply@yourdomain.com

# WhatsApp Service (Twilio)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
```

---

## 🚀 Step 4: Test the Feature

### 4.1 Restart Development Server

After updating `.env`:

```bash
npm run dev
```

### 4.2 Test Email Sending

1. Navigate to a travel request detail page
2. Add a passenger with a **verified email address**
3. Click **Send Details** button (should be in header or passengers section)
4. Select the passenger
5. Choose **Email** as communication method
6. Select content types (Flight Details, Hotel Details, etc.)
7. Click **Send Details**
8. Check the passenger's email inbox

### 4.3 Test WhatsApp Sending

1. Make sure you've joined the Twilio WhatsApp Sandbox
2. Add a passenger with your **WhatsApp number** (in E.164 format: +1234567890)
3. Click **Send Details**
4. Select the passenger
5. Choose **WhatsApp** as communication method
6. Click **Send Details**
7. Check your WhatsApp for the message

---

## 📊 Monitoring Communications

All sent communications are logged in the `TripCommunication` table:

- View in Prisma Studio: `npx prisma studio`
- Navigate to **TripCommunication** model
- Check fields:
  - `status`: SENT, FAILED, or PENDING
  - `externalMessageId`: Message ID from Resend/Twilio
  - `errorMessage`: Error details if failed
  - `sentAt`: Timestamp
  - `communicationType`: EMAIL, WHATSAPP, or BOTH

---

## 🎨 Features Available

### Content Types

- **Flight Details** - All flights for selected passengers
- **Hotel Details** - Hotel bookings and room assignments
- **Event Details** - Events and activities
- **Full Itinerary** - Complete trip itinerary with all details

### Communication Methods

- **Email Only** - HTML formatted emails
- **WhatsApp Only** - Text-based WhatsApp messages
- **Both** - Send via both channels simultaneously

### Additional Features

- **Custom Message** - Add personal message to communications
- **Passenger Selection** - Select all or specific passengers
- **Notification Preferences** - Respects passenger communication preferences
- **Success Animation** - Visual feedback when sent
- **Error Handling** - Detailed error reporting

---

## 💰 Cost Estimates

### Resend (Email)

**Free Tier:**
- 100 emails/day
- 3,000 emails/month
- $0

**Paid Plans:**
- $20/month - 50,000 emails/month
- $80/month - 100,000 emails/month

### Twilio (WhatsApp)

**Pricing (Varies by country):**
- WhatsApp Business API: ~$0.005-$0.02 per message (depending on region)
- Free trial credit: $15

**Example Costs:**
- 100 messages: ~$0.50-$2.00
- 1,000 messages: ~$5.00-$20.00

---

## 🔒 Security Best Practices

1. **Never commit .env to version control** - Already in .gitignore
2. **Use environment variables in production** - Set in Vercel/hosting platform
3. **Rotate API keys regularly** - Change keys every 90 days
4. **Monitor usage** - Set up alerts in Resend/Twilio dashboards
5. **Validate email addresses** - Prevent spam and bounces
6. **Rate limiting** - Consider implementing rate limits for bulk sends

---

## 🐛 Troubleshooting

### Email Not Sending

1. **Check API key is valid** - Test in Resend dashboard
2. **Verify from email** - Must be verified domain or sandbox email
3. **Check recipient email** - Must be valid and verified (for sandbox)
4. **Look at logs** - Check console for error messages
5. **Check TripCommunication table** - Look at errorMessage field

### WhatsApp Not Sending

1. **Verify sandbox setup** - Re-join sandbox if needed
2. **Check phone number format** - Must be E.164 format (+1234567890)
3. **Verify account SID and token** - Check Twilio dashboard
4. **Check WhatsApp opt-in** - User must have joined sandbox or opted in
5. **Look at Twilio logs** - Check Twilio console for delivery status

### Common Errors

**"Email service not configured"**
- Missing or invalid `RESEND_API_KEY`
- Missing `RESEND_FROM_EMAIL`

**"WhatsApp service not configured"**
- Missing `TWILIO_ACCOUNT_SID` or `TWILIO_AUTH_TOKEN`
- Missing `TWILIO_WHATSAPP_FROM`

**"No email address available"**
- Passenger's person record doesn't have email
- Check Employee/Stakeholder/Employer records

**"No phone number available"**
- Passenger's person record doesn't have phone
- Check Employee/Stakeholder/Employer records

---

## 📝 API Endpoints

### POST /api/travel/passengers/send-details

**Request Body:**
```json
{
  "travelRequestId": 1,
  "passengerIds": [1, 2, 3],
  "contentTypes": ["FLIGHT_DETAILS", "HOTEL_DETAILS"],
  "communicationType": "BOTH",
  "customMessage": "Looking forward to your trip!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Sent details to 3 recipient(s)",
  "data": {
    "communicationsSent": 6,
    "errors": 0,
    "details": {
      "communications": [...],
      "errors": []
    }
  }
}
```

---

## 🎓 Next Steps

After setting up the Send Details feature, consider:

1. **Communications History Tab** - View all sent communications for a trip
2. **Resend Capability** - Ability to resend failed communications
3. **Email Templates** - Customize email designs and layouts
4. **WhatsApp Templates** - Pre-approved WhatsApp message templates
5. **Bulk Operations** - Send to multiple trips at once
6. **Scheduling** - Schedule communications for future delivery
7. **Analytics** - Track open rates, click rates, etc.

---

## 📞 Support

For issues with:
- **Resend:** [resend.com/docs](https://resend.com/docs) or support@resend.com
- **Twilio:** [twilio.com/docs](https://www.twilio.com/docs) or Twilio Support Portal

For application issues:
- Check application logs
- Review TripCommunication records in database
- Check [send-details/route.ts](src/app/api/travel/passengers/send-details/route.ts) implementation

---

**Last Updated:** November 2025
**Status:** Production Ready ✅
