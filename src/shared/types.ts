// Shared Types for VideoFix-Pro (Frontend + Backend Sync)

export interface SoftwareDownload {
  name: string;
  officialUrl: string;
  downloadUrl: string;
  size: string;
  version: string;
  description: string;
  systemRequirements: {
    os: string[];
    ram: string;
    storage: string;
    graphics: string;
  };
  license: 'free' | 'trial' | 'paid' | 'subscription' | 'pro';
  category: 'video-editing' | 'motion-graphics' | 'color-grading' | 'compositing' | 'production' | 'audio' | 'legacy-optimized';
}

export interface DownloadStatus {
  progress: number;
  status: 'checking' | 'downloading' | 'installing' | 'completed' | 'failed';
  message: string;
  downloadSpeed?: string;
  estimatedTime?: string;
  localPath?: string;
}

export interface SystemInfo {
  os: string;
  architecture: string;
  ram: string;
  storage: string;
  graphics: string;
}

export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

export interface BillingEntitlement {
  userId: string;
  active_subscription: string;
  expiry: string;
  entitlements?: string[];
}
