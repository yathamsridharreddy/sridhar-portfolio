import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite blocks dev-server requests whose Host header isn't recognised. That is
// the right default locally, but it breaks remote/proxied dev environments
// (GitHub Codespaces, ngrok/cloudflare tunnels, cloud sandboxes).
//
// Opt in per environment instead of hardcoding hosts:
//   VITE_ALLOWED_HOSTS=all                  -> allow any host
//   VITE_ALLOWED_HOSTS=a.example,b.example  -> allow just those
const allowedHostsEnv = process.env.VITE_ALLOWED_HOSTS?.trim()
const allowedHosts =
  allowedHostsEnv === 'all'
    ? true
    : allowedHostsEnv
      ? allowedHostsEnv.split(',').map((h) => h.trim()).filter(Boolean)
      : []

export default defineConfig({
  plugins: [react()],
  server: { allowedHosts },
})
