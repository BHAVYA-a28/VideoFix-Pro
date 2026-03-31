/**
 * VideoFix Pro - OneDrive Direct Link Transformer
 * Converts standard sharing links to direct-download streams.
 * Supported: onedrive.live.com, 1drv.ms
 */
export const transformOneDriveLink = (shareUrl: string): string => {
  if (!shareUrl) return '';
  
  try {
    // 1. Regular onedrive.live.com links
    if (shareUrl.includes('onedrive.live.com')) {
      const url = new URL(shareUrl);
      url.searchParams.set('download', '1');
      return url.toString();
    }

    // 2. Shortened 1drv.ms links (Requires base64 padding for the 'resid' method if possible)
    // For now, we'll use the 'download=1' strategy as most standard links support it.
    if (shareUrl.includes('1drv.ms')) {
      return `${shareUrl}?download=1`;
    }

    return shareUrl;
  } catch (err) {
    console.error('[VFP-Utils] OneDrive Transformation Failure:', err);
    return shareUrl;
  }
};

/**
 * Enterprise Repository Auth Verification
 * Simple check for Pro entitlements before surfacing Legacy Repo
 */
export const verifyRepoAccess = (userRole: string): boolean => {
  return ['pro', 'enterprise', 'admin'].includes(userRole.toLowerCase());
};
