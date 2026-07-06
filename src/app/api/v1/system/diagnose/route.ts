import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import os from 'os';
import path from 'path';

const runCommand = (command: string): Promise<string> => {
  return new Promise((resolve) => {
    exec(command, (error, stdout) => {
      if (error) {
        resolve('');
      } else {
        resolve(stdout.trim());
      }
    });
  });
};

const getCpuUsage = (): Promise<number> => {
  return new Promise((resolve) => {
    const startMeasure = os.cpus().map(cpu => cpu.times);
    setTimeout(() => {
      const endMeasure = os.cpus().map(cpu => cpu.times);
      let totalIdle = 0;
      let totalTick = 0;
      for (let i = 0; i < startMeasure.length; i++) {
        const start = startMeasure[i];
        const end = endMeasure[i];
        const idle = end.idle - start.idle;
        const tick = (end.user - start.user) + (end.sys - start.sys) + (end.nice - start.nice) + (end.irq - start.irq) + idle;
        totalIdle += idle;
        totalTick += tick;
      }
      if (totalTick === 0) resolve(0);
      else resolve(Math.round((1 - totalIdle / totalTick) * 100));
    }, 100);
  });
};

export async function GET() {
  try {
    const isWindows = process.platform === 'win32';
    
    const osType = os.type();
    const osRelease = os.release();
    const osArch = os.arch();
    const totalMemoryBytes = os.totalmem();
    const freeMemoryBytes = os.freemem();
    const cpuModel = os.cpus()[0]?.model || 'Unknown CPU';
    const cpuCores = os.cpus().length;
    
    let osName = `${osType} ${osRelease}`;
    let gpuName = 'WebGL/Browser Controlled GPU';
    let totalStorageBytes = 0;
    let freeStorageBytes = 0;
    let cpuLoad = 0;
    let installedSoftware: any[] = [];
    let totalMemoryGB = Math.round(totalMemoryBytes / (1024 * 1024 * 1024));
    
    if (isWindows) {
      const ramOutput = await runCommand('powershell -Command "(Get-CimInstance Win32_PhysicalMemory | Measure-Object -Property Capacity -Sum).Sum"');
      if (ramOutput) {
        const physicalBytes = parseInt(ramOutput.trim());
        if (!isNaN(physicalBytes) && physicalBytes > 0) {
          totalMemoryGB = Math.round(physicalBytes / (1024 * 1024 * 1024));
        }
      }

      const osCaption = await runCommand('powershell -Command "(Get-CimInstance Win32_OperatingSystem).Caption"');
      if (osCaption) osName = osCaption;
      
      const gpuOutput = await runCommand('powershell -Command "Get-CimInstance Win32_VideoController | Select-Object -ExpandProperty Name"');
      if (gpuOutput) {
        const gpus = gpuOutput.split(/\r?\n/).map(g => g.trim()).filter(Boolean);
        gpuName = gpus.join(' / ');
      }
      
      const diskOutput = await runCommand('powershell -Command "Get-Volume -DriveLetter C | Select-Object Size, SizeRemaining | ConvertTo-Json"');
      if (diskOutput) {
        try {
          const diskData = JSON.parse(diskOutput);
          totalStorageBytes = diskData.Size || 0;
          freeStorageBytes = diskData.SizeRemaining || 0;
        } catch (e) {
          // ignore parsing error
        }
      }
      
      cpuLoad = await getCpuUsage();
      
      const scriptPath = path.join(process.cwd(), 'scripts', 'detect-software.ps1');
      const softwareOutput = await runCommand(`powershell.exe -ExecutionPolicy Bypass -File "${scriptPath}"`);
      if (softwareOutput) {
        try {
          const softwareData = JSON.parse(softwareOutput);
          installedSoftware = softwareData.VideoEditingSoftware || [];
        } catch (e) {
          // ignore parsing error
        }
      }
    }
    
    const formatBytes = (bytes: number): string => {
      if (bytes === 0) return '0 B';
      const k = 1024;
      const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };
    
    const usedStorageBytes = totalStorageBytes - freeStorageBytes;
    const storageUsagePercent = totalStorageBytes > 0 ? Math.round((usedStorageBytes / totalStorageBytes) * 100) : 0;
    
    const responseData = {
      os: osName,
      osVersion: osRelease,
      architecture: osArch,
      totalMemoryBytes,
      totalMemoryGB,
      freeMemoryBytes,
      cpu: cpuModel,
      cpuCores,
      cpuLoad,
      gpu: gpuName,
      storage: {
        total: totalStorageBytes > 0 ? formatBytes(totalStorageBytes) : 'Unknown',
        free: freeStorageBytes > 0 ? formatBytes(freeStorageBytes) : 'Unknown',
        used: usedStorageBytes > 0 ? formatBytes(usedStorageBytes) : 'Unknown',
        usagePercent: storageUsagePercent
      },
      installedSoftware
    };
    
    return NextResponse.json({
      status: 'success',
      data: responseData
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: error.message || 'Error executing system diagnostics'
    }, { status: 500 });
  }
}
