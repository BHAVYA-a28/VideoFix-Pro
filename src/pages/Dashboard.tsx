
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { 
  Monitor, 
  HardDrive, 
  Cpu, 
  MemoryStick as Memory, 
  Zap, 
  Download,
  Settings, 
  BarChart3, 
  CheckCircle, 
  Play,
  FileVideo,
  Palette,
  Globe,
  Shield,
  Activity,
  TrendingUp,
  Upload,
  RefreshCw,
  FolderOpen,
  Scissors,
  Film,
  TrendingDown,
  Video,
  Image,
  Headphones,
  Wifi,
  WifiOff
} from 'lucide-react';
import { 
  detectSystemInfo, 
  getPerformanceMetrics, 
  type SystemInfo as DetectedSystemInfo,
  type PerformanceMetrics as DetectedPerformanceMetrics
} from '../services/systemDetector';

interface SystemInfo {
  os: string;
  ram: string;
  storage: string;
  gpu: string;
  cpu: string;
  cpuCores: number;
  uptime: string;
  architecture: string;
  browser: string;
  screenResolution: string;
  network: string;
  online: boolean;
}

interface ProjectStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalHours: number;
  totalExports: number;
  totalImports: number;
}

interface RecentActivity {
  id: string;
  type: 'project' | 'export' | 'import' | 'backup' | 'update' | 'render' | 'edit' | 'share';
  title: string;
  description: string;
  timestamp: string;
  status: 'completed' | 'in-progress' | 'failed' | 'pending';
  progress?: number;
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  path: string;
}

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  status: 'excellent' | 'good' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  icon: React.ReactNode;
}

interface MediaLibrary {
  videos: number;
  images: number;
  audio: number;
  totalSize: string;
  lastBackup: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [clickedAction, setClickedAction] = useState<string | null>(null);
  const [isLoadingSystem, setIsLoadingSystem] = useState(true);
  const [systemDetectedAt, setSystemDetectedAt] = useState<Date | null>(null);

  // Define quickActions before using them in useEffect
  const quickActions: QuickAction[] = useMemo(() => [
    {
      id: 'new-project',
      title: 'New Project',
      description: 'Create a new video editing project',
      icon: <FileVideo className="h-6 w-6" />,
      color: 'bg-blue-500',
      path: '/projects/new'
    },
    {
      id: 'software-downloads',
      title: 'Software Downloads',
      description: 'Download video editing software',
      icon: <Download className="h-6 w-6" />,
      color: 'bg-green-500',
      path: '/software'
    },
    {
      id: 'plugin-manager',
      title: 'Plugin Manager',
      description: 'Manage video editing plugins',
      icon: <Palette className="h-6 w-6" />,
      color: 'bg-purple-500',
      path: '/plugins'
    },
    {
      id: 'media-library',
      title: 'Media Library',
      description: 'Browse and organize media files',
      icon: <FolderOpen className="h-6 w-6" />,
      color: 'bg-orange-500',
      path: '/media'
    },
    {
      id: 'render-queue',
      title: 'Render Queue',
      description: 'Manage video rendering tasks',
      icon: <Film className="h-6 w-6" />,
      color: 'bg-red-500',
      path: '/render'
    },
    {
      id: 'system-diagnostics',
      title: 'System Diagnostics',
      description: 'Check system performance and compatibility',
      icon: <Settings className="h-6 w-6" />,
      color: 'bg-indigo-500',
      path: '/diagnostics'
    }
  ], []);

  // Keyboard shortcuts for quick actions
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const quickActionMap: { [key: string]: string } = {
        '1': 'new-project',
        '2': 'software-downloads',
        '3': 'plugin-manager',
        '4': 'media-library',
        '5': 'render-queue',
        '6': 'system-diagnostics'
      };

