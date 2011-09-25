$(document).ready(function(){
    
    var S = Signal;
    
    module("Module Behaviour");
    
    test("Test lift", function() {
        var out = "";
        var dispose = S.lift("hello").listen(function(x){
            out = "hello";
        });
        
        deepEqual("hello", out);
    });
    
    

    test("Test with trigger - Undefined", function() {  
        var b = S.withTrigger();
        var out = [];
        b.listen(function(x){
            out.push(x);
        });
        b.trigger(1);
        b.trigger(2);
        deepEqual(out, [undefined, 1,2], "Test");

    });    
       
    test("Test with trigger", function() {  
        var b = S.withTrigger("A");
        var out = [];
        b.listen(function(x){
            out.push(x);
        });
        
        b.trigger("B");
        b.trigger("C");
        
        deepEqual(out, ["A", "B", "C"], "Test");

    });    

    test("Test dispose", function() {  
        var b = S.withTrigger(1);
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
        
        var b1 = S.withTrigger("B1:1");
        var b2 = S.withTrigger("B2:1");
        var b3 = S.withTrigger("B3:1");
        
        var b = S.withTrigger(b1);
        
        var out = [];

        S.join(b).listen(function(x) {
            out.push(x);
        });
        
        
        b1.trigger("B1:2");
        b1.trigger("B1:3");
        
        b.trigger(b2);
        b2.trigger("B2:2");
        
        b.trigger(b3);
        b3.trigger("B3:2");
        b3.trigger("B3:3");
        
        b1.trigger("B1:4");
        b2.trigger("B2:3");
        
        deepEqual(
            out, 
            [   
                "B1:1", 
                "B1:2", 
                "B1:3", 
                "B2:1", 
                "B2:2", 
                "B3:1", 
                "B3:2", 
                "B3:3" 
            ], "");

    });


    test("Test map", function() {  
        var b1 = S.withTrigger(1);
        var b2 = b1.map(function(x) {
            return (x * x);        
        });
        var out = [];    
        b2.listen(function(x) {
            out.push(x);
        });
        
        b1.trigger(2);
        b1.trigger(3);
        
        deepEqual(out, [1,4,9], "");
        
        
    });


    test("Test bind", function() {  
        var b1 = S.withTrigger(1);
        var b2 = b1.bind(function(x) {
            return S.lift(x * x);        
        });
        var out = [];                
        b2.listen(function(x) {
            out.push(x);
        });
        b1.trigger(2);
        b1.trigger(3);
        deepEqual(out, [1, 4,9], "");
        
    });
    
    test("Test nested bind", function() {  
        var b1 = S.withTrigger(1);
        
        var b2 = b1.bind(function(x) {
            var b = 
                S.lift(x * x)
                .bind (function(x) {
                    return S.lift(x*x);
                });
            return b;                
            
        });

        var out = [];                
        b2.listen(function(x) {
            out.push(x);
        });
        b1.trigger(2);
        b1.trigger(3);
        deepEqual(out, [1, 16,81], "");
        
    });    

    test("Test bind and dispose", function() {  
        var b1 = S.withTrigger(1);
        var b2 = b1.bind(function(x) {
            return S.lift(x * x);        
        });
        var out = [];                
        var dispose = b2.listen(function(x) {
            out.push(x);
        });
        
        dispose();
        b1.trigger(2);
        b1.trigger(3);
        deepEqual(out, [1], "");
        
    });
    
    
    test("Test apply", function() {  
        
        var bf = S.lift(function(x){
            return x * x;
        });
        
        var bx = S.withTrigger(1);        
        var b = S.apply(bf, bx);
        var out = [];
        var dispose = b.listen(function(x) {
            out.push(x);
        });
        bx.trigger(2);
        bx.trigger(3);
        
        deepEqual(out, [1, 4, 9], "");
        
    });

    test("Test apply with dispose", function() {  
        
        var bf = S.lift(function(x){
            return x * x;
        });
        
        var bx = S.withTrigger(1); 
        var b = S.apply(bf, bx);
        var out = [];
        
        var dispose = b.listen(function(x) {
            out.push(x);
        });
        
        dispose();
        
        
        bx.trigger(2);
        bx.trigger(3);
        
        deepEqual(out, [1], "");
        
    });

    test("Test combine", function() {  
        
        var b1 = S.withTrigger("A:1");
        var b2 = S.withTrigger("B:1");
        var b3 = S.withTrigger("C:1");
        var b = 
            S.combine (
                function (x,y,z) {
                    return x + " " + y + " " + z;    
                },
                b1, b2, b3
            );
            
        var out = [];
        var dispose =
            b.listen(function(xs) {
                out.push(xs);
            });
            
        deepEqual(b.current(), "A:1 B:1 C:1");
        
              
        b1.trigger("A:2");
        b2.trigger("B:2");
        b3.trigger("C:2");
        dispose();
        b3.trigger("C:3");
        deepEqual(out, 
            [
                "A:1 B:1 C:1", 
                "A:2 B:1 C:1",
                "A:2 B:2 C:1",
                "A:2 B:2 C:2"
            ]
        );
        
    });

});

