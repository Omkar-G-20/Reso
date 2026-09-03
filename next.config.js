const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');

module.exports = (phase) => {
  const isDev = phase === PHASE_DEVELOPMENT_SERVER;
  const basePath = isDev ? '' : '/Reso';

  /** @type {import('next').NextConfig} */
  return {
    output: 'export',
    basePath: basePath,
    assetPrefix: basePath ? `${basePath}/` : '',
    images: {
      unoptimized: true,
    },
    trailingSlash: true,
    eslint: {
      ignoreDuringBuilds: true,
    },
    typescript: {
      ignoreBuildErrors: true,
    },
  };
};