      if (quickActionMap[key] && !event.ctrlKey && !event.altKey && !event.metaKey) {
        // Don't intercept if user is typing in an input
        const target = event.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

        event.preventDefault();
        const action = quickActions.find(a => a.id === quickActionMap[key]);
        if (action) {
          setClickedAction(action.id);
          setTimeout(() => {
            setClickedAction(null);
            navigate(action.path);
          }, 500);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [navigate, quickActions]);

  // REAL system info — starts with empty, filled by detection
  const [systemInfo, setSystemInfo] = useState<SystemInfo>({
    os: 'Detecting...',
    ram: 'Detecting...',
    storage: 'Detecting...',
    gpu: 'Detecting...',
    cpu: 'Detecting...',
    cpuCores: 0,
    uptime: 'Detecting...',
    architecture: 'Detecting...',
    browser: 'Detecting...',
    screenResolution: 'Detecting...',
    network: 'Detecting...',
    online: navigator.onLine
  });

  // REAL performance metrics — starts with zeros, filled by detection
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([
    { name: 'CPU Usage', value: 0, unit: '%', status: 'excellent', trend: 'stable', icon: <Cpu className="h-6 w-6" /> },
    { name: 'Memory Usage', value: 0, unit: '%', status: 'excellent', trend: 'stable', icon: <Memory className="h-6 w-6" /> },
    { name: 'Storage Usage', value: 0, unit: '%', status: 'excellent', trend: 'stable', icon: <HardDrive className="h-6 w-6" /> },
    { name: 'GPU Tier', value: 0, unit: '', status: 'excellent', trend: 'stable', icon: <Zap className="h-6 w-6" /> }
  ]);

  // Run REAL system detection on mount
  useEffect(() => {
    const runDetection = async () => {
      setIsLoadingSystem(true);
      try {
        // 1. Detect system info (uses REAL browser APIs)
        const detected: DetectedSystemInfo = await detectSystemInfo();

        // Calculate page uptime
        const perfTiming = performance.now();
        const uptimeSeconds = Math.floor(perfTiming / 1000);
        const uptimeMin = Math.floor(uptimeSeconds / 60);
        const uptimeHours = Math.floor(uptimeMin / 60);
        let uptimeStr = '';
        if (uptimeHours > 0) uptimeStr += `${uptimeHours}h `;
        if (uptimeMin % 60 > 0) uptimeStr += `${uptimeMin % 60}m `;
        uptimeStr += `${uptimeSeconds % 60}s`;

        setSystemInfo({
          os: detected.os,
          ram: detected.totalMemory,
          storage: detected.storage.total !== 'Not available'
            ? `${detected.storage.total} total (${detected.storage.free} free)`
            : 'Browser restricted',
          gpu: detected.gpu,
          cpu: detected.cpu,
          cpuCores: detected.cpuCores,
          uptime: `Session: ${uptimeStr}`,
          architecture: detected.architecture,
          browser: `${detected.browser} v${detected.browserVersion}`,
          screenResolution: `${detected.screenResolution} @ ${detected.devicePixelRatio}x`,
          network: detected.network.online 
            ? `Online${detected.network.downlink !== 'Not available' ? ` • ${detected.network.downlink}` : ''}${detected.network.rtt !== 'Not available' ? ` • ${detected.network.rtt} latency` : ''}`
            : 'Offline',
          online: detected.network.online
        });

        // 2. Get REAL performance metrics
        const metrics: DetectedPerformanceMetrics = await getPerformanceMetrics();

        const getStatus = (val: number): 'excellent' | 'good' | 'warning' | 'critical' => {
          if (val <= 25) return 'excellent';
          if (val <= 50) return 'good';
          if (val <= 75) return 'warning';
          return 'critical';
        };

        setPerformanceMetrics([
          {
            name: 'CPU Load',
            value: metrics.cpuUsage,
            unit: '%',
            status: getStatus(metrics.cpuUsage),
            trend: metrics.cpuUsage < 30 ? 'stable' : metrics.cpuUsage < 60 ? 'up' : 'up',
            icon: <Cpu className="h-6 w-6" />
          },
          {
            name: 'Memory Pressure',
            value: metrics.memoryUsage,
            unit: '%',
            status: getStatus(metrics.memoryUsage),
            trend: 'stable',
            icon: <Memory className="h-6 w-6" />
          },
          {
            name: 'Storage Usage',
            value: metrics.storageUsage,
            unit: '%',
            status: getStatus(metrics.storageUsage),
            trend: 'stable',
            icon: <HardDrive className="h-6 w-6" />
          },
          {
            name: 'GPU Tier',
            value: 0,
            unit: metrics.gpuTier,
            status: metrics.gpuTier === 'High-End' ? 'excellent' :
                    metrics.gpuTier === 'Mid-Range' ? 'good' :
                    metrics.gpuTier === 'Entry-Level' ? 'warning' : 'warning',
            trend: 'stable',
            icon: <Zap className="h-6 w-6" />
          }
        ]);

        setSystemDetectedAt(new Date());
      } catch (error) {
        console.error('System detection failed:', error);
      } finally {
        setIsLoadingSystem(false);
      }
    };

    runDetection();
  }, []);

  // Refresh performance metrics periodically
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const metrics = await getPerformanceMetrics();
        const getStatus = (val: number): 'excellent' | 'good' | 'warning' | 'critical' => {
          if (val <= 25) return 'excellent';
          if (val <= 50) return 'good';
          if (val <= 75) return 'warning';
          return 'critical';
        };

        setPerformanceMetrics(prev => [
          { ...prev[0], value: metrics.cpuUsage, status: getStatus(metrics.cpuUsage) },
          { ...prev[1], value: metrics.memoryUsage, status: getStatus(metrics.memoryUsage) },
          { ...prev[2], value: metrics.storageUsage, status: getStatus(metrics.storageUsage) },
          prev[3] // GPU tier doesn't change
        ]);
      } catch (e) {
        // silent
      }
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  // Project stats persisted in localStorage
  const [projectStats, setProjectStats] = useState<ProjectStats>(() => {
    const saved = localStorage.getItem('vfp_project_stats');
    return saved ? JSON.parse(saved) : {
      totalProjects: 12,
      activeProjects: 3,
      completedProjects: 9,
      totalHours: 142,
      totalExports: 28,
      totalImports: 156
    };
  });

