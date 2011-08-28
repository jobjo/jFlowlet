(function() {
    this.F.Control = 
        {            
            
            /******************************************************************
            *
            ******************************************************************/
            input : function(def){                
                    
                var defValue = "";
                if (def != undefined) {
                    defValue = def.toString();
                }
                
                // State of the input 
                var state = B.withTrigger(defValue);
                                
                
                // Input element                     
                var layout = L.mk();
                var elem = 
                    E.mk("input", {
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
                    if (value != undefined) {
                        elem.jQuery.val(value);
                    }
                    else if(def != undefined) {
                        elem.jQuery.val(def);
                    }
                    else {
                        elem.jQuery.val('');
                    }
                    update();
                };
                
                return F.mkForm(
                    layout, 
                    state.behavior, 
                    notify, 
                    update
                );
            },

            /******************************************************************
            * Select
            ******************************************************************/
            select : function(defIx, values){                
                    
                var defValue = values[defIx].value;
                var state = B.withTrigger(defValue);
                

                var elem = 
                    E.mk("select", {
                        attrs : { "value" : defIx}, 
                        events : {
                            "change": 
                                function(){
                                    state.trigger($(this).val());
                                }
                        },
                        children :
                            values.map (function(x) {
                                return (
                                    E.mk("option", {
                                        attrs: {value : x.value},
                                        children : [x.name]}
                                    )
                                );
                            })
                    });
                
                // Input element                     
                var layout = L.mk();                
                layout.append(elem);
                return F.mkForm(layout, state.behavior);
            },

            /******************************************************************
            *
            ******************************************************************/
            textArea : function(def){                
                    
                var defValue = "";
                if (def != undefined) {
                    defValue = def.toString();
                }
                
                // State of the input 
                var state = B.withTrigger(defValue);
                
                // Input element                     
                var layout = L.mk();
                var elem = 
                    E.mk("textarea", {
                        events : {
                            "keyup": 
                                function(){
                                    state.trigger($(this).val());
                                }
                        },
                        children : [defValue]
                    });
                layout.append(elem);
                return F.mkForm(layout, state.behavior);
            }


        };
})();
