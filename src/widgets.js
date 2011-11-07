Flowlet.Widgets = (function() {
    return {
        
        /**
         * Input text flowlet.
         * @param {Value} default
         * @return tex-box flowlet.
         */
        input : function(def){                
                
            var defValue = "";
            if (def !== undefined) {
                defValue = def.toString();
            }
            
            // State of the input 
            var state = Signal.withTrigger(defValue);
                            
            // Input element                     
            var layout = Container.Factory.create();
            var elem = 
                Element.mk("input", {
                    attrs : { "value" : defValue}, 
                    events : {
                        "keyup": 
                            function(){
                                state.trigger($(this).val());
                            }
                    }
                });
                
            layout.append(elem);
            
            // Update form value
            var update = function () {
                state.trigger(elem.jQuery.val());
            };                
            
            // Notify function
            var notify = function(value) {
                if (value !== undefined) {
                    elem.jQuery.val(value);
                }
                else if(def !== undefined) {
                    elem.jQuery.val(def);
                }
                else {
                    elem.jQuery.val('');
                }
                update();
            };
            
            return Flowlet.Factory.buildFlowlet(layout, state, notify, update);
        },
        
        /**
         * @pram {String} - Default value.
         * @return {flowlet<string>} 
         */
        textArea : function(def) {             
            
            // FXIME: Conditional assign
            var defValue = "";
            if (def !== undefined) {
                defValue = def.toString();
            }
            
            // State of the input 
            var state = Signal.withTrigger(defValue);
            
            // Input element                     
            var layout = Container.Factory.create();
            var elem = 
                Element.mk("textarea", {
                    events : {
                        keyup : function(){
                            state.trigger($(this).val());
                        }
                    },
                    children : [defValue]
                });
            
            // Update form value
            var update = function () {
                state.trigger(elem.jQuery.val());
            };                
            
            // Notify function
            var notify = function(value) {
                if (value !== undefined) {
                    elem.jQuery.val(value);
                }
                else if(def !== undefined) {
                    elem.jQuery.val(def);
                }
                else {
                    elem.jQuery.val('');
                }
                update();
            };                
            
            layout.append(elem);
            return Flowlet.Factory.buildFlowlet(layout, state, notify, update);
        },
        
        /**
         * Select
         * @param {integer} Default selected index
         * @param {Array} list of name and value pairs.
         */
        select : function(defIx, values){                
                
            if (defIx === undefined) {
                defIx = 0;
            }
            
            var defValue = values[defIx].value;
            var state = Signal.withTrigger(defValue);
            
            var elem;
            
            // Update form value
            var update = function () {
                state.trigger(values[elem.jQuery.val()].value);
            };            
            
            elem = 
                Element.mk("select", {
                    attrs : { "value" : values[defIx]}, 
                    events : {
                        "change": update
                    },
                    children :
                        values.map (function(x, ix) {
                            var attrs = {value : ix};
                            if (defIx === ix) {
                                attrs.selected = "true";
                            }
                            var opt =
                                Element.mk("option", {
                                    attrs : attrs,
                                    children : [x.name]}
                                );                 
                                
                            return opt;                                
                        })
                });
            
            // Input element                     
            var layout = Container.Factory.create();
            layout.append(elem);            
            
            // Notify function
            var notify = function(ix) {
                if (ix !== undefined) {
                    elem.jQuery.val(ix).attr("selected", true);
                }
                else {
                    elem.jQuery.val(defIx).attr("selected", true);
                }
                update();
            };                
            
            return Flowlet.Factory.buildFlowlet(layout, state, notify, update);        
        }        
    };
})();

