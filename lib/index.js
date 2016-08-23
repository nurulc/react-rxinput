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

'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _except = require('except');

var _except2 = _interopRequireDefault(_except);

var _reactBootstrap = require('react-bootstrap');

var _reactLibReactInputSelection = require('react/lib/ReactInputSelection');

var RX = require("incr-regex-package");

var KEYCODE_Z = 90;
var KEYCODE_Y = 89;

function isUndo(e) {
  return (e.ctrlKey || e.metaKey) && e.keyCode === (e.shiftKey ? KEYCODE_Y : KEYCODE_Z);
}

function isRedo(e) {
  return (e.ctrlKey || e.metaKey) && e.keyCode === (e.shiftKey ? KEYCODE_Z : KEYCODE_Y);
}

function supportArrowNavigation(mask) {
  return RX.contract.isFunc(mask.arrowAction);
}

function asStr(anObj) {
  return JSON.stringify(anObj);
}

function eqSel(sel1, sel2) {
  if (sel1 === sel2) return true;
  if (sel1 === undefined || sel2 === undefined) return false;
  return sel1.start === sel2.start && sel1.end === sel2.end;
}

function selAt(sel, x) {
  if (!sel && x === 0) return true;
  return sel.start === x && (sel.end === undefined || sel.end === x);
}

