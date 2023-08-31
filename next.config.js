/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    dangerouslyAllowSVG: true,
    domains: ['seeklogo.com', 'organizer.toornament.com', 'www.flaticon.com']
  }
}

module.exports = nextConfig
