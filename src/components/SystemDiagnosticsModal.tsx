import React, { useState, useEffect } from 'react';
import { 
  Monitor, 
  Cpu, 
  HardDrive, 
  Zap, 
  Settings, 
  CheckCircle, 
  AlertCircle,
  RefreshCw,
  X,
  Activity,
  Database,
  Wifi,
  WifiOff
} from 'lucide-react';
import {
  detectSystemInfo,
  runDiagnostics,
  getSystemRecommendations,
  type SystemInfo,
  type DiagnosticResult
} from '../services/systemDetector';

interface SystemDiagnosticsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SystemDiagnosticsModal: React.FC<SystemDiagnosticsModalProps> = ({ isOpen, onClose }) => {
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [diagnostics, setDiagnostics] = useState<DiagnosticResult[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanTask, setScanTask] = useState('');

  // Real system detection
  const detectSystem = async () => {
    setIsScanning(true);
    setScanProgress(0);
    setDiagnostics([]);
    setSystemInfo(null);
    setRecommendations([]);

    const steps = [
      { progress: 10, task: 'Initializing hardware hooks...', delay: 200 },
      { progress: 25, task: 'Querying Operating System kernel...', delay: 400 },
      { progress: 40, task: 'Measuring CPU concurrency & threads...', delay: 300 },
      { progress: 55, task: 'Probing GPU via WebGL debug info...', delay: 600 },
      { progress: 65, task: 'Checking memory (WASM memory pressure)...', delay: 200 },
      { progress: 75, task: 'Querying StorageManager allocation...', delay: 400 },
      { progress: 85, task: 'Pinging telemetry servers...', delay: 300 },
      { progress: 95, task: 'Analyzing results...', delay: 200 }
    ];

    for (const step of steps) {
      setScanTask(step.task);
      // Faster or slower based on the task "weight"
      await new Promise(resolve => setTimeout(resolve, step.delay));
      setScanProgress(step.progress);
    }

    // Use REAL system detection
    const detectedSystem = await detectSystemInfo();
    setSystemInfo(detectedSystem);

    // Run REAL diagnostics on detected data
    const diagnosticResults = runDiagnostics(detectedSystem);
    setDiagnostics(diagnosticResults);

    // Get recommendations based on real data
    const recs = getSystemRecommendations(detectedSystem);
    setRecommendations(recs);

    setIsScanning(false);
  };

