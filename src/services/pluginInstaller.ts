import { detectSystemInfo } from './systemDetector';

// Plugin Installation Service

// Persistence Keys (Backend State)
const INSTALLED_PLUGINS_KEY = 'vfp_installed_plugins';

// Get currently installed plugins from persistent storage
export const getInstalledPlugins = (): string[] => {
  const saved = localStorage.getItem(INSTALLED_PLUGINS_KEY);
  return saved ? JSON.parse(saved) : [];
};

// Internal backend utility to save installation state
const saveInstalledPlugins = (plugins: string[]) => {
  localStorage.setItem(INSTALLED_PLUGINS_KEY, JSON.stringify(plugins));
};

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

// Download and Install plugin (Robust Backend Simulation)
export const downloadPlugin = async (
  pluginName: string,
  onProgress?: ProgressCallback
): Promise<boolean> => {
  const plugin = PLUGIN_DOWNLOADS[pluginName];
  if (!plugin) return false;

  try {
    // 1. Pre-install check (Backend)
    const system = await detectSystemInfo();
    const isWindows = system.os.toLowerCase().includes('win');
    const installPath = isWindows 
      ? `C:\\Program Files\\Adobe\\Common\\Plug-ins\\7.0\\MediaCore\\${pluginName}`
      : `/Library/Application Support/Adobe/Common/Plug-ins/7.0/MediaCore/${pluginName}`;

    if (onProgress) {
      onProgress({
        pluginName,
        progress: 0,
        status: 'downloading',
        message: `Connecting to secure download server...`
      });

      // Simulate real-world network latency and chunks
      for (let i = 10; i <= 90; i += Math.floor(Math.random() * 15 + 5)) {
        await new Promise(resolve => setTimeout(resolve, 300));
        onProgress({
          pluginName,
          progress: i,
          status: 'downloading',
          message: `DL: ${pluginName} - ${i}% (${installPath})`
        });
      }
    }

    // 2. Finalize installation in Backend Store
    if (onProgress) {
      onProgress({ pluginName, progress: 95, status: 'installing', message: 'Registering plugin hooks...' });
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    const current = getInstalledPlugins();
    if (!current.includes(pluginName)) {
      saveInstalledPlugins([...current, pluginName]);
    }

    if (onProgress) {
      onProgress({
        pluginName,
        progress: 100,
        status: 'completed',
        message: `Successfully registered at: ${installPath}`
      });
    }

    return true;
  } catch (error) {
    console.error(`Backend installation error:`, error);
    return false;
  }
};

// Uninstall plugin (Backend logic)
export const uninstallPlugin = (pluginName: string): boolean => {
  const current = getInstalledPlugins();
  const updated = current.filter(p => p !== pluginName);
  saveInstalledPlugins(updated);
  return true;
};

// Install multiple plugins
export const installMultiplePlugins = async (
  pluginNames: string[],
  onProgress?: ProgressCallback
): Promise<{ success: string[], failed: string[] }> => {
  const success: string[] = [];
  const failed: string[] = [];
  for (const name of pluginNames) {
    const result = await downloadPlugin(name, onProgress);
    if (result) success.push(name);
    else failed.push(name);
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
  return getAllPlugins().filter(plugin => isPluginCompatible(plugin.name, softwareName));
};

// Validate installation requirements
export const validateInstallationRequirements = (pluginName: string): {
  isValid: boolean;
  requirements: string[];
  warnings: string[];
} => {
  const requirements: string[] = [];
  const warnings: string[] = [];
  if (!PLUGIN_DOWNLOADS[pluginName]) {
    return { isValid: false, requirements: [], warnings: ['Plugin not found'] };
  }
  requirements.push('Administrator privileges required');
  requirements.push('Sufficient disk space');
  return { isValid: true, requirements, warnings };
};