  // Media library stats persisted in localStorage
  const [mediaLibrary, setMediaLibrary] = useState<MediaLibrary>(() => {
    const saved = localStorage.getItem('vfp_media_library');
    return saved ? JSON.parse(saved) : {
      videos: 8,
      images: 42,
      audio: 12,
      totalSize: '4.2 GB',
      lastBackup: 'Recent'
    };
  });

  // Recent activities from localStorage
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>(() => {
    const saved = localStorage.getItem('vfp_recent_activities');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* fall through */ }
    }
    return [
      {
        id: 'welcome',
        type: 'update' as const,
        title: 'VideoFix Pro Initialized',
        description: 'System scanning and management services are now active.',
        timestamp: new Date().toLocaleString(),
        status: 'completed' as const,
        progress: 100
      }
    ];
  });

  // Synchronize dashboard and persist updates
  useEffect(() => {
    localStorage.setItem('vfp_project_stats', JSON.stringify(projectStats));
    localStorage.setItem('vfp_media_library', JSON.stringify(mediaLibrary));
    localStorage.setItem('vfp_recent_activities', JSON.stringify(recentActivities));
  }, [projectStats, mediaLibrary, recentActivities]);

  // Sync from storage events (for activities updated by other pages)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'vfp_recent_activities' && e.newValue) {
        try { setRecentActivities(JSON.parse(e.newValue)); } catch (err) {}
      }
      if (e.key === 'vfp_project_stats' && e.newValue) {
        try { setProjectStats(JSON.parse(e.newValue)); } catch (err) {}
      }
      if (e.key === 'vfp_media_library' && e.newValue) {
        try { setMediaLibrary(JSON.parse(e.newValue)); } catch (err) {}
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Add status indicators for quick actions
  const getActionStatus = (actionId: string) => {
    switch (actionId) {
      case 'new-project':
        return { available: true, count: projectStats.totalProjects };
      case 'software-downloads':
        return { available: true, count: 15 };
      case 'plugin-manager':
        return { available: true, count: 8 };
      case 'media-library':
        return { available: true, count: mediaLibrary.videos + mediaLibrary.images + mediaLibrary.audio };
      case 'render-queue':
        return { available: true, count: 0 };
      case 'system-diagnostics':
        return { available: true, count: 0 };
      default:
        return { available: true, count: 0 };
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'project': return <FileVideo className="h-4 w-4" />;
      case 'export': return <Download className="h-4 w-4" />;
      case 'import': return <Upload className="h-4 w-4" />;
      case 'backup': return <Shield className="h-4 w-4" />;
      case 'update': return <RefreshCw className="h-4 w-4" />;
      case 'render': return <Film className="h-4 w-4" />;
      case 'edit': return <Scissors className="h-4 w-4" />;
      case 'share': return <Globe className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in-progress': return 'text-blue-600 bg-blue-100';
      case 'failed': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPerformanceStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />;
      case 'stable': return <BarChart3 className="h-4 w-4 text-blue-600" />;
      default: return <BarChart3 className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Video Editing Dashboard
          </h1>
          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              Real-time system monitoring and project overview
            </p>
            <div className="flex items-center space-x-3">
              {isLoadingSystem ? (
                <span className="flex items-center text-sm text-blue-600">
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                  Scanning system...
                </span>
              ) : (
                <span className="flex items-center text-sm text-green-600">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  System detected {systemDetectedAt ? `at ${systemDetectedAt.toLocaleTimeString()}` : ''}
                </span>
              )}
              {systemInfo.online ? (
                <span className="flex items-center text-sm text-green-600">
                  <Wifi className="h-4 w-4 mr-1" /> Online
                </span>
              ) : (
                <span className="flex items-center text-sm text-red-600">
                  <WifiOff className="h-4 w-4 mr-1" /> Offline
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Projects</p>
                <p className="text-2xl font-bold text-gray-900">{projectStats.totalProjects}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileVideo className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Projects</p>
                <p className="text-2xl font-bold text-gray-900">{projectStats.activeProjects}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Play className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">CPU Cores</p>
                <p className="text-2xl font-bold text-gray-900">{systemInfo.cpuCores || '...'}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Cpu className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Exports</p>
                <p className="text-2xl font-bold text-gray-900">{projectStats.totalExports}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Download className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Media Files</p>
                <p className="text-2xl font-bold text-gray-900">{mediaLibrary.videos + mediaLibrary.images + mediaLibrary.audio}</p>
              </div>
              <div className="p-3 bg-indigo-100 rounded-lg">
                <FolderOpen className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">System Health</p>
                <p className={`text-2xl font-bold ${
                  isLoadingSystem ? 'text-gray-400' :
                  performanceMetrics[0]?.status === 'excellent' ? 'text-green-600' :
                  performanceMetrics[0]?.status === 'good' ? 'text-blue-600' :
                  performanceMetrics[0]?.status === 'warning' ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {isLoadingSystem ? 'Scanning...' :
                   performanceMetrics[0]?.status === 'excellent' ? 'Excellent' :
                   performanceMetrics[0]?.status === 'good' ? 'Good' :
                   performanceMetrics[0]?.status === 'warning' ? 'Warning' : 'Critical'}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
            <div className="text-sm text-gray-500">
              Click any action to navigate • Press 1-6 for keyboard shortcuts
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action) => (
              <Link
                key={action.id}
                to={action.path}
                onClick={() => {
                  setClickedAction(action.id);
                  setTimeout(() => setClickedAction(null), 1000);
                }}
                className={`bg-white p-6 rounded-xl shadow-sm border hover:shadow-md hover:border-blue-300 transition-all duration-200 cursor-pointer group transform hover:-translate-y-1 ${
                  clickedAction === action.id ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-lg ${action.color} text-white group-hover:scale-110 transition-transform duration-200`}>
                    {action.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{action.title}</h3>
                      <div className="flex items-center space-x-2">
                        {getActionStatus(action.id).count > 0 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {getActionStatus(action.id).count}
                          </span>
                        )}
                        <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          {quickActions.indexOf(action) + 1}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    {clickedAction === action.id ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                    ) : (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* System Overview — now shows REAL data */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">System Overview</h2>
                {isLoadingSystem && (
                  <RefreshCw className="h-5 w-5 text-blue-600 animate-spin" />
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Monitor className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-gray-700">Operating System</span>
                    </div>
                    <span className="text-sm text-gray-600">{systemInfo.os}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Memory className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-gray-700">RAM</span>
                    </div>
                    <span className="text-sm text-gray-600">{systemInfo.ram}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <HardDrive className="h-5 w-5 text-purple-600" />
                      <span className="font-medium text-gray-700">Storage</span>
                    </div>
                    <span className="text-sm text-gray-600 text-right max-w-[200px] truncate" title={systemInfo.storage}>{systemInfo.storage}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Globe className="h-5 w-5 text-teal-600" />
                      <span className="font-medium text-gray-700">Browser</span>
                    </div>
                    <span className="text-sm text-gray-600">{systemInfo.browser}</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Zap className="h-5 w-5 text-yellow-600" />
                      <span className="font-medium text-gray-700">GPU</span>
                    </div>
                    <span className="text-sm text-gray-600 text-right max-w-[200px] truncate" title={systemInfo.gpu}>{systemInfo.gpu}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Cpu className="h-5 w-5 text-red-600" />
                      <span className="font-medium text-gray-700">CPU</span>
                    </div>
                    <span className="text-sm text-gray-600">{systemInfo.cpu}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Monitor className="h-5 w-5 text-pink-600" />
                      <span className="font-medium text-gray-700">Display</span>
                    </div>
                    <span className="text-sm text-gray-600">{systemInfo.screenResolution}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {systemInfo.online ? (
                        <Wifi className="h-5 w-5 text-green-600" />
                      ) : (
                        <WifiOff className="h-5 w-5 text-red-600" />
                      )}
                      <span className="font-medium text-gray-700">Network</span>
                    </div>
                    <span className="text-sm text-gray-600 text-right max-w-[200px] truncate" title={systemInfo.network}>{systemInfo.network}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Media Library */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Media Library</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Video className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-gray-700">Videos</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{mediaLibrary.videos}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Image className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-gray-700">Images</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{mediaLibrary.images}</span>
            </div>
            
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Headphones className="h-5 w-5 text-purple-600" />
                  <span className="font-medium text-gray-700">Audio</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{mediaLibrary.audio}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <HardDrive className="h-5 w-5 text-orange-600" />
                  <span className="font-medium text-gray-700">Total Size</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{mediaLibrary.totalSize}</span>
            </div>
            
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-indigo-600" />
                  <span className="font-medium text-gray-700">Last Backup</span>
                </div>
                <span className="text-sm text-gray-600">{mediaLibrary.lastBackup}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics — now REAL data */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Performance Metrics</h2>
            <span className="text-xs text-gray-500">Live — refreshes every 10s</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {performanceMetrics.map((metric) => (
              <div key={metric.name} className="text-center">
                <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mx-auto mb-3">
                  <div className={getPerformanceStatusColor(metric.status)}>
                    {metric.icon}
                  </div>
                    </div>
                <h3 className="font-semibold text-gray-900 mb-1">{metric.name}</h3>
                <p className={`text-2xl font-bold ${getPerformanceStatusColor(metric.status)}`}>
                  {metric.name === 'GPU Tier' ? metric.unit : `${metric.value}${metric.unit}`}
                </p>
                <div className="flex items-center justify-center space-x-1 mt-2">
                  {getTrendIcon(metric.trend)}
                  <span className="text-sm text-gray-600 capitalize">{metric.status}</span>
                </div>
              </div>
            ))}
            </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivities.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Activity className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p>No recent activity. Start by creating a project or running diagnostics!</p>
              </div>
            ) : (
              recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex-shrink-0 mt-1">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-xs text-gray-600">{activity.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">{activity.timestamp}</span>
                      <div className="flex items-center space-x-2">
                        {activity.progress !== undefined && activity.status === 'in-progress' && (
                          <div className="w-16 bg-gray-200 rounded-full h-1">
                            <div 
                              className="bg-blue-600 h-1 rounded-full" 
                              style={{ width: `${activity.progress}%` }}
                            ></div>
          </div>
        )}
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(activity.status)}`}>
                          {activity.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;