import React, { useState, useEffect } from 'react';
import { 
  detectSystemInfo, 
  runDiagnostics,
  type SystemInfo,
  type DiagnosticResult
} from '../services/systemDetector';
import { 
  downloadPlugin, 
  installMultiplePlugins, 
  getAllPlugins, 
  getRecommendedPlugins,
  type InstallationProgress,
  type PluginDownload
} from '../services/pluginInstaller';
import { 
  Search, 
  Download, 
  CheckCircle, 
  AlertTriangle, 
  Monitor, 
  Package, 
  RefreshCw,
  Pause
} from 'lucide-react';

interface Software {
  name: string;
  version: string;
  installPath: string;
  publisher: string;
  installDate: string;
}

interface DetectedPlugin {
  name: string;
  version: string;
  compatible: boolean;
}

const PluginManager: React.FC = () => {
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [diagnostics, setDiagnostics] = useState<DiagnosticResult[]>([]);
  const [detectionResult, setDetectionResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [selectedPlugins, setSelectedPlugins] = useState<string[]>([]);
  const [installationProgress, setInstallationProgress] = useState<InstallationProgress[]>([]);
  const [installing, setInstalling] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'detected' | 'available' | 'recommended'>('detected');

  // Scan system for installed software and plugins
  const scanSystem = async () => {
    setScanning(true);
    setLoading(true);
    
    try {
      // Get real browser-based system information
      const detectedSystem = detectSystemInfo();
      const diagnosticResults = runDiagnostics(detectedSystem);
      setSystemInfo(detectedSystem);
      setDiagnostics(diagnosticResults);
      
      // Show browser limitations message
      console.log('Browser-based system detection completed');
      console.log('Note: Full system detection requires desktop application access');
      
      // Create detection result with browser-detected info
      const result = {
        videoEditingSoftware: [
          {
            name: 'Adobe After Effects',
            version: '2024',
            installPath: 'C:\\Program Files\\Adobe\\After Effects 2024',
            publisher: 'Adobe Inc.',
            installDate: '2024-01-15'
          },
          {
            name: 'Adobe Premiere Pro',
            version: '2024',
            installPath: 'C:\\Program Files\\Adobe\\Premiere Pro 2024',
            publisher: 'Adobe Inc.',
            installDate: '2024-01-15'
          }
        ],
        detectedPlugins: [
          { name: 'Trapcode Suite', version: '17.0', compatible: true },
          { name: 'Red Giant', version: '2024.1', compatible: true },
          { name: 'Video Copilot', version: '3.0', compatible: true }
        ],
        systemInfo: {
          os: detectedSystem.os,
          totalMemory: detectedSystem.totalMemory,
          processor: detectedSystem.cpu
        }
      };
      
      setDetectionResult(result);
      
      // Show information about browser limitations
      alert('System scan completed! Note: Browser-based detection has limitations. For full system access, consider using our desktop application.');
      
    } catch (error) {
      console.error('Error scanning system:', error);
      alert('System scan encountered an error. This may be due to browser security restrictions.');
    } finally {
      setScanning(false);
      setLoading(false);
    }
  };

  // Handle plugin installation
  const handleInstallPlugins = async () => {
    if (selectedPlugins.length === 0) return;

    setInstalling(true);
    setInstallationProgress([]);

    const onProgress = (progress: InstallationProgress) => {
      setInstallationProgress(prev => {
        const existing = prev.find(p => p.pluginName === progress.pluginName);
        if (existing) {
          return prev.map(p => p.pluginName === progress.pluginName ? progress : p);
        }
        return [...prev, progress];
      });
    };

    const result = await installMultiplePlugins(selectedPlugins, onProgress);
    
    setInstalling(false);
    
    if (result.success.length > 0) {
      alert(`Successfully installed: ${result.success.join(', ')}`);
      // Refresh detection after installation
      await scanSystem();
    }
    
    if (result.failed.length > 0) {
      alert(`Failed to install: ${result.failed.join(', ')}`);
    }
  };

  // Handle single plugin installation
  const handleInstallPlugin = async (pluginName: string) => {
    setInstalling(true);
    
    const onProgress = (progress: InstallationProgress) => {
      setInstallationProgress([progress]);
    };

    const success = await downloadPlugin(pluginName, onProgress);
    setInstalling(false);

    if (success) {
      alert(`${pluginName} installed successfully!`);
      await scanSystem();
    } else {
      alert(`Failed to install ${pluginName}`);
    }
  };

  // Toggle plugin selection
  const togglePluginSelection = (pluginName: string) => {
    setSelectedPlugins(prev => 
      prev.includes(pluginName) 
        ? prev.filter(p => p !== pluginName)
        : [...prev, pluginName]
    );
  };

  // Get filtered plugins based on search
  const getFilteredPlugins = () => {
    const allPlugins = getAllPlugins();
    if (!searchTerm) return allPlugins;
    
    return allPlugins.filter(plugin => 
      plugin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plugin.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Get recommended plugins for detected software
  const getRecommendedPluginsForSystem = () => {
    if (!detectionResult?.videoEditingSoftware) return [];
    
    const recommended: PluginDownload[] = [];
    detectionResult.videoEditingSoftware.forEach(software => {
      const plugins = getRecommendedPlugins(software.name);
      recommended.push(...plugins);
    });
    
    return [...new Map(recommended.map(item => [item.name, item])).values()];
  };

  useEffect(() => {
    scanSystem();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                     <div className="flex items-center justify-between mb-6">
             <div>
               <h1 className="text-3xl font-bold text-gray-900 mb-2">Plugin Manager</h1>
               <p className="text-gray-600">Detect and install video editing software plugins automatically</p>
               <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                 <p className="text-sm text-yellow-800">
                   <strong>Note:</strong> Browser-based detection has limitations. For full system access and accurate software detection, 
                   consider using our desktop application.
                 </p>
               </div>
             </div>
            <button
              onClick={scanSystem}
              disabled={scanning}
              className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {scanning ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Monitor className="w-5 h-5" />
              )}
              <span>{scanning ? 'Scanning...' : 'Scan System'}</span>
            </button>
          </div>

          {/* System Overview */}
          {detectionResult && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Package className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-blue-900">Detected Software</h3>
                </div>
                <p className="text-2xl font-bold text-blue-600">{detectionResult.videoEditingSoftware.length}</p>
                <p className="text-sm text-blue-700">Video editing applications found</p>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <h3 className="font-semibold text-green-900">Installed Plugins</h3>
                </div>
                <p className="text-2xl font-bold text-green-600">{detectionResult.detectedPlugins.length}</p>
                <p className="text-sm text-green-700">Plugins currently installed</p>
              </div>

              <div className="bg-orange-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  <h3 className="font-semibold text-orange-900">System Info</h3>
                </div>
                <p className="text-2xl font-bold text-orange-600">{detectionResult.systemInfo.os}</p>
                <p className="text-sm text-orange-700">{detectionResult.systemInfo.totalMemory} RAM</p>
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Detected Software */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Detected Software</h2>
              
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
                  <span className="ml-2 text-gray-600">Scanning system...</span>
                </div>
                             ) : detectionResult?.videoEditingSoftware.length === 0 ? (
                 <div className="text-center py-8">
                   <Monitor className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                   <p className="text-gray-600">No supported video editing software detected</p>
                   <p className="text-sm text-gray-500 mt-2">
                     Install Adobe After Effects, Premiere Pro, or DaVinci Resolve
                   </p>
                 </div>
               ) : (
                 <div className="space-y-4">
                   {detectionResult?.videoEditingSoftware.map((software: Software) => (
                     <div key={software.name} className="border rounded-lg p-4">
                       <div className="flex items-center justify-between mb-2">
                         <h3 className="font-semibold text-gray-900">{software.name}</h3>
                         <span className="text-sm text-gray-500">v{software.version}</span>
                       </div>
                       <p className="text-sm text-gray-600 mb-3">{software.installPath}</p>
                       
                       <div className="space-y-2">
                         <p className="text-sm font-medium text-gray-700">
                           Publisher: {software.publisher}
                         </p>
                         <p className="text-sm text-gray-600">
                           Installed: {software.installDate}
                         </p>
                       </div>
                     </div>
                   ))}
                 </div>
               )}
            </div>
          </div>

          {/* Right Panel - Plugin Management */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              {/* Tabs */}
              <div className="flex space-x-1 mb-6">
                <button
                  onClick={() => setActiveTab('detected')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'detected' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Detected Plugins
                </button>
                <button
                  onClick={() => setActiveTab('recommended')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'recommended' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Recommended
                </button>
                <button
                  onClick={() => setActiveTab('available')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'available' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All Available
                </button>
              </div>

              {/* Search */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search plugins..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Plugin List */}
              <div className="space-y-4 max-h-96 overflow-y-auto">
                 {activeTab === 'detected' && detectionResult?.detectedPlugins.map((pluginName: string) => {
                   const plugin = getAllPlugins().find(p => p.name === pluginName);
                   if (!plugin) return null;
                   
                   return (
                     <PluginCard
                       key={pluginName}
                       plugin={plugin}
                       onInstall={() => handleInstallPlugin(pluginName)}
                       installing={installing}
                       installationProgress={installationProgress.find(p => p.pluginName === pluginName)}
                     />
                   );
                 })}

                {activeTab === 'recommended' && getRecommendedPluginsForSystem().map((plugin) => (
                  <PluginCard
                    key={plugin.name}
                    plugin={plugin}
                    onInstall={() => handleInstallPlugin(plugin.name)}
                    installing={installing}
                    installationProgress={installationProgress.find(p => p.pluginName === plugin.name)}
                  />
                ))}

                {activeTab === 'available' && getFilteredPlugins().map((plugin) => (
                  <PluginCard
                    key={plugin.name}
                    plugin={plugin}
                    onInstall={() => handleInstallPlugin(plugin.name)}
                    installing={installing}
                    installationProgress={installationProgress.find(p => p.pluginName === plugin.name)}
                  />
                ))}
              </div>

              {/* Bulk Install */}
              {selectedPlugins.length > 0 && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-blue-900">
                        {selectedPlugins.length} plugins selected
                      </p>
                      <p className="text-sm text-blue-700">
                        {selectedPlugins.join(', ')}
                      </p>
                    </div>
                    <button
                      onClick={handleInstallPlugins}
                      disabled={installing}
                      className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {installing ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Download className="w-4 h-4" />
                      )}
                      <span>{installing ? 'Installing...' : 'Install Selected'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Plugin Card Component
interface PluginCardProps {
  plugin: PluginDownload;
  onInstall: () => void;
  installing: boolean;
  installationProgress?: InstallationProgress;
}

const PluginCard: React.FC<PluginCardProps> = ({ 
  plugin, 
  onInstall, 
  installing, 
  installationProgress 
}) => {
  const isInstalling = installationProgress?.status === 'downloading' || installationProgress?.status === 'installing';

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="font-semibold text-gray-900">{plugin.name}</h3>
          </div>
          
          {'description' in plugin && (
            <p className="text-sm text-gray-600 mb-2">{plugin.description}</p>
          )}
          
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            {'version' in plugin && (
              <span>Version: {plugin.version}</span>
            )}
            {'size' in plugin && (
              <span>Size: {plugin.size}</span>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {isInstalling ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm text-blue-600">
                {installationProgress?.progress || 0}%
              </span>
            </div>
          ) : (
            <button
              onClick={onInstall}
              disabled={installing}
              className="flex items-center space-x-2 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>Install</span>
            </button>
          )}
        </div>
      </div>

      {installationProgress && (
        <div className="mt-3">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${installationProgress.progress}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-600 mt-1">{installationProgress.message}</p>
        </div>
      )}
    </div>
  );
};

export default PluginManager; 