# UPI QR Code Image Setup Instructions

## 📱 Adding UPI QR Code Image

### **Step 1: Save the QR Code Image**
1. Save the UPI QR code image you provided as `upi-qr-code.png`
2. Place it in the `public/` folder of your project
3. The path should be: `public/upi-qr-code.png`

### **Step 2: Image Specifications**
- **Format**: PNG (recommended) or JPG
- **Size**: 200x200 pixels or larger (will be scaled down)
- **Background**: White background for best visibility
- **Quality**: High resolution for clear scanning

### **Step 3: Verify the Image**
1. Start your development server: `npm run dev`
2. Navigate to the Services page: http://localhost:5176/services
3. Click any "Buy Now" button
4. Select "UPI Payment" from payment methods
5. Choose any UPI app (Paytm, Google Pay, or PhonePe)
6. The QR code image should now appear in the payment modal

### **Step 4: Testing**
- The QR code will appear when users select UPI payment
- It will show for all UPI apps (Paytm, Google Pay, PhonePe)
- The image has error handling - if the image fails to load, it shows a placeholder

### **File Structure**
```
project/
├── public/
│   └── upi-qr-code.png  ← Place your QR code image here
├── src/
│   └── pages/
│       └── Services.tsx  ← Updated to show the image
└── UPI_QR_CODE_INSTRUCTIONS.md
```

### **Features Added:**
- ✅ **QR Code Display**: Shows the UPI QR code when UPI payment is selected
- ✅ **Responsive Design**: Image scales properly on different screen sizes
- ✅ **Error Handling**: Falls back to placeholder if image fails to load
- ✅ **Professional Styling**: Clean white background with border
- ✅ **Multiple UPI Apps**: Works with Paytm, Google Pay, and PhonePe

### **How It Works:**
1. User clicks "Buy Now" on any service
2. Payment modal opens with payment method options
3. User selects "UPI Payment"
4. UPI app selection buttons appear (Paytm, Google Pay, PhonePe)
5. User selects an UPI app
6. The QR code image appears with UPI ID and amount
7. User can scan the QR code with their UPI app

The QR code image is now integrated into your payment system! 🎉 