(function() {

    var i = F.Control.input;
    var s = F.Control.select;
    var t = F.Control.textArea;
    var b = function(){return $("body");};
    
    this.T = {
    

        /********************************************************************
        * 
        ***********************************************r************************/
        testInput : function() {

            var form = F.Control.input("A");      
            
            form.renderTo(b());
        },


        /********************************************************************
        * Test append
        ***********************************************r************************/
        testAppend : function() {

            var form =  
                F.Control.input("A")
                .append(F.Control.input("B"), function (x,y) {
                    return {
                        A : x,
                        B : y
                    }; 
                });
           
            form.renderTo(b());
        },


        /********************************************************************
        * Test label
        ***********************************************r************************/
        testValidate : function() {

            var form =  
                F.Control.input("")
                .validate(function (x) {
                    if(x.length === 0) {
                        return {
                            isValid : false,
                            error : "empty value"
                        };
                    }
                    else {
                        return {
                            isValid : true
                        };
                    }
                });
            
            // Subscribe to state
            form.listen(function(x) {
                console.log("value: ", x);
            });                      
            
            form
            .withValidationIcon()
            .horizontal()
            .renderTo(b());
        },

        /********************************************************************
        * Test label
        ***********************************************r************************/
        testNotify : function() {

            var form = 
                F.Control.input("First Value")
                .map(function(x) {
                    return (x + " " + x);
                })                
                .bind(function(x) {
                    return i(x.toLowerCase());
                });
                
            
            // Subscribe to state
            form.listen(function(x) {
                alert("New Value: " + x.toString());
            });                      
            
            form.renderTo(b());
            
        },

    
        /********************************************************************
        * Test label
        ***********************************************r************************/
        test0 : function() {

            F.Control.input("hello")
            .bind (function(x) {
                return F.Control.textArea(x);
            })
            .renderTo(b());
        },
    
        
        /***********************************************************************
        * Test label
        ***********************************************************************/
        test0_ : function() {
            F.ret()
            .bind(function () {
                return (
                    F.ret ()
                    .bind(function () {
                        return ( 
                            s(0, [
                                {name : "Option a", value : "A"},
                                {name : "Option b", value : "B"},
                                {name : "Option c", value : "C"}                                                                
                            ]).
                            withLabel("Label")
                            .bind (function(v) {
                                return i("").withLabel(v);
                            })
                        )
                    })
                    .bind (function(v) {
                        return t("").withLabel(v);
                    })                    
                    .vertical()
                    .withContainer(function() {
                        var panel = E.mk("div", {
                            attrs : {
                                style : "padding: 10px; background-color : pink;"
                            }
                        });
                        return {
                            inner : panel,
                            outer : panel
                        }
                    })                    
                    .withLabel("My Label")                            
                );
            })
            .bind(function() {
                return (
                    i("B")
                    .withLabel("My Label 2")
                )                        
            })            
            .vertical()
            .renderTo(b());
        },
        
        /***********************************************************************
        * Test label
        ***********************************************************************/
        test1 : function() {
        
            
            // Formlet Declration
            var f = 
                F.ret()
                .bind(function () {
                    var f = i("A");
                    f.layout.setLabel("A Label");                
                    return f;                
                })
                .bind( function(x) {
                    var f = 
                        F.ret()
                        .bind(function() {
                            return i("B");
                        });
                    f.layout.setLabel(x);                
                    return f;                    
                })
                .bind( function(x) {
                    var f = i("C");
                    f.layout.setLabel(x);                
                    return f;                    
                });
                
            // Set wrapper                
            f.layout.addWrapper(function(el,l) {
                var row = E.mk("tr");
                if(l !== undefined) {
                    var cell = E.mk("td");
                    cell.append(l);
                    row.append(cell);
                }
                var cell = E.mk("td");
                cell.append(el);
                row.append(cell);
                return row;
            });
            
            // Set container
            f.layout.withContainer(function() {
                var outer = E.mk("table", {border: '1'});   
                var inner = E.mk("tbody");            
                outer.append(inner);
                return {
                    outer : outer,
                    inner : inner
                };                                           
            });
            
            f.layout.setLabel("OUTER");
            
            
            
            f.renderTo(b());
        }
    
    };

})();
