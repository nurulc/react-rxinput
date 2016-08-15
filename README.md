# react-rxinput

[![Travis][build-badge]][build]
[![npm package][npm-badge]][npm]
[![Coveralls][coveralls-badge]][coveralls]


[build-badge]: https://img.shields.io/travis/user/repo/master.svg?style=flat-square
[build]: https://travis-ci.org/user/repo

[npm-badge]: https://img.shields.io/npm/v/npm-package.svg?style=flat-square
[npm]: https://www.npmjs.org/package/npm-package

[coveralls-badge]: https://img.shields.io/coveralls/user/repo/master.svg?style=flat-square
[coveralls]: https://coveralls.io/github/user/repo
# react-rxinput


[Demo](https://nurulc.github.io/)


## Highlights:

- Use regular expression to define 'masked input' (project inspired by https://github.com/insin/react-maskinput)
- RegExp matching/validation as you type
- Auto complete
- Matching suggestions
- Replacement for mask input 
- Handles very large regular expressions
- Pretty extensive test scripts

[Please try out the demo](https://nurulc.github.io/)

[incr-regex-package](https://github.com/nurulc/incr-regex-package)
[react-bootstrap](https://react-bootstrap.github.io/)
[React](https://facebook.github.io/react/)


JavaScript regular expression is great and really fast, and it would be pointless to try to create a RegExp alternative that does the same thing. But having said that, this project is a specific use case  - validating input as you type using RegExp. 

I needed a regular expression matcher that would work incrementally; By that I mean that it should let you know if a string matches the beginning part of a regular expression (good so far, but needs more input scenario). I tried to figure out if that was possible using JavaScript's regular expression matcher. I could not figure out any easy to do that. I decided that I would write an incremental regular expression matcher. I was much more difficult that I expected. But I have build an npm package that does perform incremental regular expression matching.

- npm incr-regex-package, (https://github.com/nurulc/incr-regex-package)
- input validation widget react-rxinput (https://github.com/nurulc/react-rxinput) 

The widget was inspired by another github project (https://github.com/insin/react-maskinput) that provides mask input for things like phone number, credit card number, date and so on. Although the capability is very nice, but it was limited. THe input mask you could enter has very little flexibility, wile a regular expression has all the flexibility you could need (even regexp has its limitations, cannot match recursive patterns, but that is for another day).

Building the widget it became obvious that it could be a swiss army knife and provide:

- Auto completion
- Dropdown list alternative
- Radio button alternative
- Mask input replacement
- As you type validation
- Force upper case
- Limit the character you can enter
- Only allow valid input as you type

### Limitations

- Does not support look back
- Does not fupport look forward
- Is not a replacement JavaScript RegExp
- Not sure of all RegExp edge cases are handles
- Assome all reagep are anchored to the beging of input (meaning the regexp matching always starts at the begining
 
## Known bugs
- Rare: but deleting input text in the middle of the input box (very complex regular expressions) sometimes misbehaves 

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
