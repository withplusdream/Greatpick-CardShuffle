mergeInto(LibraryManager.library, {
    InstallSocketIO: function () {
        (function webpackUniversalModuleDefinition(root, factory) {
            if (typeof exports === 'object' && typeof module === 'object')
                module.exports = factory();
            else if (typeof define === 'function' && define.amd)
                define([], factory);
            else if (typeof exports === 'object')
                exports['io'] = factory();
            else
                root['io'] = factory();
        }(this, function () {
            return function (modules) {
                var installedModules = {};
                function __webpack_require__(moduleId) {
                    if (installedModules[moduleId])
                        return installedModules[moduleId].exports;
                    var module = installedModules[moduleId] = {
                            exports: {},
                            id: moduleId,
                            loaded: false
                        };
                    modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
                    module.loaded = true;
                    return module.exports;
                }
                __webpack_require__.m = modules;
                __webpack_require__.c = installedModules;
                __webpack_require__.p = '';
                return __webpack_require__(0);
            }([
                function (module, exports, __webpack_require__) {
                    'use strict';
                    var _typeof = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol' ? function (obj) {
                            return typeof obj;
                        } : function (obj) {
                            return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj;
                        };
                    var url = __webpack_require__(1);
                    var parser = __webpack_require__(4);
                    var Manager = __webpack_require__(9);
                    var debug = __webpack_require__(3)('socket.io-client');
                    module.exports = exports = lookup;
                    var cache = exports.managers = {};
                    function lookup(uri, opts) {
                        if ((typeof uri === 'undefined' ? 'undefined' : _typeof(uri)) === 'object') {
                            opts = uri;
                            uri = undefined;
                        }
                        opts = opts || {};
                        var parsed = url(uri);
                        var source = parsed.source;
                        var id = parsed.id;
                        var path = parsed.path;
                        var sameNamespace = cache[id] && path in cache[id].nsps;
                        var newConnection = opts.forceNew || opts['force new connection'] || false === opts.multiplex || sameNamespace;
                        var io;
                        if (newConnection) {
                            io = Manager(source, opts);
                        } else {
                            if (!cache[id]) {
                                cache[id] = Manager(source, opts);
                            }
                            io = cache[id];
                        }
                        if (parsed.query && !opts.query) {
                            opts.query = parsed.query;
                        }
                        return io.socket(parsed.path, opts);
                    }
                    exports.protocol = parser.protocol;
                    exports.connect = lookup;
                    exports.Manager = __webpack_require__(9);
                    exports.Socket = __webpack_require__(33);
                },
                function (module, exports, __webpack_require__) {
                    'use strict';
                    var parseuri = __webpack_require__(2);
                    var debug = __webpack_require__(3)('socket.io-client:url');
                    module.exports = url;
                    function url(uri, loc) {
                        var obj = uri;
                        loc = loc || typeof location !== 'undefined' && location;
                        if (null == uri)
                            uri = loc.protocol + '//' + loc.host;
                        if ('string' === typeof uri) {
                            if ('/' === uri.charAt(0)) {
                                if ('/' === uri.charAt(1)) {
                                    uri = loc.protocol + uri;
                                } else {
                                    uri = loc.host + uri;
                                }
                            }
                            if (!/^(https?|wss?):\/\//.test(uri)) {
                                if ('undefined' !== typeof loc) {
                                    uri = loc.protocol + '//' + uri;
                                } else {
                                    uri = 'https://' + uri;
                                }
                            }
                            obj = parseuri(uri);
                        }
                        if (!obj.port) {
                            if (/^(http|ws)$/.test(obj.protocol)) {
                                obj.port = '80';
                            } else if (/^(http|ws)s$/.test(obj.protocol)) {
                                obj.port = '443';
                            }
                        }
                        obj.path = obj.path || '/';
                        var ipv6 = obj.host.indexOf(':') !== -1;
                        var host = ipv6 ? '[' + obj.host + ']' : obj.host;
                        obj.id = obj.protocol + '://' + host + ':' + obj.port;
                        obj.href = obj.protocol + '://' + host + (loc && loc.port === obj.port ? '' : ':' + obj.port);
                        return obj;
                    }
                },
                function (module, exports) {
                    var re = /^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;
                    var parts = [
                            'source',
                            'protocol',
                            'authority',
                            'userInfo',
                            'user',
                            'password',
                            'host',
                            'port',
                            'relative',
                            'path',
                            'directory',
                            'file',
                            'query',
                            'anchor'
                        ];
                    module.exports = function parseuri(str) {
                        var src = str, b = str.indexOf('['), e = str.indexOf(']');
                        if (b != -1 && e != -1) {
                            str = str.substring(0, b) + str.substring(b, e).replace(/:/g, ';') + str.substring(e, str.length);
                        }
                        var m = re.exec(str || ''), uri = {}, i = 14;
                        while (i--) {
                            uri[parts[i]] = m[i] || '';
                        }
                        if (b != -1 && e != -1) {
                            uri.source = src;
                            uri.host = uri.host.substring(1, uri.host.length - 1).replace(/;/g, ':');
                            uri.authority = uri.authority.replace('[', '').replace(']', '').replace(/;/g, ':');
                            uri.ipv6uri = true;
                        }
                        return uri;
                    };
                },
                function (module, exports) {
                    'use strict';
                    module.exports = function () {
                        return function () {
                        };
                    };
                },
                function (module, exports, __webpack_require__) {
                    var debug = __webpack_require__(3)('socket.io-parser');
                    var Emitter = __webpack_require__(5);
                    var binary = __webpack_require__(6);
                    var isArray = __webpack_require__(7);
                    var isBuf = __webpack_require__(8);
                    exports.protocol = 4;
                    exports.types = [
                        'CONNECT',
                        'DISCONNECT',
                        'EVENT',
                        'ACK',
                        'ERROR',
                        'BINARY_EVENT',
                        'BINARY_ACK'
                    ];
                    exports.CONNECT = 0;
                    exports.DISCONNECT = 1;
                    exports.EVENT = 2;
                    exports.ACK = 3;
                    exports.ERROR = 4;
                    exports.BINARY_EVENT = 5;
                    exports.BINARY_ACK = 6;
                    exports.Encoder = Encoder;
                    exports.Decoder = Decoder;
                    function Encoder() {
                    }
                    var ERROR_PACKET = exports.ERROR + '"encode error"';
                    Encoder.prototype.encode = function (obj, callback) {
                        if (exports.BINARY_EVENT === obj.type || exports.BINARY_ACK === obj.type) {
                            encodeAsBinary(obj, callback);
                        } else {
                            var encoding = encodeAsString(obj);
                            callback([encoding]);
                        }
                    };
                    function encodeAsString(obj) {
                        var str = '' + obj.type;
                        if (exports.BINARY_EVENT === obj.type || exports.BINARY_ACK === obj.type) {
                            str += obj.attachments + '-';
                        }
                        if (obj.nsp && '/' !== obj.nsp) {
                            str += obj.nsp + ',';
                        }
                        if (null != obj.id) {
                            str += obj.id;
                        }
                        if (null != obj.data) {
                            var payload = tryStringify(obj.data);
                            if (payload !== false) {
                                str += payload;
                            } else {
                                return ERROR_PACKET;
                            }
                        }
                        return str;
                    }
                    function tryStringify(str) {
                        try {
                            return JSON.stringify(str);
                        } catch (e) {
                            return false;
                        }
                    }
                    function encodeAsBinary(obj, callback) {
                        function writeEncoding(bloblessData) {
                            var deconstruction = binary.deconstructPacket(bloblessData);
                            var pack = encodeAsString(deconstruction.packet);
                            var buffers = deconstruction.buffers;
                            buffers.unshift(pack);
                            callback(buffers);
                        }
                        binary.removeBlobs(obj, writeEncoding);
                    }
                    function Decoder() {
                        this.reconstructor = null;
                    }
                    Emitter(Decoder.prototype);
                    Decoder.prototype.add = function (obj) {
                        var packet;
                        if (typeof obj === 'string') {
                            packet = decodeString(obj);
                            if (exports.BINARY_EVENT === packet.type || exports.BINARY_ACK === packet.type) {
                                this.reconstructor = new BinaryReconstructor(packet);
                                if (this.reconstructor.reconPack.attachments === 0) {
                                    this.emit('decoded', packet);
                                }
                            } else {
                                this.emit('decoded', packet);
                            }
                        } else if (isBuf(obj) || obj.base64) {
                            if (!this.reconstructor) {
                                throw new Error('got binary data when not reconstructing a packet');
                            } else {
                                packet = this.reconstructor.takeBinaryData(obj);
                                if (packet) {
                                    this.reconstructor = null;
                                    this.emit('decoded', packet);
                                }
                            }
                        } else {
                            throw new Error('Unknown type: ' + obj);
                        }
                    };
                    function decodeString(str) {
                        var i = 0;
                        var p = { type: Number(str.charAt(0)) };
                        if (null == exports.types[p.type]) {
                            return error('unknown packet type ' + p.type);
                        }
                        if (exports.BINARY_EVENT === p.type || exports.BINARY_ACK === p.type) {
                            var buf = '';
                            while (str.charAt(++i) !== '-') {
                                buf += str.charAt(i);
                                if (i == str.length)
                                    break;
                            }
                            if (buf != Number(buf) || str.charAt(i) !== '-') {
                                throw new Error('Illegal attachments');
                            }
                            p.attachments = Number(buf);
                        }
                        if ('/' === str.charAt(i + 1)) {
                            p.nsp = '';
                            while (++i) {
                                var c = str.charAt(i);
                                if (',' === c)
                                    break;
                                p.nsp += c;
                                if (i === str.length)
                                    break;
                            }
                        } else {
                            p.nsp = '/';
                        }
                        var next = str.charAt(i + 1);
                        if ('' !== next && Number(next) == next) {
                            p.id = '';
                            while (++i) {
                                var c = str.charAt(i);
                                if (null == c || Number(c) != c) {
                                    --i;
                                    break;
                                }
                                p.id += str.charAt(i);
                                if (i === str.length)
                                    break;
                            }
                            p.id = Number(p.id);
                        }
                        if (str.charAt(++i)) {
                            var payload = tryParse(str.substr(i));
                            var isPayloadValid = payload !== false && (p.type === exports.ERROR || isArray(payload));
                            if (isPayloadValid) {
                                p.data = payload;
                            } else {
                                return error('invalid payload');
                            }
                        }
                        return p;
                    }
                    function tryParse(str) {
                        try {
                            return JSON.parse(str);
                        } catch (e) {
                            return false;
                        }
                    }
                    Decoder.prototype.destroy = function () {
                        if (this.reconstructor) {
                            this.reconstructor.finishedReconstruction();
                        }
                    };
                    function BinaryReconstructor(packet) {
                        this.reconPack = packet;
                        this.buffers = [];
                    }
                    BinaryReconstructor.prototype.takeBinaryData = function (binData) {
                        this.buffers.push(binData);
                        if (this.buffers.length === this.reconPack.attachments) {
                            var packet = binary.reconstructPacket(this.reconPack, this.buffers);
                            this.finishedReconstruction();
                            return packet;
                        }
                        return null;
                    };
                    BinaryReconstructor.prototype.finishedReconstruction = function () {
                        this.reconPack = null;
                        this.buffers = [];
                    };
                    function error(msg) {
                        return {
                            type: exports.ERROR,
                            data: 'parser error: ' + msg
                        };
                    }
                },
                function (module, exports, __webpack_require__) {
                    if (true) {
                        module.exports = Emitter;
                    }
                    function Emitter(obj) {
                        if (obj)
                            return mixin(obj);
                    }
                    ;
                    function mixin(obj) {
                        for (var key in Emitter.prototype) {
                            obj[key] = Emitter.prototype[key];
                        }
                        return obj;
                    }
                    Emitter.prototype.on = Emitter.prototype.addEventListener = function (event, fn) {
                        this._callbacks = this._callbacks || {};
                        (this._callbacks['$' + event] = this._callbacks['$' + event] || []).push(fn);
                        return this;
                    };
                    Emitter.prototype.once = function (event, fn) {
                        function on() {
                            this.off(event, on);
                            fn.apply(this, arguments);
                        }
                        on.fn = fn;
                        this.on(event, on);
                        return this;
                    };
                    Emitter.prototype.off = Emitter.prototype.removeListener = Emitter.prototype.removeAllListeners = Emitter.prototype.removeEventListener = function (event, fn) {
                        this._callbacks = this._callbacks || {};
                        if (0 == arguments.length) {
                            this._callbacks = {};
                            return this;
                        }
                        var callbacks = this._callbacks['$' + event];
                        if (!callbacks)
                            return this;
                        if (1 == arguments.length) {
                            delete this._callbacks['$' + event];
                            return this;
                        }
                        var cb;
                        for (var i = 0; i < callbacks.length; i++) {
                            cb = callbacks[i];
                            if (cb === fn || cb.fn === fn) {
                                callbacks.splice(i, 1);
                                break;
                            }
                        }
                        return this;
                    };
                    Emitter.prototype.emit = function (event) {
                        this._callbacks = this._callbacks || {};
                        var args = [].slice.call(arguments, 1), callbacks = this._callbacks['$' + event];
                        if (callbacks) {
                            callbacks = callbacks.slice(0);
                            for (var i = 0, len = callbacks.length; i < len; ++i) {
                                callbacks[i].apply(this, args);
                            }
                        }
                        return this;
                    };
                    Emitter.prototype.listeners = function (event) {
                        this._callbacks = this._callbacks || {};
                        return this._callbacks['$' + event] || [];
                    };
                    Emitter.prototype.hasListeners = function (event) {
                        return !!this.listeners(event).length;
                    };
                },
                function (module, exports, __webpack_require__) {
                    var isArray = __webpack_require__(7);
                    var isBuf = __webpack_require__(8);
                    var toString = Object.prototype.toString;
                    var withNativeBlob = typeof Blob === 'function' || typeof Blob !== 'undefined' && toString.call(Blob) === '[object BlobConstructor]';
                    var withNativeFile = typeof File === 'function' || typeof File !== 'undefined' && toString.call(File) === '[object FileConstructor]';
                    exports.deconstructPacket = function (packet) {
                        var buffers = [];
                        var packetData = packet.data;
                        var pack = packet;
                        pack.data = _deconstructPacket(packetData, buffers);
                        pack.attachments = buffers.length;
                        return {
                            packet: pack,
                            buffers: buffers
                        };
                    };
                    function _deconstructPacket(data, buffers) {
                        if (!data)
                            return data;
                        if (isBuf(data)) {
                            var placeholder = {
                                    _placeholder: true,
                                    num: buffers.length
                                };
                            buffers.push(data);
                            return placeholder;
                        } else if (isArray(data)) {
                            var newData = new Array(data.length);
                            for (var i = 0; i < data.length; i++) {
                                newData[i] = _deconstructPacket(data[i], buffers);
                            }
                            return newData;
                        } else if (typeof data === 'object' && !(data instanceof Date)) {
                            var newData = {};
                            for (var key in data) {
                                newData[key] = _deconstructPacket(data[key], buffers);
                            }
                            return newData;
                        }
                        return data;
                    }
                    exports.reconstructPacket = function (packet, buffers) {
                        packet.data = _reconstructPacket(packet.data, buffers);
                        packet.attachments = undefined;
                        return packet;
                    };
                    function _reconstructPacket(data, buffers) {
                        if (!data)
                            return data;
                        if (data && data._placeholder) {
                            return buffers[data.num];
                        } else if (isArray(data)) {
                            for (var i = 0; i < data.length; i++) {
                                data[i] = _reconstructPacket(data[i], buffers);
                            }
                        } else if (typeof data === 'object') {
                            for (var key in data) {
                                data[key] = _reconstructPacket(data[key], buffers);
                            }
                        }
                        return data;
                    }
                    exports.removeBlobs = function (data, callback) {
                        function _removeBlobs(obj, curKey, containingObject) {
                            if (!obj)
                                return obj;
                            if (withNativeBlob && obj instanceof Blob || withNativeFile && obj instanceof File) {
                                pendingBlobs++;
                                var fileReader = new FileReader();
                                fileReader.onload = function () {
                                    if (containingObject) {
                                        containingObject[curKey] = this.result;
                                    } else {
                                        bloblessData = this.result;
                                    }
                                    if (!--pendingBlobs) {
                                        callback(bloblessData);
                                    }
                                };
                                fileReader.readAsArrayBuffer(obj);
                            } else if (isArray(obj)) {
                                for (var i = 0; i < obj.length; i++) {
                                    _removeBlobs(obj[i], i, obj);
                                }
                            } else if (typeof obj === 'object' && !isBuf(obj)) {
                                for (var key in obj) {
                                    _removeBlobs(obj[key], key, obj);
                                }
                            }
                        }
                        var pendingBlobs = 0;
                        var bloblessData = data;
                        _removeBlobs(bloblessData);
                        if (!pendingBlobs) {
                            callback(bloblessData);
                        }
                    };
                },
                function (module, exports) {
                    var toString = {}.toString;
                    module.exports = Array.isArray || function (arr) {
                        return toString.call(arr) == '[object Array]';
                    };
                },
                function (module, exports) {
                    module.exports = isBuf;
                    var withNativeBuffer = typeof Buffer === 'function' && typeof Buffer.isBuffer === 'function';
                    var withNativeArrayBuffer = typeof ArrayBuffer === 'function';
                    var isView = function (obj) {
                        return typeof ArrayBuffer.isView === 'function' ? ArrayBuffer.isView(obj) : obj.buffer instanceof ArrayBuffer;
                    };
                    function isBuf(obj) {
                        return withNativeBuffer && Buffer.isBuffer(obj) || withNativeArrayBuffer && (obj instanceof ArrayBuffer || isView(obj));
                    }
                },
                function (module, exports, __webpack_require__) {
                    'use strict';
                    var _typeof = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol' ? function (obj) {
                            return typeof obj;
                        } : function (obj) {
                            return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj;
                        };
                    var eio = __webpack_require__(10);
                    var Socket = __webpack_require__(33);
                    var Emitter = __webpack_require__(5);
                    var parser = __webpack_require__(4);
                    var on = __webpack_require__(35);
                    var bind = __webpack_require__(36);
                    var debug = __webpack_require__(3)('socket.io-client:manager');
                    var indexOf = __webpack_require__(32);
                    var Backoff = __webpack_require__(37);
                    var has = Object.prototype.hasOwnProperty;
                    module.exports = Manager;
                    function Manager(uri, opts) {
                        if (!(this instanceof Manager))
                            return new Manager(uri, opts);
                        if (uri && 'object' === (typeof uri === 'undefined' ? 'undefined' : _typeof(uri))) {
                            opts = uri;
                            uri = undefined;
                        }
                        opts = opts || {};
                        opts.path = opts.path || '/socket.io';
                        this.nsps = {};
                        this.subs = [];
                        this.opts = opts;
                        this.reconnection(opts.reconnection !== false);
                        this.reconnectionAttempts(opts.reconnectionAttempts || Infinity);
                        this.reconnectionDelay(opts.reconnectionDelay || 1000);
                        this.reconnectionDelayMax(opts.reconnectionDelayMax || 5000);
                        this.randomizationFactor(opts.randomizationFactor || 0.5);
                        this.backoff = new Backoff({
                            min: this.reconnectionDelay(),
                            max: this.reconnectionDelayMax(),
                            jitter: this.randomizationFactor()
                        });
                        this.timeout(null == opts.timeout ? 20000 : opts.timeout);
                        this.readyState = 'closed';
                        this.uri = uri;
                        this.connecting = [];
                        this.lastPing = null;
                        this.encoding = false;
                        this.packetBuffer = [];
                        var _parser = opts.parser || parser;
                        this.encoder = new _parser.Encoder();
                        this.decoder = new _parser.Decoder();
                        this.autoConnect = opts.autoConnect !== false;
                        if (this.autoConnect)
                            this.open();
                    }
                    Manager.prototype.emitAll = function () {
                        this.emit.apply(this, arguments);
                        for (var nsp in this.nsps) {
                            if (has.call(this.nsps, nsp)) {
                                this.nsps[nsp].emit.apply(this.nsps[nsp], arguments);
                            }
                        }
                    };
                    Manager.prototype.updateSocketIds = function () {
                        for (var nsp in this.nsps) {
                            if (has.call(this.nsps, nsp)) {
                                this.nsps[nsp].id = this.generateId(nsp);
                            }
                        }
                    };
                    Manager.prototype.generateId = function (nsp) {
                        return (nsp === '/' ? '' : nsp + '#') + this.engine.id;
                    };
                    Emitter(Manager.prototype);
                    Manager.prototype.reconnection = function (v) {
                        if (!arguments.length)
                            return this._reconnection;
                        this._reconnection = !!v;
                        return this;
                    };
                    Manager.prototype.reconnectionAttempts = function (v) {
                        if (!arguments.length)
                            return this._reconnectionAttempts;
                        this._reconnectionAttempts = v;
                        return this;
                    };
                    Manager.prototype.reconnectionDelay = function (v) {
                        if (!arguments.length)
                            return this._reconnectionDelay;
                        this._reconnectionDelay = v;
                        this.backoff && this.backoff.setMin(v);
                        return this;
                    };
                    Manager.prototype.randomizationFactor = function (v) {
                        if (!arguments.length)
                            return this._randomizationFactor;
                        this._randomizationFactor = v;
                        this.backoff && this.backoff.setJitter(v);
                        return this;
                    };
                    Manager.prototype.reconnectionDelayMax = function (v) {
                        if (!arguments.length)
                            return this._reconnectionDelayMax;
                        this._reconnectionDelayMax = v;
                        this.backoff && this.backoff.setMax(v);
                        return this;
                    };
                    Manager.prototype.timeout = function (v) {
                        if (!arguments.length)
                            return this._timeout;
                        this._timeout = v;
                        return this;
                    };
                    Manager.prototype.maybeReconnectOnOpen = function () {
                        if (!this.reconnecting && this._reconnection && this.backoff.attempts === 0) {
                            this.reconnect();
                        }
                    };
                    Manager.prototype.open = Manager.prototype.connect = function (fn, opts) {
                        if (~this.readyState.indexOf('open'))
                            return this;
                        this.engine = eio(this.uri, this.opts);
                        var socket = this.engine;
                        var self = this;
                        this.readyState = 'opening';
                        this.skipReconnect = false;
                        var openSub = on(socket, 'open', function () {
                                self.onopen();
                                fn && fn();
                            });
                        var errorSub = on(socket, 'error', function (data) {
                                self.cleanup();
                                self.readyState = 'closed';
                                self.emitAll('connect_error', data);
                                if (fn) {
                                    var err = new Error('Connection error');
                                    err.data = data;
                                    fn(err);
                                } else {
                                    self.maybeReconnectOnOpen();
                                }
                            });
                        if (false !== this._timeout) {
                            var timeout = this._timeout;
                            var timer = setTimeout(function () {
                                    openSub.destroy();
                                    socket.close();
                                    socket.emit('error', 'timeout');
                                    self.emitAll('connect_timeout', timeout);
                                }, timeout);
                            this.subs.push({
                                destroy: function destroy() {
                                    clearTimeout(timer);
                                }
                            });
                        }
                        this.subs.push(openSub);
                        this.subs.push(errorSub);
                        return this;
                    };
                    Manager.prototype.onopen = function () {
                        this.cleanup();
                        this.readyState = 'open';
                        this.emit('open');
                        var socket = this.engine;
                        this.subs.push(on(socket, 'data', bind(this, 'ondata')));
                        this.subs.push(on(socket, 'ping', bind(this, 'onping')));
                        this.subs.push(on(socket, 'pong', bind(this, 'onpong')));
                        this.subs.push(on(socket, 'error', bind(this, 'onerror')));
                        this.subs.push(on(socket, 'close', bind(this, 'onclose')));
                        this.subs.push(on(this.decoder, 'decoded', bind(this, 'ondecoded')));
                    };
                    Manager.prototype.onping = function () {
                        this.lastPing = new Date();
                        this.emitAll('ping');
                    };
                    Manager.prototype.onpong = function () {
                        this.emitAll('pong', new Date() - this.lastPing);
                    };
                    Manager.prototype.ondata = function (data) {
                        this.decoder.add(data);
                    };
                    Manager.prototype.ondecoded = function (packet) {
                        this.emit('packet', packet);
                    };
                    Manager.prototype.onerror = function (err) {
                        this.emitAll('error', err);
                    };
                    Manager.prototype.socket = function (nsp, opts) {
                        var socket = this.nsps[nsp];
                        if (!socket) {
                            socket = new Socket(this, nsp, opts);
                            this.nsps[nsp] = socket;
                            var self = this;
                            socket.on('connecting', onConnecting);
                            socket.on('connect', function () {
                                socket.id = self.generateId(nsp);
                            });
                            if (this.autoConnect) {
                                onConnecting();
                            }
                        }
                        function onConnecting() {
                            if (!~indexOf(self.connecting, socket)) {
                                self.connecting.push(socket);
                            }
                        }
                        return socket;
                    };
                    Manager.prototype.destroy = function (socket) {
                        var index = indexOf(this.connecting, socket);
                        if (~index)
                            this.connecting.splice(index, 1);
                        if (this.connecting.length)
                            return;
                        this.close();
                    };
                    Manager.prototype.packet = function (packet) {
                        var self = this;
                        if (packet.query && packet.type === 0)
                            packet.nsp += '?' + packet.query;
                        if (!self.encoding) {
                            self.encoding = true;
                            this.encoder.encode(packet, function (encodedPackets) {
                                for (var i = 0; i < encodedPackets.length; i++) {
                                    self.engine.write(encodedPackets[i], packet.options);
                                }
                                self.encoding = false;
                                self.processPacketQueue();
                            });
                        } else {
                            self.packetBuffer.push(packet);
                        }
                    };
                    Manager.prototype.processPacketQueue = function () {
                        if (this.packetBuffer.length > 0 && !this.encoding) {
                            var pack = this.packetBuffer.shift();
                            this.packet(pack);
                        }
                    };
                    Manager.prototype.cleanup = function () {
                        var subsLength = this.subs.length;
                        for (var i = 0; i < subsLength; i++) {
                            var sub = this.subs.shift();
                            sub.destroy();
                        }
                        this.packetBuffer = [];
                        this.encoding = false;
                        this.lastPing = null;
                        this.decoder.destroy();
                    };
                    Manager.prototype.close = Manager.prototype.disconnect = function () {
                        this.skipReconnect = true;
                        this.reconnecting = false;
                        if ('opening' === this.readyState) {
                            this.cleanup();
                        }
                        this.backoff.reset();
                        this.readyState = 'closed';
                        if (this.engine)
                            this.engine.close();
                    };
                    Manager.prototype.onclose = function (reason) {
                        this.cleanup();
                        this.backoff.reset();
                        this.readyState = 'closed';
                        this.emit('close', reason);
                        if (this._reconnection && !this.skipReconnect) {
                            this.reconnect();
                        }
                    };
                    Manager.prototype.reconnect = function () {
                        if (this.reconnecting || this.skipReconnect)
                            return this;
                        var self = this;
                        if (this.backoff.attempts >= this._reconnectionAttempts) {
                            this.backoff.reset();
                            this.emitAll('reconnect_failed');
                            this.reconnecting = false;
                        } else {
                            var delay = this.backoff.duration();
                            this.reconnecting = true;
                            var timer = setTimeout(function () {
                                    if (self.skipReconnect)
                                        return;
                                    self.emitAll('reconnect_attempt', self.backoff.attempts);
                                    self.emitAll('reconnecting', self.backoff.attempts);
                                    if (self.skipReconnect)
                                        return;
                                    self.open(function (err) {
                                        if (err) {
                                            self.reconnecting = false;
                                            self.reconnect();
                                            self.emitAll('reconnect_error', err.data);
                                        } else {
                                            self.onreconnect();
                                        }
                                    });
                                }, delay);
                            this.subs.push({
                                destroy: function destroy() {
                                    clearTimeout(timer);
                                }
                            });
                        }
                    };
                    Manager.prototype.onreconnect = function () {
                        var attempt = this.backoff.attempts;
                        this.reconnecting = false;
                        this.backoff.reset();
                        this.updateSocketIds();
                        this.emitAll('reconnect', attempt);
                    };
                },
                function (module, exports, __webpack_require__) {
                    module.exports = __webpack_require__(11);
                    module.exports.parser = __webpack_require__(18);
                },
                function (module, exports, __webpack_require__) {
                    var transports = __webpack_require__(12);
                    var Emitter = __webpack_require__(5);
                    var debug = __webpack_require__(3)('engine.io-client:socket');
                    var index = __webpack_require__(32);
                    var parser = __webpack_require__(18);
                    var parseuri = __webpack_require__(2);
                    var parseqs = __webpack_require__(26);
                    module.exports = Socket;
                    function Socket(uri, opts) {
                        if (!(this instanceof Socket))
                            return new Socket(uri, opts);
                        opts = opts || {};
                        if (uri && 'object' === typeof uri) {
                            opts = uri;
                            uri = null;
                        }
                        if (uri) {
                            uri = parseuri(uri);
                            opts.hostname = uri.host;
                            opts.secure = uri.protocol === 'https' || uri.protocol === 'wss';
                            opts.port = uri.port;
                            if (uri.query)
                                opts.query = uri.query;
                        } else if (opts.host) {
                            opts.hostname = parseuri(opts.host).host;
                        }
                        this.secure = null != opts.secure ? opts.secure : typeof location !== 'undefined' && 'https:' === location.protocol;
                        if (opts.hostname && !opts.port) {
                            opts.port = this.secure ? '443' : '80';
                        }
                        this.agent = opts.agent || false;
                        this.hostname = opts.hostname || (typeof location !== 'undefined' ? location.hostname : 'localhost');
                        this.port = opts.port || (typeof location !== 'undefined' && location.port ? location.port : this.secure ? 443 : 80);
                        this.query = opts.query || {};
                        if ('string' === typeof this.query)
                            this.query = parseqs.decode(this.query);
                        this.upgrade = false !== opts.upgrade;
                        this.path = (opts.path || '/engine.io').replace(/\/$/, '') + '/';
                        this.forceJSONP = !!opts.forceJSONP;
                        this.jsonp = false !== opts.jsonp;
                        this.forceBase64 = !!opts.forceBase64;
                        this.enablesXDR = !!opts.enablesXDR;
                        this.withCredentials = false !== opts.withCredentials;
                        this.timestampParam = opts.timestampParam || 't';
                        this.timestampRequests = opts.timestampRequests;
                        this.transports = opts.transports || [
                            'polling',
                            'websocket'
                        ];
                        this.transportOptions = opts.transportOptions || {};
                        this.readyState = '';
                        this.writeBuffer = [];
                        this.prevBufferLen = 0;
                        this.policyPort = opts.policyPort || 843;
                        this.rememberUpgrade = opts.rememberUpgrade || false;
                        this.binaryType = null;
                        this.onlyBinaryUpgrades = opts.onlyBinaryUpgrades;
                        this.perMessageDeflate = false !== opts.perMessageDeflate ? opts.perMessageDeflate || {} : false;
                        if (true === this.perMessageDeflate)
                            this.perMessageDeflate = {};
                        if (this.perMessageDeflate && null == this.perMessageDeflate.threshold) {
                            this.perMessageDeflate.threshold = 1024;
                        }
                        this.pfx = opts.pfx || null;
                        this.key = opts.key || null;
                        this.passphrase = opts.passphrase || null;
                        this.cert = opts.cert || null;
                        this.ca = opts.ca || null;
                        this.ciphers = opts.ciphers || null;
                        this.rejectUnauthorized = opts.rejectUnauthorized === undefined ? true : opts.rejectUnauthorized;
                        this.forceNode = !!opts.forceNode;
                        this.isReactNative = typeof navigator !== 'undefined' && typeof navigator.product === 'string' && navigator.product.toLowerCase() === 'reactnative';
                        if (typeof self === 'undefined' || this.isReactNative) {
                            if (opts.extraHeaders && Object.keys(opts.extraHeaders).length > 0) {
                                this.extraHeaders = opts.extraHeaders;
                            }
                            if (opts.localAddress) {
                                this.localAddress = opts.localAddress;
                            }
                        }
                        this.id = null;
                        this.upgrades = null;
                        this.pingInterval = null;
                        this.pingTimeout = null;
                        this.pingIntervalTimer = null;
                        this.pingTimeoutTimer = null;
                        this.open();
                    }
                    Socket.priorWebsocketSuccess = false;
                    Emitter(Socket.prototype);
                    Socket.protocol = parser.protocol;
                    Socket.Socket = Socket;
                    Socket.Transport = __webpack_require__(17);
                    Socket.transports = __webpack_require__(12);
                    Socket.parser = __webpack_require__(18);
                    Socket.prototype.createTransport = function (name) {
                        var query = clone(this.query);
                        query.EIO = parser.protocol;
                        query.transport = name;
                        var options = this.transportOptions[name] || {};
                        if (this.id)
                            query.sid = this.id;
                        var transport = new transports[name]({
                                query: query,
                                socket: this,
                                agent: options.agent || this.agent,
                                hostname: options.hostname || this.hostname,
                                port: options.port || this.port,
                                secure: options.secure || this.secure,
                                path: options.path || this.path,
                                forceJSONP: options.forceJSONP || this.forceJSONP,
                                jsonp: options.jsonp || this.jsonp,
                                forceBase64: options.forceBase64 || this.forceBase64,
                                enablesXDR: options.enablesXDR || this.enablesXDR,
                                withCredentials: options.withCredentials || this.withCredentials,
                                timestampRequests: options.timestampRequests || this.timestampRequests,
                                timestampParam: options.timestampParam || this.timestampParam,
                                policyPort: options.policyPort || this.policyPort,
                                pfx: options.pfx || this.pfx,
                                key: options.key || this.key,
                                passphrase: options.passphrase || this.passphrase,
                                cert: options.cert || this.cert,
                                ca: options.ca || this.ca,
                                ciphers: options.ciphers || this.ciphers,
                                rejectUnauthorized: options.rejectUnauthorized || this.rejectUnauthorized,
                                perMessageDeflate: options.perMessageDeflate || this.perMessageDeflate,
                                extraHeaders: options.extraHeaders || this.extraHeaders,
                                forceNode: options.forceNode || this.forceNode,
                                localAddress: options.localAddress || this.localAddress,
                                requestTimeout: options.requestTimeout || this.requestTimeout,
                                protocols: options.protocols || void 0,
                                isReactNative: this.isReactNative
                            });
                        return transport;
                    };
                    function clone(obj) {
                        var o = {};
                        for (var i in obj) {
                            if (obj.hasOwnProperty(i)) {
                                o[i] = obj[i];
                            }
                        }
                        return o;
                    }
                    Socket.prototype.open = function () {
                        var transport;
                        if (this.rememberUpgrade && Socket.priorWebsocketSuccess && this.transports.indexOf('websocket') !== -1) {
                            transport = 'websocket';
                        } else if (0 === this.transports.length) {
                            var self = this;
                            setTimeout(function () {
                                self.emit('error', 'No transports available');
                            }, 0);
                            return;
                        } else {
                            transport = this.transports[0];
                        }
                        this.readyState = 'opening';
                        try {
                            transport = this.createTransport(transport);
                        } catch (e) {
                            this.transports.shift();
                            this.open();
                            return;
                        }
                        transport.open();
                        this.setTransport(transport);
                    };
                    Socket.prototype.setTransport = function (transport) {
                        var self = this;
                        if (this.transport) {
                            this.transport.removeAllListeners();
                        }
                        this.transport = transport;
                        transport.on('drain', function () {
                            self.onDrain();
                        }).on('packet', function (packet) {
                            self.onPacket(packet);
                        }).on('error', function (e) {
                            self.onError(e);
                        }).on('close', function () {
                            self.onClose('transport close');
                        });
                    };
                    Socket.prototype.probe = function (name) {
                        var transport = this.createTransport(name, { probe: 1 });
                        var failed = false;
                        var self = this;
                        Socket.priorWebsocketSuccess = false;
                        function onTransportOpen() {
                            if (self.onlyBinaryUpgrades) {
                                var upgradeLosesBinary = !this.supportsBinary && self.transport.supportsBinary;
                                failed = failed || upgradeLosesBinary;
                            }
                            if (failed)
                                return;
                            transport.send([{
                                    type: 'ping',
                                    data: 'probe'
                                }]);
                            transport.once('packet', function (msg) {
                                if (failed)
                                    return;
                                if ('pong' === msg.type && 'probe' === msg.data) {
                                    self.upgrading = true;
                                    self.emit('upgrading', transport);
                                    if (!transport)
                                        return;
                                    Socket.priorWebsocketSuccess = 'websocket' === transport.name;
                                    self.transport.pause(function () {
                                        if (failed)
                                            return;
                                        if ('closed' === self.readyState)
                                            return;
                                        cleanup();
                                        self.setTransport(transport);
                                        transport.send([{ type: 'upgrade' }]);
                                        self.emit('upgrade', transport);
                                        transport = null;
                                        self.upgrading = false;
                                        self.flush();
                                    });
                                } else {
                                    var err = new Error('probe error');
                                    err.transport = transport.name;
                                    self.emit('upgradeError', err);
                                }
                            });
                        }
                        function freezeTransport() {
                            if (failed)
                                return;
                            failed = true;
                            cleanup();
                            transport.close();
                            transport = null;
                        }
                        function onerror(err) {
                            var error = new Error('probe error: ' + err);
                            error.transport = transport.name;
                            freezeTransport();
                            self.emit('upgradeError', error);
                        }
                        function onTransportClose() {
                            onerror('transport closed');
                        }
                        function onclose() {
                            onerror('socket closed');
                        }
                        function onupgrade(to) {
                            if (transport && to.name !== transport.name) {
                                freezeTransport();
                            }
                        }
                        function cleanup() {
                            transport.removeListener('open', onTransportOpen);
                            transport.removeListener('error', onerror);
                            transport.removeListener('close', onTransportClose);
                            self.removeListener('close', onclose);
                            self.removeListener('upgrading', onupgrade);
                        }
                        transport.once('open', onTransportOpen);
                        transport.once('error', onerror);
                        transport.once('close', onTransportClose);
                        this.once('close', onclose);
                        this.once('upgrading', onupgrade);
                        transport.open();
                    };
                    Socket.prototype.onOpen = function () {
                        this.readyState = 'open';
                        Socket.priorWebsocketSuccess = 'websocket' === this.transport.name;
                        this.emit('open');
                        this.flush();
                        if ('open' === this.readyState && this.upgrade && this.transport.pause) {
                            for (var i = 0, l = this.upgrades.length; i < l; i++) {
                                this.probe(this.upgrades[i]);
                            }
                        }
                    };
                    Socket.prototype.onPacket = function (packet) {
                        if ('opening' === this.readyState || 'open' === this.readyState || 'closing' === this.readyState) {
                            this.emit('packet', packet);
                            this.emit('heartbeat');
                            switch (packet.type) {
                            case 'open':
                                this.onHandshake(JSON.parse(packet.data));
                                break;
                            case 'pong':
                                this.setPing();
                                this.emit('pong');
                                break;
                            case 'error':
                                var err = new Error('server error');
                                err.code = packet.data;
                                this.onError(err);
                                break;
                            case 'message':
                                this.emit('data', packet.data);
                                this.emit('message', packet.data);
                                break;
                            }
                        } else {
                        }
                    };
                    Socket.prototype.onHandshake = function (data) {
                        this.emit('handshake', data);
                        this.id = data.sid;
                        this.transport.query.sid = data.sid;
                        this.upgrades = this.filterUpgrades(data.upgrades);
                        this.pingInterval = data.pingInterval;
                        this.pingTimeout = data.pingTimeout;
                        this.onOpen();
                        if ('closed' === this.readyState)
                            return;
                        this.setPing();
                        this.removeListener('heartbeat', this.onHeartbeat);
                        this.on('heartbeat', this.onHeartbeat);
                    };
                    Socket.prototype.onHeartbeat = function (timeout) {
                        clearTimeout(this.pingTimeoutTimer);
                        var self = this;
                        self.pingTimeoutTimer = setTimeout(function () {
                            if ('closed' === self.readyState)
                                return;
                            self.onClose('ping timeout');
                        }, timeout || self.pingInterval + self.pingTimeout);
                    };
                    Socket.prototype.setPing = function () {
                        var self = this;
                        clearTimeout(self.pingIntervalTimer);
                        self.pingIntervalTimer = setTimeout(function () {
                            self.ping();
                            self.onHeartbeat(self.pingTimeout);
                        }, self.pingInterval);
                    };
                    Socket.prototype.ping = function () {
                        var self = this;
                        this.sendPacket('ping', function () {
                            self.emit('ping');
                        });
                    };
                    Socket.prototype.onDrain = function () {
                        this.writeBuffer.splice(0, this.prevBufferLen);
                        this.prevBufferLen = 0;
                        if (0 === this.writeBuffer.length) {
                            this.emit('drain');
                        } else {
                            this.flush();
                        }
                    };
                    Socket.prototype.flush = function () {
                        if ('closed' !== this.readyState && this.transport.writable && !this.upgrading && this.writeBuffer.length) {
                            this.transport.send(this.writeBuffer);
                            this.prevBufferLen = this.writeBuffer.length;
                            this.emit('flush');
                        }
                    };
                    Socket.prototype.write = Socket.prototype.send = function (msg, options, fn) {
                        this.sendPacket('message', msg, options, fn);
                        return this;
                    };
                    Socket.prototype.sendPacket = function (type, data, options, fn) {
                        if ('function' === typeof data) {
                            fn = data;
                            data = undefined;
                        }
                        if ('function' === typeof options) {
                            fn = options;
                            options = null;
                        }
                        if ('closing' === this.readyState || 'closed' === this.readyState) {
                            return;
                        }
                        options = options || {};
                        options.compress = false !== options.compress;
                        var packet = {
                                type: type,
                                data: data,
                                options: options
                            };
                        this.emit('packetCreate', packet);
                        this.writeBuffer.push(packet);
                        if (fn)
                            this.once('flush', fn);
                        this.flush();
                    };
                    Socket.prototype.close = function () {
                        if ('opening' === this.readyState || 'open' === this.readyState) {
                            this.readyState = 'closing';
                            var self = this;
                            if (this.writeBuffer.length) {
                                this.once('drain', function () {
                                    if (this.upgrading) {
                                        waitForUpgrade();
                                    } else {
                                        close();
                                    }
                                });
                            } else if (this.upgrading) {
                                waitForUpgrade();
                            } else {
                                close();
                            }
                        }
                        function close() {
                            self.onClose('forced close');
                            self.transport.close();
                        }
                        function cleanupAndClose() {
                            self.removeListener('upgrade', cleanupAndClose);
                            self.removeListener('upgradeError', cleanupAndClose);
                            close();
                        }
                        function waitForUpgrade() {
                            self.once('upgrade', cleanupAndClose);
                            self.once('upgradeError', cleanupAndClose);
                        }
                        return this;
                    };
                    Socket.prototype.onError = function (err) {
                        Socket.priorWebsocketSuccess = false;
                        this.emit('error', err);
                        this.onClose('transport error', err);
                    };
                    Socket.prototype.onClose = function (reason, desc) {
                        if ('opening' === this.readyState || 'open' === this.readyState || 'closing' === this.readyState) {
                            var self = this;
                            clearTimeout(this.pingIntervalTimer);
                            clearTimeout(this.pingTimeoutTimer);
                            this.transport.removeAllListeners('close');
                            this.transport.close();
                            this.transport.removeAllListeners();
                            this.readyState = 'closed';
                            this.id = null;
                            this.emit('close', reason, desc);
                            self.writeBuffer = [];
                            self.prevBufferLen = 0;
                        }
                    };
                    Socket.prototype.filterUpgrades = function (upgrades) {
                        var filteredUpgrades = [];
                        for (var i = 0, j = upgrades.length; i < j; i++) {
                            if (~index(this.transports, upgrades[i]))
                                filteredUpgrades.push(upgrades[i]);
                        }
                        return filteredUpgrades;
                    };
                },
                function (module, exports, __webpack_require__) {
                    var XMLHttpRequest = __webpack_require__(13);
                    var XHR = __webpack_require__(15);
                    var JSONP = __webpack_require__(29);
                    var websocket = __webpack_require__(30);
                    exports.polling = polling;
                    exports.websocket = websocket;
                    function polling(opts) {
                        var xhr;
                        var xd = false;
                        var xs = false;
                        var jsonp = false !== opts.jsonp;
                        if (typeof location !== 'undefined') {
                            var isSSL = 'https:' === location.protocol;
                            var port = location.port;
                            if (!port) {
                                port = isSSL ? 443 : 80;
                            }
                            xd = opts.hostname !== location.hostname || port !== opts.port;
                            xs = opts.secure !== isSSL;
                        }
                        opts.xdomain = xd;
                        opts.xscheme = xs;
                        xhr = new XMLHttpRequest(opts);
                        if ('open' in xhr && !opts.forceJSONP) {
                            return new XHR(opts);
                        } else {
                            if (!jsonp)
                                throw new Error('JSONP disabled');
                            return new JSONP(opts);
                        }
                    }
                },
                function (module, exports, __webpack_require__) {
                    var hasCORS = __webpack_require__(14);
                    module.exports = function (opts) {
                        var xdomain = opts.xdomain;
                        var xscheme = opts.xscheme;
                        var enablesXDR = opts.enablesXDR;
                        try {
                            if ('undefined' !== typeof XMLHttpRequest && (!xdomain || hasCORS)) {
                                return new XMLHttpRequest();
                            }
                        } catch (e) {
                        }
                        try {
                            if ('undefined' !== typeof XDomainRequest && !xscheme && enablesXDR) {
                                return new XDomainRequest();
                            }
                        } catch (e) {
                        }
                        if (!xdomain) {
                            try {
                                return new self[(['Active'].concat('Object').join('X'))]('Microsoft.XMLHTTP');
                            } catch (e) {
                            }
                        }
                    };
                },
                function (module, exports) {
                    try {
                        module.exports = typeof XMLHttpRequest !== 'undefined' && 'withCredentials' in new XMLHttpRequest();
                    } catch (err) {
                        module.exports = false;
                    }
                },
                function (module, exports, __webpack_require__) {
                    var XMLHttpRequest = __webpack_require__(13);
                    var Polling = __webpack_require__(16);
                    var Emitter = __webpack_require__(5);
                    var inherit = __webpack_require__(27);
                    var debug = __webpack_require__(3)('engine.io-client:polling-xhr');
                    module.exports = XHR;
                    module.exports.Request = Request;
                    function empty() {
                    }
                    function XHR(opts) {
                        Polling.call(this, opts);
                        this.requestTimeout = opts.requestTimeout;
                        this.extraHeaders = opts.extraHeaders;
                        if (typeof location !== 'undefined') {
                            var isSSL = 'https:' === location.protocol;
                            var port = location.port;
                            if (!port) {
                                port = isSSL ? 443 : 80;
                            }
                            this.xd = typeof location !== 'undefined' && opts.hostname !== location.hostname || port !== opts.port;
                            this.xs = opts.secure !== isSSL;
                        }
                    }
                    inherit(XHR, Polling);
                    XHR.prototype.supportsBinary = true;
                    XHR.prototype.request = function (opts) {
                        opts = opts || {};
                        opts.uri = this.uri();
                        opts.xd = this.xd;
                        opts.xs = this.xs;
                        opts.agent = this.agent || false;
                        opts.supportsBinary = this.supportsBinary;
                        opts.enablesXDR = this.enablesXDR;
                        opts.withCredentials = this.withCredentials;
                        opts.pfx = this.pfx;
                        opts.key = this.key;
                        opts.passphrase = this.passphrase;
                        opts.cert = this.cert;
                        opts.ca = this.ca;
                        opts.ciphers = this.ciphers;
                        opts.rejectUnauthorized = this.rejectUnauthorized;
                        opts.requestTimeout = this.requestTimeout;
                        opts.extraHeaders = this.extraHeaders;
                        return new Request(opts);
                    };
                    XHR.prototype.doWrite = function (data, fn) {
                        var isBinary = typeof data !== 'string' && data !== undefined;
                        var req = this.request({
                                method: 'POST',
                                data: data,
                                isBinary: isBinary
                            });
                        var self = this;
                        req.on('success', fn);
                        req.on('error', function (err) {
                            self.onError('xhr post error', err);
                        });
                        this.sendXhr = req;
                    };
                    XHR.prototype.doPoll = function () {
                        var req = this.request();
                        var self = this;
                        req.on('data', function (data) {
                            self.onData(data);
                        });
                        req.on('error', function (err) {
                            self.onError('xhr poll error', err);
                        });
                        this.pollXhr = req;
                    };
                    function Request(opts) {
                        this.method = opts.method || 'GET';
                        this.uri = opts.uri;
                        this.xd = !!opts.xd;
                        this.xs = !!opts.xs;
                        this.async = false !== opts.async;
                        this.data = undefined !== opts.data ? opts.data : null;
                        this.agent = opts.agent;
                        this.isBinary = opts.isBinary;
                        this.supportsBinary = opts.supportsBinary;
                        this.enablesXDR = opts.enablesXDR;
                        this.withCredentials = opts.withCredentials;
                        this.requestTimeout = opts.requestTimeout;
                        this.pfx = opts.pfx;
                        this.key = opts.key;
                        this.passphrase = opts.passphrase;
                        this.cert = opts.cert;
                        this.ca = opts.ca;
                        this.ciphers = opts.ciphers;
                        this.rejectUnauthorized = opts.rejectUnauthorized;
                        this.extraHeaders = opts.extraHeaders;
                        this.create();
                    }
                    Emitter(Request.prototype);
                    Request.prototype.create = function () {
                        var opts = {
                                agent: this.agent,
                                xdomain: this.xd,
                                xscheme: this.xs,
                                enablesXDR: this.enablesXDR
                            };
                        opts.pfx = this.pfx;
                        opts.key = this.key;
                        opts.passphrase = this.passphrase;
                        opts.cert = this.cert;
                        opts.ca = this.ca;
                        opts.ciphers = this.ciphers;
                        opts.rejectUnauthorized = this.rejectUnauthorized;
                        var xhr = this.xhr = new XMLHttpRequest(opts);
                        var self = this;
                        try {
                            xhr.open(this.method, this.uri, this.async);
                            try {
                                if (this.extraHeaders) {
                                    xhr.setDisableHeaderCheck && xhr.setDisableHeaderCheck(true);
                                    for (var i in this.extraHeaders) {
                                        if (this.extraHeaders.hasOwnProperty(i)) {
                                            xhr.setRequestHeader(i, this.extraHeaders[i]);
                                        }
                                    }
                                }
                            } catch (e) {
                            }
                            if ('POST' === this.method) {
                                try {
                                    if (this.isBinary) {
                                        xhr.setRequestHeader('Content-type', 'application/octet-stream');
                                    } else {
                                        xhr.setRequestHeader('Content-type', 'text/plain;charset=UTF-8');
                                    }
                                } catch (e) {
                                }
                            }
                            try {
                                xhr.setRequestHeader('Accept', '*/*');
                            } catch (e) {
                            }
                            if ('withCredentials' in xhr) {
                                xhr.withCredentials = this.withCredentials;
                            }
                            if (this.requestTimeout) {
                                xhr.timeout = this.requestTimeout;
                            }
                            if (this.hasXDR()) {
                                xhr.onload = function () {
                                    self.onLoad();
                                };
                                xhr.onerror = function () {
                                    self.onError(xhr.responseText);
                                };
                            } else {
                                xhr.onreadystatechange = function () {
                                    if (xhr.readyState === 2) {
                                        try {
                                            var contentType = xhr.getResponseHeader('Content-Type');
                                            if (self.supportsBinary && contentType === 'application/octet-stream' || contentType === 'application/octet-stream; charset=UTF-8') {
                                                xhr.responseType = 'arraybuffer';
                                            }
                                        } catch (e) {
                                        }
                                    }
                                    if (4 !== xhr.readyState)
                                        return;
                                    if (200 === xhr.status || 1223 === xhr.status) {
                                        self.onLoad();
                                    } else {
                                        setTimeout(function () {
                                            self.onError(typeof xhr.status === 'number' ? xhr.status : 0);
                                        }, 0);
                                    }
                                };
                            }
                            xhr.send(this.data);
                        } catch (e) {
                            setTimeout(function () {
                                self.onError(e);
                            }, 0);
                            return;
                        }
                        if (typeof document !== 'undefined') {
                            this.index = Request.requestsCount++;
                            Request.requests[this.index] = this;
                        }
                    };
                    Request.prototype.onSuccess = function () {
                        this.emit('success');
                        this.cleanup();
                    };
                    Request.prototype.onData = function (data) {
                        this.emit('data', data);
                        this.onSuccess();
                    };
                    Request.prototype.onError = function (err) {
                        this.emit('error', err);
                        this.cleanup(true);
                    };
                    Request.prototype.cleanup = function (fromError) {
                        if ('undefined' === typeof this.xhr || null === this.xhr) {
                            return;
                        }
                        if (this.hasXDR()) {
                            this.xhr.onload = this.xhr.onerror = empty;
                        } else {
                            this.xhr.onreadystatechange = empty;
                        }
                        if (fromError) {
                            try {
                                this.xhr.abort();
                            } catch (e) {
                            }
                        }
                        if (typeof document !== 'undefined') {
                            delete Request.requests[this.index];
                        }
                        this.xhr = null;
                    };
                    Request.prototype.onLoad = function () {
                        var data;
                        try {
                            var contentType;
                            try {
                                contentType = this.xhr.getResponseHeader('Content-Type');
                            } catch (e) {
                            }
                            if (contentType === 'application/octet-stream' || contentType === 'application/octet-stream; charset=UTF-8') {
                                data = this.xhr.response || this.xhr.responseText;
                            } else {
                                data = this.xhr.responseText;
                            }
                        } catch (e) {
                            this.onError(e);
                        }
                        if (null != data) {
                            this.onData(data);
                        }
                    };
                    Request.prototype.hasXDR = function () {
                        return typeof XDomainRequest !== 'undefined' && !this.xs && this.enablesXDR;
                    };
                    Request.prototype.abort = function () {
                        this.cleanup();
                    };
                    Request.requestsCount = 0;
                    Request.requests = {};
                    if (typeof document !== 'undefined') {
                        if (typeof attachEvent === 'function') {
                            attachEvent('onunload', unloadHandler);
                        } else if (typeof addEventListener === 'function') {
                            var terminationEvent = 'onpagehide' in self ? 'pagehide' : 'unload';
                            addEventListener(terminationEvent, unloadHandler, false);
                        }
                    }
                    function unloadHandler() {
                        for (var i in Request.requests) {
                            if (Request.requests.hasOwnProperty(i)) {
                                Request.requests[i].abort();
                            }
                        }
                    }
                },
                function (module, exports, __webpack_require__) {
                    var Transport = __webpack_require__(17);
                    var parseqs = __webpack_require__(26);
                    var parser = __webpack_require__(18);
                    var inherit = __webpack_require__(27);
                    var yeast = __webpack_require__(28);
                    var debug = __webpack_require__(3)('engine.io-client:polling');
                    module.exports = Polling;
                    var hasXHR2 = function () {
                            var XMLHttpRequest = __webpack_require__(13);
                            var xhr = new XMLHttpRequest({ xdomain: false });
                            return null != xhr.responseType;
                        }();
                    function Polling(opts) {
                        var forceBase64 = opts && opts.forceBase64;
                        if (!hasXHR2 || forceBase64) {
                            this.supportsBinary = false;
                        }
                        Transport.call(this, opts);
                    }
                    inherit(Polling, Transport);
                    Polling.prototype.name = 'polling';
                    Polling.prototype.doOpen = function () {
                        this.poll();
                    };
                    Polling.prototype.pause = function (onPause) {
                        var self = this;
                        this.readyState = 'pausing';
                        function pause() {
                            self.readyState = 'paused';
                            onPause();
                        }
                        if (this.polling || !this.writable) {
                            var total = 0;
                            if (this.polling) {
                                total++;
                                this.once('pollComplete', function () {
                                    --total || pause();
                                });
                            }
                            if (!this.writable) {
                                total++;
                                this.once('drain', function () {
                                    --total || pause();
                                });
                            }
                        } else {
                            pause();
                        }
                    };
                    Polling.prototype.poll = function () {
                        this.polling = true;
                        this.doPoll();
                        this.emit('poll');
                    };
                    Polling.prototype.onData = function (data) {
                        var self = this;
                        var callback = function (packet, index, total) {
                            if ('opening' === self.readyState) {
                                self.onOpen();
                            }
                            if ('close' === packet.type) {
                                self.onClose();
                                return false;
                            }
                            self.onPacket(packet);
                        };
                        parser.decodePayload(data, this.socket.binaryType, callback);
                        if ('closed' !== this.readyState) {
                            this.polling = false;
                            this.emit('pollComplete');
                            if ('open' === this.readyState) {
                                this.poll();
                            } else {
                            }
                        }
                    };
                    Polling.prototype.doClose = function () {
                        var self = this;
                        function close() {
                            self.write([{ type: 'close' }]);
                        }
                        if ('open' === this.readyState) {
                            close();
                        } else {
                            this.once('open', close);
                        }
                    };
                    Polling.prototype.write = function (packets) {
                        var self = this;
                        this.writable = false;
                        var callbackfn = function () {
                            self.writable = true;
                            self.emit('drain');
                        };
                        parser.encodePayload(packets, this.supportsBinary, function (data) {
                            self.doWrite(data, callbackfn);
                        });
                    };
                    Polling.prototype.uri = function () {
                        var query = this.query || {};
                        var schema = this.secure ? 'https' : 'http';
                        var port = '';
                        if (false !== this.timestampRequests) {
                            query[this.timestampParam] = yeast();
                        }
                        if (!this.supportsBinary && !query.sid) {
                            query.b64 = 1;
                        }
                        query = parseqs.encode(query);
                        if (this.port && ('https' === schema && Number(this.port) !== 443 || 'http' === schema && Number(this.port) !== 80)) {
                            port = ':' + this.port;
                        }
                        if (query.length) {
                            query = '?' + query;
                        }
                        var ipv6 = this.hostname.indexOf(':') !== -1;
                        return schema + '://' + (ipv6 ? '[' + this.hostname + ']' : this.hostname) + port + this.path + query;
                    };
                },
                function (module, exports, __webpack_require__) {
                    var parser = __webpack_require__(18);
                    var Emitter = __webpack_require__(5);
                    module.exports = Transport;
                    function Transport(opts) {
                        this.path = opts.path;
                        this.hostname = opts.hostname;
                        this.port = opts.port;
                        this.secure = opts.secure;
                        this.query = opts.query;
                        this.timestampParam = opts.timestampParam;
                        this.timestampRequests = opts.timestampRequests;
                        this.readyState = '';
                        this.agent = opts.agent || false;
                        this.socket = opts.socket;
                        this.enablesXDR = opts.enablesXDR;
                        this.withCredentials = opts.withCredentials;
                        this.pfx = opts.pfx;
                        this.key = opts.key;
                        this.passphrase = opts.passphrase;
                        this.cert = opts.cert;
                        this.ca = opts.ca;
                        this.ciphers = opts.ciphers;
                        this.rejectUnauthorized = opts.rejectUnauthorized;
                        this.forceNode = opts.forceNode;
                        this.isReactNative = opts.isReactNative;
                        this.extraHeaders = opts.extraHeaders;
                        this.localAddress = opts.localAddress;
                    }
                    Emitter(Transport.prototype);
                    Transport.prototype.onError = function (msg, desc) {
                        var err = new Error(msg);
                        err.type = 'TransportError';
                        err.description = desc;
                        this.emit('error', err);
                        return this;
                    };
                    Transport.prototype.open = function () {
                        if ('closed' === this.readyState || '' === this.readyState) {
                            this.readyState = 'opening';
                            this.doOpen();
                        }
                        return this;
                    };
                    Transport.prototype.close = function () {
                        if ('opening' === this.readyState || 'open' === this.readyState) {
                            this.doClose();
                            this.onClose();
                        }
                        return this;
                    };
                    Transport.prototype.send = function (packets) {
                        if ('open' === this.readyState) {
                            this.write(packets);
                        } else {
                            throw new Error('Transport not open');
                        }
                    };
                    Transport.prototype.onOpen = function () {
                        this.readyState = 'open';
                        this.writable = true;
                        this.emit('open');
                    };
                    Transport.prototype.onData = function (data) {
                        var packet = parser.decodePacket(data, this.socket.binaryType);
                        this.onPacket(packet);
                    };
                    Transport.prototype.onPacket = function (packet) {
                        this.emit('packet', packet);
                    };
                    Transport.prototype.onClose = function () {
                        this.readyState = 'closed';
                        this.emit('close');
                    };
                },
                function (module, exports, __webpack_require__) {
                    var keys = __webpack_require__(19);
                    var hasBinary = __webpack_require__(20);
                    var sliceBuffer = __webpack_require__(21);
                    var after = __webpack_require__(22);
                    var utf8 = __webpack_require__(23);
                    var base64encoder;
                    if (typeof ArrayBuffer !== 'undefined') {
                        base64encoder = __webpack_require__(24);
                    }
                    var isAndroid = typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent);
                    var isPhantomJS = typeof navigator !== 'undefined' && /PhantomJS/i.test(navigator.userAgent);
                    var dontSendBlobs = isAndroid || isPhantomJS;
                    exports.protocol = 3;
                    var packets = exports.packets = {
                            open: 0,
                            close: 1,
                            ping: 2,
                            pong: 3,
                            message: 4,
                            upgrade: 5,
                            noop: 6
                        };
                    var packetslist = keys(packets);
                    var err = {
                            type: 'error',
                            data: 'parser error'
                        };
                    var Blob = __webpack_require__(25);
                    exports.encodePacket = function (packet, supportsBinary, utf8encode, callback) {
                        if (typeof supportsBinary === 'function') {
                            callback = supportsBinary;
                            supportsBinary = false;
                        }
                        if (typeof utf8encode === 'function') {
                            callback = utf8encode;
                            utf8encode = null;
                        }
                        var data = packet.data === undefined ? undefined : packet.data.buffer || packet.data;
                        if (typeof ArrayBuffer !== 'undefined' && data instanceof ArrayBuffer) {
                            return encodeArrayBuffer(packet, supportsBinary, callback);
                        } else if (typeof Blob !== 'undefined' && data instanceof Blob) {
                            return encodeBlob(packet, supportsBinary, callback);
                        }
                        if (data && data.base64) {
                            return encodeBase64Object(packet, callback);
                        }
                        var encoded = packets[packet.type];
                        if (undefined !== packet.data) {
                            encoded += utf8encode ? utf8.encode(String(packet.data), { strict: false }) : String(packet.data);
                        }
                        return callback('' + encoded);
                    };
                    function encodeBase64Object(packet, callback) {
                        var message = 'b' + exports.packets[packet.type] + packet.data.data;
                        return callback(message);
                    }
                    function encodeArrayBuffer(packet, supportsBinary, callback) {
                        if (!supportsBinary) {
                            return exports.encodeBase64Packet(packet, callback);
                        }
                        var data = packet.data;
                        var contentArray = new Uint8Array(data);
                        var resultBuffer = new Uint8Array(1 + data.byteLength);
                        resultBuffer[0] = packets[packet.type];
                        for (var i = 0; i < contentArray.length; i++) {
                            resultBuffer[i + 1] = contentArray[i];
                        }
                        return callback(resultBuffer.buffer);
                    }
                    function encodeBlobAsArrayBuffer(packet, supportsBinary, callback) {
                        if (!supportsBinary) {
                            return exports.encodeBase64Packet(packet, callback);
                        }
                        var fr = new FileReader();
                        fr.onload = function () {
                            exports.encodePacket({
                                type: packet.type,
                                data: fr.result
                            }, supportsBinary, true, callback);
                        };
                        return fr.readAsArrayBuffer(packet.data);
                    }
                    function encodeBlob(packet, supportsBinary, callback) {
                        if (!supportsBinary) {
                            return exports.encodeBase64Packet(packet, callback);
                        }
                        if (dontSendBlobs) {
                            return encodeBlobAsArrayBuffer(packet, supportsBinary, callback);
                        }
                        var length = new Uint8Array(1);
                        length[0] = packets[packet.type];
                        var blob = new Blob([
                                length.buffer,
                                packet.data
                            ]);
                        return callback(blob);
                    }
                    exports.encodeBase64Packet = function (packet, callback) {
                        var message = 'b' + exports.packets[packet.type];
                        if (typeof Blob !== 'undefined' && packet.data instanceof Blob) {
                            var fr = new FileReader();
                            fr.onload = function () {
                                var b64 = fr.result.split(',')[1];
                                callback(message + b64);
                            };
                            return fr.readAsDataURL(packet.data);
                        }
                        var b64data;
                        try {
                            b64data = String.fromCharCode.apply(null, new Uint8Array(packet.data));
                        } catch (e) {
                            var typed = new Uint8Array(packet.data);
                            var basic = new Array(typed.length);
                            for (var i = 0; i < typed.length; i++) {
                                basic[i] = typed[i];
                            }
                            b64data = String.fromCharCode.apply(null, basic);
                        }
                        message += btoa(b64data);
                        return callback(message);
                    };
                    exports.decodePacket = function (data, binaryType, utf8decode) {
                        if (data === undefined) {
                            return err;
                        }
                        if (typeof data === 'string') {
                            if (data.charAt(0) === 'b') {
                                return exports.decodeBase64Packet(data.substr(1), binaryType);
                            }
                            if (utf8decode) {
                                data = tryDecode(data);
                                if (data === false) {
                                    return err;
                                }
                            }
                            var type = data.charAt(0);
                            if (Number(type) != type || !packetslist[type]) {
                                return err;
                            }
                            if (data.length > 1) {
                                return {
                                    type: packetslist[type],
                                    data: data.substring(1)
                                };
                            } else {
                                return { type: packetslist[type] };
                            }
                        }
                        var asArray = new Uint8Array(data);
                        var type = asArray[0];
                        var rest = sliceBuffer(data, 1);
                        if (Blob && binaryType === 'blob') {
                            rest = new Blob([rest]);
                        }
                        return {
                            type: packetslist[type],
                            data: rest
                        };
                    };
                    function tryDecode(data) {
                        try {
                            data = utf8.decode(data, { strict: false });
                        } catch (e) {
                            return false;
                        }
                        return data;
                    }
                    exports.decodeBase64Packet = function (msg, binaryType) {
                        var type = packetslist[msg.charAt(0)];
                        if (!base64encoder) {
                            return {
                                type: type,
                                data: {
                                    base64: true,
                                    data: msg.substr(1)
                                }
                            };
                        }
                        var data = base64encoder.decode(msg.substr(1));
                        if (binaryType === 'blob' && Blob) {
                            data = new Blob([data]);
                        }
                        return {
                            type: type,
                            data: data
                        };
                    };
                    exports.encodePayload = function (packets, supportsBinary, callback) {
                        if (typeof supportsBinary === 'function') {
                            callback = supportsBinary;
                            supportsBinary = null;
                        }
                        var isBinary = hasBinary(packets);
                        if (supportsBinary && isBinary) {
                            if (Blob && !dontSendBlobs) {
                                return exports.encodePayloadAsBlob(packets, callback);
                            }
                            return exports.encodePayloadAsArrayBuffer(packets, callback);
                        }
                        if (!packets.length) {
                            return callback('0:');
                        }
                        function setLengthHeader(message) {
                            return message.length + ':' + message;
                        }
                        function encodeOne(packet, doneCallback) {
                            exports.encodePacket(packet, !isBinary ? false : supportsBinary, false, function (message) {
                                doneCallback(null, setLengthHeader(message));
                            });
                        }
                        map(packets, encodeOne, function (err, results) {
                            return callback(results.join(''));
                        });
                    };
                    function map(ary, each, done) {
                        var result = new Array(ary.length);
                        var next = after(ary.length, done);
                        var eachWithIndex = function (i, el, cb) {
                            each(el, function (error, msg) {
                                result[i] = msg;
                                cb(error, result);
                            });
                        };
                        for (var i = 0; i < ary.length; i++) {
                            eachWithIndex(i, ary[i], next);
                        }
                    }
                    exports.decodePayload = function (data, binaryType, callback) {
                        if (typeof data !== 'string') {
                            return exports.decodePayloadAsBinary(data, binaryType, callback);
                        }
                        if (typeof binaryType === 'function') {
                            callback = binaryType;
                            binaryType = null;
                        }
                        var packet;
                        if (data === '') {
                            return callback(err, 0, 1);
                        }
                        var length = '', n, msg;
                        for (var i = 0, l = data.length; i < l; i++) {
                            var chr = data.charAt(i);
                            if (chr !== ':') {
                                length += chr;
                                continue;
                            }
                            if (length === '' || length != (n = Number(length))) {
                                return callback(err, 0, 1);
                            }
                            msg = data.substr(i + 1, n);
                            if (length != msg.length) {
                                return callback(err, 0, 1);
                            }
                            if (msg.length) {
                                packet = exports.decodePacket(msg, binaryType, false);
                                if (err.type === packet.type && err.data === packet.data) {
                                    return callback(err, 0, 1);
                                }
                                var ret = callback(packet, i + n, l);
                                if (false === ret)
                                    return;
                            }
                            i += n;
                            length = '';
                        }
                        if (length !== '') {
                            return callback(err, 0, 1);
                        }
                    };
                    exports.encodePayloadAsArrayBuffer = function (packets, callback) {
                        if (!packets.length) {
                            return callback(new ArrayBuffer(0));
                        }
                        function encodeOne(packet, doneCallback) {
                            exports.encodePacket(packet, true, true, function (data) {
                                return doneCallback(null, data);
                            });
                        }
                        map(packets, encodeOne, function (err, encodedPackets) {
                            var totalLength = encodedPackets.reduce(function (acc, p) {
                                    var len;
                                    if (typeof p === 'string') {
                                        len = p.length;
                                    } else {
                                        len = p.byteLength;
                                    }
                                    return acc + len.toString().length + len + 2;
                                }, 0);
                            var resultArray = new Uint8Array(totalLength);
                            var bufferIndex = 0;
                            encodedPackets.forEach(function (p) {
                                var isString = typeof p === 'string';
                                var ab = p;
                                if (isString) {
                                    var view = new Uint8Array(p.length);
                                    for (var i = 0; i < p.length; i++) {
                                        view[i] = p.charCodeAt(i);
                                    }
                                    ab = view.buffer;
                                }
                                if (isString) {
                                    resultArray[bufferIndex++] = 0;
                                } else {
                                    resultArray[bufferIndex++] = 1;
                                }
                                var lenStr = ab.byteLength.toString();
                                for (var i = 0; i < lenStr.length; i++) {
                                    resultArray[bufferIndex++] = parseInt(lenStr[i]);
                                }
                                resultArray[bufferIndex++] = 255;
                                var view = new Uint8Array(ab);
                                for (var i = 0; i < view.length; i++) {
                                    resultArray[bufferIndex++] = view[i];
                                }
                            });
                            return callback(resultArray.buffer);
                        });
                    };
                    exports.encodePayloadAsBlob = function (packets, callback) {
                        function encodeOne(packet, doneCallback) {
                            exports.encodePacket(packet, true, true, function (encoded) {
                                var binaryIdentifier = new Uint8Array(1);
                                binaryIdentifier[0] = 1;
                                if (typeof encoded === 'string') {
                                    var view = new Uint8Array(encoded.length);
                                    for (var i = 0; i < encoded.length; i++) {
                                        view[i] = encoded.charCodeAt(i);
                                    }
                                    encoded = view.buffer;
                                    binaryIdentifier[0] = 0;
                                }
                                var len = encoded instanceof ArrayBuffer ? encoded.byteLength : encoded.size;
                                var lenStr = len.toString();
                                var lengthAry = new Uint8Array(lenStr.length + 1);
                                for (var i = 0; i < lenStr.length; i++) {
                                    lengthAry[i] = parseInt(lenStr[i]);
                                }
                                lengthAry[lenStr.length] = 255;
                                if (Blob) {
                                    var blob = new Blob([
                                            binaryIdentifier.buffer,
                                            lengthAry.buffer,
                                            encoded
                                        ]);
                                    doneCallback(null, blob);
                                }
                            });
                        }
                        map(packets, encodeOne, function (err, results) {
                            return callback(new Blob(results));
                        });
                    };
                    exports.decodePayloadAsBinary = function (data, binaryType, callback) {
                        if (typeof binaryType === 'function') {
                            callback = binaryType;
                            binaryType = null;
                        }
                        var bufferTail = data;
                        var buffers = [];
                        while (bufferTail.byteLength > 0) {
                            var tailArray = new Uint8Array(bufferTail);
                            var isString = tailArray[0] === 0;
                            var msgLength = '';
                            for (var i = 1;; i++) {
                                if (tailArray[i] === 255)
                                    break;
                                if (msgLength.length > 310) {
                                    return callback(err, 0, 1);
                                }
                                msgLength += tailArray[i];
                            }
                            bufferTail = sliceBuffer(bufferTail, 2 + msgLength.length);
                            msgLength = parseInt(msgLength);
                            var msg = sliceBuffer(bufferTail, 0, msgLength);
                            if (isString) {
                                try {
                                    msg = String.fromCharCode.apply(null, new Uint8Array(msg));
                                } catch (e) {
                                    var typed = new Uint8Array(msg);
                                    msg = '';
                                    for (var i = 0; i < typed.length; i++) {
                                        msg += String.fromCharCode(typed[i]);
                                    }
                                }
                            }
                            buffers.push(msg);
                            bufferTail = sliceBuffer(bufferTail, msgLength);
                        }
                        var total = buffers.length;
                        buffers.forEach(function (buffer, i) {
                            callback(exports.decodePacket(buffer, binaryType, true), i, total);
                        });
                    };
                },
                function (module, exports) {
                    module.exports = Object.keys || function keys(obj) {
                        var arr = [];
                        var has = Object.prototype.hasOwnProperty;
                        for (var i in obj) {
                            if (has.call(obj, i)) {
                                arr.push(i);
                            }
                        }
                        return arr;
                    };
                },
                function (module, exports, __webpack_require__) {
                    var isArray = __webpack_require__(7);
                    var toString = Object.prototype.toString;
                    var withNativeBlob = typeof Blob === 'function' || typeof Blob !== 'undefined' && toString.call(Blob) === '[object BlobConstructor]';
                    var withNativeFile = typeof File === 'function' || typeof File !== 'undefined' && toString.call(File) === '[object FileConstructor]';
                    module.exports = hasBinary;
                    function hasBinary(obj) {
                        if (!obj || typeof obj !== 'object') {
                            return false;
                        }
                        if (isArray(obj)) {
                            for (var i = 0, l = obj.length; i < l; i++) {
                                if (hasBinary(obj[i])) {
                                    return true;
                                }
                            }
                            return false;
                        }
                        if (typeof Buffer === 'function' && Buffer.isBuffer && Buffer.isBuffer(obj) || typeof ArrayBuffer === 'function' && obj instanceof ArrayBuffer || withNativeBlob && obj instanceof Blob || withNativeFile && obj instanceof File) {
                            return true;
                        }
                        if (obj.toJSON && typeof obj.toJSON === 'function' && arguments.length === 1) {
                            return hasBinary(obj.toJSON(), true);
                        }
                        for (var key in obj) {
                            if (Object.prototype.hasOwnProperty.call(obj, key) && hasBinary(obj[key])) {
                                return true;
                            }
                        }
                        return false;
                    }
                },
                function (module, exports) {
                    module.exports = function (arraybuffer, start, end) {
                        var bytes = arraybuffer.byteLength;
                        start = start || 0;
                        end = end || bytes;
                        if (arraybuffer.slice) {
                            return arraybuffer.slice(start, end);
                        }
                        if (start < 0) {
                            start += bytes;
                        }
                        if (end < 0) {
                            end += bytes;
                        }
                        if (end > bytes) {
                            end = bytes;
                        }
                        if (start >= bytes || start >= end || bytes === 0) {
                            return new ArrayBuffer(0);
                        }
                        var abv = new Uint8Array(arraybuffer);
                        var result = new Uint8Array(end - start);
                        for (var i = start, ii = 0; i < end; i++, ii++) {
                            result[ii] = abv[i];
                        }
                        return result.buffer;
                    };
                },
                function (module, exports) {
                    module.exports = after;
                    function after(count, callback, err_cb) {
                        var bail = false;
                        err_cb = err_cb || noop;
                        proxy.count = count;
                        return count === 0 ? callback() : proxy;
                        function proxy(err, result) {
                            if (proxy.count <= 0) {
                                throw new Error('after called too many times');
                            }
                            --proxy.count;
                            if (err) {
                                bail = true;
                                callback(err);
                                callback = err_cb;
                            } else if (proxy.count === 0 && !bail) {
                                callback(null, result);
                            }
                        }
                    }
                    function noop() {
                    }
                },
                function (module, exports) {
                    var stringFromCharCode = String.fromCharCode;
                    function ucs2decode(string) {
                        var output = [];
                        var counter = 0;
                        var length = string.length;
                        var value;
                        var extra;
                        while (counter < length) {
                            value = string.charCodeAt(counter++);
                            if (value >= 55296 && value <= 56319 && counter < length) {
                                extra = string.charCodeAt(counter++);
                                if ((extra & 64512) == 56320) {
                                    output.push(((value & 1023) << 10) + (extra & 1023) + 65536);
                                } else {
                                    output.push(value);
                                    counter--;
                                }
                            } else {
                                output.push(value);
                            }
                        }
                        return output;
                    }
                    function ucs2encode(array) {
                        var length = array.length;
                        var index = -1;
                        var value;
                        var output = '';
                        while (++index < length) {
                            value = array[index];
                            if (value > 65535) {
                                value -= 65536;
                                output += stringFromCharCode(value >>> 10 & 1023 | 55296);
                                value = 56320 | value & 1023;
                            }
                            output += stringFromCharCode(value);
                        }
                        return output;
                    }
                    function checkScalarValue(codePoint, strict) {
                        if (codePoint >= 55296 && codePoint <= 57343) {
                            if (strict) {
                                throw Error('Lone surrogate U+' + codePoint.toString(16).toUpperCase() + ' is not a scalar value');
                            }
                            return false;
                        }
                        return true;
                    }
                    function createByte(codePoint, shift) {
                        return stringFromCharCode(codePoint >> shift & 63 | 128);
                    }
                    function encodeCodePoint(codePoint, strict) {
                        if ((codePoint & 4294967168) == 0) {
                            return stringFromCharCode(codePoint);
                        }
                        var symbol = '';
                        if ((codePoint & 4294965248) == 0) {
                            symbol = stringFromCharCode(codePoint >> 6 & 31 | 192);
                        } else if ((codePoint & 4294901760) == 0) {
                            if (!checkScalarValue(codePoint, strict)) {
                                codePoint = 65533;
                            }
                            symbol = stringFromCharCode(codePoint >> 12 & 15 | 224);
                            symbol += createByte(codePoint, 6);
                        } else if ((codePoint & 4292870144) == 0) {
                            symbol = stringFromCharCode(codePoint >> 18 & 7 | 240);
                            symbol += createByte(codePoint, 12);
                            symbol += createByte(codePoint, 6);
                        }
                        symbol += stringFromCharCode(codePoint & 63 | 128);
                        return symbol;
                    }
                    function utf8encode(string, opts) {
                        opts = opts || {};
                        var strict = false !== opts.strict;
                        var codePoints = ucs2decode(string);
                        var length = codePoints.length;
                        var index = -1;
                        var codePoint;
                        var byteString = '';
                        while (++index < length) {
                            codePoint = codePoints[index];
                            byteString += encodeCodePoint(codePoint, strict);
                        }
                        return byteString;
                    }
                    function readContinuationByte() {
                        if (byteIndex >= byteCount) {
                            throw Error('Invalid byte index');
                        }
                        var continuationByte = byteArray[byteIndex] & 255;
                        byteIndex++;
                        if ((continuationByte & 192) == 128) {
                            return continuationByte & 63;
                        }
                        throw Error('Invalid continuation byte');
                    }
                    function decodeSymbol(strict) {
                        var byte1;
                        var byte2;
                        var byte3;
                        var byte4;
                        var codePoint;
                        if (byteIndex > byteCount) {
                            throw Error('Invalid byte index');
                        }
                        if (byteIndex == byteCount) {
                            return false;
                        }
                        byte1 = byteArray[byteIndex] & 255;
                        byteIndex++;
                        if ((byte1 & 128) == 0) {
                            return byte1;
                        }
                        if ((byte1 & 224) == 192) {
                            byte2 = readContinuationByte();
                            codePoint = (byte1 & 31) << 6 | byte2;
                            if (codePoint >= 128) {
                                return codePoint;
                            } else {
                                throw Error('Invalid continuation byte');
                            }
                        }
                        if ((byte1 & 240) == 224) {
                            byte2 = readContinuationByte();
                            byte3 = readContinuationByte();
                            codePoint = (byte1 & 15) << 12 | byte2 << 6 | byte3;
                            if (codePoint >= 2048) {
                                return checkScalarValue(codePoint, strict) ? codePoint : 65533;
                            } else {
                                throw Error('Invalid continuation byte');
                            }
                        }
                        if ((byte1 & 248) == 240) {
                            byte2 = readContinuationByte();
                            byte3 = readContinuationByte();
                            byte4 = readContinuationByte();
                            codePoint = (byte1 & 7) << 18 | byte2 << 12 | byte3 << 6 | byte4;
                            if (codePoint >= 65536 && codePoint <= 1114111) {
                                return codePoint;
                            }
                        }
                        throw Error('Invalid UTF-8 detected');
                    }
                    var byteArray;
                    var byteCount;
                    var byteIndex;
                    function utf8decode(byteString, opts) {
                        opts = opts || {};
                        var strict = false !== opts.strict;
                        byteArray = ucs2decode(byteString);
                        byteCount = byteArray.length;
                        byteIndex = 0;
                        var codePoints = [];
                        var tmp;
                        while ((tmp = decodeSymbol(strict)) !== false) {
                            codePoints.push(tmp);
                        }
                        return ucs2encode(codePoints);
                    }
                    module.exports = {
                        version: '2.1.2',
                        encode: utf8encode,
                        decode: utf8decode
                    };
                },
                function (module, exports) {
                    (function () {
                        'use strict';
                        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
                        var lookup = new Uint8Array(256);
                        for (var i = 0; i < chars.length; i++) {
                            lookup[chars.charCodeAt(i)] = i;
                        }
                        exports.encode = function (arraybuffer) {
                            var bytes = new Uint8Array(arraybuffer), i, len = bytes.length, base64 = '';
                            for (i = 0; i < len; i += 3) {
                                base64 += chars[bytes[i] >> 2];
                                base64 += chars[(bytes[i] & 3) << 4 | bytes[i + 1] >> 4];
                                base64 += chars[(bytes[i + 1] & 15) << 2 | bytes[i + 2] >> 6];
                                base64 += chars[bytes[i + 2] & 63];
                            }
                            if (len % 3 === 2) {
                                base64 = base64.substring(0, base64.length - 1) + '=';
                            } else if (len % 3 === 1) {
                                base64 = base64.substring(0, base64.length - 2) + '==';
                            }
                            return base64;
                        };
                        exports.decode = function (base64) {
                            var bufferLength = base64.length * 0.75, len = base64.length, i, p = 0, encoded1, encoded2, encoded3, encoded4;
                            if (base64[base64.length - 1] === '=') {
                                bufferLength--;
                                if (base64[base64.length - 2] === '=') {
                                    bufferLength--;
                                }
                            }
                            var arraybuffer = new ArrayBuffer(bufferLength), bytes = new Uint8Array(arraybuffer);
                            for (i = 0; i < len; i += 4) {
                                encoded1 = lookup[base64.charCodeAt(i)];
                                encoded2 = lookup[base64.charCodeAt(i + 1)];
                                encoded3 = lookup[base64.charCodeAt(i + 2)];
                                encoded4 = lookup[base64.charCodeAt(i + 3)];
                                bytes[p++] = encoded1 << 2 | encoded2 >> 4;
                                bytes[p++] = (encoded2 & 15) << 4 | encoded3 >> 2;
                                bytes[p++] = (encoded3 & 3) << 6 | encoded4 & 63;
                            }
                            return arraybuffer;
                        };
                    }());
                },
                function (module, exports) {
                    var BlobBuilder = typeof BlobBuilder !== 'undefined' ? BlobBuilder : typeof WebKitBlobBuilder !== 'undefined' ? WebKitBlobBuilder : typeof MSBlobBuilder !== 'undefined' ? MSBlobBuilder : typeof MozBlobBuilder !== 'undefined' ? MozBlobBuilder : false;
                    var blobSupported = function () {
                            try {
                                var a = new Blob(['hi']);
                                return a.size === 2;
                            } catch (e) {
                                return false;
                            }
                        }();
                    var blobSupportsArrayBufferView = blobSupported && function () {
                            try {
                                var b = new Blob([new Uint8Array([
                                            1,
                                            2
                                        ])]);
                                return b.size === 2;
                            } catch (e) {
                                return false;
                            }
                        }();
                    var blobBuilderSupported = BlobBuilder && BlobBuilder.prototype.append && BlobBuilder.prototype.getBlob;
                    function mapArrayBufferViews(ary) {
                        return ary.map(function (chunk) {
                            if (chunk.buffer instanceof ArrayBuffer) {
                                var buf = chunk.buffer;
                                if (chunk.byteLength !== buf.byteLength) {
                                    var copy = new Uint8Array(chunk.byteLength);
                                    copy.set(new Uint8Array(buf, chunk.byteOffset, chunk.byteLength));
                                    buf = copy.buffer;
                                }
                                return buf;
                            }
                            return chunk;
                        });
                    }
                    function BlobBuilderConstructor(ary, options) {
                        options = options || {};
                        var bb = new BlobBuilder();
                        mapArrayBufferViews(ary).forEach(function (part) {
                            bb.append(part);
                        });
                        return options.type ? bb.getBlob(options.type) : bb.getBlob();
                    }
                    ;
                    function BlobConstructor(ary, options) {
                        return new Blob(mapArrayBufferViews(ary), options || {});
                    }
                    ;
                    if (typeof Blob !== 'undefined') {
                        BlobBuilderConstructor.prototype = Blob.prototype;
                        BlobConstructor.prototype = Blob.prototype;
                    }
                    module.exports = function () {
                        if (blobSupported) {
                            return blobSupportsArrayBufferView ? Blob : BlobConstructor;
                        } else if (blobBuilderSupported) {
                            return BlobBuilderConstructor;
                        } else {
                            return undefined;
                        }
                    }();
                },
                function (module, exports) {
                    exports.encode = function (obj) {
                        var str = '';
                        for (var i in obj) {
                            if (obj.hasOwnProperty(i)) {
                                if (str.length)
                                    str += '&';
                                str += encodeURIComponent(i) + '=' + encodeURIComponent(obj[i]);
                            }
                        }
                        return str;
                    };
                    exports.decode = function (qs) {
                        var qry = {};
                        var pairs = qs.split('&');
                        for (var i = 0, l = pairs.length; i < l; i++) {
                            var pair = pairs[i].split('=');
                            qry[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
                        }
                        return qry;
                    };
                },
                function (module, exports) {
                    module.exports = function (a, b) {
                        var fn = function () {
                        };
                        fn.prototype = b.prototype;
                        a.prototype = new fn();
                        a.prototype.constructor = a;
                    };
                },
                function (module, exports) {
                    'use strict';
                    var alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_'.split(''), length = 64, map = {}, seed = 0, i = 0, prev;
                    function encode(num) {
                        var encoded = '';
                        do {
                            encoded = alphabet[num % length] + encoded;
                            num = Math.floor(num / length);
                        } while (num > 0);
                        return encoded;
                    }
                    function decode(str) {
                        var decoded = 0;
                        for (i = 0; i < str.length; i++) {
                            decoded = decoded * length + map[str.charAt(i)];
                        }
                        return decoded;
                    }
                    function yeast() {
                        var now = encode(+new Date());
                        if (now !== prev)
                            return seed = 0, prev = now;
                        return now + '.' + encode(seed++);
                    }
                    for (; i < length; i++)
                        map[alphabet[i]] = i;
                    yeast.encode = encode;
                    yeast.decode = decode;
                    module.exports = yeast;
                },
                function (module, exports, __webpack_require__) {
                    (function (global) {
                        var Polling = __webpack_require__(16);
                        var inherit = __webpack_require__(27);
                        module.exports = JSONPPolling;
                        var rNewline = /\n/g;
                        var rEscapedNewline = /\\n/g;
                        var callbacks;
                        function empty() {
                        }
                        function glob() {
                            return typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : {};
                        }
                        function JSONPPolling(opts) {
                            Polling.call(this, opts);
                            this.query = this.query || {};
                            if (!callbacks) {
                                var global = glob();
                                callbacks = global.___eio = global.___eio || [];
                            }
                            this.index = callbacks.length;
                            var self = this;
                            callbacks.push(function (msg) {
                                self.onData(msg);
                            });
                            this.query.j = this.index;
                            if (typeof addEventListener === 'function') {
                                addEventListener('beforeunload', function () {
                                    if (self.script)
                                        self.script.onerror = empty;
                                }, false);
                            }
                        }
                        inherit(JSONPPolling, Polling);
                        JSONPPolling.prototype.supportsBinary = false;
                        JSONPPolling.prototype.doClose = function () {
                            if (this.script) {
                                this.script.parentNode.removeChild(this.script);
                                this.script = null;
                            }
                            if (this.form) {
                                this.form.parentNode.removeChild(this.form);
                                this.form = null;
                                this.iframe = null;
                            }
                            Polling.prototype.doClose.call(this);
                        };
                        JSONPPolling.prototype.doPoll = function () {
                            var self = this;
                            var script = document.createElement('script');
                            if (this.script) {
                                this.script.parentNode.removeChild(this.script);
                                this.script = null;
                            }
                            script.async = true;
                            script.src = this.uri();
                            script.onerror = function (e) {
                                self.onError('jsonp poll error', e);
                            };
                            var insertAt = document.getElementsByTagName('script')[0];
                            if (insertAt) {
                                insertAt.parentNode.insertBefore(script, insertAt);
                            } else {
                                (document.head || document.body).appendChild(script);
                            }
                            this.script = script;
                            var isUAgecko = 'undefined' !== typeof navigator && /gecko/i.test(navigator.userAgent);
                            if (isUAgecko) {
                                setTimeout(function () {
                                    var iframe = document.createElement('iframe');
                                    document.body.appendChild(iframe);
                                    document.body.removeChild(iframe);
                                }, 100);
                            }
                        };
                        JSONPPolling.prototype.doWrite = function (data, fn) {
                            var self = this;
                            if (!this.form) {
                                var form = document.createElement('form');
                                var area = document.createElement('textarea');
                                var id = this.iframeId = 'eio_iframe_' + this.index;
                                var iframe;
                                form.className = 'socketio';
                                form.style.position = 'absolute';
                                form.style.top = '-1000px';
                                form.style.left = '-1000px';
                                form.target = id;
                                form.method = 'POST';
                                form.setAttribute('accept-charset', 'utf-8');
                                area.name = 'd';
                                form.appendChild(area);
                                document.body.appendChild(form);
                                this.form = form;
                                this.area = area;
                            }
                            this.form.action = this.uri();
                            function complete() {
                                initIframe();
                                fn();
                            }
                            function initIframe() {
                                if (self.iframe) {
                                    try {
                                        self.form.removeChild(self.iframe);
                                    } catch (e) {
                                        self.onError('jsonp polling iframe removal error', e);
                                    }
                                }
                                try {
                                    var html = '<iframe src="javascript:0" name="' + self.iframeId + '">';
                                    iframe = document.createElement(html);
                                } catch (e) {
                                    iframe = document.createElement('iframe');
                                    iframe.name = self.iframeId;
                                    iframe.src = 'javascript:0';
                                }
                                iframe.id = self.iframeId;
                                self.form.appendChild(iframe);
                                self.iframe = iframe;
                            }
                            initIframe();
                            data = data.replace(rEscapedNewline, '\\\n');
                            this.area.value = data.replace(rNewline, '\\n');
                            try {
                                this.form.submit();
                            } catch (e) {
                            }
                            if (this.iframe.attachEvent) {
                                this.iframe.onreadystatechange = function () {
                                    if (self.iframe.readyState === 'complete') {
                                        complete();
                                    }
                                };
                            } else {
                                this.iframe.onload = complete;
                            }
                        };
                    }.call(exports, function () {
                        return this;
                    }()));
                },
                function (module, exports, __webpack_require__) {
                    var Transport = __webpack_require__(17);
                    var parser = __webpack_require__(18);
                    var parseqs = __webpack_require__(26);
                    var inherit = __webpack_require__(27);
                    var yeast = __webpack_require__(28);
                    var debug = __webpack_require__(3)('engine.io-client:websocket');
                    var BrowserWebSocket, NodeWebSocket;
                    if (typeof WebSocket !== 'undefined') {
                        BrowserWebSocket = WebSocket;
                    } else if (typeof self !== 'undefined') {
                        BrowserWebSocket = self.WebSocket || self.MozWebSocket;
                    }
                    if (typeof window === 'undefined') {
                        try {
                            NodeWebSocket = __webpack_require__(31);
                        } catch (e) {
                        }
                    }
                    var WebSocketImpl = BrowserWebSocket || NodeWebSocket;
                    module.exports = WS;
                    function WS(opts) {
                        var forceBase64 = opts && opts.forceBase64;
                        if (forceBase64) {
                            this.supportsBinary = false;
                        }
                        this.perMessageDeflate = opts.perMessageDeflate;
                        this.usingBrowserWebSocket = BrowserWebSocket && !opts.forceNode;
                        this.protocols = opts.protocols;
                        if (!this.usingBrowserWebSocket) {
                            WebSocketImpl = NodeWebSocket;
                        }
                        Transport.call(this, opts);
                    }
                    inherit(WS, Transport);
                    WS.prototype.name = 'websocket';
                    WS.prototype.supportsBinary = true;
                    WS.prototype.doOpen = function () {
                        if (!this.check()) {
                            return;
                        }
                        var uri = this.uri();
                        var protocols = this.protocols;
                        var opts = {
                                agent: this.agent,
                                perMessageDeflate: this.perMessageDeflate
                            };
                        opts.pfx = this.pfx;
                        opts.key = this.key;
                        opts.passphrase = this.passphrase;
                        opts.cert = this.cert;
                        opts.ca = this.ca;
                        opts.ciphers = this.ciphers;
                        opts.rejectUnauthorized = this.rejectUnauthorized;
                        if (this.extraHeaders) {
                            opts.headers = this.extraHeaders;
                        }
                        if (this.localAddress) {
                            opts.localAddress = this.localAddress;
                        }
                        try {
                            this.ws = this.usingBrowserWebSocket && !this.isReactNative ? protocols ? new WebSocketImpl(uri, protocols) : new WebSocketImpl(uri) : new WebSocketImpl(uri, protocols, opts);
                        } catch (err) {
                            return this.emit('error', err);
                        }
                        if (this.ws.binaryType === undefined) {
                            this.supportsBinary = false;
                        }
                        if (this.ws.supports && this.ws.supports.binary) {
                            this.supportsBinary = true;
                            this.ws.binaryType = 'nodebuffer';
                        } else {
                            this.ws.binaryType = 'arraybuffer';
                        }
                        this.addEventListeners();
                    };
                    WS.prototype.addEventListeners = function () {
                        var self = this;
                        this.ws.onopen = function () {
                            self.onOpen();
                        };
                        this.ws.onclose = function () {
                            self.onClose();
                        };
                        this.ws.onmessage = function (ev) {
                            self.onData(ev.data);
                        };
                        this.ws.onerror = function (e) {
                            self.onError('websocket error', e);
                        };
                    };
                    WS.prototype.write = function (packets) {
                        var self = this;
                        this.writable = false;
                        var total = packets.length;
                        for (var i = 0, l = total; i < l; i++) {
                            (function (packet) {
                                parser.encodePacket(packet, self.supportsBinary, function (data) {
                                    if (!self.usingBrowserWebSocket) {
                                        var opts = {};
                                        if (packet.options) {
                                            opts.compress = packet.options.compress;
                                        }
                                        if (self.perMessageDeflate) {
                                            var len = 'string' === typeof data ? Buffer.byteLength(data) : data.length;
                                            if (len < self.perMessageDeflate.threshold) {
                                                opts.compress = false;
                                            }
                                        }
                                    }
                                    try {
                                        if (self.usingBrowserWebSocket) {
                                            self.ws.send(data);
                                        } else {
                                            self.ws.send(data, opts);
                                        }
                                    } catch (e) {
                                    }
                                    --total || done();
                                });
                            }(packets[i]));
                        }
                        function done() {
                            self.emit('flush');
                            setTimeout(function () {
                                self.writable = true;
                                self.emit('drain');
                            }, 0);
                        }
                    };
                    WS.prototype.onClose = function () {
                        Transport.prototype.onClose.call(this);
                    };
                    WS.prototype.doClose = function () {
                        if (typeof this.ws !== 'undefined') {
                            this.ws.close();
                        }
                    };
                    WS.prototype.uri = function () {
                        var query = this.query || {};
                        var schema = this.secure ? 'wss' : 'ws';
                        var port = '';
                        if (this.port && ('wss' === schema && Number(this.port) !== 443 || 'ws' === schema && Number(this.port) !== 80)) {
                            port = ':' + this.port;
                        }
                        if (this.timestampRequests) {
                            query[this.timestampParam] = yeast();
                        }
                        if (!this.supportsBinary) {
                            query.b64 = 1;
                        }
                        query = parseqs.encode(query);
                        if (query.length) {
                            query = '?' + query;
                        }
                        var ipv6 = this.hostname.indexOf(':') !== -1;
                        return schema + '://' + (ipv6 ? '[' + this.hostname + ']' : this.hostname) + port + this.path + query;
                    };
                    WS.prototype.check = function () {
                        return !!WebSocketImpl && !('__initialize' in WebSocketImpl && this.name === WS.prototype.name);
                    };
                },
                function (module, exports) {
                },
                function (module, exports) {
                    var indexOf = [].indexOf;
                    module.exports = function (arr, obj) {
                        if (indexOf)
                            return arr.indexOf(obj);
                        for (var i = 0; i < arr.length; ++i) {
                            if (arr[i] === obj)
                                return i;
                        }
                        return -1;
                    };
                },
                function (module, exports, __webpack_require__) {
                    'use strict';
                    var _typeof = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol' ? function (obj) {
                            return typeof obj;
                        } : function (obj) {
                            return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj;
                        };
                    var parser = __webpack_require__(4);
                    var Emitter = __webpack_require__(5);
                    var toArray = __webpack_require__(34);
                    var on = __webpack_require__(35);
                    var bind = __webpack_require__(36);
                    var debug = __webpack_require__(3)('socket.io-client:socket');
                    var parseqs = __webpack_require__(26);
                    var hasBin = __webpack_require__(20);
                    module.exports = exports = Socket;
                    var events = {
                            connect: 1,
                            connect_error: 1,
                            connect_timeout: 1,
                            connecting: 1,
                            disconnect: 1,
                            error: 1,
                            reconnect: 1,
                            reconnect_attempt: 1,
                            reconnect_failed: 1,
                            reconnect_error: 1,
                            reconnecting: 1,
                            ping: 1,
                            pong: 1
                        };
                    var emit = Emitter.prototype.emit;
                    function Socket(io, nsp, opts) {
                        this.io = io;
                        this.nsp = nsp;
                        this.json = this;
                        this.ids = 0;
                        this.acks = {};
                        this.receiveBuffer = [];
                        this.sendBuffer = [];
                        this.connected = false;
                        this.disconnected = true;
                        this.flags = {};
                        if (opts && opts.query) {
                            this.query = opts.query;
                        }
                        if (this.io.autoConnect)
                            this.open();
                    }
                    Emitter(Socket.prototype);
                    Socket.prototype.subEvents = function () {
                        if (this.subs)
                            return;
                        var io = this.io;
                        this.subs = [
                            on(io, 'open', bind(this, 'onopen')),
                            on(io, 'packet', bind(this, 'onpacket')),
                            on(io, 'close', bind(this, 'onclose'))
                        ];
                    };
                    Socket.prototype.open = Socket.prototype.connect = function () {
                        if (this.connected)
                            return this;
                        this.subEvents();
                        this.io.open();
                        if ('open' === this.io.readyState)
                            this.onopen();
                        this.emit('connecting');
                        return this;
                    };
                    Socket.prototype.send = function () {
                        var args = toArray(arguments);
                        args.unshift('message');
                        this.emit.apply(this, args);
                        return this;
                    };
                    Socket.prototype.emit = function (ev) {
                        if (events.hasOwnProperty(ev)) {
                            emit.apply(this, arguments);
                            return this;
                        }
                        var args = toArray(arguments);
                        var packet = {
                                type: (this.flags.binary !== undefined ? this.flags.binary : hasBin(args)) ? parser.BINARY_EVENT : parser.EVENT,
                                data: args
                            };
                        packet.options = {};
                        packet.options.compress = !this.flags || false !== this.flags.compress;
                        if ('function' === typeof args[args.length - 1]) {
                            this.acks[this.ids] = args.pop();
                            packet.id = this.ids++;
                        }
                        if (this.connected) {
                            this.packet(packet);
                        } else {
                            this.sendBuffer.push(packet);
                        }
                        this.flags = {};
                        return this;
                    };
                    Socket.prototype.packet = function (packet) {
                        packet.nsp = this.nsp;
                        this.io.packet(packet);
                    };
                    Socket.prototype.onopen = function () {
                        if ('/' !== this.nsp) {
                            if (this.query) {
                                var query = _typeof(this.query) === 'object' ? parseqs.encode(this.query) : this.query;
                                this.packet({
                                    type: parser.CONNECT,
                                    query: query
                                });
                            } else {
                                this.packet({ type: parser.CONNECT });
                            }
                        }
                    };
                    Socket.prototype.onclose = function (reason) {
                        this.connected = false;
                        this.disconnected = true;
                        delete this.id;
                        this.emit('disconnect', reason);
                    };
                    Socket.prototype.onpacket = function (packet) {
                        var sameNamespace = packet.nsp === this.nsp;
                        var rootNamespaceError = packet.type === parser.ERROR && packet.nsp === '/';
                        if (!sameNamespace && !rootNamespaceError)
                            return;
                        switch (packet.type) {
                        case parser.CONNECT:
                            this.onconnect();
                            break;
                        case parser.EVENT:
                            this.onevent(packet);
                            break;
                        case parser.BINARY_EVENT:
                            this.onevent(packet);
                            break;
                        case parser.ACK:
                            this.onack(packet);
                            break;
                        case parser.BINARY_ACK:
                            this.onack(packet);
                            break;
                        case parser.DISCONNECT:
                            this.ondisconnect();
                            break;
                        case parser.ERROR:
                            this.emit('error', packet.data);
                            break;
                        }
                    };
                    Socket.prototype.onevent = function (packet) {
                        var args = packet.data || [];
                        if (null != packet.id) {
                            args.push(this.ack(packet.id));
                        }
                        if (this.connected) {
                            emit.apply(this, args);
                        } else {
                            this.receiveBuffer.push(args);
                        }
                    };
                    Socket.prototype.ack = function (id) {
                        var self = this;
                        var sent = false;
                        return function () {
                            if (sent)
                                return;
                            sent = true;
                            var args = toArray(arguments);
                            self.packet({
                                type: hasBin(args) ? parser.BINARY_ACK : parser.ACK,
                                id: id,
                                data: args
                            });
                        };
                    };
                    Socket.prototype.onack = function (packet) {
                        var ack = this.acks[packet.id];
                        if ('function' === typeof ack) {
                            ack.apply(this, packet.data);
                            delete this.acks[packet.id];
                        } else {
                        }
                    };
                    Socket.prototype.onconnect = function () {
                        this.connected = true;
                        this.disconnected = false;
                        this.emit('connect');
                        this.emitBuffered();
                    };
                    Socket.prototype.emitBuffered = function () {
                        var i;
                        for (i = 0; i < this.receiveBuffer.length; i++) {
                            emit.apply(this, this.receiveBuffer[i]);
                        }
                        this.receiveBuffer = [];
                        for (i = 0; i < this.sendBuffer.length; i++) {
                            this.packet(this.sendBuffer[i]);
                        }
                        this.sendBuffer = [];
                    };
                    Socket.prototype.ondisconnect = function () {
                        this.destroy();
                        this.onclose('io server disconnect');
                    };
                    Socket.prototype.destroy = function () {
                        if (this.subs) {
                            for (var i = 0; i < this.subs.length; i++) {
                                this.subs[i].destroy();
                            }
                            this.subs = null;
                        }
                        this.io.destroy(this);
                    };
                    Socket.prototype.close = Socket.prototype.disconnect = function () {
                        if (this.connected) {
                            this.packet({ type: parser.DISCONNECT });
                        }
                        this.destroy();
                        if (this.connected) {
                            this.onclose('io client disconnect');
                        }
                        return this;
                    };
                    Socket.prototype.compress = function (compress) {
                        this.flags.compress = compress;
                        return this;
                    };
                    Socket.prototype.binary = function (binary) {
                        this.flags.binary = binary;
                        return this;
                    };
                },
                function (module, exports) {
                    module.exports = toArray;
                    function toArray(list, index) {
                        var array = [];
                        index = index || 0;
                        for (var i = index || 0; i < list.length; i++) {
                            array[i - index] = list[i];
                        }
                        return array;
                    }
                },
                function (module, exports) {
                    'use strict';
                    module.exports = on;
                    function on(obj, ev, fn) {
                        obj.on(ev, fn);
                        return {
                            destroy: function destroy() {
                                obj.removeListener(ev, fn);
                            }
                        };
                    }
                },
                function (module, exports) {
                    var slice = [].slice;
                    module.exports = function (obj, fn) {
                        if ('string' == typeof fn)
                            fn = obj[fn];
                        if ('function' != typeof fn)
                            throw new Error('bind() requires a function');
                        var args = slice.call(arguments, 2);
                        return function () {
                            return fn.apply(obj, args.concat(slice.call(arguments)));
                        };
                    };
                },
                function (module, exports) {
                    module.exports = Backoff;
                    function Backoff(opts) {
                        opts = opts || {};
                        this.ms = opts.min || 100;
                        this.max = opts.max || 10000;
                        this.factor = opts.factor || 2;
                        this.jitter = opts.jitter > 0 && opts.jitter <= 1 ? opts.jitter : 0;
                        this.attempts = 0;
                    }
                    Backoff.prototype.duration = function () {
                        var ms = this.ms * Math.pow(this.factor, this.attempts++);
                        if (this.jitter) {
                            var rand = Math.random();
                            var deviation = Math.floor(rand * this.jitter * ms);
                            ms = (Math.floor(rand * 10) & 1) == 0 ? ms - deviation : ms + deviation;
                        }
                        return Math.min(ms, this.max) | 0;
                    };
                    Backoff.prototype.reset = function () {
                        this.attempts = 0;
                    };
                    Backoff.prototype.setMin = function (min) {
                        this.ms = min;
                    };
                    Backoff.prototype.setMax = function (max) {
                        this.max = max;
                    };
                    Backoff.prototype.setJitter = function (jitter) {
                        this.jitter = jitter;
                    };
                }
            ]);
        }));
        ;
    }
});
