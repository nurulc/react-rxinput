module.exports = {
  type: 'react-component',
  npm: {
    esModules: true,
    umd: {
      global: 'RxInput',
      externals: {
        react: 'React',
        ReactBootstrap: 'react-bootstrap'
      }
    }
  },
  webpack: {
    html: {
      template: 'demo/src/index.html'
    }
  }
}

