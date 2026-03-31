import React, { useState, useEffect } from 'react';
import { 
  detectSystemInfo
} from '../services/systemDetector';
import { 
  downloadPlugin, 
  installMultiplePlugins, 
  getAllPlugins, 
  getRecommendedPlugins,
  getInstalledPlugins,
  uninstallPlugin,
  type InstallationProgress,
  type PluginDownload
} from '../services/pluginInstaller';
import {
  getInstalledSoftware,
  SOFTWARE_DOWNLOADS
} from '../services/softwareDownloader';
import { 
  Search, 
  Download, 
  CheckCircle, 
  AlertTriangle, 
  Monitor, 
  Package, 
  RefreshCw,
  Pause,
  Trash2
} from 'lucide-react';

interface Software {
  name: string;
  version: string;
  installPath: string;
  publisher: string;
  installDate: string;
}

interface DetectionResult {
  videoEditingSoftware: Software[];
  detectedPlugins: {
    name: string;
    version: string;
    compatible: boolean;
  }[];
  systemInfo: {
    os: string;
    totalMemory: string;
    processor: string;
    gpu: string;
  };
}

const PluginManager: React.FC = () => {
  const [detectionResult, setDetectionResult] = useState<DetectionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [selectedPlugins] = useState<string[]>([]);
  const [installationProgress, setInstallationProgress] = useState<InstallationProgress[]>([]);
  const [installing, setInstalling] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'detected' | 'available' | 'recommended'>('detected');

  // Scan system for installed software and plugins
  const scanSystem = async () => {
    setScanning(true);
    setLoading(true);
    
    try {
      const detectedSystem = await detectSystemInfo();
      const installedNames = getInstalledSoftware();
      const installedPlugins = getInstalledPlugins();
      
      const isWindows = detectedSystem.os.toLowerCase().includes('win');
      const baseDir = isWindows ? 'C:\\Users\\Public\\Downloads\\VideoFixPro' : '/Users/Shared/Downloads/VideoFixPro';
      
      const videoEditingSoftware: Software[] = installedNames.map(name => {
        const info = SOFTWARE_DOWNLOADS[name];
        return {
          name: info?.name || name,
          version: info?.version || 'Current',
          installPath: `${baseDir}\\${name.replace(/\s+/g, '_')}`,
          publisher: 'VFP-Certified Distributor',
          installDate: 'Registered System'
        };
      });

      const result: DetectionResult = {
        videoEditingSoftware,
        detectedPlugins: installedPlugins.map(name => ({
          name,
          version: 'Active',
          compatible: true
        })),
        systemInfo: {
          os: detectedSystem.os,
          totalMemory: detectedSystem.totalMemory,
          processor: detectedSystem.cpu,
          gpu: detectedSystem.gpu
        }
      };
      
      setDetectionResult(result);
    } catch (error) {
      console.error('Error scanning system:', error);
    } finally {
      setScanning(false);
      setLoading(false);
    }
  };

  const handleInstallPlugin = async (pluginName: string) => {
    setInstalling(true);
    const onProgress = (progress: InstallationProgress) => {
      setInstallationProgress(prev => {
        const existing = prev.find(p => p.pluginName === progress.pluginName);
        if (existing) return prev.map(p => p.pluginName === progress.pluginName ? progress : p);
        return [...prev, progress];
      });
    };
    await downloadPlugin(pluginName, onProgress);
    setInstalling(false);
    await scanSystem();
  };

  const handleUninstallPlugin = (pluginName: string) => {
    if (window.confirm(`Are you sure you want to uninstall ${pluginName}?`)) {
      uninstallPlugin(pluginName);
      setInstallationProgress(prev => prev.filter(p => p.pluginName !== pluginName));
      scanSystem();
    }
  };

  const handleInstallPlugins = async () => {
    if (selectedPlugins.length === 0) return;
    setInstalling(true);
    const onProgress = (progress: InstallationProgress) => {
      setInstallationProgress(prev => {
        const existing = prev.find(p => p.pluginName === progress.pluginName);
        if (existing) return prev.map(p => p.pluginName === progress.pluginName ? progress : p);
        return [...prev, progress];
      });
    };
    await installMultiplePlugins(selectedPlugins, onProgress);
    setInstalling(false);
    await scanSystem();
  };

  const getFilteredPlugins = () => {
    const allPlugins = getAllPlugins();
    if (!searchTerm) return allPlugins;
    return allPlugins.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  };

  const getRecommendedPluginsForSystem = () => {
    if (!detectionResult?.videoEditingSoftware) return [];
    const recommended: PluginDownload[] = [];
    detectionResult.videoEditingSoftware.forEach(s => {
      recommended.push(...getRecommendedPlugins(s.name));
    });
    return [...new Map(recommended.map(p => [p.name, p])).values()];
  };

  useEffect(() => {
    scanSystem();
  }, []);

  const isWindows = detectionResult?.systemInfo.os.toLowerCase().includes('win') || false;

  // SAFE CALCULATED LISTING
  const pluginsToDisplay = React.useMemo(() => {
    try {
      if (activeTab === 'detected') {
        return (detectionResult?.detectedPlugins || [])
          .map(d => getAllPlugins().find(p => p.name === d.name))
          .filter((p): p is PluginDownload => !!p);
      }
      
      if (activeTab === 'recommended') {
        return getRecommendedPluginsForSystem() || [];
      }
      
      return getFilteredPlugins() || [];
    } catch (err) {
      console.error('[VFP-Plugin-Manager] Listing error:', err);
      return [];
    }
  }, [activeTab, detectionResult, searchTerm]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Plugin Manager</h1>
              <p className="text-gray-600">Enterprise-grade diagnostic engine for video software extensions</p>
            </div>
            <button
              onClick={scanSystem}
              disabled={scanning}
              className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={scanning ? 'w-5 h-5 animate-spin' : 'w-5 h-5'} />
              <span>{scanning ? 'Analyzing System...' : 'Initiate Scan'}</span>
            </button>
          </div>

          {detectionResult && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                <h3 className="font-bold text-blue-900 text-xs uppercase tracking-wider flex items-center mb-2">
                  <Package className="w-4 h-4 mr-2" /> Target Software
                </h3>
                <p className="text-3xl font-extrabold text-blue-600">{detectionResult.videoEditingSoftware.length}</p>
              </div>
              <div className="bg-green-50 border border-green-100 rounded-xl p-4">
                <h3 className="font-bold text-green-900 text-xs uppercase tracking-wider flex items-center mb-2">
                  <CheckCircle className="w-4 h-4 mr-2" /> Verified Plugins
                </h3>
                <p className="text-3xl font-extrabold text-green-600">{detectionResult.detectedPlugins.length}</p>
              </div>
              <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
                <h3 className="font-bold text-orange-900 text-xs uppercase tracking-wider flex items-center mb-2">
                  <Monitor className="w-4 h-4 mr-2" /> Deployment OS
                </h3>
                <p className="text-lg font-bold text-orange-600 truncate">{detectionResult.systemInfo.os}</p>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Mobile-First: Software List moves above on small screens */}
          <div className="order-2 lg:order-1 lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6 border border-gray-100 h-full">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Monitor className="w-5 h-5 mr-2 text-blue-600" />
                <span>Host Software</span>
              </h2>
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-100 animate-pulse rounded-xl"></div>)}
                </div>
              ) : 
               detectionResult?.videoEditingSoftware.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  <Package className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-400 font-medium">No host found</p>
                </div>
               ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                  {detectionResult?.videoEditingSoftware.map(s => (
                    <div key={s.name} className="border border-gray-100 bg-gray-50 rounded-xl p-4 transition-all hover:bg-white hover:shadow-md group">
                      <h3 className="font-bold text-sm text-gray-900 group-hover:text-blue-600 transition-colors">{s.name}</h3>
                      <div className="flex items-center mt-2 text-[10px] font-mono text-gray-500 bg-white px-2 py-1 rounded-md border border-gray-100">
                        <CheckCircle className="w-3 h-3 mr-1 text-green-500" /> {s.version}
                      </div>
                    </div>
                  ))}
                </div>
               )}
            </div>
          </div>

          <div className="order-1 lg:order-2 lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6 border border-gray-100">
              {/* Tab Navigation - Better Mobile View */}
              <div className="flex items-center p-1.5 bg-gray-100 rounded-2xl mb-6 overflow-x-auto scroller-hide">
                {(['detected', 'recommended', 'available'] as const).map(tab => (
                  <button 
                    key={tab} 
                    onClick={() => setActiveTab(tab)} 
                    className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs md:text-sm transition-all whitespace-nowrap ${
                      activeTab === tab 
                        ? 'bg-white text-blue-600 shadow-lg' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {/* Advanced Search */}
              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="Filter plugins by name or host..." 
                  value={searchTerm} 
                  onChange={e => setSearchTerm(e.target.value)} 
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-medium text-sm md:text-base placeholder:text-gray-400" 
                />
              </div>

              {/* Plugin Distribution List */}
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1 custom-scrollbar">
                {pluginsToDisplay.length === 0 ? (
                  <div className="text-center py-20 bg-gray-50 rounded-2xl">
                    <Search className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                    <p className="text-gray-400 font-bold">No results found</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {pluginsToDisplay.map((p) => (
                      <PluginCard 
                        key={p.name} 
                        plugin={p} 
                        onInstall={() => handleInstallPlugin(p.name)} 
                        onUninstall={() => handleUninstallPlugin(p.name)}
                        installing={installing} 
                        isWindows={isWindows}
                        installationProgress={installationProgress.find(pr => pr.pluginName === p.name)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PluginCard: React.FC<{
  plugin: PluginDownload;
  onInstall: () => void;
  onUninstall: () => void;
  installing: boolean;
  isWindows: boolean;
  installationProgress?: InstallationProgress;
}> = ({ plugin, onInstall, onUninstall, installing, isWindows, installationProgress }) => {
  const isInstalled = installationProgress?.status === 'completed';
  const progress = installationProgress?.progress || 0;
  const showProgress = installationProgress && (installationProgress.status === 'downloading' || installationProgress.status === 'installing');

  return (
    <div className="border rounded-xl p-5 hover:border-blue-200 transition-all">
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <h3 className="font-bold text-gray-900 truncate">{plugin.name}</h3>
            {isInstalled && <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">INSTALLED</span>}
          </div>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{plugin.description}</p>
          {isInstalled && (
            <div className="mt-3 text-[10px] bg-gray-50 p-2 rounded border border-gray-100 flex items-start">
              <Monitor className="w-3 h-3 mr-1.5 mt-0.5 text-gray-400" />
              <span className="truncate">Path: {isWindows ? 'C:\\Program Files\\Adobe\\Common\\...' : '/Library/Application Support/...'}</span>
            </div>
          )}
        </div>

        <div className="ml-4">
          {isInstalled ? (
            <button onClick={onUninstall} className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
              <Trash2 className="w-5 h-5" />
            </button>
          ) : (
            <button 
              onClick={onInstall} 
              disabled={installing} 
              className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-blue-700 transition-all disabled:opacity-50"
            >
              Install
            </button>
          )}
        </div>
      </div>

      {showProgress && (
        <div className="mt-4">
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div className="bg-blue-600 h-1.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">{installationProgress.message}</span>
            <span className="text-[10px] text-blue-600 font-bold">{progress}%</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PluginManager;