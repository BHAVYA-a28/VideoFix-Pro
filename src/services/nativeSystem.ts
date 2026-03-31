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
  
  return {
    os: system.os,
    architecture: system.architecture,
    ram: system.totalMemory, // "8 GB" etc
    storage: system.storage.total,
    graphics: system.gpu,
    cores: navigator.hardwareConcurrency || 4
  };
};