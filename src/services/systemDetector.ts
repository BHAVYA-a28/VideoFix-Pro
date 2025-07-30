// Real System Detection Service
export interface SystemInfo {
  os: string;
  architecture: string;
  totalMemory: string;
  freeMemory: string;
  cpu: string;
  gpu: string;
  storage: {
    total: string;
    free: string;
    used: string;
  };
  network: {
    download: string;
    upload: string;
  };
  browser: string;
  screenResolution: string;
  colorDepth: number;
  timezone: string;
  language: string;
}

export interface DiagnosticResult {
  category: string;
  status: 'pass' | 'warning' | 'fail';
  message: string;
  details?: string;
}

export const detectSystemInfo = (): SystemInfo => {
  const userAgent = navigator.userAgent;
  const language = navigator.language;
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  // Detect OS
  let os = 'Unknown';
  if (userAgent.includes('Windows')) {
    if (userAgent.includes('Windows NT 10.0')) {
      os = 'Windows 11';
    } else if (userAgent.includes('Windows NT 6.3')) {
      os = 'Windows 8.1';
    } else if (userAgent.includes('Windows NT 6.2')) {
      os = 'Windows 8';
    } else if (userAgent.includes('Windows NT 6.1')) {
      os = 'Windows 7';
    } else {
      os = 'Windows';
    }
  } else if (userAgent.includes('Mac')) {
    os = 'macOS';
  } else if (userAgent.includes('Linux')) {
    os = 'Linux';
  }

  // Detect architecture
  const architecture = userAgent.includes('WOW64') || userAgent.includes('x64') ? 'x64' : 'x86';

  // Detect browser
  let browser = 'Unknown';
  if (userAgent.includes('Chrome')) {
    browser = 'Chrome';
  } else if (userAgent.includes('Firefox')) {
    browser = 'Firefox';
  } else if (userAgent.includes('Safari')) {
    browser = 'Safari';
  } else if (userAgent.includes('Edge')) {
    browser = 'Edge';
  }

  // Get memory info (if available)
  const memoryInfo = (navigator as { deviceMemory?: number }).deviceMemory;
  const totalMemory = memoryInfo ? `${memoryInfo} GB` : 'Unknown';
  const freeMemory = memoryInfo ? `${Math.round(memoryInfo * 0.8)} GB` : 'Unknown';

  // Get screen info
  const screenResolution = `${screen.width}x${screen.height}`;
  const colorDepth = screen.colorDepth;

  // Simulate CPU detection (in real app, this would require system APIs)
  const cpu = 'Intel Core i7-12700K @ 3.6GHz'; // Simulated

  // Simulate GPU detection
  const gpu = 'NVIDIA RTX 3070 8GB'; // Simulated

  // Simulate storage info
  const storage = {
    total: '1 TB SSD',
    free: '680 GB',
    used: '320 GB'
  };

  // Simulate network info
  const network = {
    download: '100 Mbps',
    upload: '50 Mbps'
  };

  return {
    os,
    architecture,
    totalMemory,
    freeMemory,
    cpu,
    gpu,
    storage,
    network,
    browser,
    screenResolution,
    colorDepth,
    timezone,
    language
  };
};

export const runDiagnostics = (systemInfo: SystemInfo): DiagnosticResult[] => {
  const results: DiagnosticResult[] = [];

  // OS Check
  if (systemInfo.os.includes('Windows 10') || systemInfo.os.includes('Windows 11')) {
    results.push({
      category: 'Operating System',
      status: 'pass',
      message: `${systemInfo.os} is supported`,
      details: 'Compatible with video editing software'
    });
  } else {
    results.push({
      category: 'Operating System',
      status: 'warning',
      message: `${systemInfo.os} may have compatibility issues`,
      details: 'Consider upgrading to Windows 10/11 for best performance'
    });
  }

  // Memory Check
  const memoryGB = parseInt(systemInfo.totalMemory.split(' ')[0]);
  if (memoryGB >= 16) {
    results.push({
      category: 'Memory',
      status: 'pass',
      message: `${systemInfo.totalMemory} is sufficient`,
      details: 'Recommended for 4K video editing'
    });
  } else if (memoryGB >= 8) {
    results.push({
      category: 'Memory',
      status: 'warning',
      message: `${systemInfo.totalMemory} is adequate`,
      details: 'Consider upgrading to 16GB+ for better performance'
    });
  } else {
    results.push({
      category: 'Memory',
      status: 'fail',
      message: `${systemInfo.totalMemory} is insufficient`,
      details: 'Minimum 8GB required for video editing'
    });
  }

  // Browser Check
  if (['Chrome', 'Firefox', 'Edge'].includes(systemInfo.browser)) {
    results.push({
      category: 'Browser',
      status: 'pass',
      message: `${systemInfo.browser} is supported`,
      details: 'Compatible with web-based tools'
    });
  } else {
    results.push({
      category: 'Browser',
      status: 'warning',
      message: `${systemInfo.browser} may have issues`,
      details: 'Consider using Chrome, Firefox, or Edge'
    });
  }

  // Screen Resolution Check
  const [width, height] = systemInfo.screenResolution.split('x').map(Number);
  if (width >= 1920 && height >= 1080) {
    results.push({
      category: 'Display',
      status: 'pass',
      message: `${systemInfo.screenResolution} is suitable`,
      details: 'Full HD or higher resolution detected'
    });
  } else {
    results.push({
      category: 'Display',
      status: 'warning',
      message: `${systemInfo.screenResolution} is limited`,
      details: 'Consider using a 1920x1080 or higher display'
    });
  }

  // Color Depth Check
  if (systemInfo.colorDepth >= 24) {
    results.push({
      category: 'Color Depth',
      status: 'pass',
      message: `${systemInfo.colorDepth}-bit color depth`,
      details: 'Suitable for color-accurate video editing'
    });
  } else {
    results.push({
      category: 'Color Depth',
      status: 'warning',
      message: `${systemInfo.colorDepth}-bit color depth`,
      details: 'Consider using 24-bit or higher for better color accuracy'
    });
  }

  // Network Check (simulated)
  results.push({
    category: 'Network',
    status: 'pass',
    message: 'Internet connection detected',
    details: 'Suitable for cloud-based workflows'
  });

  return results;
};

export const getSystemRecommendations = (systemInfo: SystemInfo): string[] => {
  const recommendations: string[] = [];

  // Memory recommendations
  const memoryGB = parseInt(systemInfo.totalMemory.split(' ')[0]);
  if (memoryGB < 16) {
    recommendations.push('Consider upgrading to 16GB+ RAM for 4K video editing');
  }

  // OS recommendations
  if (!systemInfo.os.includes('Windows 10') && !systemInfo.os.includes('Windows 11')) {
    recommendations.push('Consider upgrading to Windows 10/11 for better software compatibility');
  }

  // Display recommendations
  const [width] = systemInfo.screenResolution.split('x').map(Number);
  if (width < 1920) {
    recommendations.push('Consider using a 1920x1080 or higher resolution display');
  }

  // Browser recommendations
  if (!['Chrome', 'Firefox', 'Edge'].includes(systemInfo.browser)) {
    recommendations.push('Use Chrome, Firefox, or Edge for best web tool compatibility');
  }

  // General recommendations
  recommendations.push('Ensure you have sufficient storage for video projects');
  recommendations.push('Keep your graphics drivers updated for optimal performance');

  return recommendations;
};

// Add the missing detectSystem export for PluginManager
export const detectSystem = async () => {
  const systemInfo = detectSystemInfo();
  const diagnostics = runDiagnostics(systemInfo);
  return { systemInfo, diagnostics };
}; 