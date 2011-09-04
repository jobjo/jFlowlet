$(document).ready(function(){


    
    module("Module Behaviour");

    test("Test with trigger", function() {  
        var b = B.withTrigger();
        var out = [];
        b.listen(function(x){
            out.push(x);
        });
        b.trigger(1);
        b.trigger(2);
        deepEqual(out, [undefined, 1,2], "Test");

    });    
    
   
    test("Test with trigger", function() {  
        var b = B.withTrigger("A");
        var out = [];
        b.listen(function(x){
            out.push(x);
        });
        
        b.trigger("B");
        b.trigger("C");
        
        deepEqual(out, ["A", "B", "C"], "Test");

    });    

    test("Test dispose", function() {  
        var b = B.withTrigger(1);
        var out = [];
        var dispose1 = b.listen(function(x){
            out.push(x);
        });
        var dispose2 = b.listen(function(x){
            out.push(x);
        });        
        dispose1();
        b.trigger(2);
        dispose2();
        b.trigger(3);
                
        deepEqual(out, [1,1,2], "Test");

    });

    test("Test join", function() {  
        var b1 = B.withTrigger("B1:1");
        var b2 = B.withTrigger("B2:1");
        var b3 = B.withTrigger("B3:1");
        
        var b = B.withTrigger(b1);
        
        var out = []
        B.join(b).listen(function(x) {
            console.log(x);
            out.push(x);
        });
        
        
        // b1.trigger("B1:2");
        // b1.trigger("B1:3");
        
        // b.trigger(b2);
        // b2.trigger("B2:2");
        
        // b.trigger(b3);
        // b3.trigger("B3:2");
        // b3.trigger("B3:3");
        
        // b1.trigger("B1:4");
        // b2.trigger("B2:3");
        
        

    });


    test("Test bind", function() {  
        var b1 = B.withTrigger(1);
        var b2 = b1.bind(function(x) {
            return (x * x);        
        });
        b2.listen(function(x) {
            console.log(x);
        });
        console.log(b2);
        ok(true);
        

    });



    
    /* 
    test("first test within module", function() {
      ok( true, "all pass" );
    });

    test("second test within module", function() {
      ok( true, "all pass" );
    });

    module("Module B");

    test("some other test", function() {

      equal( true, false, "failing test" );
      equal( true, true, "passing test" );
      equal( true, true, "passing test" );
    });
    
    */    
});

