$(document).ready (function () {
    
    var F = Flowlet;
    var W = Flowlet.Widgets;
    
    // Example using Flowlet.combine for static composition.
    var example1 =
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

    // Render using vertical layout.
    example1.vertical().renderTo($("#demos"));
    
    
    // Same as example 2 but using Flowlet.infer.
    // Not yet implemented.
    var example2 = Flowlet.infer({
        
        name : 
            W.input("Joel").
            isNotEmpty().
            withValidationIcon().
            withLabel("Name"),
        
        
        email : 
            W.input("Joel").
            isNotEmpty().
            withValidationIcon().
            withLabel("Name"),
        
        contactMe : 
            W.select(
                0, 
                [
                    {name: "Yes", value : 0},
                    {name: "No", value : 1}
                ]
            ).withLabel("Contact Me")
    });
    
    
    
    
});