import React, { useState, useEffect } from 'react';
import {
  Monitor,
  Cpu,
  HardDrive,
  Zap,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Activity,
  Database,
  Wifi,
  WifiOff,
  Download,
  Shield,
  Eye,
  Clock,
  ArrowRight
} from 'lucide-react';
import {
  detectSystemInfo,
  runDiagnostics,
  getSystemRecommendations,
  getPerformanceMetrics,
  type SystemInfo,
  type DiagnosticResult,
  type PerformanceMetrics
} from '../services/systemDetector';

const SystemDiagnostics: React.FC = () => {
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [diagnostics, setDiagnostics] = useState<DiagnosticResult[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanTask, setScanTask] = useState('');
  const [lastScanTime, setLastScanTime] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'diagnostics' | 'hardware' | 'recommendations'>('overview');
  const [scanHistory, setScanHistory] = useState<{ date: string; passCount: number; warnCount: number; failCount: number }[]>(() => {
    const saved = localStorage.getItem('vfp_scan_history');
    return saved ? JSON.parse(saved) : [];
  });

  const runFullScan = async () => {
    setIsScanning(true);
    setScanProgress(0);
    setDiagnostics([]);
    setSystemInfo(null);
    setRecommendations([]);
    setPerformanceMetrics(null);

    const steps = [
      { progress: 10, task: 'Initializing system scan...' },
      { progress: 20, task: 'Detecting operating system...' },
      { progress: 30, task: 'Analyzing CPU (hardware concurrency)...' },
      { progress: 40, task: 'Detecting GPU via WebGL...' },
      { progress: 50, task: 'Checking memory (navigator.deviceMemory)...' },
      { progress: 60, task: 'Estimating storage (StorageManager API)...' },
      { progress: 70, task: 'Testing network (Network Information API)...' },
      { progress: 80, task: 'Measuring CPU performance...' },
      { progress: 90, task: 'Running compatibility diagnostics...' },
      { progress: 95, task: 'Generating recommendations...' },
      { progress: 100, task: 'Scan complete!' }
    ];

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 400));
      setScanProgress(step.progress);
      setScanTask(step.task);
    }

    const detected = await detectSystemInfo();
    setSystemInfo(detected);

    const diags = runDiagnostics(detected);
    setDiagnostics(diags);

    const recs = getSystemRecommendations(detected);
    setRecommendations(recs);

    const metrics = await getPerformanceMetrics();
    setPerformanceMetrics(metrics);

    setLastScanTime(new Date());
    setIsScanning(false);

    // Save to history
    const passCount = diags.filter(d => d.status === 'pass').length;
    const warnCount = diags.filter(d => d.status === 'warning').length;
    const failCount = diags.filter(d => d.status === 'fail').length;
    const newHistory = [
      { date: new Date().toLocaleString(), passCount, warnCount, failCount },
      ...scanHistory.slice(0, 9)
    ];
    setScanHistory(newHistory);
    localStorage.setItem('vfp_scan_history', JSON.stringify(newHistory));
  };

  useEffect(() => {
    runFullScan();
  }, []);

  // Auto-refresh performance metrics
  useEffect(() => {
    const interval = setInterval(async () => {
      if (!isScanning) {
        try {
          const metrics = await getPerformanceMetrics();
          setPerformanceMetrics(metrics);
        } catch { /* silent */ }
      }
    }, 8000);
    return () => clearInterval(interval);
  }, [isScanning]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'fail': return <AlertCircle className="w-5 h-5 text-red-500" />;
      default: return <Activity className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'pass': return 'bg-green-50 border-green-200';
      case 'warning': return 'bg-yellow-50 border-yellow-200';
      case 'fail': return 'bg-red-50 border-red-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const passCount = diagnostics.filter(d => d.status === 'pass').length;
  const warnCount = diagnostics.filter(d => d.status === 'warning').length;
  const failCount = diagnostics.filter(d => d.status === 'fail').length;
  const overallScore = diagnostics.length > 0 ? Math.round((passCount / diagnostics.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">System Diagnostics</h1>
            <p className="text-gray-600">
              Real-time system analysis using browser APIs
              {lastScanTime && (
                <span className="ml-2 text-sm text-gray-500">
                  — Last scan: {lastScanTime.toLocaleTimeString()}
                </span>
              )}
            </p>
          </div>
          <button
            onClick={runFullScan}
            disabled={isScanning}
            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isScanning ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <Monitor className="w-5 h-5" />
            )}
            <span>{isScanning ? 'Scanning...' : 'Run Full Scan'}</span>
          </button>
        </div>

        {/* Progress Bar */}
        {isScanning && (
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span className="font-medium">{scanTask}</span>
              <span>{scanProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${scanProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Score + Summary Cards */}
        {!isScanning && diagnostics.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="text-center">
                <div className={`text-5xl font-bold mb-2 ${
                  overallScore >= 80 ? 'text-green-600' :
                  overallScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {overallScore}%
                </div>
                <p className="text-sm text-gray-600 font-medium">Overall Score</p>
                <p className="text-xs text-gray-500 mt-1">
                  {overallScore >= 80 ? 'Excellent for video editing' :
                   overallScore >= 60 ? 'Adequate with some concerns' : 'Needs improvement'}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">{passCount}</p>
                  <p className="text-sm text-gray-600">Tests Passed</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <AlertCircle className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-yellow-600">{warnCount}</p>
                  <p className="text-sm text-gray-600">Warnings</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-red-100 rounded-lg">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-600">{failCount}</p>
                  <p className="text-sm text-gray-600">Issues Found</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex space-x-1 bg-white rounded-lg shadow-sm border p-1 mb-6">
          {[
            { id: 'overview', label: 'Overview', icon: <Eye className="w-4 h-4" /> },
            { id: 'diagnostics', label: 'Diagnostics', icon: <Activity className="w-4 h-4" /> },
            { id: 'hardware', label: 'Hardware Details', icon: <Cpu className="w-4 h-4" /> },
            { id: 'recommendations', label: 'Recommendations', icon: <Shield className="w-4 h-4" /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Live Performance Metrics */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Live Performance</h3>
                <span className="text-xs text-gray-500 flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  Updates every 8s
                </span>
              </div>
              {performanceMetrics ? (
                <div className="space-y-6">
                  {/* CPU */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700 flex items-center">
                        <Cpu className="w-4 h-4 mr-2 text-blue-600" /> CPU Load
                      </span>
                      <span className="text-sm font-semibold">{performanceMetrics.cpuUsage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full transition-all duration-700 ${
                          performanceMetrics.cpuUsage < 30 ? 'bg-green-500' :
                          performanceMetrics.cpuUsage < 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${performanceMetrics.cpuUsage}%` }}
                      />
                    </div>
                  </div>

                  {/* Memory */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700 flex items-center">
                        <Database className="w-4 h-4 mr-2 text-green-600" /> Memory Pressure
                      </span>
                      <span className="text-sm font-semibold">{performanceMetrics.memoryUsage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full transition-all duration-700 ${
                          performanceMetrics.memoryUsage < 30 ? 'bg-green-500' :
                          performanceMetrics.memoryUsage < 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.max(performanceMetrics.memoryUsage, 2)}%` }}
                      />
                    </div>
                  </div>

                  {/* Storage */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700 flex items-center">
                        <HardDrive className="w-4 h-4 mr-2 text-purple-600" /> Storage Usage
                      </span>
                      <span className="text-sm font-semibold">{performanceMetrics.storageUsage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full transition-all duration-700 ${
                          performanceMetrics.storageUsage < 50 ? 'bg-green-500' :
                          performanceMetrics.storageUsage < 80 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.max(performanceMetrics.storageUsage, 2)}%` }}
                      />
                    </div>
                  </div>

                  {/* GPU Tier */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700 flex items-center">
                      <Zap className="w-4 h-4 mr-2 text-yellow-600" /> GPU Tier
                    </span>
                    <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                      performanceMetrics.gpuTier === 'High-End' ? 'bg-green-100 text-green-700' :
                      performanceMetrics.gpuTier === 'Mid-Range' ? 'bg-blue-100 text-blue-700' :
                      performanceMetrics.gpuTier === 'Entry-Level' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {performanceMetrics.gpuTier}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center py-8 text-gray-500">
                  <RefreshCw className="w-5 h-5 animate-spin mr-2" />
                  Measuring...
                </div>
              )}
            </div>

            {/* System Quick Info */}
            {systemInfo && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Detected System</h3>
                <div className="space-y-3">
                  {[
                    { icon: <Monitor className="w-4 h-4 text-blue-600" />, label: 'OS', value: systemInfo.os, sub: systemInfo.architecture },
                    { icon: <Database className="w-4 h-4 text-green-600" />, label: 'RAM', value: systemInfo.totalMemory },
                    { icon: <Cpu className="w-4 h-4 text-red-600" />, label: 'CPU', value: systemInfo.cpu },
                    { icon: <Zap className="w-4 h-4 text-yellow-600" />, label: 'GPU', value: systemInfo.gpu },
                    { icon: <HardDrive className="w-4 h-4 text-purple-600" />, label: 'Storage', value: systemInfo.storage.total, sub: systemInfo.storage.usagePercent > 0 ? `${systemInfo.storage.usagePercent}% used` : undefined },
                    { icon: <Activity className="w-4 h-4 text-indigo-600" />, label: 'Browser', value: `${systemInfo.browser} v${systemInfo.browserVersion}` },
                    { icon: <Monitor className="w-4 h-4 text-pink-600" />, label: 'Screen', value: `${systemInfo.screenResolution} @ ${systemInfo.devicePixelRatio}x` },
                    {
                      icon: systemInfo.network.online
                        ? <Wifi className="w-4 h-4 text-green-600" />
                        : <WifiOff className="w-4 h-4 text-red-600" />,
                      label: 'Network',
                      value: systemInfo.network.online ? 'Online' : 'Offline',
                      sub: systemInfo.network.downlink !== 'Not available' ? systemInfo.network.downlink : undefined
                    }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-2.5 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="flex items-center space-x-3">
                        {item.icon}
                        <span className="text-sm font-medium text-gray-700">{item.label}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-gray-900 block truncate max-w-[250px]" title={item.value}>{item.value}</span>
                        {item.sub && <span className="text-xs text-gray-500">{item.sub}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'diagnostics' && (
          <div className="space-y-3">
            {diagnostics.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border p-12 text-center text-gray-500">
                <Activity className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium">No diagnostics yet</p>
                <p className="text-sm">Click "Run Full Scan" to check your system</p>
              </div>
            ) : (
              diagnostics.map((diag, i) => (
                <div key={i} className={`p-4 rounded-xl border ${getStatusBg(diag.status)}`}>
                  <div className="flex items-start space-x-3">
                    {getStatusIcon(diag.status)}
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{diag.category}</h4>
                      <p className="text-sm text-gray-700 mt-1">{diag.message}</p>
                      {diag.details && (
                        <p className="text-xs text-gray-500 mt-1">{diag.details}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'hardware' && systemInfo && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* GPU Details */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Zap className="w-5 h-5 mr-2 text-yellow-600" /> GPU Details
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Renderer</span>
                  <span className="text-sm font-medium text-right max-w-[280px] truncate" title={systemInfo.gpu}>{systemInfo.gpu}</span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Vendor</span>
                  <span className="text-sm font-medium">{systemInfo.gpuVendor}</span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Max Texture Size</span>
                  <span className="text-sm font-medium">{systemInfo.maxTextureSize.toLocaleString()}px</span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">WebGL 2.0</span>
                  <span className={`text-sm font-medium ${systemInfo.webGL2Support ? 'text-green-600' : 'text-red-600'}`}>
                    {systemInfo.webGL2Support ? '✓ Supported' : '✗ Not supported'}
                  </span>
                </div>
              </div>
            </div>

            {/* Display */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Monitor className="w-5 h-5 mr-2 text-blue-600" /> Display & Browser
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Resolution</span>
                  <span className="text-sm font-medium">{systemInfo.screenResolution}</span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Pixel Ratio</span>
                  <span className="text-sm font-medium">{systemInfo.devicePixelRatio}x</span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Color Depth</span>
                  <span className="text-sm font-medium">{systemInfo.colorDepth}-bit</span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Touch Support</span>
                  <span className="text-sm font-medium">{systemInfo.touchSupport ? 'Yes' : 'No'}</span>
                </div>
              </div>
            </div>

            {/* Network */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                {systemInfo.network.online ? <Wifi className="w-5 h-5 mr-2 text-green-600" /> : <WifiOff className="w-5 h-5 mr-2 text-red-600" />}
                Network
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className={`text-sm font-medium ${systemInfo.network.online ? 'text-green-600' : 'text-red-600'}`}>
                    {systemInfo.network.online ? 'Online' : 'Offline'}
                  </span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Connection Type</span>
                  <span className="text-sm font-medium">{systemInfo.network.effectiveType}</span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Downlink Speed</span>
                  <span className="text-sm font-medium">{systemInfo.network.downlink}</span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Latency (RTT)</span>
                  <span className="text-sm font-medium">{systemInfo.network.rtt}</span>
                </div>
              </div>
            </div>

            {/* System */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-indigo-600" /> System
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Timezone</span>
                  <span className="text-sm font-medium">{systemInfo.timezone}</span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Language</span>
                  <span className="text-sm font-medium">{systemInfo.language}</span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Platform</span>
                  <span className="text-sm font-medium">{systemInfo.platform}</span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Cookies</span>
                  <span className="text-sm font-medium">{systemInfo.cookiesEnabled ? 'Enabled' : 'Disabled'}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'recommendations' && (
          <div className="space-y-6">
            {recommendations.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border p-12 text-center text-gray-500">
                <Shield className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium">No recommendations yet</p>
                <p className="text-sm">Run a full scan to get personalized recommendations</p>
              </div>
            ) : (
              <>
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">System Recommendations</h3>
                  <div className="space-y-3">
                    {recommendations.map((rec, i) => (
                      <div key={i} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <ArrowRight className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-800">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Scan History */}
                {scanHistory.length > 0 && (
                  <div className="bg-white rounded-xl shadow-sm border p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Scan History</h3>
                    <div className="space-y-2">
                      {scanHistory.map((scan, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm text-gray-700">{scan.date}</span>
                          <div className="flex items-center space-x-3 text-xs">
                            <span className="text-green-600 font-medium">{scan.passCount} pass</span>
                            {scan.warnCount > 0 && <span className="text-yellow-600 font-medium">{scan.warnCount} warn</span>}
                            {scan.failCount > 0 && <span className="text-red-600 font-medium">{scan.failCount} fail</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Software Compatibility */}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Software Compatibility</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { name: 'Adobe Premiere Pro', compatible: true },
                      { name: 'Adobe After Effects', compatible: true },
                      { name: 'DaVinci Resolve', compatible: true },
                      { name: 'Blender', compatible: true },
                      { name: 'Final Cut Pro', compatible: systemInfo?.os.toLowerCase().includes('mac') || false },
                      { name: 'Vegas Pro', compatible: systemInfo?.os.toLowerCase().includes('windows') || false }
                    ].map((sw, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Download className="w-4 h-4 text-gray-500" />
                          <span className="text-sm font-medium text-gray-800">{sw.name}</span>
                        </div>
                        {sw.compatible ? (
                          <span className="text-xs text-green-600 font-medium flex items-center">
                            <CheckCircle className="w-3 h-3 mr-1" /> Compatible
                          </span>
                        ) : (
                          <span className="text-xs text-red-600 font-medium flex items-center">
                            <AlertCircle className="w-3 h-3 mr-1" /> Not compatible
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemDiagnostics;