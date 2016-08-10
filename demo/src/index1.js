import './style.css'
import './bootstrap-3.3.5-dist/css/bootstrap.min.css'
import './ok.png'
import React from 'react';
import {render} from 'react-dom';

import RxInput from '../../src';
import RX from 'incr-regex-package'


const PATTERNS = [
  '1111 1111',
  '111 111',
  '11 11',
  '1 1'
];

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
//    ["FM", "Micronesia"],
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
      card:  '',
      email: '',
      tester: '',
      ccv: '',
      plate: '',
      escaped: '',
      leading: '',
      custom: '',
      changing: '',
      pattern: '1111 1111' ,
      rgb: /.*/,
      rx: "",
    }
  },

  _onChange(e) {
    const stateChange = {}
    stateChange[e.target.name] = e.target.value
    this.setState(stateChange)
  },

  _changePattern(e) {
    try {
      let rgb = new RegExp(e.target.value);
      if( rgb ) this.setState({rgb: rgb, rx: e.target.value});
    } catch(e) {
        this.setState({ rx: e.target.value});
    }
  },

  render() {
    var rx = "1111112";  ///123-...456/;
    const states = US.map(a => "(" +a[0] +"-"+a[1]+"|"+a[1]+"-"+a[0]+")").join("|");
    //const states = US.map(a => "(" +a[1] +"-"+a[0]+")").join("|");
    const ssn = "Ssn: \\d{3}-\\d{2}-\\d{4}";
    const ext = "( Ext: \\d+)?";
    const phonebase = "(\\+\\d{1,3} )?\\(\\d{3}\\)-\\d{3}-\\d{4}";
    const phone = "Phone: "+phonebase+ext;
    const hwc_phone = "(Home: |Cell: )" + phonebase + "|Work: "+phonebase+ext;
    const zip = "Zip: \\d{5}(-\\d{4})?";
    const creditcard = "CC: (\\d{4}-){3}\\d{4} exp: (0\\d|1[012])/\\d{2}";

    var rz2 = /aa[a-zA-Z]+@-@\d+!!/;
    var emails = "[a-zA-Z_0-9][a-zA-Z_.0-9-]*@([a-zA-Z_0-9][a-zA-Z_.0-9-]*)+"
    var rx1 = new RegExp([states,ssn,phone,zip,creditcard, "Email: " + emails].join("|"));
    var email = new RegExp(emails);
    var yesno = /Yes|No/;
    var rgb = /Red|Gr(een|ay)|Blue|Yellow|O(range|live)/;
    //console.log("here I am",rx, RX.RXInputMask);
    return (
      <div className="App">
        <h1>
          Demo of Dynamic Masked Input
        </h1>
        <p></p>
        <p className="lead">A React component which creates a masked <code>&lt;input/&gt;</code></p>
        <div style={ {width: "600px"} }>
          <div className="form-field">
            <p className="small-text form-field">RegEx: <i>too long</i> {/*rx1.toString()*/}</p>
          </div>
          <div className="form-field" style={ {verticalAlign: 'top', width: "600px"} } >
            <label htmlFor="card">Various:</label>
            <RxInput mask={rx1} name="card" id="card" popover="yes" placeholder="State Name| Phone: |Ssn:  |Cc: |Email: " 
                         size="50" value={this.state.card} onChange={this._onChange} selection={{start:0,stop:0}} 
            />
          </div>
          <div className="form-field">
            <p  className="small-text form-field">RegEx: {hwc_phone.toString()}</p>
          </div>
          <div className="form-field">
            <label htmlFor="hwc_phone">Home/Work/Cell:</label>
            <RxInput mask={hwc_phone} name="hwc_phone" id="hwc_phone" size="40" popover="yes"
                         placeholder="{Work: , Home:, Cell:} +<country> (ddd)-ddd-dddd Ext: dd" 
                         value={this.state.email} onChange={this._onChange} selection={{start:0,stop:0}} />
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
            <RxInput mask={yesno} name="yesno" id="yesno" size="40" value={this.state.tester} popover="yes" selection={{start:0,stop:0}}  onChange={this._onChange}/>
          </div>
           <div className="form-field">
            <p  className="small-text form-field">RegEx: {rgb.toString()}</p>
          </div>
          <div className="form-field">
            <label htmlFor="rxinput">Regex:</label>
            <input name="rxinput" id="rxinput" size="100"  onBlur={this._changePattern}/>
          </div>
          <div className="form-field">
            <p  className="small-text form-field">RegEx: {this.state.rgb.toString()}</p>
          </div>
          <div className="form-field">
            <label htmlFor="rgb">Regex Tester:</label>
            <RxInput mask={this.state.rgb} name="rgb" id="rgb" size="40" value={this.state.tester} selection={{start:0,stop:0}} popover="yes" onChange={this._onChange}/>
          </div>
        </div>
      </div>  
      )
  }
})


