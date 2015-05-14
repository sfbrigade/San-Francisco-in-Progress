var EventEmitter = require('events').EventEmitter,
    util  = require('util');

function JqueryEmitter() {
    this.emitting = false;
    
    EventEmitter.call(this);
}

util.inherits(JqueryEmitter, EventEmitter);

function nsMatch(nsIn, nsRegistered) {
    var match = false;
    
    if (Array.isArray(nsIn) && Array.isArray(nsRegistered)) {
        for (var i = 0; i < nsIn.length; i++) {
            if (-1 !== nsRegistered.indexOf(nsIn[i])) {
                match = true;
                break;
            }    
        }    
    }
    
    return match;
}

JqueryEmitter.prototype.emit = function(type) {
    var args = arguments,
        ret  = [],
        _this = this;
  
    type = Array.isArray(type) ? type : type.split(' ');
    
    type.forEach(function(event) {      
        var ns = [],
            handlers,
            newHandlers = [];
            
        if (-1 !== event.indexOf('.') && _this._events) {                            
            ns = event.split('.');
            event = ns.shift();                       
            
            handlers = _this._events[event];
            
            if (handlers) {                
                if (Array.isArray(handlers)) {
                    handlers.forEach(function(handler) {
                        if (nsMatch(ns, handler.__eens)) {
                            newHandlers.push(handler);
                        }
                    })
                    
                    if (newHandlers.length) {
                        _this._events[event] = newHandlers;
                    } else {
                        return;
                    }
                } else if (false == nsMatch(ns, handlers.__eens)){
                    return;
                }
            }                                 
        }
        
        _this.emitting = {event: event, namespaces: ns};
        
        args[0] = event;        
        
        ret.push(EventEmitter.prototype.emit.apply(_this, args));
        
        _this.emitting = false;
        
        if (newHandlers.length) {
            _this._events[event] = handlers;
        }
    })
    
    return ret.length == 1 ? ret[0] : ret;
}

JqueryEmitter.prototype.addListener = function(type, listener) {
    var ns,
        i;
    
    if (-1 !== (i = type.indexOf('.')) && typeof listener == 'function') {
         listener = listener.bind();
         ns = type.split('.');
         type = ns.shift();
         listener.__eens = ns;
    }
    
    return EventEmitter.prototype.addListener.call(this, type, listener);
}

JqueryEmitter.prototype.on = function(type, listener) {
    var isArray = Array.isArray(type),
        _this   = this,
        keys;
    
    if (typeof type == 'string' || isArray) {
        type = isArray ? type : type.split(' ');                
        
        type.forEach(function(ev) {
            _this.addListener(ev, listener);
        })
    } else if (typeof type == 'object') {
        keys = Object.keys(type);
        
        keys.forEach(function(ev) {
            _this.addListener(ev, type[ev]);
        })
    } else {
        EventEmitter.prototype.addListener.call(this, type, listener);
    }           
}

JqueryEmitter.prototype.removeListener = function(type, listener) {
    if (-1 !== type.indexOf('.')) {        
        type = type.split('.').shift();
    }
    
    return EventEmitter.prototype.removeListener.call(this, type, listener);
}

JqueryEmitter.prototype.removeAllListeners = function(type) {
    var ns;

    if (-1 !== type.indexOf('.')) {        
        ns = type.split('.');
        type = ns.shift();  
            
        if (type) {
            this._offNs(ns, type);
        } else {
            if (this._events) {                
                Object.keys(this._events).forEach(this._offNs.bind(this, ns))
            }
        }
    } else {
       EventEmitter.prototype.removeAllListeners.call(this, type);  
    }  
    
    return this;
}

JqueryEmitter.prototype._offNs = function(ns, type) {
    var handlers = this._events && this._events[type],
        _this = this;
            
    if (handlers) {
        if (Array.isArray(handlers)) {                    
            handlers.forEach(function(handler) {
                if (nsMatch(ns, handler.__eens)) {
                    _this.removeListener(type, handler);
                }
            })
        } else if (nsMatch(ns, handlers.__eens)) {
            this.removeListener(type, handlers);
        }
    }
}

JqueryEmitter.prototype.off = function(type, listener) {
    var isArray = Array.isArray(type),
        _this   = this,
        hasListener = typeof listener == 'function',        
        keys;
        
    if (typeof type == 'string' || isArray) {
        type = isArray ? type : type.split(' ');
        
        type.forEach(function(ev) {
            if (hasListener) {
                _this.removeListener(ev, listener);
            } else {
                _this.removeAllListeners(ev);
            }            
        })
    } else if (typeof type == 'object') {
        keys = Object.keys(type);
        
        keys.forEach(function(ev) {
            if (typeof type[ev] == 'function') {
                _this.removeListener(ev, type[ev]);
            } else {
                _this.removeAllListeners(ev);
            }             
        })
    }
      
    return this;
}

module.exports = function(instance) {
    return instance;
}.bind(null, new JqueryEmitter);

var instances = {};

module.exports.create = function(instance) {
    var jqee;
    
    if (instance && instances[instance]) {
        jqee = instances[instance];    
    } else {
        jqee = new JqueryEmitter
    }
    
    return jqee;
};

module.exports.EventEmitter = JqueryEmitter;

