module.exports = {
  type: 'react-component',
  npm: {
    esModules: true,
    umd: {
      global: 'RxInput',
      externals: {
//        "incr-regex-package": 'iRX',
        "react-bootstrap": "ReactBootstrap",
        "react": "React",
        "react-dom": "ReactDOM" 
      }
    }
  },
  babel: {
    stage: 2
  },
  webpack: {
    html: {
      template: 'demo/src/index.html'
    }
  }
}

