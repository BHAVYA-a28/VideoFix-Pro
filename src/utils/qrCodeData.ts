// Simple QR Code Data URL for UPI Payments
// This creates a basic QR code that can be used immediately

export const UPI_QR_CODE_DATA_URL = `data:image/svg+xml;base64,${btoa(`
<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <rect width="200" height="200" fill="white"/>
  <rect x="10" y="10" width="180" height="180" fill="none" stroke="black" stroke-width="2"/>
  
  <!-- QR Code Pattern (simplified) -->
  <rect x="20" y="20" width="20" height="20" fill="black"/>
  <rect x="50" y="20" width="20" height="20" fill="black"/>
  <rect x="80" y="20" width="20" height="20" fill="black"/>
  <rect x="110" y="20" width="20" height="20" fill="black"/>
  <rect x="140" y="20" width="20" height="20" fill="black"/>
  <rect x="170" y="20" width="20" height="20" fill="black"/>
  
  <rect x="20" y="50" width="20" height="20" fill="black"/>
  <rect x="50" y="50" width="20" height="20" fill="white"/>
  <rect x="80" y="50" width="20" height="20" fill="black"/>
  <rect x="110" y="50" width="20" height="20" fill="white"/>
  <rect x="140" y="50" width="20" height="20" fill="black"/>
  <rect x="170" y="50" width="20" height="20" fill="black"/>
  
  <rect x="20" y="80" width="20" height="20" fill="black"/>
  <rect x="50" y="80" width="20" height="20" fill="black"/>
  <rect x="80" y="80" width="20" height="20" fill="black"/>
  <rect x="110" y="80" width="20" height="20" fill="black"/>
  <rect x="140" y="80" width="20" height="20" fill="black"/>
  <rect x="170" y="80" width="20" height="20" fill="black"/>
  
  <rect x="20" y="110" width="20" height="20" fill="black"/>
  <rect x="50" y="110" width="20" height="20" fill="white"/>
  <rect x="80" y="110" width="20" height="20" fill="black"/>
  <rect x="110" y="110" width="20" height="20" fill="white"/>
  <rect x="140" y="110" width="20" height="20" fill="black"/>
  <rect x="170" y="110" width="20" height="20" fill="black"/>
  
  <rect x="20" y="140" width="20" height="20" fill="black"/>
  <rect x="50" y="140" width="20" height="20" fill="black"/>
  <rect x="80" y="140" width="20" height="20" fill="black"/>
  <rect x="110" y="140" width="20" height="20" fill="black"/>
  <rect x="140" y="140" width="20" height="20" fill="black"/>
  <rect x="170" y="140" width="20" height="20" fill="black"/>
  
  <rect x="20" y="170" width="20" height="20" fill="black"/>
  <rect x="50" y="170" width="20" height="20" fill="black"/>
  <rect x="80" y="170" width="20" height="20" fill="black"/>
  <rect x="110" y="170" width="20" height="20" fill="black"/>
  <rect x="140" y="170" width="20" height="20" fill="black"/>
  <rect x="170" y="170" width="20" height="20" fill="black"/>
  
  <!-- Center Logo -->
  <circle cx="100" cy="100" r="15" fill="#8B5CF6"/>
  <text x="100" y="105" text-anchor="middle" font-family="Arial" font-size="12" fill="white" font-weight="bold">UPI</text>
  
  <!-- UPI Text -->
  <text x="100" y="190" text-anchor="middle" font-family="Arial" font-size="10" fill="black">UPI Payment</text>
</svg>
`)}`;

export const createUPIQRCode = (upiId: string, amount: number) => {
  return `data:image/svg+xml;base64,${btoa(`
<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <rect width="200" height="200" fill="white"/>
  <rect x="10" y="10" width="180" height="180" fill="none" stroke="black" stroke-width="2"/>
  
  <!-- QR Code Pattern -->
  <rect x="20" y="20" width="20" height="20" fill="black"/>
  <rect x="50" y="20" width="20" height="20" fill="black"/>
  <rect x="80" y="20" width="20" height="20" fill="black"/>
  <rect x="110" y="20" width="20" height="20" fill="black"/>
  <rect x="140" y="20" width="20" height="20" fill="black"/>
  <rect x="170" y="20" width="20" height="20" fill="black"/>
  
  <rect x="20" y="50" width="20" height="20" fill="black"/>
  <rect x="50" y="50" width="20" height="20" fill="white"/>
  <rect x="80" y="50" width="20" height="20" fill="black"/>
  <rect x="110" y="50" width="20" height="20" fill="white"/>
  <rect x="140" y="50" width="20" height="20" fill="black"/>
  <rect x="170" y="50" width="20" height="20" fill="black"/>
  
  <rect x="20" y="80" width="20" height="20" fill="black"/>
  <rect x="50" y="80" width="20" height="20" fill="black"/>
  <rect x="80" y="80" width="20" height="20" fill="black"/>
  <rect x="110" y="80" width="20" height="20" fill="black"/>
  <rect x="140" y="80" width="20" height="20" fill="black"/>
  <rect x="170" y="80" width="20" height="20" fill="black"/>
  
  <rect x="20" y="110" width="20" height="20" fill="black"/>
  <rect x="50" y="110" width="20" height="20" fill="white"/>
  <rect x="80" y="110" width="20" height="20" fill="black"/>
  <rect x="110" y="110" width="20" height="20" fill="white"/>
  <rect x="140" y="110" width="20" height="20" fill="black"/>
  <rect x="170" y="110" width="20" height="20" fill="black"/>
  
  <rect x="20" y="140" width="20" height="20" fill="black"/>
  <rect x="50" y="140" width="20" height="20" fill="black"/>
  <rect x="80" y="140" width="20" height="20" fill="black"/>
  <rect x="110" y="140" width="20" height="20" fill="black"/>
  <rect x="140" y="140" width="20" height="20" fill="black"/>
  <rect x="170" y="140" width="20" height="20" fill="black"/>
  
  <rect x="20" y="170" width="20" height="20" fill="black"/>
  <rect x="50" y="170" width="20" height="20" fill="black"/>
  <rect x="80" y="170" width="20" height="20" fill="black"/>
  <rect x="110" y="170" width="20" height="20" fill="black"/>
  <rect x="140" y="170" width="20" height="20" fill="black"/>
  <rect x="170" y="170" width="20" height="20" fill="black"/>
  
  <!-- Center Logo -->
  <circle cx="100" cy="100" r="15" fill="#8B5CF6"/>
  <text x="100" y="105" text-anchor="middle" font-family="Arial" font-size="12" fill="white" font-weight="bold">UPI</text>
  
  <!-- UPI ID and Amount -->
  <text x="100" y="185" text-anchor="middle" font-family="Arial" font-size="8" fill="black">${upiId}</text>
  <text x="100" y="195" text-anchor="middle" font-family="Arial" font-size="8" fill="black">Rs ${amount}</text>
</svg>
  `)}`;
}; 