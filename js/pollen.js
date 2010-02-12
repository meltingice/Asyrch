/**   
*   PollenJS/Pollen.JS 2009 Rick Waldron
*   http://github.com/rwldrn
*   http://pollenjs.com
*   MIT License
*   version: '0.1.26'
*
*   JSON2 2009 Doug Crockford
*   http://json.org
*   Public Domain.
*/
//  https://developer.mozilla.org/En/Core_JavaScript_1.5_Reference/Objects/Array/ForEach
if ( !Array.prototype.forEach ) {
  Array.prototype.forEach = function (fn) {
    var len = this.length >>> 0;
    if (typeof fn != "function")  {
      throw new TypeError();
    }

    var thisp = arguments[1];
    for (var i = 0; i < len; i++) {
      if (i in this) {
        fn.call(thisp, this[i], i, this);
      }
    }
  };
}

//  PollenJS Factory
var pollen = function() {};


(function () {
  

  pollen.prototype = {
    
    version: '0.1.31',
    
    /**
      Function Spore
    */
    func: {
      emptyFn:  function  ( ) { },
      returnFn: function  (x) { return x; },
      bindFn:    function  ( fn, scope ) {
        if ( scope ) {
          if ( typeof fn === "string" ) {
            fn = scope[ fn ];
          }

          if ( fn ) {
            return function() {
              return fn.apply( scope, arguments );
            };
          }
        }
      },      
    }, 
    /**
      Eval Spore
    */  
    evaluate:     {
      //http://stackoverflow.com/questions/1173549/how-to-determine-if-an-object-is-an-object-literal-in-javascript
      isObjLiteral: function ( arg ) {
        var _orig  = Object.getPrototypeOf(arg), 
            _test  = arg;

        return (  typeof arg != 'object' || arg === null ?
                    false :  
                    (
                      (function () {
                        while (!false) {
                          if (  Object.getPrototypeOf( _test = Object.getPrototypeOf(_test)  ) === null) {
                            break;
                          }      
                        }
                        return _orig === _test;
                      })()
                    )
                );
      },
      isArr:        function ( arg ) {
        return arg !== null && typeof arg == 'object' &&
                  'splice' in arg && 'join' in arg;
      },
      isRegExp:       function ( arg )  {
        return new RegExp(arg).test(null);
      },  
      isObj:        function ( arg ) {
        return arg !== null && typeof arg == 'object' && 
                  !this.isArr(arg);
      },      
      isFn:         function ( arg ) {
        return typeof arg == 'function';
      },
      isStr:        function ( arg ) {
        return typeof arg == 'string';
      },
      isNum:        function ( arg ) {
        return typeof arg == 'number';
      },
      isJson:       function ( arg ) {
        var jsonExp = new RegExp('^("(\\\\.|[^"\\\\\\n\\r])*?"|[,:{}\\[\\]0-9.\\-+Eaeflnr-u \\n\\r\\t])+?$');
        return jsonExp.test(arg) ? true : false;        
      },
      isUndef:      function ( arg ) {
        return typeof arg === undefined;
      },
      isDef:        function ( arg ) {
        return typeof arg !== undefined;
      },  
      isNull:       function ( arg ) {
        return arg === null;
      },
      typeof:       function ( arg ) {
        //  NEW.
        // add support for the above evaluators;
        return  typeof arg;
      }
    },
    /**
      String Spore
    */  
    string: {
      trim:           function(str) {
        return (str || '').replace( /^\s+|\s+$/g, '');
      }
    },
    /**
      Array Spore
    */
    array: {
      each:           function(obj, fn) {
        
        //  THIS WHOLE METHOD NEEDS TO BE UPDATE TO USE forEach()
        var i = 0, _len = obj.length;
        
        if ( pollen.evaluate.isArr(obj) ) {
          for ( ; i < _len; i++) {
            fn.call(obj, obj[i], i); 
          }
        }

        if ( pollen.evaluate.isObj(obj) ) {
          for ( var _member in obj ) {
            if ( obj[_member] !== undefined ) {
              fn.call(obj[_member], obj[_member], i++);
            }            
          }
        }
      },
      toArray:     function(arg) {
        if (!arg)         { return []; }
        if (pollen.isArr(arg)) { return arg; }
        if (pollen.isStr(arg)) { return arg.split(''); }

        var _len = arg.length || 0, _ret = [];

        while (_len--) {
          _ret[_len] = arg[_len];
        }

        return _ret;  
      },
      isInArray:     function( _a, arg ) {
        var i = 0, _len = _a.length;
        for ( ; i < _len; i++ ) {
          if ( _a.indexOf(arg) >= 0 ) {
            return true;
          }        
        }
        return false;
      },
      isAtIndex:  function( _a, i, arg ) {
        if ( _a[i] == arg ) {
          return true;
        }        
        return false;
      }, 
      getIndex:     function(_a, arg) {
        var _index  = _a.indexOf(arg);
        return ( _index != -1 ? 
                      _index  :
                      false );
      },
      clone:        function(_a) {
        return [].concat(_a);
      },
      last:         function(_a) {
        return _a[_a.length - 1];
      },  
      unique:       function(_a) {
        var i = 0, _len = _a.length, _ret  = [];

        for ( ; i < _len; i++ ) {
          if ( !pollen.isInArray(_a[i], _ret) ) {
            _ret.push(_a[i]);
          }          
        }        
        return _ret;
      },
      merge:        function( _a, _b ) {
        var i = 0, _len = _b.length;

        for ( ; i < _len ; i++ ) {
          _a.push(_b[i]);
        }
        return this.unique(_a);
      },
      filter:       function( _a, fn, _i ) {
        var i = 0, _len = _a.length, _ret  = [];

        for ( ; i < _len; i++ ) {
          if ( arguments[1] ) {
            if ( !_i != !fn(_a[i], i ) ) {
              _ret.push(_a[i]);
            }
          }
          else {
            if ( pollen.trim(_a[i]) !== '' || !pollen.isNull(_a[i]) ) {
              _ret.push(_a[i]);
            }
          }
        }
        return _ret;
      },
      map:          function( _a, fn ) {
        var _ret  = [], 
            i   = 0, _len = _a.length;

        for ( ; i < _len; i++ ) {
          var _new = fn( _a[ i ], i );
          if ( _new !== null ) {
            _ret[ _ret.length ] = _new;
          }
        }
        return _ret.concat.apply( [], _ret );
      }, 
      size:         function(_a) {
        return this.toArray(_a).length;
      },

      grep:         function( obj, expr, fn ) {
        var _ret  = []; 
        
        expr    = new RegExp(expr);
        fn      = pollen.evaluate.isDef(fn)     ? fn : pollen.func._emptyFn; 
        
        this.each(obj, function(_val, i) { 
          
          if ( typeof _val === 'number' ) {
            _val  = _val + '';
          }

          if ( _val.match(expr) ) {
            _ret.push(  fn ? 
                        fn.call(obj, _val, i) : 
                        _val );
          }        
        });

        return _ret;
      }
    },
    /**
      Object Spore
    */
    object: {
      //  Object
      keys:         function(_obj) {
        var _keys = [];
        for (var _prop in _obj) {
          if ( _obj[_prop] ) {
            _keys.push(_prop);
          }
        }        
        return _keys;
      },
      values:       function(_obj) {
        var _vals = [];
        for (var _prop in _obj)   {
          if ( _obj[_prop] ) {          
            _vals.push(_obj[_prop]);
          }
        }      
        return _vals;
      },
      extend:       function(_obj, _new) { 
        for (var _n in _new) { 
          if (_new.hasOwnProperty(_n)) { 
            var _nProp  = _new[_n],
                _oProp  = _obj[_n]; 

             _obj[_n]   = (_oProp && typeof _nProp == 'object' && typeof _oProp == 'object') ? 
                              pollen.array.merge(_oProp, _nProp) : 
                              _nProp; 
          } 
        } 
        return _obj; 
      }, 
      /**
        Reflection Spore
      */
      reflect: {
        getMembers:     function(_obj) {
          var _plen = 0, 
              _mlen = 0,
              _ret = { 
                properties: {},
                methods:    {}
              };
          for (var _prop in _obj) {
            if ( !pollen.evaluate.isFn(_obj[_prop]) ) {
              _ret.properties[_prop] = _obj[_prop];
              _plen++;

            } else {       
              _ret.methods[_prop] = _obj[_prop];
              _mlen++;
            }
          }

          _ret.properties.length  = _plen;
          _ret.methods.length     = _mlen;

          return _ret;  
        },
        getProperties:  function(_obj){
          return this.getMembers(_obj).properties;
        },
        getMethods:     function(_obj){
          return this.getMembers(_obj).methods;
        }
      },  
      //  shorthand to reflection
      getMembers:       function (_obj) { 
        return this.reflect.getMembers(_obj);
      }, 
      getProperties:    function (_obj) { 
        return this.reflect.getProperties(_obj);
      }, 
      getMethods:       function (_obj) { 
        return this.reflect.getMethods(_obj);
      }
    }, 
    /**
      JSON2 Spore
    */
    json: (function () {

      //  Minified JSON2 (Author: Doug Crockford [json2.js] )
      if(!this.JSON){JSON=function(){function f(n){return n<10?"0"+n:n}Date.prototype.toJSON=function(){return this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z"};var m={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"};function stringify(value,whitelist){var a,i,k,l,r=/["\\\x00-\x1f\x7f-\x9f]/g,v;switch(typeof value){case"string":return r.test(value)?'"'+value.replace(r,function(a){var c=m[a];if(c){return c}c=a.charCodeAt();return"\\u00"+Math.floor(c/16).toString(16)+(c%16).toString(16)})+'"':'"'+value+'"';case"number":return isFinite(value)?String(value):"null";case"boolean":case"null":return String(value);case"object":if(!value){return"null"}if(typeof value.toJSON==="function"){return stringify(value.toJSON())}a=[];if(typeof value.length==="number"&&!(value.propertyIsEnumerable("length"))){l=value.length;for(i=0;i<l;i+=1){a.push(stringify(value[i],whitelist)||"null")}return"["+a.join(",")+"]"}if(whitelist){l=whitelist.length;for(i=0;i<l;i+=1){k=whitelist[i];if(typeof k==="string"){v=stringify(value[k],whitelist);if(v){a.push(stringify(k)+":"+v)}}}}else{for(k in value){if(typeof k==="string"){v=stringify(value[k],whitelist);if(v){a.push(stringify(k)+":"+v)}}}}return"{"+a.join(",")+"}"}}return{stringify:stringify,parse:function(text,filter){var j;function walk(k,v){var i,n;if(v&&typeof v==="object"){for(i in v){if(Object.prototype.hasOwnProperty.apply(v,[i])){n=walk(i,v[i]);if(n!==undefined){v[i]=n}else{delete v[i]}}}}return filter(k,v)}if(/^[\],:{}\s]*$/.test(text.replace(/\\./g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,""))){j=eval("("+text+")");return typeof filter==="function"?walk("",j):j}throw new SyntaxError("parseJSON")}}}()};

      return {
        stringify:  JSON.stringify,
        parse:      JSON.parse,
        //  cleaner function names:
        decode:     JSON.stringify,
        encode:     JSON.parse,
      };     
    })(), 
    /**
      Ajax Spore
    */
    ajax: { 
      _ajax: {
        url:      '',
        data:     '',
        success:  function () {}, //$.fn,//  
        type:     'GET',
        sync:     true,
        xhr:      function()  {
          return new XMLHttpRequest();
        }
      },
      getJSON:  function(_req) {
        _req.type = 'GET';
        this.ajax(_req, 'json');
      },
      get:      function(_req) { 
        _req.type = 'GET';
        this.ajax(_req);
      }, 
      post:     function(_req) { 
        _req.type = 'POST';
        this.ajax(_req);
      },
      confXhr: function(_cxhr, fn, _json) { 

        _cxhr.onreadystatechange = function() {
          var
          // _isJSON = new RegExp('^("(\\\\.|[^"\\\\\\n\\r])*?"|[,:{}\\[\\]0-9.\\-+Eaeflnr-u \\n\\r\\t])+?$'), 
              _xjson;
          
          if (_cxhr.readyState == 4) { 
              //_xjson  = _isJSON.test(_cxhr.responseText) ? $.json.parse(_cxhr.responseText) : null;
              _xjson  = pollen.evaluate.isJson(_cxhr.responseText) ? pollen.json.parse(_cxhr.responseText) : null;
              
              
              fn.call(_cxhr, _json ? _xjson : { 
                                  text: _cxhr.responseText, 
                                  xml:  _cxhr.responseXML,
                                  json: _xjson
                              }
              ); 
          } 
        }; 
      },       
      ajax:     function(_req) {
        var _options  = pollen.extend( this._ajax, _req),
            _json     = arguments[1] ? true : false, 
            _type     = _options.type.toLowerCase(),
            _xhr      = this._ajax.xhr();

        if (_xhr) {
          this.confXhr(_xhr, _options.success, _json); 
          _xhr.open(_options.type, _options.url, _options.sync); 
          _xhr.setRequestHeader('X-Requested-With', 'Worker-XMLHttpRequest'); 

          if ( _type == 'post' ) {
            _xhr.setRequestHeader('Content-type',    'application/x-www-form-urlencoded'); 
            _xhr.setRequestHeader('Content-length',   _options.data.length); 
            _xhr.setRequestHeader('Connection',      'close'); 
          }
          _xhr.send(  _type == 'post' ? _options.data : '' ); 
        } 
      }
    }, 
    
    /*    
    stack:  {
      
      queue:  [],
      quid:   0,
      
      push: function (fn) {
        return pollen.stack.queue.push(fn);
      },
      exec: function () {
        var _len  = pollen.stack.queue.length;
        
        for ( var i = 0; i < _len; i++ ) {
          // unfinished.
        }
      }
    },
    */
    
    worker: {
      
      receive:   function (fn) {
        
        return addEventListener('message', function (evtMessage) {
          
          var _data = evtMessage.data;
          
          //  WebKit .data fix
          if ( pollen.evaluate.isJson(_data) ) {
            _data = pollen.json.parse(_data);
          }
          
          return fn.call(evtMessage, _data);
          
        }, false);      
      },
      reply:   function (arg) {
        postMessage(arg);  
      },
      send:   function (arg) {
        postMessage(arg);  
      }      
      
    }
  };
  
  //  Expose Pollen to the worker scope
  pollen = $ = new pollen();
  
  
  //  
  var spores  = ('string evaluate reflection array func object json worker').split(' ');    
  
  
  //  Copy specific module methods back to $ for shorthand syntax
  $.array.each(spores, function (_obj) {
    for ( var _method in $[_obj] ) {
      //if ( typeof $[_obj][_method] == 'function' ) {
      if ( $.evaluate.isFn($[_obj][_method]) ) {
        $[_method]  = $[_obj][_method];
      }
    }
  });
  
}());
//  END.