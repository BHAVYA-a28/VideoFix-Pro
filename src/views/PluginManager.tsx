'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { 
  detectSystemInfo
} from '../services/systemDetector';
import { 
  downloadPlugin, 
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
} from '../services/softwareDownloadService';
import {
  getDetectedSoftware
} from '../services/nativeSystem';
import { useAuth } from '../hooks/useAuth';
import { 
  Search, 
  CheckCircle, 
  Monitor, 
  Package, 
  RefreshCw,
  Trash2,
  Cpu,
  Zap,
  Activity
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
  const { plan, upgrade } = useAuth();
  const [detectionResult, setDetectionResult] = useState<DetectionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [installationProgress, setInstallationProgress] = useState<InstallationProgress[]>([]);
  const [installing, setInstalling] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'detected' | 'available' | 'recommended'>('detected');

  const scanSystem = async () => {
    setScanning(true);
    setLoading(true);
    try {
      // 1. Core Browser Heuristics
      const detectedSystem = await detectSystemInfo();
      
      // 2. Native Bridge (Electron IPC)
      const nativeResults = await getDetectedSoftware();
      
      let videoEditingSoftware: Software[] = [];
      const isWindows = detectedSystem.os.toLowerCase().includes('win');
      const baseDir = isWindows ? 'C:\\Users\\Public\\Downloads\\VideoFixPro' : '/Users/Shared/Downloads/VideoFixPro';

      if (nativeResults && nativeResults.VideoEditingSoftware) {
        // Use real registry data
        videoEditingSoftware = nativeResults.VideoEditingSoftware.map((s: any) => ({
          name: s.DisplayName,
          version: s.DisplayVersion || 'Unknown',
          installPath: s.InstallLocation || 'Unknown',
          publisher: s.Publisher || 'Unknown',
          installDate: s.InstallDate || 'Unknown'
        }));
      } else {
        // Fallback to local storage records
        const installedNames = getInstalledSoftware();
        videoEditingSoftware = installedNames.map((name: string) => {
          const info = SOFTWARE_DOWNLOADS[name];
          return {
            name: info?.name || name,
            version: info?.version || 'Current',
            installPath: `${baseDir}\\${name.replace(/\s+/g, '_')}`,
            publisher: 'VFP-Certified Distributor',
            installDate: 'Registered System'
          };
        });
      }

      const result: DetectionResult = {
        videoEditingSoftware,
        detectedPlugins: getInstalledPlugins().map((name: string) => ({
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
    // SaaS Restriction: Check if plugin requires Pro plan
    const plugin = getAllPlugins().find(p => p.name === pluginName);
    if (plugin?.tier === 'pro' && plan !== 'pro') {
      if (window.confirm(`${pluginName} is a Professional Module. Upgrade your startup plan to Pro to unlock native deployment?`)) {
        upgrade();
      } else {
        return;
      }
    }

    setInstalling(true);
    const onProgress = (progress: InstallationProgress) => {
      setInstallationProgress(prev => {
        const existing = prev.find(p => p.pluginName === progress.pluginName);
        if (existing) {
          return prev.map(p => p.pluginName === progress.pluginName ? progress : p);
        }
        return [...prev, progress];
      });
    };
    await downloadPlugin(pluginName, onProgress);
    setInstalling(false);
    // Refresh detection after install
    await scanSystem();
  };

  const handleUninstallPlugin = (pluginName: string) => {
    if (window.confirm(`Are you sure you want to remove the ${pluginName} module?`)) {
      uninstallPlugin(pluginName);
      // Remove from UI state
      setInstallationProgress(prev => prev.filter(p => p.pluginName !== pluginName));
      // Trigger scan to update detection
      scanSystem();
    }
  };

  const pluginsToDisplay = useMemo(() => {
    if (activeTab === 'detected') {
      return (detectionResult?.detectedPlugins || [])
        .map(d => getAllPlugins().find(p => p.name === d.name))
        .filter((p): p is PluginDownload => !!p);
    }
    
    if (activeTab === 'recommended') {
      const recommended: PluginDownload[] = [];
      detectionResult?.videoEditingSoftware.forEach(s => {
        recommended.push(...getRecommendedPlugins(s.name));
      });
      // Filter out duplicates
      return [...new Map(recommended.map(p => [p.name, p])).values()];
    }

    const all = getAllPlugins();
    if (searchTerm) {
      return all.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return all;
  }, [activeTab, detectionResult, searchTerm]);

  useEffect(() => {
    scanSystem();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="bg-white shadow-sm mb-8">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Plugin Management</h1>
              <p className="text-gray-600 mt-2">Manage software extensions and optimize your editing environment</p>
            </div>
            <button
              onClick={scanSystem}
              disabled={scanning}
              className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-bold text-white shadow-lg transition-all ${
                scanning ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
              }`}
            >
              <RefreshCw className={scanning ? 'w-5 h-5 animate-spin' : 'w-5 h-5'} />
              <span>{scanning ? 'Analyzing Infrastructure...' : 'Initiate Scan'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left: Environment Insights */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <Monitor className="w-5 h-5 mr-3 text-blue-600" />
                Detected Environment
              </h2>
              
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-16 bg-gray-50 animate-pulse rounded-lg bg-gradient-to-r from-gray-50 to-gray-100"></div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {detectionResult?.videoEditingSoftware.length === 0 ? (
                    <div className="bg-yellow-50 p-4 rounded-lg flex items-start space-x-3">
                      <Zap className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-1" />
                      <p className="text-sm text-yellow-700">No active video software detected. Check standard install paths.</p>
                    </div>
                  ) : (
                    detectionResult?.videoEditingSoftware.map(s => (
                      <div key={s.name} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-blue-200 transition-all">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                          <Activity className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-sm text-gray-900">{s.name}</h3>
                          <div className="flex items-center space-x-2 text-[10px] text-gray-500 font-medium">
                            <span>{s.version}</span>
                            <span>•</span>
                            <span className="truncate max-w-[150px]">{s.publisher}</span>
                          </div>
                        </div>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Cpu className="w-5 h-5 mr-3 text-purple-600" />
                System Specs
              </h2>
              {detectionResult && (
                <div className="space-y-3">
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-500 font-medium">OS:</span>
                    <span className="text-sm font-bold text-gray-700">{detectionResult.systemInfo.os}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-500 font-medium">Core RAM:</span>
                    <span className="text-sm font-bold text-gray-700">{detectionResult.systemInfo.totalMemory}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Module Management */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 min-h-[500px]">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-4 border-b border-gray-50 gap-4">
                <div className="flex space-x-4">
                  {(['detected', 'recommended', 'available'] as const).map(tab => (
                    <button 
                      key={tab} 
                      onClick={() => setActiveTab(tab)} 
                      className={`px-4 py-2 font-bold text-sm transition-all border-b-2 uppercase tracking-wide ${
                        activeTab === tab 
                          ? 'border-blue-600 text-blue-600' 
                          : 'border-transparent text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input 
                    type="text" 
                    placeholder="Search modules..." 
                    value={searchTerm} 
                    onChange={e => setSearchTerm(e.target.value)} 
                    className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-full md:w-64" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pluginsToDisplay.map((p) => (
                  <div key={p.name} className="p-5 border border-gray-100 rounded-xl hover:border-blue-200 hover:shadow-lg transition-all group flex flex-col justify-between h-full bg-white">
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <div className="bg-blue-50 p-2 rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all"><Package className="h-5 w-5" /></div>
                        {activeTab === 'detected' && <span className="text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold uppercase">Active Module</span>}
                      </div>
                      <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">{p.name}</h3>
                      <p className="text-xs text-gray-500 mb-2 line-clamp-2">{p.description}</p>
                      <div className="flex items-center mb-4">
                        <span className={`text-[10px] font-bold uppercase rounded px-1.5 py-0.5 ${p.tier === 'pro' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
                          {p.tier} Module
                        </span>
                      </div>
                    </div>

                    <div className="mt-auto pt-4">
                      {installationProgress.find(pr => pr.pluginName === p.name) ? (
                        <div className="space-y-3">
                          <div className="flex justify-between text-xs font-bold text-blue-600">
                             <span>{installationProgress.find(pr => pr.pluginName === p.name)?.message}</span>
                             <span>{installationProgress.find(pr => pr.pluginName === p.name)?.progress}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${installationProgress.find(pr => pr.pluginName === p.name)?.progress}%` }}></div>
                          </div>
                          {installationProgress.find(pr => pr.pluginName === p.name)?.status === 'completed' && (
                            <button onClick={() => handleUninstallPlugin(p.name)} className="w-full mt-2 py-2 text-xs font-bold text-red-500 hover:text-red-700 transition-colors flex items-center justify-center">
                              <Trash2 className="h-3 w-3 mr-2" /> Uninstall Module
                            </button>
                          )}
                        </div>
                      ) : (
                        <button 
                          onClick={() => handleInstallPlugin(p.name)} 
                          disabled={installing} 
                          className="w-full py-2.5 bg-gray-50 hover:bg-blue-600 hover:text-white text-blue-600 rounded-lg font-bold text-xs uppercase tracking-widest transition-all disabled:opacity-50 border border-transparent active:scale-[0.98]"
                        >
                          Deploy Module
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PluginManager;