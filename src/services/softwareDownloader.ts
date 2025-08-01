// Software Download Service for Video Editing Software

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
  license: 'free' | 'trial' | 'paid' | 'subscription';
  category: 'video-editing' | 'motion-graphics' | 'color-grading' | 'compositing';
}

export interface DownloadProgress {
  softwareName: string;
  progress: number; // 0-100
  status: 'checking' | 'downloading' | 'installing' | 'completed' | 'failed';
  message: string;
  downloadedBytes?: number;
  totalBytes?: number;
  downloadSpeed?: string;
  estimatedTime?: string;
}

export interface SystemInfo {
  os: string;
  architecture: string;
  ram: number;
  storage: number;
  graphics: string;
}

// Official software download sources with direct download links
export const SOFTWARE_DOWNLOADS: Record<string, SoftwareDownload> = {
  'Adobe Premiere Pro': {
    name: 'Adobe Premiere Pro',
    officialUrl: 'https://www.adobe.com/products/premiere.html',
    downloadUrl: 'https://www.adobe.com/products/premiere/download.html',
    size: '2.8GB',
    version: '2024',
    description: 'Professional video editing software for film, TV, and web',
    systemRequirements: {
      os: ['Windows 10', 'Windows 11', 'macOS 10.15+'],
      ram: '8GB minimum, 16GB recommended',
      storage: '8GB available space',
      graphics: 'DirectX 12 compatible'
    },
    license: 'subscription',
    category: 'video-editing'
  },
  'Adobe After Effects': {
    name: 'Adobe After Effects',
    officialUrl: 'https://www.adobe.com/products/aftereffects.html',
    downloadUrl: 'https://www.adobe.com/products/aftereffects/download.html',
    size: '3.2GB',
    version: '2024',
    description: 'Motion graphics and visual effects software',
    systemRequirements: {
      os: ['Windows 10', 'Windows 11', 'macOS 10.15+'],
      ram: '8GB minimum, 16GB recommended',
      storage: '10GB available space',
      graphics: 'DirectX 12 compatible'
    },
    license: 'subscription',
    category: 'motion-graphics'
  },
  'DaVinci Resolve': {
    name: 'DaVinci Resolve',
    officialUrl: 'https://www.blackmagicdesign.com/products/davinciresolve',
    downloadUrl: 'https://www.blackmagicdesign.com/support/download/',
    size: '4.5GB',
    version: '18.5',
    description: 'Professional video editing, color grading, and audio post-production',
    systemRequirements: {
      os: ['Windows 10', 'Windows 11', 'macOS 10.15+', 'Linux'],
      ram: '16GB minimum, 32GB recommended',
      storage: '15GB available space',
      graphics: 'OpenCL 1.2 or CUDA 11'
    },
    license: 'free',
    category: 'video-editing'
  },
  'Final Cut Pro': {
    name: 'Final Cut Pro',
    officialUrl: 'https://www.apple.com/final-cut-pro/',
    downloadUrl: 'https://apps.apple.com/us/app/final-cut-pro/id424389933',
    size: '3.1GB',
    version: '10.7',
    description: 'Professional video editing for macOS',
    systemRequirements: {
      os: ['macOS 12.3+'],
      ram: '8GB minimum, 16GB recommended',
      storage: '10GB available space',
      graphics: 'Metal-compatible graphics card'
    },
    license: 'paid',
    category: 'video-editing'
  },
  'Blender': {
    name: 'Blender',
    officialUrl: 'https://www.blender.org/',
    downloadUrl: 'https://www.blender.org/download/',
    size: '200MB',
    version: '4.0',
    description: 'Free 3D creation suite with video editing capabilities',
    systemRequirements: {
      os: ['Windows 10', 'Windows 11', 'macOS 10.15+', 'Linux'],
      ram: '4GB minimum, 8GB recommended',
      storage: '2GB available space',
      graphics: 'OpenGL 3.3 compatible'
    },
    license: 'free',
    category: 'video-editing'
  },
  'HitFilm Pro': {
    name: 'HitFilm Pro',
    officialUrl: 'https://fxhome.com/product/hitfilm',
    downloadUrl: 'https://fxhome.com/download',
    size: '1.8GB',
    version: '2023.1',
    description: 'Professional video editing and visual effects',
    systemRequirements: {
      os: ['Windows 10', 'Windows 11', 'macOS 10.15+'],
      ram: '8GB minimum, 16GB recommended',
      storage: '5GB available space',
      graphics: 'DirectX 11 compatible'
    },
    license: 'paid',
    category: 'video-editing'
  },
  'Vegas Pro': {
    name: 'Vegas Pro',
    officialUrl: 'https://www.vegascreativesoftware.com/us/vegas-pro/',
    downloadUrl: 'https://www.vegascreativesoftware.com/us/vegas-pro/download/',
    size: '2.5GB',
    version: '21',
    description: 'Professional video editing and audio production',
    systemRequirements: {
      os: ['Windows 10', 'Windows 11'],
      ram: '8GB minimum, 16GB recommended',
      storage: '8GB available space',
      graphics: 'DirectX 11 compatible'
    },
    license: 'paid',
    category: 'video-editing'
  },
  'Lightworks': {
    name: 'Lightworks',
    officialUrl: 'https://www.lwks.com/',
    downloadUrl: 'https://www.lwks.com/downloads/',
    size: '1.2GB',
    version: '2023.2',
    description: 'Professional video editing software',
    systemRequirements: {
      os: ['Windows 10', 'Windows 11', 'macOS 10.15+', 'Linux'],
      ram: '4GB minimum, 8GB recommended',
      storage: '3GB available space',
      graphics: 'OpenGL 3.3 compatible'
    },
    license: 'free',
    category: 'video-editing'
  }
};