function strCmp1(a, b) {
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

var mapImg = {
  "DONE": [_react2['default'].createElement('span', { className: 'glyphicon glyphicon-ok form-control-feedback' }), ""],
  "MORE": [_react2['default'].createElement('span', { className: 'glyphicon glyphicon-arrow-right form-control-feedback' }), " has-warning"],
  "OK": [_react2['default'].createElement('span', { className: 'glyphicon glyphicon-option-horizontal form-control-feedback' }), ""]
};

//const LOG = (a, msg='') =>  { console.log(msg+": "+ a); return a; }
var LOG = function LOG(x) {
  return x;
};
var RxStatus = _react2['default'].createClass({
  displayName: 'RxStatus',

  propTypes: {
    mask: _react2['default'].PropTypes.object.isRequired
  },
  render: function render() {
    function printElem(_ref) {
      var _ref2 = _slicedToArray(_ref, 2);

      var code = _ref2[0];
      var typ = _ref2[1];

      if (typ === undefined) return code;
      return _react2['default'].createElement(
        'b',
        null,
        code
      );
    }
    var t = this.props.mask.pattern.getInputTracker() || [];
    return _react2['default'].createElement(
      'div',
      null,
      t.map(printElem)
    );
  }
});

var RxInput = _react2['default'].createClass({
  displayName: 'RxInput',

  propTypes: {
    mask: _react2['default'].PropTypes.object.isRequired,
    name: _react2['default'].PropTypes.string.isRequired,
    popover: _react2['default'].PropTypes.string,
    selection: _react2['default'].PropTypes.object,
    value: _react2['default'].PropTypes.string
  },

  getDefaultProps: function getDefaultProps() {
    return {
      value: '',
      showAll: "yes"
    };
  },

  getInitialState: function getInitialState() {
    var options = {
      pattern: this.props.mask,
      value: this.props.value
    };
    return { focus: false,
      value: this.props.value,
      selection: this.props.selection,
      mask: new RX.RXInputMask(options)
    };
  },

  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    if (this.props.mask.toString() !== nextProps.mask.toString()) {
      //this.state.mask.setPattern(nextProps.mask, {value: this.state.mask.getRawValue()});
      this.state.mask.setPattern(nextProps.mask, { value: nextProps.value, selection: this.state.mask.selection });
      this.setState({ selection: this.state.selection, value: nextProps.value });
    } else if (this.props.value !== nextProps.value) {
      this.state.mask.setValue(nextProps.value);
    }
  },

  _updateMaskSelection: function _updateMaskSelection() {
    this.state.mask.selection = (0, _reactLibReactInputSelection.getSelection)(this.input);
  },

  _updateInputSelection: function _updateInputSelection() {
    if (!eqSel((0, _reactLibReactInputSelection.getSelection)(this.input), this.state.mask.selection)) (0, _reactLibReactInputSelection.setSelection)(this.input, this.state.mask.selection);
  },

  _onFocus: function _onFocus(e) {},

  _onBlurr: function _onBlurr() {},

  _onChange: function _onChange(e) {
    // console.log('onChange', asStr(getSelection(this.input)), e.target.value)
    var mask = this.state.mask;
    var maskValue = mask.getValue();
    if (e.target.value !== maskValue) {
      // Cut or delete operations will have shortened the value
      if (e.target.value.length < maskValue.length) {
        var sizeDiff = maskValue.length - e.target.value.length;
        this._updateMaskSelection();
        mask.selection.end = mask.selection.start + sizeDiff;
        mask.backspace();
        //console.log("Fix maskValue", maskValue, "diff:", sizeDiff, "target value: ", e.target.value);
      }
      var value = this._getDisplayValue();
      e.target.value = value;
      if (value) {
        this._updateInputSelection();
      }
    }
    this.setState({ selection: this.mask.selection });
    if (this.props.onChange) {
      var opt = { target: { value: this.getValue() } };
      this.props.onChange(opt);
    }
    // console.log("on change", e)
  },

  _onKeyDown: function _onKeyDown(e) {
    var _this = this;

    var mask = this.state.mask;
    var isKey = function isKey(keyV) {
      return function (e) {
        return e.key === keyV;
      };
    };

    var _C = function _C(test, action) {
      if (!test(e)) return false;
      e.preventDefault();
      _this._updateMaskSelection();
      if (action()) {
        var oldVal = e.target.value;
        var value = _this._getDisplayValue();
        e.target.value = value;
        //console.log(action+":getDisplayValue", value);
        if (value) {
          _this._updateInputSelection();
        }
        if (_this.props.onChange && oldVal != value) {
          var opt = { target: { value: mask._getValue() } };
          _this.props.onChange(opt);
          //console.log("on change", e)
        }
        // console.log("on change1", e)
      }
      _this.setState({ selection: mask.selection });
      return true;
    };
    //console.log('onKeyDown',mask, asStr(getSelection(this.input))+"/"+asStr(mask.selection), e.key, e.keyCode, e.target.value)
    if (_C(isUndo, function () {
      return mask.undo();
    }) || _C(isRedo, function () {
      return mask.redo();
    }) || _C(isKey("Backspace"), function () {
      return mask.backspace();
    }) || _C(isKey("Delete"), function () {
      return mask.del();
    })) return;

    if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey || e.key === 'Enter') {
      return;
    }
    if (e.key === 'ArrowLeft' || e.key == 'ArrowRight') {
      // Check if mask supports arrow support
      var sel = (0, _reactLibReactInputSelection.getSelection)(this.input);
      //mask.selection = sel;
      if (sel.start === sel.end && mask.left !== undefined) {
        e.preventDefault();
        if (e.key === 'ArrowLeft') mask.left(sel);else mask.right(sel);
        this._updateInputSelection();
        //this.refs.debug.props.forceUpdate();
      }

      //console.log("Arrow Action support:", supportArrowNavigation(mask), " value:",this._getDisplayValue(), " selection: ", asStr(getSelection(this.input)), asStr(mask.selection));
    }
  },

  _onKeyPress: function _onKeyPress(e) {
    var mask = this.state.mask;
    //console.log('onKeyPress', asStr(getSelection(this.input)),asStr(mask.selection), e.key, e.target.value)

    // Ignore modified key presses
    // Ignore enter key to allow form submission
    if (e.metaKey || e.altKey || e.ctrlKey || e.key === 'Enter') {
      return;
    }
    var selX = (0, _reactLibReactInputSelection.getSelection)(this.input);
    var oldMaskX = mask.getSelection();
    e.preventDefault();
    this._updateMaskSelection();

    if (insert(e.key)) {
      var oldVal = e.target.value;
      var value = mask.getValue();
      e.target.value = value;
      //console.log("keyPress:getDisplayValue", this._getDisplayValue(),  " selection: ", asStr(selX)+"/"+asStr(mask.selection)+"<"+asStr(oldMaskX));
      this._updateInputSelection();
      this.setState({ selection: mask.selection });
      if (this.props.onChange && oldVal != value) {
        var opt = { target: { value: mask._getValue() } };
        this.props.onChange(opt);
      }
      //console.log("on change", e)
    }

    function insert(ch) {
      if (mask.input(ch)) return true;
      if (ch !== ch.toUpperCase()) return mask.input(ch.toUpperCase());else if (ch != ch.toLowerCase()) return mask.input(ch.toLowerCase());
      return false;
    }
  },

  _onPaste: function _onPaste(e) {
    var mask = this.state.mask;
    //console.log('onPaste', asStr(getSelection(this.input)), e.clipboardData.getData('Text'), e.target.value)

    e.preventDefault();
    this._updateMaskSelection();
    // getData value needed for IE also works in FF & Chrome
    //console.log("paste: ", e.clipboardData.getData('Text'));
    if (mask.paste(e.clipboardData.getData('Text'))) {
      e.target.value = mask.getValue();
      //console.log("undo:getDisplayValue", this._getDisplayValue());
      // Timeout needed for IE
      setTimeout(this._updateInputSelection, 0);
      //this.props.onChange(e);
      this.setState({ selection: mask.selection });
    }
  },

  _getMaskList: function _getMaskList(flag) {
    var list = this.state.mask.minCharsList(!!flag);
    if (list && list.length < 20) return list;
    return this.state.mask.minCharsList();
  },

  _getDisplayValue: function _getDisplayValue() {
    var value = this.state.mask.getValue();
    return value === this.state.mask.emptyValue ? '' : value;
  },

  selected: function selected(str, e) {
    //console.log("Selected: "+str);
    if (!str.split('').find(function (c) {
      return RX.isMeta(c) ? c : undefined;
    })) {
      var mask = this.state.mask;
      mask.setValue(str);
      this.setState({ mask: mask });
      //console.log("Selected(done): "+str);
    }
  },

  _createPopover: function _createPopover(valueList, headers, maxWidth, placeholder) {
    var _this2 = this;

    var strip = function strip(s) {
      return LOG(s.replace(/\u0332/g, ""), "strip:");
    };
    maxWidth = Math.max(150, maxWidth || 12 * Math.max.apply(null, valueList.map(function (a) {
      return Math.min(25, strip(a).length);
    })));
    LOG(maxWidth, "MAX WIDTH:");
    var MAXWIDTH = maxWidth || 200;
    var SPANSTYLE = { width: MAXWIDTH - 50, maxWidth: MAXWIDTH - 50 };
    var TS = undefined,
        PADDING = undefined;
    if (!valueList || valueList.length <= 1) {
      if (!placeholder) return _react2['default'].createElement('div', null);
      valueList = [placeholder];
    }
    if (valueList.length > 20) {
      TS = { height: "400px", display: "block", overflow: "auto" };
      PADDING = _react2['default'].createElement(
        'div',
        null,
        '             '
      );
    }
    function hash(str) {
      var hashVal = 5381,
          i = str.length;

      while (i) hashVal = hashVal * 33 ^ str.charCodeAt(--i);
      return (hashVal >>> 0) + 12;
    }
    var me = this;
    return _react2['default'].createElement(
      _reactBootstrap.Popover,
      { id: this.props.name + "myPopover", className: 'col-xs-10 col-md-10', style: { width: MAXWIDTH, maxWidth: MAXWIDTH, fontSize: "10px", marginTop: "10px", marginBottom: "10px" } },
      _react2['default'].createElement(
        'table',
        { key: this.props.name + "myPopover1", className: 'table-responsive table-striped table-hover table-condensed col-xs-10 col-md-10', style: SPANSTYLE },
        _react2['default'].createElement(
          'thead',
          null,
          _react2['default'].createElement(
            'tr',
            null,
            headers.map(function (e) {
              return _react2['default'].createElement(
                'th',
                { key: _this2.props.name + e },
                e
              );
            })
          )
        ),
        _react2['default'].createElement(
          'tbody',
          { style: TS },
          valueList.sort(strCmp1).map(function (l) {
            return _react2['default'].createElement(
              'tr',
              { onClick: function (e) {
                  return me.selected(l, e);
                }, key: _this2.props.name + "L" + hash(l) },
              _react2['default'].createElement(
                'td',
                { onClick: function (e) {
                    return me.selected(l, e);
                  } },
                l
              )
            );
          })
        )
      ),
      PADDING
    );
  },

  render: function render() {
    var _this3 = this;

    var _props = this.props;
    var mask = _props.mask;
    var size = _props.size;
    var placeholder = _props.placeholder;

    var props = _objectWithoutProperties(_props, ['mask', 'size', 'placeholder']);

    var inpProps = (0, _except2['default'])(this.props, ['popover', 'mask', 'selection']);
    //console.log("PROPS:", inpProps);
    var OK = undefined;
    var pat = this.state.mask.pattern;
    var patternLength = pat.length;
    //console.log(`about to render name:'${this.props.name}' - ${this.state.mask.isDone()}`);
    var myPopover = this.props.popover ? this._createPopover(this._getMaskList(this.props.showAll !== 'no'), ['Possible Values'], undefined, placeholder) : _react2['default'].createElement('span', null);
    //console.log("about to render - " + this.state.mask.isDone());
    var ok = this.state.mask.isDone();
    if (ok) OK = mapImg[this.state.mask.isDone()]; //<span className="input-group-addon">.00</span>;  //

    var warningStyle = { marginBotton: "0px", fontSize: "70%", color: 'red', fontStyle: 'italic' };
    var selDisplay = "";
    var inputField = _react2['default'].createElement(
      'div',
      { style: { marginBotton: "0px", paddingLeft: "100px" } },
      _react2['default'].createElement(
        'div',
        { style: warningStyle },
        ok,
        '  '
      ),
      _react2['default'].createElement(RxStatus, { mask: this.state.mask }),
      _react2['default'].createElement(
        'div',
        { className: "form-group has-feedback" + OK[1] },
        _react2['default'].createElement(
          _reactBootstrap.OverlayTrigger,
          { trigger: 'focus', style: { marginBotton: "0px" }, ref: 'mypop', placement: 'bottom', overlay: myPopover },
          _react2['default'].createElement('input', _extends({}, inpProps, {
            className: 'form-control',
            ref: function (r) {
              return _this3.input = r;
            },
            maxLength: patternLength,
            onChange: this._onChange,
            onKeyDown: this._onKeyDown,
            onKeyPress: this._onKeyPress,
            onPaste: this._onPaste,
            placeholder: placeholder || this.state.mask.emptyValue,
            size: size || patternLength,
            value: this._getDisplayValue(),
            style: { padding: "3px 0px 3px 0px" }
          }))
        ),
        OK[0]
      )
    );
    return inputField;
  }
});
module.exports = RxInput;