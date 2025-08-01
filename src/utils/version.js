/**
 * Version management utilities
 */

export const APP_VERSION = '1.0.0';
export const BUILD_DATE = new Date().toISOString();

export const getVersionInfo = () => ({
  version: APP_VERSION,
  buildDate: BUILD_DATE,
  environment: process.env.NODE_ENV || 'development'
});

export const isNewerVersion = (currentVersion, newVersion) => {
  const current = currentVersion.split('.').map(Number);
  const newer = newVersion.split('.').map(Number);
  
  for (let i = 0; i < 3; i++) {
    if (newer[i] > current[i]) return true;
    if (newer[i] < current[i]) return false;
  }
  return false;
};