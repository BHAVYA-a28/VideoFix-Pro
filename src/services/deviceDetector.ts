// Device Specification Service — derived from professional diagnostic patterns
// This service provides high-fidelity hardware and software heuristics

export interface DeviceSpecs {
  // Hardware
  cpuCores: number | string;
  ram: string;
  gpu: {
    renderer: string;
    vendor: string;
  };
  touchPoints: number;

  // Screen
  screenResolution: string;
  viewport: string;
  devicePixelRatio: number;
  colorDepth: string;
  orientation: string;

  // Software
  os: string;
  browser: string;
  userAgent: string;
  platform: string;
  language: string;
  timezone: string;
  cookiesEnabled: boolean;

  // Network
  connectionType: string;
  downlink: string;
  saveData: boolean;
}

export function getDeviceSpecs(): DeviceSpecs {
  // GPU detection via WebGL
  function getGPU() {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) return { renderer: 'unavailable', vendor: 'unavailable' };
      const ext = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info');
      if (ext) {
        return {
          renderer: (gl as WebGLRenderingContext).getParameter(ext.UNMASKED_RENDERER_WEBGL),
          vendor:   (gl as WebGLRenderingContext).getParameter(ext.UNMASKED_VENDOR_WEBGL)
        };
      }
      return { 
        renderer: (gl as WebGLRenderingContext).getParameter((gl as WebGLRenderingContext).RENDERER), 
        vendor: (gl as WebGLRenderingContext).getParameter((gl as WebGLRenderingContext).VENDOR) 
      };
    } catch (e) {
      return { renderer: 'blocked', vendor: 'blocked' };
    }
  }

  // OS detection
  function getOS() {
    const ua = navigator.userAgent;
    if (/Windows NT 10/.test(ua))  return 'Windows 10/11';
    if (/Android/.test(ua))        { const m = ua.match(/Android ([\d.]+)/); return 'Android ' + (m?.[1] ?? ''); }
    if (/iPhone|iPad/.test(ua))    { const m = ua.match(/OS ([\d_]+)/);      return 'iOS ' + (m?.[1].replace(/_/g, '.') ?? ''); }
    if (/Mac OS X/.test(ua))       { const m = ua.match(/Mac OS X ([\d_]+)/);return 'macOS ' + (m?.[1].replace(/_/g, '.') ?? ''); }
    if (/Linux/.test(ua))          return 'Linux';
    return 'Unknown';
  }

  // Browser detection
  function getBrowser() {
    const ua = navigator.userAgent;
    if (/Edg\//.test(ua))    { const m = ua.match(/Edg\/([\d.]+)/);     return 'Edge '    + (m?.[1].split('.')[0] ?? ''); }
    if (/OPR\//.test(ua))    { const m = ua.match(/OPR\/([\d.]+)/);      return 'Opera '   + (m?.[1].split('.')[0] ?? ''); }
    if (/Chrome\//.test(ua)) { const m = ua.match(/Chrome\/([\d.]+)/);   return 'Chrome '  + (m?.[1].split('.')[0] ?? ''); }
    if (/Firefox\//.test(ua)){ const m = ua.match(/Firefox\/([\d.]+)/);  return 'Firefox ' + (m?.[1].split('.')[0] ?? ''); }
    if (/Safari\//.test(ua)) { const m = ua.match(/Version\/([\d.]+)/);  return 'Safari '  + (m?.[1].split('.')[0] ?? ''); }
    return 'Unknown';
  }

  const gpu = getGPU();
  // @ts-ignore
  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

  return {
    // Hardware
    cpuCores:         navigator.hardwareConcurrency ?? 'unknown',
    // @ts-ignore
    ram:              navigator.deviceMemory ? `${navigator.deviceMemory} GB` : 'not disclosed',
    gpu:              gpu,
    touchPoints:      navigator.maxTouchPoints,

    // Screen
    screenResolution: `${screen.width} × ${screen.height}`,
    viewport:         `${window.innerWidth} × ${window.innerHeight}`,
    devicePixelRatio: window.devicePixelRatio,
    colorDepth:       `${screen.colorDepth}-bit`,
    orientation:      screen.orientation?.type ?? (window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'),

    // Software
    os:               getOS(),
    browser:          getBrowser(),
    userAgent:        navigator.userAgent,
    platform:         navigator.platform,
    language:         navigator.language,
    timezone:         Intl.DateTimeFormat().resolvedOptions().timeZone,
    cookiesEnabled:   navigator.cookieEnabled,

    // Network
    connectionType:   conn?.effectiveType ?? 'unknown',
    downlink:         conn?.downlink ? `${conn.downlink} Mbps` : 'unknown',
    saveData:         conn?.saveData ?? false,
  };
}
