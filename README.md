# react-rxinput

[![Travis][build-badge]][build]
[![npm package][npm-badge]][npm]
[![Coveralls][coveralls-badge]][coveralls]

Describe react-rxinput here.

[build-badge]: https://img.shields.io/travis/user/repo/master.svg?style=flat-square
[build]: https://travis-ci.org/user/repo

[npm-badge]: https://img.shields.io/npm/v/npm-package.svg?style=flat-square
[npm]: https://www.npmjs.org/package/npm-package

[coveralls-badge]: https://img.shields.io/coveralls/user/repo/master.svg?style=flat-square
[coveralls]: https://coveralls.io/github/user/repo
# react-rxinput

[Demo](https://nurulc.github.io/)


### Installation

  npm install react-rxinput --save


git:

```
    git clone https://github.com/nurulc/react-rxinput.git
    cd react-rxinput
    npm install
    npm start
```


The commands above will start the demo application
point youy browser at http://localhost:3000


How to use the component:


**RxInput***

properties:

- mask - regular expression
- value - value to set
- selection - selection
- popover - Yes| No whether to show hints or nor
- onChange - function to execute when a chnage happens
- placeholder - text placeholder

```
const App = React.createClass({
  getInitialState() {
    return {
      color: "",
    }
  },

  _onChange(e) {
    const stateChange = {}
    stateChange[e.target.name] = e.target.value
    this.setState(stateChange)
  },


  _createHeader() {
   return (
    <div>
        <h1>
          Demo of Rx Masked Input
        </h1>
        <p></p>
        <p className="lead">
          A React component which creates a masked using 
          <a href="https://github.com/nurulc/incr-regex-package">incremental regular expression matching</a>
          to validate input as you type
          <code>&lt;RxInput/&gt;</code>
        </p>

    </div>
    );
  },



  render() {
    // Color: <scome colors>  |  Email: <email> | Phone: <phone number>
    const color = /Color: (Red|Gr(een|ay)|Blue|Yellow|O(range|live))|Email: [a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+|(Phone: (\\+\\d{1,3} )?\\(\\d{3}\\)-\\d{3}-\\d{4}( Ext: \\d+)?)/;
  
    return (
      <div className="App">
        {this._createHeader() }
        <div>
          <div className="form-field">
            <label htmlFor="color">Color:</label>
            <RxInput name="color" id="color" size="40" 
                     mask={color} 
                     value={this.state.color} 
                     popover="yes" 
                     placeholder="Color: <scome colors>  |  Email: <email> | Phone: <phone number>"
                     selection={{start:0,stop:0}}  
                     onChange={this._onChange}/>
          </div>
        </div>
      </div>  
      )
  }
});


render(<App name="test"/>, document.querySelector('#demo'));
```


**_Documentation to come_**
