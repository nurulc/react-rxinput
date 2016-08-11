import './style.css'
import React from 'react';
import {render} from 'react-dom';

import RxInput from '../../src/index';
import RX from 'incr-regex-package'

console.log("HERE I AM");


window.RX = RX;
const US = [
    ["AL", "Alabama"],
    ["AK", "Alaska"],
    ["AS", "American Samoa"],
    ["AZ", "Arizona"],
    ["AR", "Arkansas"],
    ["CA", "California"],
    ["CO", "Colorado"],
    ["CT", "Connecticut"],
    ["DE", "Delaware"],
    ["DC", "District Of Columbia"],
    ["FM", "Federated States Of Micronesia"],
    ["FL", "Florida"],
    ["GA", "Georgia"],
    ["GU", "Guam"],
    ["HI", "Hawaii"],
    ["ID", "Idaho"],
    ["IL", "Illinois"],
    ["IN", "Indiana"],
    ["IA", "Iowa"],
    ["KS", "Kansas"],
    ["KY", "Kentucky"],
    ["LA", "Louisiana"],
    ["ME", "Maine"],
    ["MH", "Marshall Islands"],
    ["MD", "Maryland"],
    ["MA", "Massachusetts"],
    ["MI", "Michigan"],
    ["MN", "Minnesota"],
    ["MS", "Mississippi"],
    ["MO", "Missouri"],
    ["MT", "Montana"],
    ["NE", "Nebraska"],
    ["NV", "Nevada"],
    ["NH", "New Hampshire"],
    ["NJ", "New Jersey"],
    ["NM", "New Mexico"],
    ["NY", "New York"],
    ["NC", "North Carolina"],
    ["ND", "North Dakota"],
    ["MP", "Mariana Islands"],
    ["MP", "Northern Mariana Islands"],
    ["OH", "Ohio"],
    ["OK", "Oklahoma"],
    ["OR", "Oregon"],
    ["PW", "Palau"],
    ["PA", "Pennsylvania"],
    ["PR", "Puerto Rico"],
    ["RI", "Rhode Island"],
    ["SC", "South Carolina"],
    ["SD", "South Dakota"],
    ["TN", "Tennessee"],
    ["TX", "Texas"],
    ["UT", "Utah"],
    ["VT", "Vermont"],
    ["VI", "Virgin Islands"],
    ["VA", "Virginia"],
    ["WA", "Washington"],
    ["WV", "West Virginia"],
    ["WI", "Wisconsin"],
    ["WY", "Wyoming"]
];


