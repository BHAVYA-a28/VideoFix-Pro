// Plugin Detection and Installation Service

export interface PluginInfo {
  name: string;
  version: string;
  path: string;
  isInstalled: boolean;
  isCompatible: boolean;
}

export interface SoftwareInfo {
  name: string;
  version: string;
  path: string;
  plugins: PluginInfo[];
  isInstalled: boolean;
}

export interface DetectionResult {
  software: SoftwareInfo[];
  missingPlugins: PluginInfo[];
  recommendations: string[];
}

// Supported video editing software
export const SUPPORTED_SOFTWARE = {
  'Adobe After Effects': {
    name: 'Adobe After Effects',
    defaultPaths: [
      'C:\\Program Files\\Adobe\\Adobe After Effects',
      'C:\\Program Files\\Adobe\\Adobe After Effects 2024',
      'C:\\Program Files\\Adobe\\Adobe After Effects 2023',
      'C:\\Program Files\\Adobe\\Adobe After Effects 2022'
    ],
    plugins: [
      'Video Copilot',
      'Trapcode Suite',
      'Red Giant',
      'Sapphire',
      'Twixtor',
      'Optical Flares',
      'Element 3D',
      'Particular',
      'Form',
      'Shine',
      'Starglow'
    ]
  },
  'Adobe Premiere Pro': {
    name: 'Adobe Premiere Pro',
    defaultPaths: [
      'C:\\Program Files\\Adobe\\Adobe Premiere Pro',
      'C:\\Program Files\\Adobe\\Adobe Premiere Pro 2024',
      'C:\\Program Files\\Adobe\\Adobe Premiere Pro 2023',
      'C:\\Program Files\\Adobe\\Adobe Premiere Pro 2022'
    ],
    plugins: [
      'Red Giant',
      'Sapphire',
      'Twixtor',
      'Magic Bullet',
      'Trapcode',
      'Boris FX',
      'NewBlue FX',
      'FilmConvert'
    ]
  },
  'DaVinci Resolve': {
    name: 'DaVinci Resolve',
    defaultPaths: [
      'C:\\Program Files\\Blackmagic Design\\DaVinci Resolve',
      'C:\\ProgramData\\Blackmagic Design\\DaVinci Resolve'
    ],
    plugins: [
      'Fusion',
      'Fairlight',
      'Color Grading',
      'Noise Reduction',
      'Motion Graphics'
    ]
  },
  'Blender': {
    name: 'Blender',
    defaultPaths: [
      'C:\\Program Files\\Blender Foundation\\Blender',
      'C:\\Program Files\\Blender Foundation\\Blender 4.0'
    ],
    plugins: [
      'Add-ons',
      'Python Scripts',
      'Node Groups',
      'Custom Shaders'
    ]
  }
};

// Detect installed software
export const detectInstalledSoftware = async (): Promise<SoftwareInfo[]> => {
  const detectedSoftware: SoftwareInfo[] = [];

  try {
    // Check for Adobe After Effects
    const aeInfo = await checkSoftwareInstallation('Adobe After Effects');
    if (aeInfo.isInstalled) {
      detectedSoftware.push(aeInfo);
    }

    // Check for Adobe Premiere Pro
    const prInfo = await checkSoftwareInstallation('Adobe Premiere Pro');
    if (prInfo.isInstalled) {
      detectedSoftware.push(prInfo);
    }

    // Check for DaVinci Resolve
    const drInfo = await checkSoftwareInstallation('DaVinci Resolve');
    if (drInfo.isInstalled) {
      detectedSoftware.push(drInfo);
    }

    // Check for Blender
    const blenderInfo = await checkSoftwareInstallation('Blender');
    if (blenderInfo.isInstalled) {
      detectedSoftware.push(blenderInfo);
    }

  } catch (error) {
    console.error('Error detecting software:', error);
  }

  return detectedSoftware;
};

// Check if specific software is installed
const checkSoftwareInstallation = async (softwareName: string): Promise<SoftwareInfo> => {
  const software = SUPPORTED_SOFTWARE[softwareName as keyof typeof SUPPORTED_SOFTWARE];
  
  if (!software) {
    return {
      name: softwareName,
      version: 'Unknown',
      path: '',
      plugins: [],
      isInstalled: false
    };
  }

  // Check registry for Windows
  const isInstalled = await checkWindowsRegistry(softwareName);
  
  if (isInstalled) {
    const plugins = await detectPlugins(softwareName);
    return {
      name: softwareName,
      version: await getSoftwareVersion(softwareName),
      path: await getSoftwarePath(softwareName),
      plugins,
      isInstalled: true
    };
  }

  return {
    name: softwareName,
    version: 'Unknown',
    path: '',
    plugins: [],
    isInstalled: false
  };
};

