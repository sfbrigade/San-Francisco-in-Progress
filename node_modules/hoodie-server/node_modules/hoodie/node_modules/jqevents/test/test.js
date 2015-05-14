var chai     = require('./chai'),
    assert   = chai.assert,
    jqee     = require('..')();
    
describe('Jquery EventEmitter', function() {
    beforeEach(function() {      
        jqee._events = [];
    })
    
    describe('Adding Events', function() {
        it('via space delimited string', function() {   
            jqee.on('one two three', function() {})
                
            assert.equal(1, jqee.listeners('one').length);  
            assert.equal(1, jqee.listeners('two').length);
            assert.equal(1, jqee.listeners('three').length);
        })
        
        it('via event map', function() {
            jqee.on({
                one: function oneFn() {},
                two: function twoFn() {},
                three: function threeFn() {}
            });
        
            assert.equal(1, jqee.listeners('one').length);  
            assert.equal('oneFn', jqee.listeners('one')[0].name);
            assert.equal(1, jqee.listeners('two').length);
            assert.equal('twoFn', jqee.listeners('two')[0].name);
            assert.equal(1, jqee.listeners('three').length);
            assert.equal('threeFn', jqee.listeners('three')[0].name);
        })
    
    
        it('via array', function() {
            jqee.on(['one', 'two', 'three'], function() {})
        
            assert.equal(1, jqee.listeners('one').length);  
            assert.equal(1, jqee.listeners('two').length);
            assert.equal(1, jqee.listeners('three').length);
        })
        
        it('handles namespaces', function() {
            
        })
    })
    
    describe('Removing Events', function() {
        var foo = function() {};
        
        beforeEach(function() {                                    
            jqee._events = [];
            
            jqee.on('one two three', foo)             
        });
        
        it('via space delimted string', function() {                                                    
            jqee.off('one two', foo);
            
            assert.equal(0, jqee.listeners('one').length);              
            assert.equal(0, jqee.listeners('two').length);
            assert.equal(1, jqee.listeners('three').length);
        })
                        
        it('via array', function() {                                                    
            jqee.off(['one', 'three'], foo);
            
            assert.equal(0, jqee.listeners('one').length);              
            assert.equal(1, jqee.listeners('two').length);
            assert.equal(0, jqee.listeners('three').length);
        })
        
        it('via map', function() {                                                    
            jqee.off({two: foo, three: foo});
            
            assert.equal(1, jqee.listeners('one').length);              
            assert.equal(0, jqee.listeners('two').length);
            assert.equal(0, jqee.listeners('three').length);
        })
        
        it('all via namespace', function() {    
            jqee._events = [];
            
            jqee.on({
                "one.thing": function() {},
                "two.thing": function() {},
                "another.thing": function() {}                
            })
            
            assert.equal(1, jqee.listeners('another').length);                          
            assert.equal(1, jqee.listeners('two').length);
            assert.equal(1, jqee.listeners('one').length);                                      
            
            jqee.off('.thing');
            
            assert.equal(0, jqee.listeners('another').length);                          
            assert.equal(0, jqee.listeners('two').length);
            assert.equal(0, jqee.listeners('one').length);                                                              
        })
        
        it('some via namespace', function() {   
            jqee._events = [];
            
            jqee.on({
                "one.thing": function() {},
                "two.thing": function() {},
                "another.thing": function() {},
                "one.thing2": function() {},
                "two.thing2": function() {},
                "another.thing2": function() {}                  
            })
            
            jqee.off('one');
            
            assert.equal(2, jqee.listeners('another').length);                          
            assert.equal(2, jqee.listeners('two').length);
            assert.equal(0, jqee.listeners('one').length); 
            
            jqee.off('two.thing2 another.thing');            
            
            assert.equal(1, jqee.listeners('another').length);                          
            assert.equal(1, jqee.listeners('two').length);
            assert.equal(0, jqee.listeners('one').length); 
        })
    })
    
    describe('Triggering Events', function() {
        beforeEach(function() {
            jqee._events = [];            
        })
        
        it('single events', function() {
            var done = chai.sinon.spy();
            
            jqee.on('testing', done);
            
            jqee.emit('testing');
            
            assert.equal(1, done.callCount);                           
        })
        
        it('single events with namespaces', function() {
            var namespaced = chai.sinon.spy();
            
            jqee.on('one.namespace', namespaced);
            
            jqee.emit('one');
            
            assert(namespaced.calledOnce);                   
            
            jqee.emit('one.other');
            
            assert.equal(namespaced.callCount, 1);
        })
                        
        it('space delimited events', function() {
            var noop = chai.sinon.spy();
            
            jqee.on('one two three', noop);
            
            jqee.emit('three');
            
            assert.equal(1, noop.callCount);                                    
        })                
        
        it('space delimited events with namespaces', function() {
            var namespaced = chai.sinon.spy();
            
            jqee.on('testing.namespace.another testing.other', namespaced);
            
            jqee.emit('testing');
            
            assert.equal(2, namespaced.callCount);
            
            jqee.emit('testing.namespace');            
            
            assert.equal(3, namespaced.callCount);
            
            jqee.emit('testing.other');
            
            assert.equal(4, namespaced.callCount);
            
            jqee.emit('testing.another');            
            
            assert.equal(5, namespaced.callCount);
            
            jqee.emit('testing.nothere');
            
            assert.equal(5, namespaced.callCount);

        })
        
        it('array events', function() {
            var noop = chai.sinon.spy();
            
            jqee.on(['one', 'two', 'three'], noop);
            
            jqee.emit('two');
            
            assert.equal(1, noop.callCount);
        })
        
        it('array events with namespaces', function() {
            var namespaced = chai.sinon.spy();
            
            jqee.on(['one.namespace', 'two.namespace'], namespaced);
            
            jqee.emit('one');
            
            assert(namespaced.calledOnce);                                 
            
            jqee.emit('one.other');
            
            assert.equal(namespaced.callCount, 1);
        })
        
        it('mapped events', function() {
            var noop = chai.sinon.spy();
            
            jqee.on({
                one: noop,
                two: noop,
                three: function() {}
            });
            
            jqee.emit('three');
            
            assert.equal(0, noop.callCount);
            
            jqee.emit('one');
            
            assert.equal(1, noop.callCount);
        }) 
        
        it('mapped events with namespaces', function() {
            var namespaced = chai.sinon.spy();
            
            jqee.on({
                "one.namespace": namespaced,
                "two.namespace": namespaced
            });
            
            jqee.emit('one');
            
            assert(namespaced.calledOnce);        
            
            jqee.emit('one.other');
            
            assert.equal(namespaced.callCount, 1);
        })
        
        it('events with multiple namespaces', function() {
            var namespaced = chai.sinon.spy();
            
            jqee.on('testing.namespace.another.one', namespaced);
            
            jqee.emit('testing.another');
            
            assert(namespaced.calledOnce);
            
            jqee.emit('testing.namespace');
            
            assert(namespaced.calledTwice);
            
            jqee.emit('testing.one');
            
            assert(namespaced.calledThrice);            
            
            jqee.emit('testing.other');
            
            assert.equal(namespaced.callCount, 3);
        })
        
        it('getting the event called', function() {
            var namespaced = chai.sinon.spy();
            
            jqee.on('testing.namespace.another.one', function() {
                namespaced();                
                assert.equal(jqee.emitting.event, 'testing')
                jqee.emitting.namespaces.should.eql(['another']);
            });                        
            
            jqee.emit('testing.another');
            
            assert(namespaced.called);           
        })
    })
})

