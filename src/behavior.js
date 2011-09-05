(function () {



    this.B = {
        
        
        /********************************************************************
        * Create a behavior from a listen.
        ********************************************************************/
        mk : function (listen) {
            var B = this;
            
            return (
                {
                    // Listen
                    listen: listen,
    
                    // Map 
                    map: function (f) {
                        return B.map(f, this);
                    },
    
                    // Bind
                    bind: function (f) {
                        return B.bind(this, f);
                    }
                }
            );
        },
        
        
        /********************************************************************
        * Join
        ********************************************************************/
        join : function (bOut) {
            
            var B = this;
            var index = 0;
            var deleteOld = function () { };
            return (
                B.mk(function (f) {
                    return (
                        bOut.listen(function (b) {
                            deleteOld();
                            console.log("BBBBBBBBBBBBBBBBBB", b);
                            
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
                B.mk(function (g) {
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
        *
        ********************************************************************/
        // Lifts a value into a behavior.
        lift: function (x) {
            var B = this;
            return (
                B.mk(function (f) {
                    f(x);
                    return function () { };
                })
            );
        },

        /********************************************************************
        *
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
            
            
            var b = B.mk(listen);
            b.trigger = trigger;
            return b;
        }
    };

})();