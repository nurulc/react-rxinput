module.exports = {
  type: 'react-component',
  build: {
    externals: {
      'react': 'React'
    },
    global: 'RxInput',
    jsNext: true,
    umd: true
  }
}
