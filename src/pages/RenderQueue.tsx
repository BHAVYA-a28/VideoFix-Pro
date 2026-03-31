import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  Trash2,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Film,
  BarChart3,
  X,
  Zap,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

interface RenderJob {
  id: string;
  name: string;
  format: string;
  resolution: string;
  codec: string;
  quality: string;
  status: 'queued' | 'rendering' | 'completed' | 'failed' | 'paused';
  progress: number;
  createdAt: string;
  completedAt?: string;
  estimatedTime?: string;
  outputSize?: string;
  fps?: number;
  duration: string;
  priority: 'low' | 'normal' | 'high';
}

const FORMATS = ['MP4', 'MOV', 'AVI', 'MKV', 'WebM', 'ProRes', 'DNxHR'];
const RESOLUTIONS = ['1280x720', '1920x1080', '2560x1440', '3840x2160', '7680x4320'];
const CODECS = ['H.264', 'H.265 (HEVC)', 'VP9', 'AV1', 'ProRes 422', 'DNxHR HQ'];
const QUALITIES = ['Low (Fast)', 'Medium', 'High', 'Ultra (Slow)', 'Lossless'];

const RenderQueue: React.FC = () => {
  const [jobs, setJobs] = useState<RenderJob[]>(() => {
    const saved = localStorage.getItem('vfp_render_jobs');
    return saved ? JSON.parse(saved) : [];
  });
  const [showNewJob, setShowNewJob] = useState(false);
  const [newJob, setNewJob] = useState({
    name: '',
    format: 'MP4',
    resolution: '1920x1080',
    codec: 'H.264',
    quality: 'High',
    duration: '00:05:00',
    priority: 'normal' as const
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const renderIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Persist
  useEffect(() => {
    localStorage.setItem('vfp_render_jobs', JSON.stringify(jobs));
  }, [jobs]);

  // Simulate rendering progress
  useEffect(() => {
    const activeJob = jobs.find(j => j.status === 'rendering');
    if (activeJob && isProcessing) {
      renderIntervalRef.current = setInterval(() => {
        setJobs(prev => prev.map(j => {
          if (j.id === activeJob.id && j.status === 'rendering') {
            const newProgress = Math.min(j.progress + Math.random() * 3, 100);
            if (newProgress >= 100) {
              // Activity log
              const activities = JSON.parse(localStorage.getItem('vfp_recent_activities') || '[]');
              activities.unshift({
                id: Date.now().toString(),
                type: 'render',
                title: `Render "${j.name}" completed`,
                description: `${j.resolution} ${j.codec} • ${j.format}`,
                timestamp: new Date().toLocaleString(),
                status: 'completed',
                progress: 100
              });
              localStorage.setItem('vfp_recent_activities', JSON.stringify(activities.slice(0, 20)));

              return {
                ...j,
                progress: 100,
                status: 'completed' as const,
                completedAt: new Date().toISOString(),
                outputSize: `${(Math.random() * 500 + 50).toFixed(1)} MB`
              };
            }
            return {
              ...j,
              progress: Math.round(newProgress * 10) / 10,
              fps: Math.round(Math.random() * 30 + 15),
              estimatedTime: `${Math.ceil((100 - newProgress) / 3)}s remaining`
            };
          }
          return j;
        }));
      }, 500);
    } else {
      if (renderIntervalRef.current) clearInterval(renderIntervalRef.current);
    }

    return () => {
      if (renderIntervalRef.current) clearInterval(renderIntervalRef.current);
    };
  }, [jobs, isProcessing]);

  // Auto-start next queued job when current finishes
  useEffect(() => {
    const hasActive = jobs.some(j => j.status === 'rendering');
    if (!hasActive && isProcessing) {
      const nextQueued = jobs.find(j => j.status === 'queued');
      if (nextQueued) {
        setJobs(prev => prev.map(j =>
          j.id === nextQueued.id ? { ...j, status: 'rendering' as const } : j
        ));
      } else {
        setIsProcessing(false);
      }
    }
  }, [jobs, isProcessing]);

  const addJob = () => {
    if (!newJob.name.trim()) return;
    const job: RenderJob = {
      id: Date.now().toString(),
      name: newJob.name,
      format: newJob.format,
      resolution: newJob.resolution,
      codec: newJob.codec,
      quality: newJob.quality,
      status: 'queued',
      progress: 0,
      createdAt: new Date().toISOString(),
      duration: newJob.duration,
      priority: newJob.priority
    };
    setJobs(prev => [...prev, job]);
    setNewJob({ name: '', format: 'MP4', resolution: '1920x1080', codec: 'H.264', quality: 'High', duration: '00:05:00', priority: 'normal' });
    setShowNewJob(false);
  };

  const startQueue = () => {
    const queued = jobs.filter(j => j.status === 'queued');
    if (queued.length === 0) return;

    setIsProcessing(true);
    // Start first queued job
    setJobs(prev => {
      const first = prev.find(j => j.status === 'queued');
      if (first) {
        return prev.map(j => j.id === first.id ? { ...j, status: 'rendering' as const } : j);
      }
      return prev;
    });
  };

  const pauseQueue = () => {
    setIsProcessing(false);
    setJobs(prev => prev.map(j =>
      j.status === 'rendering' ? { ...j, status: 'paused' as const } : j
    ));
  };

  const deleteJob = (id: string) => {
    setJobs(prev => prev.filter(j => j.id !== id));
  };

  const retryJob = (id: string) => {
    setJobs(prev => prev.map(j =>
      j.id === id ? { ...j, status: 'queued' as const, progress: 0, completedAt: undefined, outputSize: undefined } : j
    ));
  };

  const moveJob = (id: string, direction: 'up' | 'down') => {
    setJobs(prev => {
      const idx = prev.findIndex(j => j.id === id);
      if (idx === -1) return prev;
      const newIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (newIdx < 0 || newIdx >= prev.length) return prev;
      const newJobs = [...prev];
      [newJobs[idx], newJobs[newIdx]] = [newJobs[newIdx], newJobs[idx]];
      return newJobs;
    });
  };

  const clearCompleted = () => {
    setJobs(prev => prev.filter(j => j.status !== 'completed'));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'rendering': return 'text-blue-600 bg-blue-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'failed': return 'text-red-600 bg-red-100';
      case 'paused': return 'text-yellow-600 bg-yellow-100';
      case 'queued': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'rendering': return <RefreshCw className="w-4 h-4 animate-spin" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'failed': return <AlertCircle className="w-4 h-4" />;
      case 'paused': return <Pause className="w-4 h-4" />;
      case 'queued': return <Clock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'normal': return 'text-blue-600';
      case 'low': return 'text-gray-500';
      default: return 'text-gray-500';
    }
  };

  const queuedCount = jobs.filter(j => j.status === 'queued').length;
  const completedCount = jobs.filter(j => j.status === 'completed').length;
  const activeJob = jobs.find(j => j.status === 'rendering');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Render Queue</h1>
            <p className="text-gray-600">
              {queuedCount} queued • {completedCount} completed • {jobs.length} total
            </p>
          </div>
          <div className="flex items-center space-x-3">
            {completedCount > 0 && (
              <button onClick={clearCompleted} className="text-sm text-gray-600 hover:text-gray-800">
                Clear completed
              </button>
            )}
            <button
              onClick={() => setShowNewJob(true)}
              className="flex items-center space-x-2 bg-white border border-gray-300 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Job</span>
            </button>
            {isProcessing ? (
              <button
                onClick={pauseQueue}
                className="flex items-center space-x-2 bg-yellow-500 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-yellow-600 transition-colors"
              >
                <Pause className="w-5 h-5" />
                <span>Pause Queue</span>
              </button>
            ) : (
              <button
                onClick={startQueue}
                disabled={queuedCount === 0}
                className="flex items-center space-x-2 bg-green-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                <Play className="w-5 h-5" />
                <span>Start Queue</span>
              </button>
            )}
          </div>
        </div>

        {/* Active Render — Big Card */}
        {activeJob && (
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{activeJob.name}</h3>
                  <p className="text-sm text-gray-600">
                    {activeJob.resolution} • {activeJob.codec} • {activeJob.format}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-blue-600">{activeJob.progress.toFixed(1)}%</p>
                {activeJob.estimatedTime && (
                  <p className="text-sm text-gray-500">{activeJob.estimatedTime}</p>
                )}
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 mb-3">
              <div
                className="bg-blue-600 h-4 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${activeJob.progress}%` }}
              />
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              {activeJob.fps && (
                <span className="flex items-center space-x-1">
                  <BarChart3 className="w-4 h-4" />
                  <span>{activeJob.fps} fps</span>
                </span>
              )}
              <span className="flex items-center space-x-1">
                <Film className="w-4 h-4" />
                <span>{activeJob.quality}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>Duration: {activeJob.duration}</span>
              </span>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Queued', count: queuedCount, icon: <Clock className="w-5 h-5 text-gray-600" />, color: 'text-gray-700' },
            { label: 'Rendering', count: jobs.filter(j => j.status === 'rendering').length, icon: <RefreshCw className="w-5 h-5 text-blue-600" />, color: 'text-blue-600' },
            { label: 'Completed', count: completedCount, icon: <CheckCircle className="w-5 h-5 text-green-600" />, color: 'text-green-600' },
            { label: 'Failed', count: jobs.filter(j => j.status === 'failed').length, icon: <AlertCircle className="w-5 h-5 text-red-600" />, color: 'text-red-600' }
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl shadow-sm border p-4 flex items-center space-x-3">
              <div className="p-2 bg-gray-100 rounded-lg">{stat.icon}</div>
              <div>
                <p className={`text-xl font-bold ${stat.color}`}>{stat.count}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Job List */}
        {jobs.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border p-16 text-center">
            <Film className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No render jobs</h3>
            <p className="text-gray-500 mb-6">Add a job to start rendering your video projects</p>
            <button
              onClick={() => setShowNewJob(true)}
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Add First Job</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {jobs.filter(j => j.status !== 'rendering').map((job) => (
              <div key={job.id} className="bg-white rounded-xl shadow-sm border p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1 min-w-0">
                    <div className="flex flex-col space-y-1">
                      {job.status === 'queued' && (
                        <>
                          <button onClick={() => moveJob(job.id, 'up')} className="text-gray-400 hover:text-gray-600">
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => moveJob(job.id, 'down')} className="text-gray-400 hover:text-gray-600">
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold text-gray-900 truncate">{job.name}</h4>
                        <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                          {getStatusIcon(job.status)}
                          <span className="capitalize">{job.status}</span>
                        </span>
                        <span className={`text-xs font-medium ${getPriorityColor(job.priority)}`}>
                          {job.priority} priority
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>{job.resolution}</span>
                        <span>{job.codec}</span>
                        <span>{job.format}</span>
                        <span>{job.quality}</span>
                        {job.outputSize && <span className="font-medium text-gray-700">{job.outputSize}</span>}
                      </div>
                      {job.status === 'completed' && (
                        <div className="w-full bg-green-100 rounded-full h-1.5 mt-2">
                          <div className="bg-green-500 h-1.5 rounded-full w-full" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    {job.status === 'failed' && (
                      <button onClick={() => retryJob(job.id)} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        Retry
                      </button>
                    )}
                    <button onClick={() => deleteJob(job.id)} className="text-gray-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Job Modal */}
        {showNewJob && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Add Render Job</h2>
                <button onClick={() => setShowNewJob(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Name *</label>
                  <input
                    type="text"
                    value={newJob.name}
                    onChange={e => setNewJob(p => ({ ...p, name: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="My Video Export"
                    autoFocus
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
                    <select
                      value={newJob.format}
                      onChange={e => setNewJob(p => ({ ...p, format: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                    >
                      {FORMATS.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Resolution</label>
                    <select
                      value={newJob.resolution}
                      onChange={e => setNewJob(p => ({ ...p, resolution: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                    >
                      {RESOLUTIONS.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Codec</label>
                    <select
                      value={newJob.codec}
                      onChange={e => setNewJob(p => ({ ...p, codec: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                    >
                      {CODECS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quality</label>
                    <select
                      value={newJob.quality}
                      onChange={e => setNewJob(p => ({ ...p, quality: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                    >
                      {QUALITIES.map(q => <option key={q} value={q}>{q}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                    <input
                      type="text"
                      value={newJob.duration}
                      onChange={e => setNewJob(p => ({ ...p, duration: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                      placeholder="00:05:00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select
                      value={newJob.priority}
                      onChange={e => setNewJob(p => ({ ...p, priority: e.target.value as any }))}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                    >
                      <option value="low">Low</option>
                      <option value="normal">Normal</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button onClick={() => setShowNewJob(false)} className="px-4 py-2.5 text-gray-600">Cancel</button>
                <button
                  onClick={addJob}
                  disabled={!newJob.name.trim()}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add to Queue</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RenderQueue;