import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import os from 'os';

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
    const cpuUsage = await getCpuUsage();

    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const memoryUsage = Math.round(((totalMem - freeMem) / totalMem) * 100);

    let storageUsage = 0;
    if (process.platform === 'win32') {
      const diskOutput = await runCommand('powershell -Command "Get-Volume -DriveLetter C | Select-Object Size, SizeRemaining | ConvertTo-Json"');
      if (diskOutput) {
        try {
          const diskData = JSON.parse(diskOutput);
          if (diskData.Size > 0) {
            storageUsage = Math.round(((diskData.Size - diskData.SizeRemaining) / diskData.Size) * 100);
          }
        } catch (e) {
          // ignore
        }
      }
    }

    return NextResponse.json({
      status: 'success',
      data: {
        cpuUsage,
        memoryUsage,
        storageUsage
      }
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: error.message
    }, { status: 500 });
  }
}
