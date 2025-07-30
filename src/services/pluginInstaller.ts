// Plugin Installation Service

export interface InstallationProgress {
  pluginName: string;
  progress: number; // 0-100
  status: 'downloading' | 'installing' | 'completed' | 'failed';
  message: string;
}

export interface PluginDownload {
  name: string;
  url: string;
  size: string;
  version: string;
  description: string;
  compatibility: string[];
}

// Plugin download sources and information
export const PLUGIN_DOWNLOADS: Record<string, PluginDownload> = {
  'Video Copilot': {
    name: 'Video Copilot',
    url: 'https://www.videocopilot.net/downloads/',
    size: '500MB',
    version: '2024.1',
    description: 'Professional visual effects and motion graphics plugins',
    compatibility: ['Adobe After Effects 2024', 'Adobe After Effects 2023']
  },
  'Trapcode Suite': {
    name: 'Trapcode Suite',
    url: 'https://www.maxon.net/en/trapcode-suite',
    size: '2.1GB',
    version: '2024.1',
    description: 'Particle systems, 3D objects, and motion graphics',
    compatibility: ['Adobe After Effects 2024', 'Adobe After Effects 2023']
  },
  'Red Giant': {
    name: 'Red Giant',
    url: 'https://www.maxon.net/en/red-giant',
    size: '1.8GB',
    version: '2024.1',
    description: 'Color grading, visual effects, and motion graphics',
    compatibility: ['Adobe After Effects 2024', 'Adobe Premiere Pro 2024']
  },
  'Sapphire': {
    name: 'Sapphire',
    url: 'https://borisfx.com/products/sapphire/',
    size: '3.2GB',
    version: '2024.1',
    description: 'Professional visual effects and transitions',
    compatibility: ['Adobe After Effects 2024', 'Adobe Premiere Pro 2024']
  },
  'Twixtor': {
    name: 'Twixtor',
    url: 'https://www.revisionfx.com/products/twixtor/',
    size: '150MB',
    version: '7.0',
    description: 'Time remapping and motion interpolation',
    compatibility: ['Adobe After Effects 2024', 'Adobe Premiere Pro 2024']
  },
  'Optical Flares': {
    name: 'Optical Flares',
    url: 'https://www.videocopilot.net/products/optical-flares/',
    size: '300MB',
    version: '1.3.5',
    description: 'Professional lens flares and light effects',
    compatibility: ['Adobe After Effects 2024', 'Adobe After Effects 2023']
  },
  'Element 3D': {
    name: 'Element 3D',
    url: 'https://www.videocopilot.net/products/element-3d/',
    size: '800MB',
    version: '2.2.2',
    description: '3D object integration for After Effects',
    compatibility: ['Adobe After Effects 2024', 'Adobe After Effects 2023']
  },
  'Particular': {
    name: 'Particular',
    url: 'https://www.maxon.net/en/particle',
    size: '450MB',
    version: '5.0',
    description: 'Advanced particle system for motion graphics',
    compatibility: ['Adobe After Effects 2024', 'Adobe After Effects 2023']
  }
};

// Installation progress callback type
export type ProgressCallback = (progress: InstallationProgress) => void;

// Download plugin
export const downloadPlugin = async (
  pluginName: string,
  onProgress?: ProgressCallback
): Promise<boolean> => {
  const plugin = PLUGIN_DOWNLOADS[pluginName];
  
  if (!plugin) {
    console.error(`Plugin ${pluginName} not found in download catalog`);
    return false;
  }

  try {
    // Simulate download progress
    if (onProgress) {
      onProgress({
        pluginName,
        progress: 0,
        status: 'downloading',
        message: `Starting download of ${pluginName}...`
      });

      // Simulate download progress
      for (let i = 10; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        onProgress({
          pluginName,
          progress: i,
          status: 'downloading',
          message: `Downloading ${pluginName}... ${i}%`
        });
      }
    }

    // Simulate installation
    if (onProgress) {
      onProgress({
        pluginName,
        progress: 100,
        status: 'installing',
        message: `Installing ${pluginName}...`
      });

      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Simulate completion
    if (onProgress) {
      onProgress({
        pluginName,
        progress: 100,
        status: 'completed',
        message: `${pluginName} installed successfully!`
      });
    }

    return true;
  } catch (error) {
    console.error(`Error downloading ${pluginName}:`, error);
    
    if (onProgress) {
      onProgress({
        pluginName,
        progress: 0,
        status: 'failed',
        message: `Failed to install ${pluginName}: ${error}`
      });
    }
    
    return false;
  }
};

// Install multiple plugins
export const installMultiplePlugins = async (
  pluginNames: string[],
  onProgress?: ProgressCallback
): Promise<{ success: string[], failed: string[] }> => {
  const success: string[] = [];
  const failed: string[] = [];

  for (const pluginName of pluginNames) {
    const result = await downloadPlugin(pluginName, onProgress);
    if (result) {
      success.push(pluginName);
    } else {
      failed.push(pluginName);
    }
  }

  return { success, failed };
};

// Get plugin information
export const getPluginInfo = (pluginName: string): PluginDownload | null => {
  return PLUGIN_DOWNLOADS[pluginName] || null;
};

// Get all available plugins
export const getAllPlugins = (): PluginDownload[] => {
  return Object.values(PLUGIN_DOWNLOADS);
};

// Check if plugin is compatible with software
export const isPluginCompatible = (pluginName: string, softwareName: string): boolean => {
  const plugin = PLUGIN_DOWNLOADS[pluginName];
  if (!plugin) return false;

  return plugin.compatibility.some(compat => 
    compat.toLowerCase().includes(softwareName.toLowerCase())
  );
};

// Get recommended plugins for specific software
export const getRecommendedPlugins = (softwareName: string): PluginDownload[] => {
  return getAllPlugins().filter(plugin => 
    isPluginCompatible(plugin.name, softwareName)
  );
};

// Validate installation requirements
export const validateInstallationRequirements = (pluginName: string): {
  isValid: boolean;
  requirements: string[];
  warnings: string[];
} => {
  const requirements: string[] = [];
  const warnings: string[] = [];

  // Check if plugin exists
  if (!PLUGIN_DOWNLOADS[pluginName]) {
    return {
      isValid: false,
      requirements: [],
      warnings: ['Plugin not found in catalog']
    };
  }

  // Add basic requirements
  requirements.push('Administrator privileges required');
  requirements.push('Sufficient disk space (2GB recommended)');
  requirements.push('Stable internet connection');

  // Add software-specific requirements
  if (pluginName === 'Video Copilot' || pluginName === 'Optical Flares') {
    requirements.push('Adobe After Effects 2023 or later');
  }

  if (pluginName === 'Trapcode Suite') {
    requirements.push('Adobe After Effects 2023 or later');
    requirements.push('OpenGL 3.3 compatible graphics card');
  }

  if (pluginName === 'Red Giant') {
    requirements.push('Adobe Creative Suite 2023 or later');
    requirements.push('8GB RAM minimum');
  }

  return {
    isValid: true,
    requirements,
    warnings
  };
}; 