// Progress callback type
export type DownloadProgressCallback = (progress: DownloadProgress) => void;

// Get system information
export const getSystemInfo = async (): Promise<SystemInfo> => {
  // This would typically use a native API or Electron
  // For now, we'll return mock data
  return {
    os: navigator.platform || 'Unknown',
    architecture: navigator.userAgent.includes('x64') ? 'x64' : 'x86',
    ram: 16, // GB
    storage: 500, // GB
    graphics: 'Unknown'
  };
};

// Check if system meets requirements
export const checkSystemCompatibility = (
  software: SoftwareDownload,
  systemInfo: SystemInfo
): { compatible: boolean; issues: string[] } => {
  const issues: string[] = [];

  // Check OS compatibility
  const osCompatible = software.systemRequirements.os.some(requiredOS => {
    if (systemInfo.os.includes('Win')) {
      return requiredOS.toLowerCase().includes('windows');
    } else if (systemInfo.os.includes('Mac')) {
      return requiredOS.toLowerCase().includes('macos');
    } else if (systemInfo.os.includes('Linux')) {
      return requiredOS.toLowerCase().includes('linux');
    }
    return false;
  });

  if (!osCompatible) {
    issues.push(`OS not compatible. Required: ${software.systemRequirements.os.join(', ')}`);
  }

  // Check RAM
  const requiredRAM = parseInt(software.systemRequirements.ram.match(/\d+/)?.[0] || '8');
  if (systemInfo.ram < requiredRAM) {
    issues.push(`Insufficient RAM. Required: ${requiredRAM}GB, Available: ${systemInfo.ram}GB`);
  }

  // Check storage
  const requiredStorage = parseInt(software.systemRequirements.storage.match(/\d+/)?.[0] || '8');
  if (systemInfo.storage < requiredStorage) {
    issues.push(`Insufficient storage. Required: ${requiredStorage}GB, Available: ${systemInfo.storage}GB`);
  }

  return {
    compatible: issues.length === 0,
    issues
  };
};