const App = React.createClass({
  getInitialState() {
    return {
      various:  '',
      rgb: '',
      changing: '',
      color: '',
      custom: /.*/,
      rx: "",
      customValue: "",
    }
  },

  _onChange(e) {
    const stateChange = {}
    stateChange[e.target.name] = e.target.value
    this.setState(stateChange)
  },

  _changePattern(e) {
    try {
      let custom = new RegExp(e.target.value);
      if( custom ) this.setState({custom: custom, rx: e.target.value});
    } catch(e) {
        this.setState({ rx: e.target.value});
    }
  },

  render() {
    
    const states = US.map(a => "(" +a[0] +"-"+a[1]+"|"+a[1]+"-"+a[0]+")").join("|");
    //const states = US.map(a => "(" +a[1] +"-"+a[0]+")").join("|");
    const ssn = "Ssn: \\d{3}-\\d{2}-\\d{4}";
    const ext = "( Ext: \\d+)?";
    const phonebase = "(\\+\\d{1,3} )?\\(\\d{3}\\)-\\d{3}-\\d{4}";
    const phone = "Phone: "+phonebase+ext;
    const hwc_phone = new RegExp("(Home: |Cell: )" + phonebase + "|Work: "+phonebase+ext);
    const zip = "Zip: \\d{5}(-\\d{4})?";
    const creditcard = "CC: (\\d{4}-){3}\\d{4} exp: (0\\d|1[012])/\\d{2}";

    var rz2 = /aa[a-zA-Z]+@-@\d+!!/;
    var emails = "[a-zA-Z_0-9][a-zA-Z_.0-9-]*@([a-zA-Z_0-9][a-zA-Z_.0-9-]*)+"
    var rxStatePhoneCcSsn = new RegExp([states,ssn,phone,zip,creditcard, "Email: " + emails].join("|"));
    var email = new RegExp(emails);
    var yesno = /Yes|No/;
    var color = /Red|Gr(een|ay)|Blue|Yellow|O(range|live)/;
    
    return (
      <div className="App">
        <h1>
          Demo of Dynamic Masked Input
        </h1>
        <p></p>
        <p className="lead">A React component which creates a masked using RegEx to validate input as you type<code>&lt;input/&gt;</code></p>
        <div style={ {width: "600px"} }>
          <div className="form-field">
            <p className="small-text form-field">RegEx: <i>too long</i> {/*rxStatePhoneCcSsn.toString()*/}</p>
          </div>
          <div className="form-field" style={ {verticalAlign: 'top', width: "600px"} } >
            <label htmlFor="card">Various:</label>
            <RxInput mask={rxStatePhoneCcSsn} name="card" id="card" popover="yes" placeholder="State Name| Phone: |Ssn:  |Cc: |Email: " 
                         size="50" value={this.state.various} onChange={this._onChange} selection={{start:0,stop:0}} 
            />
          </div>
          <div className="form-field">
            <p  className="small-text form-field">RegEx: {hwc_phone.toString()}</p>
          </div>
          <div className="form-field">
            <label htmlFor="hwc_phone">Home/Work/Cell:</label>
            <RxInput mask={hwc_phone} name="hwc_phone" id="hwc_phone" size="40" popover="yes"
                         placeholder="{Work: , Home:, Cell:} +<country> (ddd)-ddd-dddd Ext: dd" 
                         value={this.state.various} onChange={this._onChange} selection={{start:0,stop:0}} />
          </div>
          <div className="form-field">
            <p  className="small-text form-field">RegEx: {rz2.toString()}</p>
          </div>
          <div className="form-field">
            <label htmlFor="tester">Tester:</label>
            <RxInput mask={rz2} name="mail" id="tester" size="40" value={this.state.tester} selection={{start:0,stop:0}} onChange={this._onChange}/>
          </div>

          <div className="form-field">
            <p  className="small-text form-field">RegEx: {yesno.toString()}</p>
          </div>
          <div className="form-field">
            <label htmlFor="yesno">Yes No:</label>
            <RxInput mask={yesno} name="yesno" id="yesno" size="40" value={this.state.yesno} popover="yes" selection={{start:0,stop:0}}  onChange={this._onChange}/>
          </div>
           <div className="form-field">
            <p  className="small-text form-field">RegEx: {color.toString()}</p>
          </div>
          <div className="form-field">
            <label htmlFor="color">Color:</label>
            <RxInput mask={yesno} name="color" id="color" size="40" value={this.state.color} popover="yes" selection={{start:0,stop:0}}  onChange={this._onChange}/>
          </div>
          <div className="form-field">
            <label htmlFor="rxinput">User Chosen regex:</label>
            <input name="rxinput" id="rxinput" size="100"  onBlur={this._changePattern}/>
          </div>
          <div className="form-field">
            <p  className="small-text form-field">RegEx: {this.state.custom.toString()}</p>
          </div>
          <div className="form-field">
            <label htmlFor="customValue">Regex Tester:</label>
            <RxInput mask={this.state.custom} name="customValue" id="customValue" size="40" value={this.state.customValue} selection={{start:0,stop:0}} popover="yes" onChange={this._onChange}/>
          </div>
        </div>
      </div>  
      )
  }
});

//console.log("I am here");
render(<App/>, document.querySelector('#demo'));