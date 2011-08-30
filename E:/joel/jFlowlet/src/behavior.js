(function () {

    /********************************************************************
    * Maps over a behavior.
    ********************************************************************/
    var map = function (f, b) {
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
    };

    /********************************************************************
    * Join
    ********************************************************************/
    var join = function (b) {
        var index = 0;
        var deleteOld = function () { return; };
        return (
            mk(function (f) {
                return (
                    b.listen(function (b) {
                        deleteOld();
                        deleteOld = b.listen(function (x) { f(x); });
                    })
                );
            })
        );
    };

    /********************************************************************
    * Bind
    ********************************************************************/
    var bind = function (b, f) {
        return join(map(f, b));
    };

    /********************************************************************
    * Create a behavior from a listen.
    ********************************************************************/
    var mk = function (listen) {
        return (
            {
                // Listen
                listen: listen,

                // Map 
                map: function (f) {
                    return map(f, this);
                },

                // Bind
                bind: function (f) {
                    return bind(this, f);
                }
            }
        );
    };


    this.B = {

        /********************************************************************
        *
        ********************************************************************/
        // Lifts a value into a behavior.
        lift: function (x) {
            return (
                mk(function (f) {
                    f(x);
                    return function () { };
                })
            );
        },


        toJson: toJson,

        /********************************************************************
        *
        ********************************************************************/
        withTrigger: function (init) {

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
            }

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
    }

})();