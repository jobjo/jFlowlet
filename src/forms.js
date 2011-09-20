(function(){

    /************************************************************************
    * Form factory method.
    * @body - form element
    * @state - form state
    *************************************************************************/

    var ERROR_TYPE = "ERROR_TYPE";
    
    var mkForm;
    
    var mkFormFun =
        function(layout, state, notify, update) {
            
            
            var listen = function(f) {
                state.listen(f);
            };
                
            var renderTo = function(parent){
                // Subscribe to state
                state.listen(function(){});
                layout.renderTo(parent);
            };            
            
            var bind = function(f) {                    
                var oldForm;                    
                var state2 =                    
                    B.bind(state, function(x) {
                        
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
                
                return mkForm(layout, state2, notify, update);                                       
            };
                
            return {    
                
                layout : layout,
                
                listen : listen,
                
                state : state,
                
                renderTo : renderTo,
                                
                bind : bind,
                
                apply : function(f) {
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
                    
                    return mkForm (layout, state, notify, update);
                },
                
                notify : notify,
                
                update : update,               
                
                reset : function() {
                    this.notify();
                },
                                
                
                append : function(form, f) {
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
                    
                    return mkForm(layout, state2, notify, update);                                       
                },
                
                map : function (f) {                    
                    // FIXME: Update behavior to use instance method for map.
                    var state2 = B.map(f, this.state);               
                    return (mkForm(layout, state2, notify, update));                
                },
                
                validate : function (f) {
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
                    
                },
                
                squash : function() {
                    var thisForm = this;
                    return (
                        F.ret()
                        .bind(function(){
                            return thisForm;
                        })
                    );
                },
                
                withContainer : function(f) {
                    this.layout.withContainer(f);
                    return this;
                },
                
                withElementWrapper : function(f) {
                    this.layout.addWrapper(f);
                    return this;
                },
                
                withLayout : function(arg) {
                    this.layout.withContainer(function() {
                        return {
                            inner : arg.inner,
                            outer : arg.outer
                        };
                    });
                    this.layout.addWrapper(arg.wrapper);
                },
                
                withLabel : function(l) {
                    this.layout.setLabel(l);
                    return this;
                },
                
                withValidationIcon : function () {
                    var form = this;
                    
                    var icon =
                        E.mk("div", {
                            attrs : { "class" : "icon"}
                        });
                    
                    form.layout.append(icon);
                    form.state.listen(function (x) {
                        if (x.type === ERROR_TYPE) {
                            icon.jQuery.addClass("error");
                            icon.jQuery.removeClass("valid");
                        }
                        else {
                            icon.jQuery.addClass("valid");
                            icon.jQuery.removeClass("error");
                        }
                    
                    });
                    return form;
                },
                
                vertical : function() {
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
                },
                
                horizontal : function() {
                    return (
                        this
                        .withElementWrapper(function(el,l) {                        
                            var label = E.mk("label");
                            if(l !== undefined) {
                                label.append(l);
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
                }
            };
        };    
    mkForm = mkFormFun;        
    
    /************************************************************************
    * Return form
    * @value - value to be lifted.
    * @return form with constant state and empty body.
    *************************************************************************/    
    var lift =
        function(x) {
            var state = B.lift(x);
            return mkForm(L.mk(), state);
        };

    this.F = {
        mkForm : mkForm,
        
        lift : lift,
        
        compose : function() {
            var F = this;
            
            var f = arguments[0];
            
            var layout = arguments[1].layout;
            
            for (var ix = 2; ix < arguments.length; ix++) {
                layout.append(arguments[ix].layout);
            }
            
            var notify = function(x) {
                for(var ix = 1; ix < arguments.length; ix++) {
                    arguments[ix].notify();
                }
            };
            
            var update = function () {
                for (var ix = 1; ix < arguments.length; ix++) {
                    arguments[ix].update();
                }
            };
            
            
        }
        
        
    };
    
})();
