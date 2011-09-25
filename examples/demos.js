$(document).ready (function () {
    
    var F = Flowlet;
    var W = Flowlet.Widgets;
    
    var demo1 =
        F.combine (
            function (n, e, c) {
                return {
                    Name : n,
                    Email : e,
                    ContactMe : c
                };
            },
            
            W.input("").withLabel("Your Name"),
            W.input("").withLabel("Your Email"),
            W.select(
                0, 
                [
                    {name: "Yes", value : 0},
                    {name: "No", value : 1}
                ]
            ).withLabel("Contact Me")
        );
    
    
    
    // demo1.horizontal().renderTo($("#demos"));  
    
    var f =Flowlet.Widgets.input("");
    f.container.withContainer(function() {
        return {
            inner : E.mk("span"),
            outer : E.mk("table")
        };
    });
    

    var f =Flowlet.Widgets.input("");
    f.withLabel("Label");
    f.horizontalTable();
    f.renderTo($("#demos"));
    
    
    
});