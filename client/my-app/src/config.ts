const config = {
  env: import.meta.env.VITE_NODE_ENV ?? 'development',
  apiUrl: import.meta.env.VITE_API_URL
}

export default config;