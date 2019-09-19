//component.js
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactBootstrap = require('react-bootstrap');

var RX = require("incr-regex-package");
var convertMask = RX.convertMask;
var contract = RX.contract;
var RXInputMask = RX.RXInputMask;
var isMeta = RX.isMeta;

/** 
 * Copyright (c) 2016, Nurul Choudhury
 * 
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 * 
 */

//
// Modified from https://github.com/insin/react-maskedinput
//  This was originally written by insin - on GIT hub
//  The code worked fine for fixed formatted input mask, but is not so useful for
//  varible mask based on regular expression (RegExp)
//  That capability regires this implementation of Regexp, and provides incremental processing of regular expression
// Amost the entire original code has been replaces but the original interfaces remain
//

//const convertMask = convertMask;
var rxPlaceHolder = new RegExp(convertMask('[?*]'));
var KEYCODE_Z = 90;
var KEYCODE_Y = 89;

function except(object, list) {
	var result = {};
	var keys = list;

	for (var key in object) {
		if (keys.indexOf(key) === -1) {
			result[key] = object[key];
		}
	}

	return result;
}

function isUndo(e) {
	return (e.ctrlKey || e.metaKey) && e.keyCode === (e.shiftKey ? KEYCODE_Y : KEYCODE_Z);
}

function isRedo(e) {
	return (e.ctrlKey || e.metaKey) && e.keyCode === (e.shiftKey ? KEYCODE_Z : KEYCODE_Y);
}

function getSelection(el) {
	var start = undefined,
	    end = undefined,
	    rangeEl = undefined,
	    clone = undefined;

	if (el.selectionStart !== undefined) {
		start = el.selectionStart;
		end = el.selectionEnd;
	} else {
		try {
			el.focus();
			rangeEl = el.createTextRange();
			clone = rangeEl.duplicate();

			rangeEl.moveToBookmark(document.selection.createRange().getBookmark());
			clone.setEndPoint('EndToStart', rangeEl);

			start = clone.text.length;
			end = start + rangeEl.text.length;
		} catch (e) {/* not focused or not visible */}
	}

	return { start: start, end: end };
}

function setSelection(el, selection) {
	var rangeEl = undefined;

	try {
		if (el.selectionStart !== undefined) {
			el.focus();
			el.setSelectionRange(selection.start, selection.end);
		} else {
			el.focus();
			rangeEl = el.createTextRange();
			rangeEl.collapse(true);
			rangeEl.moveStart('character', selection.start);
			rangeEl.moveEnd('character', selection.end - selection.start);
			rangeEl.select();
		}
	} catch (e) {/* not focused or not visible */}
}

function supportArrowNavigation(mask) {
	return contract.isFunc(mask.arrowAction);
}

function getSelection(el) {
	var start = undefined,
	    end = undefined,
	    rangeEl = undefined,
	    clone = undefined;

	if (el.selectionStart !== undefined) {
		start = el.selectionStart;
		end = el.selectionEnd;
	} else {
		try {
			el.focus();
			rangeEl = el.createTextRange();
			clone = rangeEl.duplicate();

			rangeEl.moveToBookmark(document.selection.createRange().getBookmark());
			clone.setEndPoint('EndToStart', rangeEl);

			start = clone.text.length;
			end = start + rangeEl.text.length;
		} catch (e) {/* not focused or not visible */}
	}

	return { start: start, end: end };
}

