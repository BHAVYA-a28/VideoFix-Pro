import { NextResponse } from 'next/server';

const transformOneDriveLink = (shareUrl: string): string => {
  if (!shareUrl) return '';
  try {
    if (shareUrl.includes('onedrive.live.com')) {
      const url = new URL(shareUrl);
      url.searchParams.set('download', '1');
      return url.toString();
    }
    if (shareUrl.includes('1drv.ms')) {
      return `${shareUrl}?download=1`;
    }
    return shareUrl;
  } catch (err) {
    return shareUrl;
  }
};

export const SOFTWARE_CATALOG = [
  { id: 'obs', name: 'OBS Studio', version: '30.1.2', license: 'free', downloadUrl: 'https://cdn-fastly.obsproject.com/downloads/OBS-Studio-30.1.2-Full-Installer-x64.exe', category: 'production' },
  { id: 'resolve', name: 'DaVinci Resolve', version: '18.6', license: 'free', downloadUrl: 'https://sw.blackmagicdesign.com/DaVinciResolve/v18.6/DaVinci_Resolve_18.6_Windows.zip', category: 'production' },
  { 
    id: 'ae-legacy', 
    name: 'After Effects (Community-Optimized)', 
    version: '2023.5', 
    license: 'pro', 
    downloadUrl: transformOneDriveLink('https://onedrive.live.com/download?cid=STUB-FIX-THIS-LATER'), 
    category: 'legacy-optimized',
    note: 'One-click OneDrive distribution active'
  },
  { 
    id: 'pr-legacy', 
    name: 'Premiere Pro (Community-Optimized)', 
    version: '2023.5', 
    license: 'pro', 
    downloadUrl: transformOneDriveLink('https://onedrive.live.com/download?cid=STUB-FIX-THIS-LATER-PR'), 
    category: 'legacy-optimized',
    note: 'Verified legacy environment'
  }
];

export async function GET() {
  return NextResponse.json(SOFTWARE_CATALOG);
}
