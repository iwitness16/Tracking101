/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Tell Turbopack exactly where the project root is so it stops
  // scanning parent directories for lockfiles
  turbopack: {
    root: import.meta.dirname,
  },
  // Keep Node-only modules (tls, nodemailer, imap) out of the client bundle
  serverExternalPackages: ['nodemailer', 'tls'],
}

export default nextConfig