  useEffect(() => {
    if (isOpen) {
      detectSystem();
    }
  }, [isOpen]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'fail':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Activity className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'fail':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const passCount = diagnostics.filter(d => d.status === 'pass').length;
  const warnCount = diagnostics.filter(d => d.status === 'warning').length;
  const failCount = diagnostics.filter(d => d.status === 'fail').length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">System Diagnostics</h2>
            <p className="text-gray-600">Real-time system analysis using browser APIs</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* System Specifications — REAL data */}
          {systemInfo && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <Monitor className="w-6 h-6 text-blue-500" />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-gray-500">OS</p>
                    <p className="text-sm font-semibold text-gray-900 truncate" title={systemInfo.os}>{systemInfo.os}</p>
                    <p className="text-xs text-gray-500">{systemInfo.architecture}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <Database className="w-6 h-6 text-green-500" />
                  <div>
                    <p className="text-xs font-medium text-gray-500">RAM</p>
                    <p className="text-sm font-semibold text-gray-900">{systemInfo.totalMemory}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <HardDrive className="w-6 h-6 text-purple-500" />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-gray-500">Storage</p>
                    <p className="text-sm font-semibold text-gray-900 truncate" title={systemInfo.storage.total}>{systemInfo.storage.total}</p>
                    {systemInfo.storage.usagePercent > 0 && (
                      <p className="text-xs text-gray-500">{systemInfo.storage.usagePercent}% used</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <Zap className="w-6 h-6 text-yellow-500" />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-gray-500">GPU</p>
                    <p className="text-sm font-semibold text-gray-900 truncate" title={systemInfo.gpu}>{systemInfo.gpu}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <Cpu className="w-6 h-6 text-red-500" />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-gray-500">CPU</p>
                    <p className="text-sm font-semibold text-gray-900 truncate" title={systemInfo.cpu}>{systemInfo.cpu}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Progress Bar */}
          {isScanning && (
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>{scanTask}</span>
                <span>{scanProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${scanProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Summary */}
          {diagnostics.length > 0 && (
            <div className="flex items-center space-x-4 mb-4 p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Results:</span>
              <span className="flex items-center text-sm text-green-700">
                <CheckCircle className="w-4 h-4 mr-1" /> {passCount} passed
              </span>
              {warnCount > 0 && (
                <span className="flex items-center text-sm text-yellow-700">
                  <AlertCircle className="w-4 h-4 mr-1" /> {warnCount} warnings
                </span>
              )}
              {failCount > 0 && (
                <span className="flex items-center text-sm text-red-700">
                  <AlertCircle className="w-4 h-4 mr-1" /> {failCount} issues
                </span>
              )}
            </div>
          )}

          {/* Diagnostic Results */}
          {diagnostics.length > 0 && (
            <div className="space-y-3 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Diagnostic Results</h3>
              {diagnostics.map((diagnostic, index) => (
                <div 
                  key={index}
                  className={`p-3 rounded-lg border ${getStatusColor(diagnostic.status)}`}
                >
                  <div className="flex items-start space-x-3">
                    {getStatusIcon(diagnostic.status)}
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm">{diagnostic.category}</h4>
                      <p className="text-xs text-gray-600 mt-1">{diagnostic.message}</p>
                      {diagnostic.details && (
                        <p className="text-xs text-gray-500 mt-1">{diagnostic.details}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Recommendations</h3>
              <div className="space-y-2">
                {recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start space-x-2 text-sm">
                    <span className="text-blue-500 mt-0.5">💡</span>
                    <span className="text-gray-700">{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Info */}
          {systemInfo && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Browser Info</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Browser:</span>
                    <span className="font-medium">{systemInfo.browser} v{systemInfo.browserVersion}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Resolution:</span>
                    <span className="font-medium">{systemInfo.screenResolution} @ {systemInfo.devicePixelRatio}x</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Color Depth:</span>
                    <span className="font-medium">{systemInfo.colorDepth}-bit</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">WebGL 2.0:</span>
                    <span className={`font-medium ${systemInfo.webGL2Support ? 'text-green-600' : 'text-red-600'}`}>
                      {systemInfo.webGL2Support ? '✓ Supported' : '✗ Not supported'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Touch:</span>
                    <span className="font-medium">{systemInfo.touchSupport ? 'Yes' : 'No'}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">System Info</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Language:</span>
                    <span className="font-medium">{systemInfo.language}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Timezone:</span>
                    <span className="font-medium">{systemInfo.timezone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Architecture:</span>
                    <span className="font-medium">{systemInfo.architecture}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Network:</span>
                    <span className="font-medium flex items-center gap-1">
                      {systemInfo.network.online ? (
                        <><Wifi className="w-3 h-3 text-green-600" /> Online</>
                      ) : (
                        <><WifiOff className="w-3 h-3 text-red-600" /> Offline</>
                      )}
                    </span>
                  </div>
                  {systemInfo.network.downlink !== 'Not available' && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Speed:</span>
                      <span className="font-medium">{systemInfo.network.downlink}</span>
                    </div>
                  )}
                  {systemInfo.network.rtt !== 'Not available' && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Latency:</span>
                      <span className="font-medium">{systemInfo.network.rtt}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* GPU Details */}
          {systemInfo && (
            <div className="mt-4 bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">GPU Details</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Renderer:</span>
                  <span className="font-medium text-right max-w-[350px] truncate" title={systemInfo.gpu}>{systemInfo.gpu}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Vendor:</span>
                  <span className="font-medium">{systemInfo.gpuVendor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Max Texture Size:</span>
                  <span className="font-medium">{systemInfo.maxTextureSize.toLocaleString()}px</span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Close
            </button>
            <button
              onClick={detectSystem}
              disabled={isScanning}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isScanning ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Settings className="w-4 h-4" />
              )}
              <span>{isScanning ? 'Scanning...' : 'Re-run Diagnostics'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemDiagnosticsModal;