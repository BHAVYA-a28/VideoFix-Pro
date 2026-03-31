import { useState, useEffect } from 'react';
import { 
  Download, 
  Monitor, 
  HardDrive, 
  Cpu, 
  CheckCircle, 
  AlertCircle, 
  ExternalLink,
  Search,
  Filter,
  Star,
  Clock,
  FileText,
  Globe,
  Shield,
  RefreshCw
} from 'lucide-react';
import {
  getAllSoftware,
  searchSoftware,
  getSystemInfo,
  checkSystemCompatibility,
  openOfficialWebsite,
  validateDownloadRequirements,
  downloadSoftware,
  getInstalledSoftware,
  type SoftwareDownload,
  type SystemInfo
} from '../services/softwareDownloader';
import {
  getNativeSystemInfo
} from '../services/nativeSystem';

const SoftwareDownload = () => {
  const [softwareList, setSoftwareList] = useState<SoftwareDownload[]>([]);
  const [filteredSoftware, setFilteredSoftware] = useState<SoftwareDownload[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLicense, setSelectedLicense] = useState<string>('all');
  const [downloadingStatus, setDownloadingStatus] = useState<Record<string, {
    progress: number;
    status: string;
    message: string;
    speed?: string;
    eta?: string;
    localPath?: string;
  }>>({});
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);

  const [showSystemInfo, setShowSystemInfo] = useState(false);
  const [selectedSoftware, setSelectedSoftware] = useState<SoftwareDownload | null>(null);
  const [showRequirements, setShowRequirements] = useState(false);
  const [showMoreSoftware, setShowMoreSoftware] = useState(false);
  const [displayedSoftware, setDisplayedSoftware] = useState<SoftwareDownload[]>([]);
  const [initialDisplayCount] = useState(6);

  useEffect(() => {
    loadSoftware();
    loadSystemInfo();
  }, []);

  useEffect(() => {
    let filtered = softwareList;

    // Apply search filter
    if (searchQuery) {
      filtered = searchSoftware(searchQuery);
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(software => software.category === selectedCategory);
    }

    // Apply license filter
    if (selectedLicense !== 'all') {
      filtered = filtered.filter(software => software.license === selectedLicense);
    }

    setFilteredSoftware(filtered);
    
    // Reset show more state when filters change
    setShowMoreSoftware(false);
  }, [softwareList, searchQuery, selectedCategory, selectedLicense]);

  // Calculate which software to display
  useEffect(() => {
    const displayCount = showMoreSoftware ? filteredSoftware.length : Math.min(initialDisplayCount, filteredSoftware.length);
    setDisplayedSoftware(filteredSoftware.slice(0, displayCount));
  }, [filteredSoftware, showMoreSoftware, initialDisplayCount]);

  const loadSoftware = () => {
    const allSoftware = getAllSoftware();
    const installed = getInstalledSoftware();
    
    // Sync UI with backend installation history
    const initialStatus: Record<string, {
      progress: number;
      status: string;
      message: string;
      speed?: string;
      eta?: string;
      localPath?: string;
    }> = {};
    
    installed.forEach(name => {
      initialStatus[name] = {
        progress: 100,
        status: 'completed',
        message: 'Active and Registered'
      };
    });
    
    setDownloadingStatus(initialStatus);
    setSoftwareList(allSoftware);
    setFilteredSoftware(allSoftware);
  };

  const loadSystemInfo = async () => {
    try {
      // Use native system info for more accurate data
      const nativeInfo = await getNativeSystemInfo();
      const info: SystemInfo = {
        os: nativeInfo.os,
        architecture: nativeInfo.architecture,
        ram: nativeInfo.ram,
        storage: nativeInfo.storage,
        graphics: nativeInfo.graphics
      };
      setSystemInfo(info);
    } catch (error) {
      console.error('Error loading system info:', error);
      // Fallback to basic system info
      try {
        const info = await getSystemInfo();
        setSystemInfo(info);
      } catch (fallbackError) {
        console.error('Fallback system info failed:', fallbackError);
      }
    }
  };

  const handleDownload = async (software: SoftwareDownload) => {
    if (!systemInfo) return;
    
    // ONE-CLICK UPGRADE: If free, skip simulation and go straight to official source
    if (software.license === 'free' && software.downloadUrl) {
      // Still register it in our backend database so it shows as "Installed"
      try {
        // Trigger the REAL official installer immediately
        window.location.href = software.downloadUrl;
        
        // Use a fast-track simulation for the UI feedback
        setDownloadingStatus(prev => ({
          ...prev,
          [software.name]: {
            progress: 100,
            status: 'completed',
            message: 'One-Click Registration Active',
            localPath: `C:\\Users\\Public\\Downloads\\VideoFixPro\\${software.name.replace(/\s+/g, '_')}`
          }
        }));
        
        // We'll call the real download function with a 'fast' flag if needed, 
        // but for now let's just use the direct trigger and register it.
        await downloadSoftware(software.name, () => {}); 
        return;
      } catch (err) {
        console.error('One-click failure:', err);
      }
    }

    // Standard managed simulation for Pro/Paid/Complex software
    await downloadSoftware(software.name, async (progress) => {
      setDownloadingStatus(prev => ({
        ...prev,
        [software.name]: {
          progress: progress.progress,
          status: progress.status,
          message: progress.message,
          speed: progress.downloadSpeed,
          eta: progress.estimatedTime,
          localPath: progress.localPath
        }
      }));

      // 4. Authentic Native Handoff: Execute via Electron if available
      if (progress.progress === 100 && progress.localPath) {
        // @ts-ignore: Electron IPC bridge
        if (window.require && window.require('electron')) {
          try {
            // @ts-ignore
            const { ipcRenderer } = window.require('electron');
            console.log('[VFP] Native Handoff: Executing installer at', progress.localPath);
            await ipcRenderer.invoke('execute-installer', progress.localPath);
          } catch (nativeErr) {
            console.error('[VFP] Native execution failed:', nativeErr);
          }
        } else if (software.downloadUrl) {
          // Standard browser fallback
          window.location.href = software.downloadUrl;
        }
      }
    });
  };

  const handleSystemCheck = (software: SoftwareDownload) => {
    if (!systemInfo) return;

    setSelectedSoftware(software);
    setShowRequirements(true);
  };

  const getLicenseIcon = (license: string) => {
    switch (license) {
      case 'free':
        return <Star className="h-4 w-4 text-green-500" />;
      case 'trial':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'paid':
        return <FileText className="h-4 w-4 text-blue-500" />;
      case 'subscription':
        return <Globe className="h-4 w-4 text-purple-500" />;
      default:
        return null;
    }
  };

  const getLicenseText = (license: string) => {
    switch (license) {
      case 'free':
        return 'Free';
      case 'trial':
        return 'Free Trial';
      case 'paid':
        return 'Paid';
      case 'subscription':
        return 'Subscription';
      default:
        return license;
    }
  };

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'video-editing', name: 'Editing' },
    { id: 'motion-graphics', name: 'Motion' },
    { id: 'compositing', name: 'Compositing' },
    { id: 'legacy-optimized', name: 'Legacy Repo' }
  ];

  const licenses = [
    { id: 'all', name: 'All' },
    { id: 'free', name: 'Free' },
    { id: 'pro', name: 'Enterprise' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header - Mobile Friendly */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 md:py-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Software Distribution</h1>
              <p className="text-sm text-gray-600 mt-1">Direct access to professional tools and legacy-optimized repositories</p>
            </div>
            <button
              onClick={() => setShowSystemInfo(true)}
              className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 transition-all font-medium shadow-md md:w-auto w-full"
            >
              <Monitor className="h-4 w-4" />
              <span>Diagnostic Check</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modern Tab Navigation (Responsive) */}
      <div className="bg-white border-b sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 overflow-x-auto scroller-hide">
          <div className="flex space-x-8 h-14">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex-shrink-0 flex items-center h-full border-b-2 font-medium transition-all ${
                  selectedCategory === cat.id 
                    ? 'border-blue-600 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filters & Search - Mobile Stacked */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search tools or repositories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Download Information */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <Download className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-blue-900 mb-1">How It Works</h3>
              <p className="text-sm text-blue-700">
                Click the "Visit Official Site" button to go directly to the official software website where you can:
              </p>
              <ul className="text-sm text-blue-700 mt-2 space-y-1">
                <li>• <strong>Free Software:</strong> Download directly from the official site</li>
                <li>• <strong>Paid Software:</strong> Purchase and download from the official store</li>
                <li>• <strong>Subscription Software:</strong> Sign in with your account or start a trial</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Software Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredSoftware.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No software found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedSoftware.map((software) => {
              const compatibility = systemInfo ? checkSystemCompatibility(software, systemInfo) : { compatible: true, issues: [] };

              return (
                <div key={software.name} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                  {/* Software Header */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{software.name}</h3>
                        <p className="text-gray-600 text-sm mb-3">{software.description}</p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                          <span className="flex items-center space-x-1">
                            <HardDrive className="h-4 w-4" />
                            <span>{software.size}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Cpu className="h-4 w-4" />
                            <span>v{software.version}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            {getLicenseIcon(software.license)}
                            <span>{getLicenseText(software.license)}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                                         {/* System Requirements Preview */}
                     <div className="mb-4">
                       <h4 className="text-sm font-medium text-gray-900 mb-2">System Requirements</h4>
                       <div className="text-xs text-gray-600 space-y-1">
                         <div>OS: {software.systemRequirements.os.join(', ')}</div>
                         <div>RAM: {software.systemRequirements.ram}</div>
                         <div>Storage: {software.systemRequirements.storage}</div>
                       </div>
                       {software.license === 'subscription' && (
                         <div className="mt-2 text-xs text-orange-600">
                           ⚠️ Requires Adobe Creative Cloud subscription
                         </div>
                       )}
                       {software.license === 'paid' && (
                         <div className="mt-2 text-xs text-orange-600">
                           ⚠️ Paid software - purchase required
                         </div>
                       )}
                     </div>

                    {/* Compatibility Status */}
                    {systemInfo && (
                      <div className="mb-4">
                        {compatibility.compatible ? (
                          <div className="flex items-center space-x-2 text-green-600">
                            <CheckCircle className="h-4 w-4" />
                            <span className="text-sm font-medium">Compatible with your system</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2 text-red-600">
                            <AlertCircle className="h-4 w-4" />
                            <span className="text-sm font-medium">Compatibility issues detected</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Progress Bar (Real-time Backend Feedback) */}
                    {downloadingStatus[software.name] && (
                      <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <div className="flex justify-between text-xs font-semibold text-blue-800 mb-1">
                          <span className="truncate">{downloadingStatus[software.name].message}</span>
                          <span>{downloadingStatus[software.name].progress}%</span>
                        </div>
                        <div className="w-full bg-blue-200 rounded-full h-1.5 mb-2">
                          <div 
                            className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${downloadingStatus[software.name].progress}%` }}
                          ></div>
                        </div>
                        {downloadingStatus[software.name]?.progress === 100 && downloadingStatus[software.name]?.localPath && (
                          <div className="mt-2 p-2 bg-white rounded border border-blue-100 flex items-center justify-between space-x-2">
                             <div className="flex items-center space-x-2 overflow-hidden">
                               <Monitor className="h-3 w-3 text-blue-500 flex-shrink-0" />
                               <div className="text-[10px] text-gray-600 truncate">
                                 <span className="font-semibold text-blue-700">Registered:</span> {downloadingStatus[software.name].localPath}
                               </div>
                             </div>
                             <button 
                               onClick={() => handleSystemCheck(software)}
                               className="text-[10px] text-blue-600 hover:underline flex-shrink-0 font-semibold"
                             >
                               Details
                             </button>
                          </div>
                        )}
                        {downloadingStatus[software.name].speed && downloadingStatus[software.name].status === 'downloading' && (
                          <div className="flex justify-between text-[10px] text-blue-600">
                            <span>Speed: {downloadingStatus[software.name].speed}</span>
                            <span>ETA: {downloadingStatus[software.name].eta}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                       <button
                         onClick={() => handleDownload(software)}
                         disabled={downloadingStatus[software.name]?.progress > 0 && downloadingStatus[software.name]?.progress < 100}
                         className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-bold shadow-sm transition-all ${
                           downloadingStatus[software.name]?.progress === 100 
                             ? 'bg-green-600 text-white' 
                             : !compatibility.compatible
                               ? 'bg-orange-500 text-white hover:bg-orange-600'
                               : 'bg-blue-600 text-white hover:bg-blue-700'
                         } hover:scale-[1.02] active:scale-[0.98] cursor-pointer`}
                       >
                         {downloadingStatus[software.name]?.progress === 100 ? (
                           <>
                             <CheckCircle className="h-4 w-4" />
                             <span>Installed</span>
                           </>
                         ) : downloadingStatus[software.name]?.progress > 0 ? (
                           <>
                             <RefreshCw className="h-4 w-4 animate-spin" />
                             <span>{downloadingStatus[software.name].status === 'installing' ? 'Installing...' : 'Downloading...'}</span>
                           </>
                         ) : (
                           <>
                             {!compatibility.compatible ? <AlertCircle className="h-4 w-4" /> : <Download className="h-4 w-4" />}
                             <span>{compatibility.compatible ? 'Download' : 'Download anyway'}</span>
                           </>
                         )}
                       </button>
                      
                      <button
                        onClick={() => openOfficialWebsite(software.name)}
                        className="px-3 py-2 border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                        title="Visit Official Website"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
              })}
            </div>
            
            {/* More Software Button */}
            {filteredSoftware.length > initialDisplayCount && (
              <div className="text-center mt-8">
                <button
                  onClick={() => setShowMoreSoftware(!showMoreSoftware)}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  {showMoreSoftware ? 'Show Less' : `Show ${filteredSoftware.length - initialDisplayCount} More Software`}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* System Info Modal */}
      {showSystemInfo && systemInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">System Information</h3>
              <button
                onClick={() => setShowSystemInfo(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Operating System:</span>
                <span className="font-medium">{systemInfo.os}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Architecture:</span>
                <span className="font-medium">{systemInfo.architecture}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">RAM:</span>
                <span className="font-medium">{systemInfo.ram}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Storage:</span>
                <span className="font-medium">{systemInfo.storage}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Graphics:</span>
                <span className="font-medium">{systemInfo.graphics}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Requirements Modal */}
      {showRequirements && selectedSoftware && systemInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">{selectedSoftware.name} Requirements</h3>
              <button
                onClick={() => setShowRequirements(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-6">
              {/* System Requirements */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">System Requirements</h4>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">OS:</span> {selectedSoftware.systemRequirements.os.join(', ')}</div>
                  <div><span className="font-medium">RAM:</span> {selectedSoftware.systemRequirements.ram}</div>
                  <div><span className="font-medium">Storage:</span> {selectedSoftware.systemRequirements.storage}</div>
                  <div><span className="font-medium">Graphics:</span> {selectedSoftware.systemRequirements.graphics}</div>
                </div>
              </div>

              {/* Compatibility Check */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Compatibility Check</h4>
                {(() => {
                  const compatibility = checkSystemCompatibility(selectedSoftware, systemInfo);
                  return (
                    <div className="space-y-2">
                      {compatibility.compatible ? (
                        <div className="flex items-center space-x-2 text-green-600">
                          <CheckCircle className="h-5 w-5" />
                          <span className="font-medium">Your system meets all requirements</span>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2 text-red-600">
                            <AlertCircle className="h-5 w-5" />
                            <span className="font-medium">Compatibility issues found:</span>
                          </div>
                          <ul className="list-disc list-inside text-sm text-red-600 ml-6">
                            {compatibility.issues.map((issue: string, index: number) => (
                              <li key={index}>{issue}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* Download Requirements */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Download Requirements</h4>
                {(() => {
                  const requirements = validateDownloadRequirements(selectedSoftware.name);
                  return (
                    <div className="space-y-2">
                      <ul className="list-disc list-inside text-sm text-gray-600">
                        {requirements.requirements.map((req: string, index: number) => (
                          <li key={index}>{req}</li>
                        ))}
                      </ul>
                      {requirements.warnings.length > 0 && (
                        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <h5 className="font-medium text-yellow-800 mb-2">Warnings:</h5>
                          <ul className="list-disc list-inside text-sm text-yellow-700">
                            {requirements.warnings.map((warning: string, index: number) => (
                              <li key={index}>{warning}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => handleDownload(selectedSoftware)}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Visit Official Site
                </button>
                <button
                  onClick={() => openOfficialWebsite(selectedSoftware.name)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Visit Official Site
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SoftwareDownload; 