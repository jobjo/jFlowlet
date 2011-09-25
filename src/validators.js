(function () {
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
}());