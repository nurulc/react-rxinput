/*
Copyright (c) 2016, Nurul Choudhury

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

*/

//
// Modified from https://github.com/insin/react-maskedinput
//  This was originally written by insin - on GIT hub
//  The code worked fine for fixed formatted input mask, but is not so useful for
//  varible mask based on regular expression (RegExp)
//  That capability regires this implementation of Regexp, and provides incremental processing of regular expression
// Amost the entire original code has been replaces but the original interfaces remain
//


import React from 'react'
import except from 'except'
import { Popover,OverlayTrigger } from 'react-bootstrap';
import {getSelection, setSelection} from 'react/lib/ReactInputSelection';

const RX = require("incr-regex-package");


const KEYCODE_Z = 90
const KEYCODE_Y = 89

function isUndo(e) {
  return (e.ctrlKey || e.metaKey) && e.keyCode === (e.shiftKey ? KEYCODE_Y : KEYCODE_Z)
}

function isRedo(e) {
  return (e.ctrlKey || e.metaKey) && e.keyCode === (e.shiftKey ? KEYCODE_Z : KEYCODE_Y)
}

function supportArrowNavigation(mask) {
   return (RX.contract.isFunc(mask.arrowAction));  
}


function asStr(anObj) {
  return JSON.stringify(anObj);
}

function eqSel(sel1,sel2) {
  if( sel1 === sel2 ) return true;
  if( sel1 === undefined || sel2 === undefined) return false;
  return sel1.start === sel2.start && sel1.end === sel2.end;
}

function selAt(sel, x) {
  if( !sel && x === 0 ) return true;
  return sel.start === x && (sel.end === undefined || sel.end === x);
}

function strCmp1(a,b) {
  var nameA = a.toUpperCase(); // ignore upper and lowercase
  var nameB = b.toUpperCase(); // ignore upper and lowercase
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }

  // names must be equal
  return 0;
}

const mapImg = {
  "DONE": ([<span className="glyphicon glyphicon-ok form-control-feedback"></span>, ""] ),
  "MORE" : ([<span className="glyphicon glyphicon-arrow-right form-control-feedback"></span>, " has-warning"]),
  "OK": ([<span className="glyphicon glyphicon-option-horizontal form-control-feedback"></span>, ""]),
};

//const LOG = (a, msg='') =>  { console.log(msg+": "+ a); return a; }
const LOG = x => x;
const RxStatus = React.createClass({
   propTypes: {
    mask: React.PropTypes.object.isRequired,
   }, 
   render() {
     function printElem([code,typ]) {
        if( typ === undefined ) return code;
        return (<b>{code}</b>)
     }
     let t = this.props.mask.pattern.getInputTracker() || []; 
     return (
        <div>
           {t.map(printElem)}
        </div>
      )
   }
});


