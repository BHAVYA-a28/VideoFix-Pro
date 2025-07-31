# Razorpay Integration Setup Guide

## 🚀 Getting Started with Razorpay

This guide will help you set up Razorpay payment gateway in your VideoFix Pro application.

## 📋 Prerequisites

1. **Razorpay Account**: Sign up at [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. **Node.js & npm**: Ensure you have Node.js installed
3. **React Development Environment**: Your project should be running

## 🔑 Step 1: Get Your Razorpay Keys

### 1.1 Create Razorpay Account
- Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
- Sign up for a new account
- Complete your business verification

### 1.2 Get API Keys
1. Navigate to **Settings** → **API Keys**
2. Generate a new key pair
3. Copy your **Key ID** and **Key Secret**

### 1.3 Environment Variables
Create a `.env` file in your project root:

```env
# Test Keys (for development)
VITE_RAZORPAY_KEY_ID=rzp_test_YOUR_TEST_KEY_ID
VITE_RAZORPAY_KEY_SECRET=YOUR_TEST_KEY_SECRET

# Live Keys (for production)
# VITE_RAZORPAY_KEY_ID=rzp_live_YOUR_LIVE_KEY_ID
# VITE_RAZORPAY_KEY_SECRET=YOUR_LIVE_KEY_SECRET
```

## 🔧 Step 2: Install Dependencies

The Razorpay SDK is already installed. If not, run:

```bash
npm install razorpay
```

## 🛠️ Step 3: Configure Your Application

### 3.1 Update Razorpay Configuration
Edit `src/services/razorpay.ts` and update the configuration:

```typescript
const RAZORPAY_CONFIG = {
  key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_YOUR_TEST_KEY',
  currency: 'INR',
  name: 'VideoFix Pro',
  theme: {
    color: '#3B82F6'
  }
};
```

### 3.2 Backend Integration (Optional)
For production, you'll need a backend to:
- Create orders securely
- Verify payment signatures
- Handle webhooks

## 🧪 Step 4: Test the Integration

### 4.1 Test Mode
- Use test keys for development
- Test with Razorpay's test cards
- Verify payment flow

### 4.2 Test Cards
Use these test card numbers:
- **Success**: 4111 1111 1111 1111
- **Failure**: 4000 0000 0000 0002
- **CVV**: Any 3 digits
- **Expiry**: Any future date

## 🔒 Step 5: Security Best Practices

### 5.1 Environment Variables
- Never commit API keys to version control
- Use different keys for test and production
- Rotate keys regularly

### 5.2 Payment Verification
Always verify payments on your backend:
```javascript
// Backend verification example
const crypto = require('crypto');

function verifyPayment(orderId, paymentId, signature) {
  const text = orderId + '|' + paymentId;
  const generated_signature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(text)
    .digest('hex');
  
  return generated_signature === signature;
}
```

## 🚀 Step 6: Go Live

### 6.1 Production Checklist
- [ ] Switch to live API keys
- [ ] Set up webhook endpoints
- [ ] Test with real payments
- [ ] Configure error handling
- [ ] Set up monitoring

### 6.2 Webhook Setup
Configure webhooks in Razorpay Dashboard:
- **Payment Authorized**: `https://yourdomain.com/api/webhooks/payment-authorized`
- **Payment Captured**: `https://yourdomain.com/api/webhooks/payment-captured`
- **Payment Failed**: `https://yourdomain.com/api/webhooks/payment-failed`

## 📱 Step 7: Mobile Integration

### 7.1 React Native
For mobile apps, use:
```bash
npm install react-native-razorpay
```

### 7.2 Web App
The current implementation works for web applications.

## 🔍 Troubleshooting

### Common Issues

1. **"Razorpay is not defined"**
   - Ensure the script is loaded before use
   - Check network connectivity

2. **"Invalid key"**
   - Verify your API keys
   - Check environment variables

3. **"Order creation failed"**
   - Verify backend integration
   - Check order parameters

### Debug Mode
Enable debug logging:
```javascript
const options = {
  ...razorpayOptions,
  debug: true
};
```

## 📞 Support

- **Razorpay Documentation**: [docs.razorpay.com](https://docs.razorpay.com/)
- **Razorpay Support**: [support.razorpay.com](https://support.razorpay.com/)
- **API Reference**: [razorpay.com/docs/api](https://razorpay.com/docs/api/)

## 🎯 Next Steps

1. **Customize Payment UI**: Modify the payment modal design
2. **Add Payment Analytics**: Track payment success rates
3. **Implement Refunds**: Add refund functionality
4. **Multi-currency**: Support different currencies
5. **Subscription Payments**: Implement recurring payments

## 📝 Notes

- Always test in sandbox mode first
- Keep your API keys secure
- Monitor payment logs regularly
- Implement proper error handling
- Follow PCI DSS compliance guidelines

---

**Happy Coding! 🚀** 