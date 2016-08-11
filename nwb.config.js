module.exports = {
  type: 'react-component',
  build: {
    externals: {
      'react': 'React',
      "react-dom": "ReactDOM",
      "react-bootstrap": "ReactBootstrap",
    },
    global: 'RxInput',
    jsNext: true,
    umd: true
  },
  webpack: {
	  html: {
	    template: "demo/src/index.html",
	  },
  },
}