render(<App/>, document.getElementById('demo'))
/*
<div className="App">
      <h1>
        <code>&lt;<a href="https://github.com/insin/react-maskedinput">RxInput</a>/&gt;</code>
      </h1>
      <p className="lead">A React component which creates a masked <code>&lt;input/&gt;</code></p>
      <div className="form-field">
        <label htmlFor="card">Card Number xxx:</label>
        <RxInput mask={rx1} name="card" id="card" size="20" value={this.state.card} onChange={this._onChange}/>
      </div>
      <p>You can even externally update the card state like a standard input element:</p>
      <div className="form-field">
        <label htmlFor="card">Externally Update:</label>
        <input onChange={this._onChange} name="card" maxLength="16" style={{borderBottom: '1px solid #999'}} />
      </div>
      <p>Placeholders are automatically generated but can be overridden with your own:</p>
      <div className="form-field">
        <label htmlFor="expiry">Expiry Date:</label>
        <RxInput mask="11/1111" name="expiry" id="expiry" placeholder="mm/yyyy" onChange={this._onChange}/>
      </div>
      <div className="form-field">
        <label htmlFor="ccv">CCV:</label>
        <RxInput mask="111" name="ccv" id="ccv" onChange={this._onChange}/>
      </div>
      <div className="form-field">
        <label htmlFor="plate">License Plate:</label>
        <RxInput mask="AAA 1111" name="plate" id="plate" onChange={this._onChange} placeholder="ABC 1234"/>
      </div>
      <p>Mask placeholder characters can be escaped with a leading <code>\</code> to use them as static contents:</p>
      <div className="form-field">
        <label htmlFor="escaped">Escaped:</label>
        <RxInput mask="11 \* 11" name="escaped" id="escaped" onChange={this._onChange}/>
      </div>
      <p>Leading static characters:</p>
      <div className="form-field">
        <label htmlFor="leading">Leading:</label>
        <RxInput mask="(0) 111 1111" name="leading" id="leading" onChange={this._onChange}/>
      </div>
      <p>Changing patterns:</p>
      <div className="form-field">
        <label htmlFor="changing">Input:</label>
        <RxInput mask={this.state.pattern} name="changing" id="changing" onChange={this._onChange}/>
      </div>
      <div className="form-field">
        <label htmlFor="pattern">Pattern:</label>
        <select onChange={this._changePattern}>
          {PATTERNS.map(pattern => <option value={pattern} key={pattern}>{pattern}</option>)}
        </select>
      </div>
      <p>Custom format character (W=[a-zA-Z0-9_], transformed to uppercase) and placeholder character (en space):</p>
      <div className="form-field">
        <label htmlFor="custom">Custom:</label>
        <CustomInput name="custom" id="custom" onChange={this._onChange}/>
      </div>
      <hr/>
      <pre><code>{JSON.stringify(this.state, null, 2)}</code></pre>
      <hr/>
      <footer><a href="https://github.com/insin/react-maskedinput">Source on GitHub</a></footer>
    </div>
*/