import { detectSystemInfo } from './systemDetector';

export interface NativeSystemInfo {
  os: string;
  architecture: string;
  ram: string;
  storage: string;
  graphics: string;
  cores: number;
}

export const getNativeSystemInfo = async (): Promise<NativeSystemInfo> => {
  // Leverage our robust systemDetector
  const system = await detectSystemInfo();
  
  let nativeData: any = null;
  let softwareData: any = null;

  // @ts-ignore
  if (window.require && window.require('electron')) {
    try {
      // @ts-ignore
      const { ipcRenderer } = window.require('electron');
      // Parallel fetch for speed
      const [detailed, apps] = await Promise.all([
        ipcRenderer.invoke('get-system-detailed'),
        ipcRenderer.invoke('detect-software')
      ]);
      nativeData = detailed;
      softwareData = apps;
    } catch (err) {
      console.error('[VFP-Native] Bridge error:', err);
    }
  }

  const sysInfo = softwareData?.SystemInfo;

  return {
    os: sysInfo?.OS || (nativeData?.platform === 'win32' ? 'Windows' : nativeData?.platform) || system.os,
    architecture: sysInfo?.Architecture || nativeData?.arch || system.architecture,
    ram: sysInfo?.TotalMemory ? `${sysInfo.TotalMemory} GB` : system.totalMemory,
    storage: sysInfo?.FreeSpace ? `${sysInfo.FreeSpace} GB Free` : system.storage.total,
    graphics: system.gpu, // GPU info is usually more reliable from Browser WebGL than raw WMI
    cores: navigator.hardwareConcurrency || 4
  };
};

export const getDetectedSoftware = async () => {
  // @ts-ignore
  if (window.require && window.require('electron')) {
    try {
      // @ts-ignore
      const { ipcRenderer } = window.require('electron');
      const result = await ipcRenderer.invoke('detect-software');
      return result;
    } catch (err) {
      console.error('[VFP-Native] Detect software error:', err);
      return null;
    }
  }
  return null;
};