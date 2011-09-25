$(document).ready(function(){

    
    
    var render = function(f) {
        
        var panel = 
            E.mk("div", 
                {
                    attrs: {"style": "border: 1px solid gray; padding: 10px; margin : 10px;"}
                }
            );
            
        panel.renderTo($("#form-panel"));
        f.renderTo(panel.jQuery); 
        
    };


    module("Module Controls");
    
    test("Test select", function() {
        
        
        var form = 
            Flowlet.Widgets.select(
                2,
                [
                    {name : "Label A", value : "A"},
                    {name : "Label B", value : "B"},
                    {name : "Label C", value : "C"},
                    {name : "Label D", value : "D"}
                ]
            );
        console.log("form", form);
        render(form);
        
        equal(form.state.current(), "C", "");

        form.notify(1);        
        equal(form.state.current(), "B", "");
        
        // Select next
        var elem = form.layout.getRenderedElements()[0].jQuery;
        elem.find('option:nth-child(3)').attr("selected", true);
        
        form.update();
        equal(form.state.current(), "C", "");
            
        form.reset();
        equal(form.state.current(), "C", "");        
        
    });    

    test("Test input", function() {
        
        var form = Flowlet.Widgets.input("A");
        render(form);
        var elem = form.layout.getRenderedElements()[0].jQuery;
        
        equal(form.state.current(), "A", "");
        equal(elem.val(), "A", "Value from text box field matching the state");

        form.notify("B");        
        equal(form.state.current(), "B", "");
        equal(elem.val(), "B", "Value from text box field matching the state");

        form.reset();
        equal(form.state.current(), "A", "");
        equal(elem.val(), "A", "Value from text box field matching the state");
        
        elem.val("C");
        equal(form.state.current(), "A", "Still A");
        form.update();
        equal(form.state.current(), "C");
        
    });
    
    
    test("Test textarea", function() {
        
        var form = Flowlet.Widgets.textArea("A");
        render(form);
        var elem = form.layout.getRenderedElements()[0].jQuery;

        equal(form.state.current(), "A", "");
        equal(elem.val(), "A", "Value from text box field matching the state");

        form.notify("B");        
        equal(form.state.current(), "B", "");
        equal(elem.val(), "B", "Value from text box field matching the state");

        form.reset();
        equal(form.state.current(), "A", "");
        equal(elem.val(), "A", "Value from text box field matching the state");
        
        elem.val("C");
        equal(form.state.current(), "A", "Still A");
        form.update();
        equal(form.state.current(), "C");
        
    });
    
    module("Module Composition");
    
    test("Test bind", function () {
        
        var form = 
            Flowlet.Widgets.input("A")
            .bind(function (x) {
                return Flowlet.Widgets.input(x+x);
            });
        render(form);
        
        var out = [];
        form.state.listen(function (x) {
            out.push(x);
        });
        
        form.notify("B");
        form.reset();
        deepEqual(out, ["AA", "BB", "AA"]);
    });
    
    
    test("Test nested bind", function () {
        var form =
            Flowlet.Widgets.input("A")
            .bind(function (x) {
                var form =
                    Flowlet.Widgets.input(x+x)
                    .bind(function(x) {
                        return Flowlet.Widgets.input(x+x);
                    });
                return form;                    
            });
        render(form);
        
        var out = [];
        form.listen(function (x) {
            out.push(x);
        });
        
        form.notify("B");
        form.reset();
        deepEqual(out, ["AAAA", "BBBB", "AAAA"]);
        
    });
    
    test("Test combine", function () {
        
        var f1 = Flowlet.Widgets.input("A");
        
        var form =
            Flowlet.combine (
                function (x,y,z) { 
                    return x + " " + y + " " + z;
                },
                f1,
                Flowlet.Widgets.input("B"),
                Flowlet.Widgets.input("C")
            );
        
        render(form);
        var f1Elem = form.layout.getRenderedElements()[0].jQuery;
        
        var out = [];
        form.listen(function(x) {
            out.push(x);
        });
        
        f1Elem.val("A:2");
        form.update();
        
        deepEqual(
            out, 
            [
                "A B C",
                "A:2 B C"
            ]
        );
        
        
    });
});    


