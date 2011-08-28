/**********************************************************************
* 
**********************************************************************/
(function(){
   
    // Lifts a value into a behavior.
    var ret = 
        function(x){
            return {
                listen : function(f){f(x)}
            }
        };
        
    // Returns a behaviour and a trigger.
    var withTrigger = 
        function(init){
            // Keeps track of the current value.
            var currValue = init;
            
            // List of subscribers.
            var subscribers = []

            // Subscribe to behavior.
            var listen =
                function (f) {
                    // First call with current value.
                    f(currValue);
                    
                    // Add to subscribers list
                    subscribers.push(f);
                    
                };
                        
            // Trigger new value.
            var trigger =
                function (x) {
                    currValue = x;
                    for(i = 0; i < subscribers.length; i++){
                        subscribers[i](currValue);
                    }
                };            
            return {
                behavior : {listen  : listen},
                trigger : trigger
            };

        };                            
     
    // Maps over a behavior.
    var map =
        function(f,b) {
            return {
                listen : 
                    function(g){
                        b.listen(
                            function(x) {
                                g(f(x));
                            }
                        );
                    }
            };
        };     

    // Join            
    var join =
        function(b){
            var index = 0;
            return {
                listen : 
                    function(f) {
                        b.listen(function(bCurr) {
                            index = index + 1;
                            var currIndex = index;
                            bCurr.listen(function(x) {
                                if(currIndex = index) {
                                    f(x);    
                                }                        
                            });
                        });
                    }                
            }
        };
    // Bind, defined using map and join.
    var bind =
        function(b,f) {
            return join(map(f,b));
        }
     
    // Add to the global namespace B.
    this.B = {
        ret : ret,
        withTrigger : withTrigger,
        map : map,
        join : join,
        bind : bind
    };
})();