// Check Windows Registry for software installation
const checkWindowsRegistry = async (_softwareName: string): Promise<boolean> => {
  try {
    // This would require a native app or Electron to access registry
    // For now, we'll simulate the check
    // const registryKeys = {
    //   'Adobe After Effects': [
    //     'HKEY_LOCAL_MACHINE\\SOFTWARE\\Adobe\\Adobe After Effects',
    //     'HKEY_LOCAL_MACHINE\\SOFTWARE\\Adobe\\Adobe After Effects 2024'
    //   ],
    //   'Adobe Premiere Pro': [
    //     'HKEY_LOCAL_MACHINE\\SOFTWARE\\Adobe\\Adobe Premiere Pro',
    //     'HKEY_LOCAL_MACHINE\\SOFTWARE\\Adobe\\Adobe Premiere Pro 2024'
    //   ],
    //   'DaVinci Resolve': [
    //     'HKEY_LOCAL_MACHINE\\SOFTWARE\\Blackmagic Design\\DaVinci Resolve'
    //   ],
    //   'Blender': [
    //     'HKEY_LOCAL_MACHINE\\SOFTWARE\\Blender Foundation\\Blender'
    //   ]
    // };

    // Simulate registry check (in real implementation, use native API)
    return Math.random() > 0.3; // 70% chance of being installed for demo
  } catch (error) {
    console.error('Error checking registry:', error);
    return false;
  }
};

// Get software version
const getSoftwareVersion = async (softwareName: string): Promise<string> => {
  // In real implementation, read from registry or executable properties
  const versions = {
    'Adobe After Effects': '2024.0',
    'Adobe Premiere Pro': '2024.0',
    'DaVinci Resolve': '18.6',
    'Blender': '4.0'
  };
  
  return versions[softwareName as keyof typeof versions] || 'Unknown';
};

// Get software installation path
const getSoftwarePath = async (softwareName: string): Promise<string> => {
  const software = SUPPORTED_SOFTWARE[softwareName as keyof typeof SUPPORTED_SOFTWARE];
  if (!software) return '';

  // Check default paths
  for (const path of software.defaultPaths) {
    // In real implementation, check if path exists
    if (Math.random() > 0.5) { // Simulate path check
      return path;
    }
  }

  return '';
};

// Detect plugins for specific software
const detectPlugins = async (softwareName: string): Promise<PluginInfo[]> => {
  const software = SUPPORTED_SOFTWARE[softwareName as keyof typeof SUPPORTED_SOFTWARE];
  if (!software) return [];

  const detectedPlugins: PluginInfo[] = [];

  for (const pluginName of software.plugins) {
    const isInstalled = await checkPluginInstallation(softwareName, pluginName);
    detectedPlugins.push({
      name: pluginName,
      version: isInstalled ? '1.0.0' : 'Not Installed',
      path: isInstalled ? `${software.defaultPaths[0]}\\Plugins\\${pluginName}` : '',
      isInstalled,
      isCompatible: true
    });
  }

  return detectedPlugins;
};

// Check if specific plugin is installed
const checkPluginInstallation = async (_softwareName: string, _pluginName: string): Promise<boolean> => {
  // In real implementation, check plugin directories and registry
  // For demo, return random installation status
  return Math.random() > 0.6; // 40% chance of being installed
};

// Get missing plugins that should be installed
export const getMissingPlugins = (software: SoftwareInfo[]): PluginInfo[] => {
  const missing: PluginInfo[] = [];

  for (const sw of software) {
    for (const plugin of sw.plugins) {
      if (!plugin.isInstalled) {
        missing.push(plugin);
      }
    }
  }

  return missing;
};

// Generate installation recommendations
export const generateRecommendations = (software: SoftwareInfo[], missingPlugins: PluginInfo[]): string[] => {
  const recommendations: string[] = [];

  if (software.length === 0) {
    recommendations.push('No supported video editing software detected. Consider installing Adobe After Effects or DaVinci Resolve.');
  }

  if (missingPlugins.length > 0) {
    recommendations.push(`Found ${missingPlugins.length} missing plugins that could enhance your workflow.`);
    
    const popularPlugins = missingPlugins.filter(p => 
      ['Video Copilot', 'Trapcode Suite', 'Red Giant', 'Sapphire'].includes(p.name)
    );
    
    if (popularPlugins.length > 0) {
      recommendations.push('Popular plugins like Video Copilot and Trapcode Suite are recommended for professional work.');
    }
  }

  return recommendations;
};

// Main detection function
export const detectSystem = async (): Promise<DetectionResult> => {
  const software = await detectInstalledSoftware();
  const missingPlugins = getMissingPlugins(software);
  const recommendations = generateRecommendations(software, missingPlugins);

  return {
    software,
    missingPlugins,
    recommendations
  };
}; 