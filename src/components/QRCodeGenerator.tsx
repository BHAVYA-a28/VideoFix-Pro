import React, { useState } from 'react';

interface QRCodeGeneratorProps {
  upiId: string;
  amount: number;
  onGenerate: (qrCodeData: string) => void;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ upiId, amount, onGenerate }) => {
  const [generated, setGenerated] = useState(false);

  const generateUPIQR = () => {
    // Create UPI QR code data
    const qrData = `upi://pay?pa=${upiId}&am=${amount}&cu=INR&tn=VideoFix%20Pro%20Payment`;
    
    // For now, we'll create a simple QR code representation
    // In a real implementation, you would use a QR code library
    // const qrCodeSVG = `
    //   <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
    //     <rect width="200" height="200" fill="white"/>
    //     <text x="100" y="100" text-anchor="middle" font-family="Arial" font-size="12" fill="black">UPI QR Code</text>
    //     <text x="100" y="120" text-anchor="middle" font-family="Arial" font-size="10" fill="gray">${upiId}</text>
    //     <text x="100" y="135" text-anchor="middle" font-family="Arial" font-size="10" fill="gray">₹${amount}</text>
    //   </svg>
    // `;
    
    setGenerated(true);
    onGenerate(qrData);
  };

  return (
    <div className="bg-white p-4 rounded-lg border">
      <h3 className="text-lg font-semibold mb-4">Generate UPI QR Code</h3>
      
      <div className="space-y-3 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">UPI ID</label>
          <input
            type="text"
            value={upiId}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
          <input
            type="number"
            value={amount}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
          />
        </div>
      </div>
      
      <button
        onClick={generateUPIQR}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Generate QR Code
      </button>
      
      {generated && (
        <div className="mt-4 p-3 bg-green-50 rounded-lg">
          <p className="text-sm text-green-800">
            ✅ QR Code generated! Copy the data and create an image file.
          </p>
        </div>
      )}
    </div>
  );
};

export default QRCodeGenerator; 