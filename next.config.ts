import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  // typescript: {
  //   ignoreBuildErrors: true, // Removed for better code quality
  // },
  // eslint: {
  //   ignoreDuringBuilds: true, // Removed for better code quality
  // },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config, {isServer}) => {
    if (!isServer) {
      // Prevent these modules from being bundled on the client
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        child_process: false,
        net: false,
        tls: false,
        http2: false,
        events: false,
      };
    }
    // Enable WebAssembly experiments
    config.experiments = {...config.experiments, asyncWebAssembly: true, topLevelAwait: true};
    return config;
  },
  devIndicators: {
    allowedDevOrigins: [
      'http://9000-firebase-studio-1748481758953.cluster-etsqrqvqyvd4erxx7qq32imrjk.cloudworkstations.dev',
    ],
  },
};

export default nextConfig;
