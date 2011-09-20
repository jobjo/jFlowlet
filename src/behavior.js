(function () {

    // Create a new behavior from a listener.
    var mk = function (listen) {
        var B = this.B;
        var current;
        listen(function(x) {
            current = x;
        });
        return (
            {
                current : function() {
                    return current;
                },
                
                listen: listen,
                
                map: function (f) {
                    return B.map(f, this);
                },
                
                bind: function (f) {
                    return B.bind(this, f);
                },
                
                apply : function(b) {
                    return B.apply(this, b);
                }                
            }
        );
    };


    this.B = {

        /********************************************************************
        * Join
        * @param {Behavior} Behavior of behavior to be merged.
        * @return {Behavior} 
        ********************************************************************/
        join : function (bOut) {
            
            var B = this;
            var index = 0;
            var deleteOld = function () { };
            return (
                mk(function (f) {
                    return (
                        bOut.listen(function (b) {
                            deleteOld();
                            deleteOld = b.listen(f);
                        })
                    );
                })
            );
        },
        
        
        /********************************************************************
        * Maps over a behavior.
        ********************************************************************/
        map : function (f, b) {
            var B = this;
            return (
                mk(function (g) {
                    return (
                        b.listen(
                            function (x) {
                                g(f(x));
                            }
                        )
                    );
                })
            );
        },
        
        
        /********************************************************************
        * Bind
        ********************************************************************/
        bind : function (b, f) {
            var B = this;
            return B.join(B.map(f, b));
        },
        

        /********************************************************************
        * Apply
        ********************************************************************/
        apply : function (bF, b) {
            var B = this;
            
            var bOut = 
                B.withTrigger(bF.current()(b.current));
            
            bF.listen(function(f) {
                bOut.trigger(f(b.current()));
            });
            
            b.listen(function(x){
               bOut.trigger(bF.current()(x));
            });
            
            return (
                mk(function(f) {
                    return bOut.listen(f);                    
                })
            );
        },


        /********************************************************************
        * Create a behavior that when subscribed to 
        * @param {Value} The value to be lifted.
        ********************************************************************/
        // Lifts a value into a behavior.
        lift: function (x) {
            var B = this;
            return (
                mk(function (f) {
                    f(x);
                    return function () { };
                })
            );
        },
        
        /********************************************************************
        * @param {Value} Initial value
        ********************************************************************/
        withTrigger: function (init) {

            var B = this;
            var subIx = 0;
            var currentValue = init;

            var subscribers = {};

            // Subscribe to behavior.
            var listen = function (f) {

                // Increase subscriber index
                subIx = subIx + 1;

                // First call with current value.
                f(currentValue);

                // Add to subscribers list
                subscribers[subIx] = f;
                var currSubIx = subIx;
                return (
                    function () {
                        // Delete on unsubscribe.
                        delete subscribers[currSubIx];
                    }
                );
            };

            // Trigger new value.
            var trigger =
                function (x) {
                    // Update current value.
                    currentValue = x;
                    for (var field in subscribers) {
                        if (typeof subscribers[field] === "function") {
                            subscribers[field](currentValue);
                        }
                    }
                };
            
            
            var b = mk(listen);
            b.trigger = trigger;
            return b;
        }
    };

})();