function setSelection(el, selection) {
	var rangeEl = undefined;

	try {
		if (el.selectionStart !== undefined) {
			el.focus();
			el.setSelectionRange(selection.start, selection.end);
		} else {
			el.focus();
			rangeEl = el.createTextRange();
			rangeEl.collapse(true);
			rangeEl.moveStart('character', selection.start);
			rangeEl.moveEnd('character', selection.end - selection.start);
			rangeEl.select();
		}
	} catch (e) {/* not focused or not visible */}
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

var RxStatus = (function (_Component) {
	_inherits(RxStatus, _Component);

	function RxStatus() {
		_classCallCheck(this, RxStatus);

		_get(Object.getPrototypeOf(RxStatus.prototype), 'constructor', this).apply(this, arguments);
	}

	_createClass(RxStatus, [{
		key: 'render',
		value: function render() {
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
	}]);

	return RxStatus;
})(_react.Component);

var RxInput = (function (_Component2) {
	_inherits(RxInput, _Component2);

	function RxInput(props) {
		_classCallCheck(this, RxInput);

		_get(Object.getPrototypeOf(RxInput.prototype), 'constructor', this).call(this, props);
		this.state = this.getInitialState();
		this._onChange = this._onChange.bind(this);
		this._onKeyDown = this._onKeyDown.bind(this);
		this._onKeyPress = this._onKeyPress.bind(this);
		this._onPaste = this._onPaste.bind(this);
		this._onFocus = this._onFocus.bind(this);
		this._onBlur = this._onBlur.bind(this);
		this.input = null;
	}

	// propTypes: {
	//   mask: React.PropTypes.object.isRequired,
	//   name: React.PropTypes.string.isRequired,
	//   popover: React.PropTypes.string,
	//   selection: React.PropTypes.object,
	//   value: React.PropTypes.string,
	// },

	// get input() {
	// 	return this.myRef.current;
	// }

	_createClass(RxInput, [{
		key: 'getInitialState',
		value: function getInitialState() {
			var options = {
				pattern: this.props.mask || /.*/,
				value: this.props.value || ''
			};
			return {
				focus: false,
				value: this.props.value || '',
				selection: this.props.selection,
				mask: new RXInputMask(options)
			};
		}
	}, {
		key: 'componentWillReceiveProps',
		value: function componentWillReceiveProps(nextProps) {
			if (this.props.mask.toString() !== nextProps.mask.toString()) {
				//this.state.mask.setPattern(nextProps.mask, {value: this.state.mask.getRawValue()});
				this.state.mask.setPattern(nextProps.mask, { value: nextProps.value, selection: this.state.mask.selection });
				this.setState({ selection: this.state.selection, value: nextProps.value });
			} else if (this.props.value !== nextProps.value) {
				this.state.mask.setValue(nextProps.value);
			}
		}
	}, {
		key: '_updateMaskSelection',
		value: function _updateMaskSelection() {
			this.state.mask.selection = getSelection(this.input);
		}
	}, {
		key: '_updateInputSelection',
		value: function _updateInputSelection() {
			if (!eqSel(getSelection(this.input), this.state.mask.selection)) setSelection(this.input, this.state.mask.selection);
		}
	}, {
		key: '_onFocus',
		value: function _onFocus(e) {
			if (this.props.onFocus) this.props.onFocus(e);
		}
	}, {
		key: '_onBlur',
		value: function _onBlur(e) {
			this.fireChange(e);
		}
	}, {
		key: 'fireChange',
		value: function fireChange(e) {
			if (this.props.onChange) {
				var opt = { value: this.state.mask._getValue(), target: e.target, name: this.props.name, mask: this.state.mask };
				//this.props.onChange(opt);
				this.props.onChange({ target: opt });
			}
		}
	}, {
		key: '_onChange',
		value: function _onChange(e) {
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
			this.fireChange(e);
			// console.log("on change", e)
		}
	}, {
		key: '_onKeyDown',
		value: function _onKeyDown(e) {
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
						//let opt = {target: {value: mask._getValue()}};
						//this.props.onChange(opt);
						_this.fireChange(e);
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

			if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey || e.key === 'Enter' || e.key === 'Tab') {
				return;
			}
			if (e.key === 'ArrowLeft' || e.key == 'ArrowRight') {
				// Check if mask supports arrow support
				var sel = getSelection(this.input);
				//mask.selection = sel;
				if (sel.start === sel.end && mask.left !== undefined) {
					e.preventDefault();
					if (e.key === 'ArrowLeft') mask.left(sel);else mask.right(sel);
					this._updateInputSelection();
					//this.refs.debug.props.forceUpdate();
				}

				//console.log("Arrow Action support:", supportArrowNavigation(mask), " value:",this._getDisplayValue(), " selection: ", asStr(getSelection(this.input)), asStr(mask.selection));
			}
		}
	}, {
		key: '_onKeyPress',
		value: function _onKeyPress(e) {
			var mask = this.state.mask;
			//console.log('onKeyPress', asStr(getSelection(this.input)),asStr(mask.selection), e.key, e.target.value)

			// Ignore modified key presses
			// Ignore enter key to allow form submission
			if (e.metaKey || e.altKey || e.ctrlKey || e.key === 'Enter') {
				return;
			}
			var selX = getSelection(this.input);
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
		}
	}, {
		key: '_onPaste',
		value: function _onPaste(e) {
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
		}
	}, {
		key: '_getMaskList',
		value: function _getMaskList(flag) {
			var list = this.state.mask.minCharsList(!!flag);
			if (list && list.length < 20) return list;
			return this.state.mask.minCharsList();
		}
	}, {
		key: '_getDisplayValue',
		value: function _getDisplayValue() {
			var value = this.state.mask.getValue();
			return value === this.state.mask.emptyValue ? '' : value;
		}
	}, {
		key: 'selected',
		value: function selected(str, e) {
			//console.log("Selected: "+str);
			if (!str.split('').find(function (c) {
				return isMeta(c) ? c : undefined;
			})) {
				var mask = this.state.mask;
				mask.setValue(str);
				this.setState({ mask: mask });
				//console.log("Selected(done): "+str);
			}
		}
	}, {
		key: '_createPopover',
		value: function _createPopover(valueList, headers, maxWidth, placeholder) {
			var _this2 = this;

			var strip = function strip(s) {
				return LOG(s.replace(/\u0332/g, ""), "strip:");
			};
			maxWidth = Math.max(200, maxWidth || 12 * Math.max.apply(null, valueList.map(function (a) {
				return Math.min(20, strip(a).length);
			})));
			LOG(maxWidth, "MAX WIDTH:");
			var MAXWIDTH = maxWidth || 300;
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
			var val = this._getDisplayValue() || '';
			var ph = placeholder || this.state.mask.emptyValue;
			var popList = [val, ph].concat(valueList);
			var smallHeader = "";
			console.log(popList);
			if (popList.find(function (v) {
				return v.match(rxPlaceHolder);
			})) smallHeader = _react2['default'].createElement(
				'pre',
				{ className: 'text-muted small-text' },
				convertMask('? - optional,   * - zero or more')
			);
			return _react2['default'].createElement(
				_reactBootstrap.Popover,
				{ id: this.props.name + "myPopover", className: 'col-xs-10 col-md-10', style: { width: MAXWIDTH, maxWidth: MAXWIDTH, fontSize: "10px", marginTop: "10px", marginBottom: "10px" } },
				smallHeader,
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
		}
	}, {
		key: 'render',
		value: function render() {
			var _this3 = this;

			var _props = this.props;
			var mask = _props.mask;
			var size = _props.size;
			var placeholder = _props.placeholder;

			var props = _objectWithoutProperties(_props, ['mask', 'size', 'placeholder']);

			var inpProps = except(this.props, ['popover', 'mask', 'selection', 'showAll']);
			//console.log("PROPS:", inpProps);
			var OK = undefined;
			var pat = this.state.mask.pattern;
			var patternLength = pat.length;
			//console.log(`about to render name:'${this.props.name}' - ${this.state.mask.isDone()}`);
			var myPopover = this.props.popover ? this._createPopover(this._getMaskList(this.props.showAll !== 'no'), ['Possible Values'], undefined, placeholder) : _react2['default'].createElement('span', null);
			//console.log("about to render - " + this.state.mask.isDone());
			var ok = this.state.mask.isDone();
			if (ok) OK = mapImg[this.state.mask.isDone()]; //<span className="input-group-addon">.00</span>;  //
			var setRef = function setRef(aDomElem) {
				_this3.input = aDomElem;
			};
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
				_react2['default'].createElement(
					'div',
					{ className: "form-group has-feedback" + OK[1] },
					_react2['default'].createElement(
						_reactBootstrap.OverlayTrigger,
						{ trigger: 'focus', style: { marginBotton: "0px" }, placement: 'bottom', overlay: myPopover },
						_react2['default'].createElement('input', _extends({}, inpProps, {
							className: 'form-control',
							ref: setRef,
							maxLength: patternLength,
							onChange: this._onChange,
							onKeyDown: this._onKeyDown,
							onKeyPress: this._onKeyPress,
							onPaste: this._onPaste,
							onFocus: this._onFocus,
							onBlur: this._onBlur,
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
	}]);

	return RxInput;
})(_react.Component);

exports.RxInput = RxInput;
/*<RxStatus mask={this.state.mask} />*/