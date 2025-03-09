export default {
  server: {
    proxy: {
      '/api': {
        target: 'https://backend.yourserver.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      }
    }
  }
}
