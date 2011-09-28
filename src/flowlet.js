/**
* @namespace Flowlet
*/
var Flowlet = (function(){
    
    var ERROR_TYPE = "ERROR_TYPE";
    
    // Flowlet factory object, containing a `buildFlowlet` function
    // and a function `extend` for enhancing flowlet objects with
    // new functionality.
    var factory = (function () {
        
        /**
         * Flowlet constructor
         * @param {Container}
         * @param {Signal} 
         * @param {Function} 
         * @param {Function}
         */
        var Flowlet = function(container, state, notify, update) {
            
            // Listen to the state of a flowlet
            this.listen = function(f) {
                state.listen(f);
            };
                
            // Render the flowlet to a parent DOM or jQuery node.
            this.renderTo = function(parent){
                // Subscribe to state
                state.listen(function(){});
                container.renderTo(parent);
            
            };
            
            // Creates a dependent flowlet.
            this.bind = function(f) {                    
                var oldForm;                    
                var state2 =                
                    state.bind (function(x) {
                        
                        // Create new form 
                        var form = f(x);
                        
                        // Remove old
                        if( oldForm !== undefined) {
                            oldForm.container.remove();
                        }
                        oldForm = form;
                        container.append(form.container);
                        return form.state;
                    });                        
                
                return new Flowlet(container, state2, notify, update);                                       
            };
                
            this.container = container;
            
            this.state = state;
            
            this.notify = notify;
            
            this.update = update;
            
            this.reset = function() {
                this.notify();
            };

            this.append = function(f, form) {
                
                var container = this.container;                    
                
                container.append(form.container);
                
                var state2 = this.state;
                
                var notify = function (x) {
                    this.notify(x);
                    form.notify(x);
                };
                
                var update = function () {
                    this.update();
                    form.update();
                }; 
                
                return new Flowlet(container, state2, notify, update);
            };
            
            // Mapping the flowlet state
            this.map = function (f) {
                var state2 =  state.map (f);
                return (new Flowlet(container, state2, notify, update));                
            };
            
            // Closing the container around flowlets.
            this.squash = function() {
                var form = this;
                return (
                    F.ret()
                    .bind(function(){
                        return form;
                    })
                );
            };
                                
            // Sets the label component.
            this.withLabel = function(l) {
                this.container.setLabel(l);
                return this;
            };  
        };

        // This method is for extending all flowlet objects with new
        // additional functionality.
        var extend = function (arg) {
            for (var prop in arg) {
                Flowlet.prototype[prop] = arg[prop];
            }
        };
        
        return {
            buildFlowlet : function(container, state, notify, update) {
                return new Flowlet(container, state, notify, update);
            },
            
            extend : extend
        };
        
    }());

    return {
        
        Factory : factory,
                
        /**
         * Lift a value into a flowlet.
         * @param {object} Value.
         * @return flowlet with constant state and an empty container.
         */
        lift : function(x) {
            var F = this;
            var state = Signal.lift(x);
            return F.buildFlowlet(Container.Factory.create(), state);
        },
        
        /**
         * Static flowlet composition.
         * @param {Function} Function for composing the flowlet states.
         * @return composed flowlet constisting of the list of provided sub
         * flowlets.
         */        
        combine : function() {
            var F = this;
            var f = arguments[0];
            var fls = Array.prototype.slice.call(arguments, 1);
            
            var block = Signal.withTrigger(true);
            var state = 
                Signal.combine.apply(                    
                    Signal, 
                    [f].concat (
                        fls.map (function (fl) {
                            return fl.state;
                        })
                    )
                ).blockWith(block);
            
            var container = fls[0].container;
            for (var ix = 1; ix < fls.length; ix++) {
                container.append(fls[ix].container);
            }
            
            var notify = function() {
                fls.map (function (fl) {
                    fl.notify();
                });
            };
            
            var update = function () {
                block.trigger(false);
                fls.map (function (fl) {
                    fl.update();
                });
                block.trigger(true);
            };
            
            return F.Factory.buildFlowlet(container, state, notify, update);            
        },
        
        /**
         * Infer a composition function and a set  of flowlet by refecting an          
         * object.
         */
        infer : function (obj) {
            /// TODO: 
        }
    };
    
})();