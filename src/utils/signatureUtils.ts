// Digital Signature Utilities using Web Crypto API

export interface SignatureData {
  message: string;
  signature: string;
  publicKey: string;
  timestamp: number;
}

export interface UserSignature {
  userId: string;
  signature: SignatureData;
  verified: boolean;
}

// Generate a key pair for digital signatures
export const generateKeyPair = async (): Promise<CryptoKeyPair> => {
  return await window.crypto.subtle.generateKey(
    {
      name: 'RSASSA-PKCS1-v1_5',
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-256',
    },
    true,
    ['sign', 'verify']
  );
};

// Export public key to string
export const exportPublicKey = async (publicKey: CryptoKey): Promise<string> => {
  const exported = await window.crypto.subtle.exportKey('spki', publicKey);
  return btoa(String.fromCharCode(...new Uint8Array(exported)));
};

// Import public key from string
export const importPublicKey = async (publicKeyString: string): Promise<CryptoKey> => {
  const binaryString = atob(publicKeyString);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  
  return await window.crypto.subtle.importKey(
    'spki',
    bytes,
    {
      name: 'RSASSA-PKCS1-v1_5',
      hash: 'SHA-256',
    },
    true,
    ['verify']
  );
};

// Create a digital signature
export const createSignature = async (
  message: string,
  privateKey: CryptoKey
): Promise<SignatureData> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  
  const signature = await window.crypto.subtle.sign(
    {
      name: 'RSASSA-PKCS1-v1_5',
    },
    privateKey,
    data
  );

  const publicKey = await exportPublicKey(privateKey);
  
  return {
    message,
    signature: btoa(String.fromCharCode(...new Uint8Array(signature))),
    publicKey,
    timestamp: Date.now()
  };
};

// Verify a digital signature
export const verifySignature = async (signatureData: SignatureData): Promise<boolean> => {
  try {
    const publicKey = await importPublicKey(signatureData.publicKey);
    const encoder = new TextEncoder();
    const data = encoder.encode(signatureData.message);
    
    const signatureBytes = new Uint8Array(
      atob(signatureData.signature).split('').map(char => char.charCodeAt(0))
    );

    return await window.crypto.subtle.verify(
      {
        name: 'RSASSA-PKCS1-v1_5',
      },
      publicKey,
      signatureBytes,
      data
    );
  } catch (error) {
    console.error('Signature verification failed:', error);
    return false;
  }
};

// Generate a unique user identifier
export const generateUserId = (): string => {
  return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

// Create a user signature for authentication
export const createUserSignature = async (
  userId: string,
  email: string,
  privateKey: CryptoKey
): Promise<UserSignature> => {
  const message = `${userId}:${email}:${Date.now()}`;
  const signature = await createSignature(message, privateKey);
  
  return {
    userId,
    signature,
    verified: true
  };
};

// Verify user signature
export const verifyUserSignature = async (userSignature: UserSignature): Promise<boolean> => {
  return await verifySignature(userSignature.signature);
}; 