const RxInput = React.createClass({
  propTypes: {
    mask: React.PropTypes.object.isRequired,
    name: React.PropTypes.string.isRequired,
    popover: React.PropTypes.string,
    selection: React.PropTypes.object,
    value: React.PropTypes.string,
  },

  getDefaultProps() {
    return {
      value: '',
      showAll: "yes"
    }
  },

  getInitialState() {
    var options = {
      pattern: this.props.mask,
      value: this.props.value,
    };
    return { focus: false,
              value: this.props.value,
              selection: this.props.selection,
              mask: new RX.RXInputMask(options)
            };
  },


  componentWillReceiveProps(nextProps) {
    if (this.props.mask.toString() !== nextProps.mask.toString()) {
      //this.state.mask.setPattern(nextProps.mask, {value: this.state.mask.getRawValue()});
      this.state.mask.setPattern(nextProps.mask, {value: nextProps.value, selection: this.state.mask.selection});
      this.setState({ selection: this.state.selection, value: nextProps.value});
    }
    else if (this.props.value !== nextProps.value) {
          this.state.mask.setValue(nextProps.value);
    }
  },

  _updateMaskSelection() {
    this.state.mask.selection = getSelection(this.input);
  },

  _updateInputSelection() {
    if( !eqSel(getSelection(this.input),this.state.mask.selection)) setSelection(this.input, this.state.mask.selection);
  },

  _onFocus(e) {

  },

  _onBlurr() {

  },

  _onChange(e) {
    // console.log('onChange', asStr(getSelection(this.input)), e.target.value)
    const mask = this.state.mask;
    var maskValue = mask.getValue()
    if (e.target.value !== maskValue) {
      // Cut or delete operations will have shortened the value
      if (e.target.value.length < maskValue.length) {
        var sizeDiff = maskValue.length - e.target.value.length
        this._updateMaskSelection();
        mask.selection.end = mask.selection.start + sizeDiff
        mask.backspace();
        //console.log("Fix maskValue", maskValue, "diff:", sizeDiff, "target value: ", e.target.value);
      }
      var value = this._getDisplayValue();
      e.target.value = value
      if (value) {
        this._updateInputSelection()
      }
    }
    this.setState({selection: this.mask.selection});
    if (this.props.onChange) {
      var opt = {target: {value: this.getValue()}};
      this.props.onChange(opt);
     
    }
    // console.log("on change", e)
  },

  

  _onKeyDown(e) {
    const mask = this.state.mask;
    const isKey = (keyV) => (e) => e.key === keyV;

    const _C = ( test, action) => {
            if( !test(e) )  return false;
            e.preventDefault();
            this._updateMaskSelection();
            if(action()) {
                let oldVal = e.target.value
                let value = this._getDisplayValue();
                e.target.value = value;
                //console.log(action+":getDisplayValue", value);
                if (value) {   this._updateInputSelection();    }
                if (this.props.onChange && oldVal != value) {
                    var opt = {target: {value: mask._getValue()}};
                    this.props.onChange(opt);
                    //console.log("on change", e)
                }
                // console.log("on change1", e)
            }
            this.setState({selection: mask.selection});
            return true;
          };
     //console.log('onKeyDown',mask, asStr(getSelection(this.input))+"/"+asStr(mask.selection), e.key, e.keyCode, e.target.value)
     if(_C(isUndo,()=>mask.undo()) || _C(isRedo,()=>mask.redo()) || 
      _C(isKey("Backspace"),()=>mask.backspace()) || 
      _C(isKey("Delete"),()=>mask.del())) return; 

    if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey || e.key === 'Enter') { return }
    if( e.key === 'ArrowLeft' || e.key == 'ArrowRight') {
      // Check if mask supports arrow support
      let sel = getSelection(this.input);
      //mask.selection = sel;
      if( sel.start === sel.end && mask.left !== undefined) {
        e.preventDefault();
        if( e.key === 'ArrowLeft' ) mask.left(sel);
        else mask.right(sel);
        this._updateInputSelection();
        //this.refs.debug.props.forceUpdate();
      }

      //console.log("Arrow Action support:", supportArrowNavigation(mask), " value:",this._getDisplayValue(), " selection: ", asStr(getSelection(this.input)), asStr(mask.selection));
    }    
  },



  _onKeyPress(e) {
    const mask = this.state.mask;
     //console.log('onKeyPress', asStr(getSelection(this.input)),asStr(mask.selection), e.key, e.target.value)

    // Ignore modified key presses
    // Ignore enter key to allow form submission
    if (e.metaKey || e.altKey || e.ctrlKey || e.key === 'Enter') { return }
    let selX = getSelection(this.input);
    let oldMaskX = mask.getSelection();
    e.preventDefault();
    this._updateMaskSelection();

    if (insert(e.key)) {
      let oldVal = e.target.value;
      let value = mask.getValue();
      e.target.value = value;
      //console.log("keyPress:getDisplayValue", this._getDisplayValue(),  " selection: ", asStr(selX)+"/"+asStr(mask.selection)+"<"+asStr(oldMaskX));
      this._updateInputSelection();
      this.setState({selection: mask.selection});
      if (this.props.onChange && oldVal != value) {
            var opt = {target: {value: mask._getValue()}};
            this.props.onChange(opt);
           
      }
       //console.log("on change", e)
    }

    function insert(ch) {
      if(mask.input(ch)) return true;
      if(ch !== ch.toUpperCase()) return mask.input(ch.toUpperCase());
      else if( ch != ch.toLowerCase()) return mask.input(ch.toLowerCase());
      return false;
    }
  },

  _onPaste(e) {
    const mask = this.state.mask;
     //console.log('onPaste', asStr(getSelection(this.input)), e.clipboardData.getData('Text'), e.target.value)

    e.preventDefault()
    this._updateMaskSelection()
    // getData value needed for IE also works in FF & Chrome
    //console.log("paste: ", e.clipboardData.getData('Text'));
    if (mask.paste(e.clipboardData.getData('Text'))) {
      e.target.value = mask.getValue();
      //console.log("undo:getDisplayValue", this._getDisplayValue());
      // Timeout needed for IE
      setTimeout(this._updateInputSelection, 0)
      //this.props.onChange(e);
      this.setState({selection: mask.selection});
    }
  },


  _getMaskList(flag) {
     const list = this.state.mask.minCharsList(!!flag);
     if( list && list.length < 20 ) return list;
     return this.state.mask.minCharsList();
  },

  _getDisplayValue() {
    var value = this.state.mask.getValue()
    return value === this.state.mask.emptyValue ? '' : value
  },

  selected(str,e) {
    //console.log("Selected: "+str);
    if( !str.split('').find(c => RX.isMeta(c)? c : undefined) ) {
      const mask = this.state.mask;
      mask.setValue(str);
      this.setState({mask: mask});
      //console.log("Selected(done): "+str);
    }
  },

  _createPopover(valueList,headers, maxWidth,placeholder) {
         const strip = s => LOG(s.replace(/\u0332/g,""),"strip:");
         maxWidth = Math.max(150, maxWidth || 12*Math.max.apply(null, valueList.map( a => Math.min(25,strip(a).length) )));
         LOG(maxWidth,"MAX WIDTH:");
         const MAXWIDTH = maxWidth || 200;
         const SPANSTYLE = {width: MAXWIDTH-50, maxWidth: MAXWIDTH-50};
         let TS, PADDING;
         if( !valueList || valueList.length <= 1 ) {
              if( !placeholder ) return <div />;
              valueList = [placeholder];
         }
         if(valueList.length> 20) {
          TS = {height: "400px", display: "block", overflow: "auto"};
          PADDING =  <div> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>;
         }
         function hash(str) {
            var hashVal = 5381,
                i    = str.length

            while(i)
              hashVal = (hashVal * 33) ^ str.charCodeAt(--i)
            return (hashVal >>> 0)+12;
         }
         const me = this;
         return ( 
               <Popover  id={this.props.name+"myPopover"} className="col-xs-10 col-md-10" style={{width: MAXWIDTH,maxWidth: MAXWIDTH, fontSize: "10px", marginTop: "10px", marginBottom: "10px"}}> 
                    
                    <table key={this.props.name+"myPopover1"} className="table-responsive table-striped table-hover table-condensed col-xs-10 col-md-10" style={SPANSTYLE}>
                        <thead>
                            <tr>{headers.map((e) => (<th key={this.props.name+e}>{e}</th>))}</tr>
                        </thead> 
                        <tbody style={TS}>
                        { valueList.sort(strCmp1).map((l) => (<tr onClick={(e) => me.selected(l,e)} key={this.props.name+"L"+hash(l)}><td onClick={(e) => me.selected(l,e)}>{l}</td></tr>) ) }
                        </tbody>
                    </table>
                   {PADDING}
                </Popover>
                 
            );
        
  },

  render() {
    var {mask, size, placeholder, ...props} = this.props;
    const inpProps = except(this.props, ['popover', 'mask', 'selection']);
    //console.log("PROPS:", inpProps);
    let OK;
    var pat = this.state.mask.pattern;
    var patternLength = pat.length;
    //console.log(`about to render name:'${this.props.name}' - ${this.state.mask.isDone()}`);
    let myPopover = this.props.popover ? this._createPopover(this._getMaskList(this.props.showAll !== 'no'),['Possible Values'],undefined,placeholder): (<span/>);
      //console.log("about to render - " + this.state.mask.isDone());
    let ok = this.state.mask.isDone();
    if(ok) OK = (mapImg[this.state.mask.isDone()]); //<span className="input-group-addon">.00</span>;  //
    
    const warningStyle = {marginBotton: "0px", fontSize: "70%", color: 'red', fontStyle: 'italic'};
    let selDisplay = "";
    var  inputField = (
                  <div  style={{marginBotton: "0px", paddingLeft: "100px"}}>
                    <div style={warningStyle} >
                        {ok} &nbsp;
                    </div>
                    <RxStatus mask={this.state.mask} />
                    <div className={ "form-group has-feedback" + OK[1]}>
                    <OverlayTrigger trigger="focus" style={{marginBotton: "0px"}} ref="mypop" placement="bottom" overlay={myPopover}>
                        
                        <input {...inpProps}
                          className="form-control"
                          ref={r => this.input = r }
                          maxLength={patternLength}
                          onChange={this._onChange}
                          onKeyDown={this._onKeyDown}
                          onKeyPress={this._onKeyPress}
                          onPaste={this._onPaste}
                          placeholder={placeholder || this.state.mask.emptyValue}
                          size={size || patternLength}
                          value={this._getDisplayValue()}
                          style={{padding: "3px 0px 3px 0px"}}
                        />
                    </OverlayTrigger>
                    {OK[0]}</div>
                  </div>

              );
    return    inputField;
  }
});
module.exports = RxInput;