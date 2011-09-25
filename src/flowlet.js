var Flowlet = (function(){

    /************************************************************************
    * Form factory method.
    * @body - form element
    * @state - form state
    *************************************************************************/

    var ERROR_TYPE = "ERROR_TYPE";
    
    // Flowlet factory object, containing a buildFlowlet function
    // and a function 'extend' for plugin new methods.
    var factory = (function () {
        
        // Creates a new flowlet.
        var Flowlet = function(layout, state, notify, update) {
                
                this.listen = function(f) {
                    state.listen(f);
                };
                    
                this.renderTo = function(parent){
                    // Subscribe to state
                    state.listen(function(){});
                    layout.renderTo(parent);
                };            
                
                this.bind = function(f) {                    
                    var oldForm;                    
                    var state2 =                
                        state.bind (function(x) {
                            
                            // Create new form 
                            var form = f(x);
                            
                            // Remove old
                            if( oldForm !== undefined) {
                                oldForm.layout.remove();
                            }
                            oldForm = form;
                            layout.append(form.layout);
                            return form.state;
                        });                        
                    
                    return new Flowlet(layout, state2, notify, update);                                       
                };
                    
                this.layout = layout;
                
                this.state = state;
                    
                this.apply = function(f) {
                    var state = this.state.apply(f.state);
                    this.layout.append(f.layout);
                    var notify = function(x) {
                        this.notify(x);
                        f.notify(x);
                    };
                    var update = function() {
                        this.update();
                        f.update();
                    };
                    
                    return new Flowlet (layout, state, notify, update);
                };
                
                this.notify = notify;
                
                this.update = update;
                
                this.reset = function() {
                    this.notify();
                };
                                    
                    
                this.append = function(form, f) {
                    var layout = this.layout;                    
                    layout.append(form.layout);
                    
                    var state2 = this.state;
                    
                    var notify = function (x) {
                        this.notify(x);
                        form.notify(x);
                    };
                    
                    var update = function () {
                        this.update();
                        form.update();
                    }; 
                    
                    return new Flowlet(layout, state2, notify, update);
                };
                
                this.map = function (f) {
                    var state2 =  state.map (f);
                    return (new Flowlet(layout, state2, notify, update));                
                };
                
                this.validate = function (f) {
                    return (
                        this.map(function (x) {
                            var res = f(x);
                            if (res.isValid ) {
                                return x;
                            }
                            else {
                                return {
                                    type : ERROR_TYPE,
                                    errors : [res.error]
                                };
                            }
                        })
                    );
                };
                    
                this.squash = function() {
                    var thisForm = this;
                    return (
                        F.ret()
                        .bind(function(){
                            return thisForm;
                        })
                    );
                };
                    
                this.withContainer = function(f) {
                    this.layout.withContainer(f);
                    return this;
                };
                    
                this.withElementWrapper = function(f) {
                    this.layout.addWrapper(f);
                    return this;
                };
                    
                withLayout = function(arg) {
                    this.layout.withContainer(function() {
                        return {
                            inner : arg.inner,
                            outer : arg.outer
                        };
                    });
                    this.layout.addWrapper(arg.wrapper);
                };
                    
                this.withLabel = function(l) {
                    this.layout.setLabel(l);
                    return this;
                };
                    
                    
                this.vertical =function() {
                    return (
                        this
                        .withElementWrapper(function(el,l) {
                        
                            var labelCell = E.mk("td");
                            if(l !== undefined) {
                                labelCell.append(l);
                            }                
                            
                            return ( 
                                E.mk("tr", {
                                    children: [
                                        labelCell,
                                        E.mk("td", {
                                            children : [el]
                                        })
                                    ]
                                })
                            );
                        })
                        .withContainer(function() {
                            var inner = E.mk("tbody");            
                            var outer = 
                                E.mk("table", {
                                    children : [inner]
                                });
                            return {
                                outer : outer,
                                inner : inner
                            };                                           
                        })
                    );
                };
                    
                this.horizontal = function() {
                    return (
                        this
                        .withElementWrapper(function(el,label) {
                            if(label === undefined) {
                                label = "";
                            }
                            return ( 
                                E.mk("td", {
                                    children: [label, el]
                                })
                            );
                        })
                        .withContainer(function() {
                            var inner = E.mk("tr");            
                            var outer = 
                                E.mk("table", {
                                    children : [
                                        E.mk("tbody", {
                                            children: [
                                                E.mk("tr", {children : [inner]})
                                            ]
                                        })
                                    ]
                                });
                            return {
                                outer : outer,
                                inner : inner
                            };                                           
                        })
                    );
                };
            };
            
        var extend = function (arg) {
            for (var prop in arg) {
                Pos.prototype[prop] = arg[prop];
            }
        };
        
        return {
            buildFlowlet : function(layout, state, notify, update) {
                return new Flowlet(layout, state, notify, update);
            },
            
            extend : extend
        };
        
    }());
    
    

    return {
        
        Factory : factory,
        
        
        /************************************************************************
        * Return form
        * @value - value to be lifted.
        * @return form with constant state and empty body.
        *************************************************************************/    
        lift : function(x) {
            var F = this;
            var state = Signal.lift(x);
            return F.buildFlowlet(L.mk(), state);
        },
        
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
            
            var layout = fls[0].layout;
            for (var ix = 1; ix < fls.length; ix++) {
                layout.append(fls[ix].layout);
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
            
            return F.Factory.buildFlowlet(layout, state, notify, update);            
        }
    };
    
})();
