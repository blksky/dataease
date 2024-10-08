export default {
  server: {
    headers: {
      'Access-Control-Allow-Origin': '*' // 主应用获取子应用时跨域响应头
    },
    proxy: {
      // '/api/f': {
      //   target: 'http://localhost:8100',
      //   changeOrigin: true,
      //   rewrite: path => path.replace(/^\/api\/f/, '')
      // },
      // '/api': {
      //   target: 'http://localhost:8100',
      //   changeOrigin: true,
      //   rewrite: path => path.replace(/^\/api/, 'de2api')
      // }
      '/de2api/f': {
        target: 'http://localhost:8100',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/de2api\/f/, '')
      },
      // 使用 proxy 实例
      '/de2api': {
        target: 'http://localhost:8100',
        changeOrigin: true
        // rewrite: path => path.replace(/^\/api/, 'de2api')
      }
    },
    port: 8080
  }
}