// Download software with progress tracking
export const downloadSoftware = async (
  softwareName: string,
  onProgress?: DownloadProgressCallback
): Promise<boolean> => {
  const software = SOFTWARE_DOWNLOADS[softwareName];
  
  if (!software) {
    console.error(`Software ${softwareName} not found in download catalog`);
    return false;
  }

  try {
    // Check system compatibility first
    const systemInfo = await getSystemInfo();
    const compatibility = checkSystemCompatibility(software, systemInfo);
    
    if (!compatibility.compatible) {
      if (onProgress) {
        onProgress({
          softwareName,
          progress: 0,
          status: 'failed',
          message: `System compatibility issues: ${compatibility.issues.join(', ')}`
        });
      }
      return false;
    }

    // Start download process
    if (onProgress) {
      onProgress({
        softwareName,
        progress: 0,
        status: 'checking',
        message: `Checking system requirements for ${softwareName}...`
      });

      await new Promise(resolve => setTimeout(resolve, 1000));

      onProgress({
        softwareName,
        progress: 10,
        status: 'downloading',
        message: `Starting download of ${softwareName}...`
      });
    }

    // Simulate download progress with realistic timing
    const totalSteps = 100;
    const downloadTime = 5000; // 5 seconds for simulation
    const stepTime = downloadTime / totalSteps;

    for (let i = 10; i <= 90; i += 2) {
      await new Promise(resolve => setTimeout(resolve, stepTime));
      
      if (onProgress) {
        const downloadedMB = Math.floor((i / 100) * parseInt(software.size.replace('GB', '000').replace('MB', '')));
        const totalMB = parseInt(software.size.replace('GB', '000').replace('MB', ''));
        const speed = Math.floor(Math.random() * 5 + 2); // MB/s
        
        onProgress({
          softwareName,
          progress: i,
          status: 'downloading',
          message: `Downloading ${softwareName}... ${i}%`,
          downloadedBytes: downloadedMB * 1024 * 1024,
          totalBytes: totalMB * 1024 * 1024,
          downloadSpeed: `${speed} MB/s`,
          estimatedTime: `${Math.ceil((100 - i) / speed)}s remaining`
        });
      }
    }

    // Simulate installation
    if (onProgress) {
      onProgress({
        softwareName,
        progress: 90,
        status: 'installing',
        message: `Installing ${softwareName}...`
      });

      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    // Complete installation
    if (onProgress) {
      onProgress({
        softwareName,
        progress: 100,
        status: 'completed',
        message: `${softwareName} installed successfully!`
      });
    }

    return true;
  } catch (error) {
    console.error(`Error downloading ${softwareName}:`, error);
    
    if (onProgress) {
      onProgress({
        softwareName,
        progress: 0,
        status: 'failed',
        message: `Failed to install ${softwareName}: ${error}`
      });
    }
    
    return false;
  }
};

// Download multiple software
export const downloadMultipleSoftware = async (
  softwareNames: string[],
  onProgress?: DownloadProgressCallback
): Promise<{ success: string[], failed: string[] }> => {
  const success: string[] = [];
  const failed: string[] = [];

  for (const softwareName of softwareNames) {
    const result = await downloadSoftware(softwareName, onProgress);
    if (result) {
      success.push(softwareName);
    } else {
      failed.push(softwareName);
    }
  }

  return { success, failed };
};

// Get software information
export const getSoftwareInfo = (softwareName: string): SoftwareDownload | null => {
  return SOFTWARE_DOWNLOADS[softwareName] || null;
};

// Get all available software
export const getAllSoftware = (): SoftwareDownload[] => {
  return Object.values(SOFTWARE_DOWNLOADS);
};

// Get software by category
export const getSoftwareByCategory = (category: string): SoftwareDownload[] => {
  return getAllSoftware().filter(software => software.category === category);
};

// Get free software
export const getFreeSoftware = (): SoftwareDownload[] => {
  return getAllSoftware().filter(software => software.license === 'free');
};

// Search software
export const searchSoftware = (query: string): SoftwareDownload[] => {
  const lowerQuery = query.toLowerCase();
  return getAllSoftware().filter(software => 
    software.name.toLowerCase().includes(lowerQuery) ||
    software.description.toLowerCase().includes(lowerQuery) ||
    software.category.toLowerCase().includes(lowerQuery)
  );
};

// Validate download requirements
export const validateDownloadRequirements = (softwareName: string): {
  isValid: boolean;
  requirements: string[];
  warnings: string[];
} => {
  const requirements: string[] = [];
  const warnings: string[] = [];

  const software = SOFTWARE_DOWNLOADS[softwareName];
  if (!software) {
    return {
      isValid: false,
      requirements: [],
      warnings: ['Software not found in catalog']
    };
  }

  // Add basic requirements
  requirements.push('Administrator privileges required');
  requirements.push('Stable internet connection');
  requirements.push('Sufficient disk space');

  // Add software-specific requirements
  if (software.license === 'subscription') {
    requirements.push('Adobe Creative Cloud subscription required');
    warnings.push('This software requires a paid subscription');
  }

  if (software.license === 'paid') {
    requirements.push('Valid license key required');
    warnings.push('This software requires a paid license');
  }

  if (software.size.includes('GB')) {
    const sizeGB = parseInt(software.size.replace('GB', ''));
    requirements.push(`At least ${sizeGB + 2}GB free space recommended`);
  }

  return {
    isValid: true,
    requirements,
    warnings
  };
};

// Open official website
export const openOfficialWebsite = (softwareName: string): void => {
  const software = SOFTWARE_DOWNLOADS[softwareName];
  if (software) {
    window.open(software.officialUrl, '_blank');
  }
};

// Get download URL
export const getDownloadUrl = (softwareName: string): string | null => {
  const software = SOFTWARE_DOWNLOADS[softwareName];
  return software?.downloadUrl || null;
}; 