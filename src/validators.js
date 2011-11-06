/**
 * Loading this script file extends all flowlet objects with
 * validation capabilities.
 */
(function () {
    var ERROR_TYPE = "_ValidationError";
    
    Flowlet.Factory.extend ( {
        
        /**
         *  @param f {Function} - Validation function.
         * 
         */
        is : function (f, e) {
            var eF = e || function(){return "";};
                
            return (
                this.map(function (x) {
                    if (f(x)) {
                        return x;
                    }
                    else {
                        return {
                            type : ERROR_TYPE,
                            errors : [eF(x)]
                        };
                    }
                })
            );
        },
        
        /**
         *  @param f {Function} - Validation function.
         * 
         */
        isEmail : function (e) {
            var eF = e || function(){return "Invalid email address";};
            var reg = 
                new RegExp(
                    '^[0-9a-zA-Z]+@[0-9a-zA-Z]+[\.]{1}[0-9a-zA-Z]+[\.]?[0-9a-zA-Z]+$'
                );
            return (
                this.is(function(x) {return reg.test(x);} , eF)
            );
        },
        
        /**
         *  
         */
        isNotEmpty : function (e) {
            var eF = e || function(){return "Empty string is not allowed";};
            return (
                this.is(function(x) {return x.trim().length > 0;} , eF)
            );
        }      
        
    });

}());


