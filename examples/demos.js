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
    // example1.vertical().renderTo($("#demos"));
    
    // Example of a dependent flowlet where the
    // choice of the select box drives the label
    // of the dependent flowlet.
    var example2 =
        W.select(
            0, 
            [
                {name: "Yes", value : true},
                {name: "No", value : false}
            ]
        ).
        withLabel("Yes or No").
        bind( function(choice) {
            if (choice) {
                return (
                    W.input("").
                    withLabel("Yes")
                );
            }
            else {
                return (
                    W.input("").
                    withLabel("No")
                );                
            }
        });
        
    // example2.verticalTable().renderTo($("#demos"));
    
    // Same as example 2 but using Flowlet.infer.
    // Not yet implemented.
    /*
    var example3_ = Flowlet.infer({
        
        name : 
            W.input("John").
            isNotEmpty().
            withValidationIcon().
            withLabel("Name"),
        
        
        email : 
            W.input("john@smith.com").isNotEmpty().
            withValidationIcon().
            withLabel("Email"),
        
        contactMe : 
            W.select(
                0, 
                [
                    {name: "Yes", value : 0},
                    {name: "No", value : 1}
                ]
            ).withLabel("Contact Me")            
    });
    */
    
    var email =
        Flowlet.lift(1).
        bind (function() {
            return (
                W.input("").                    
                isEmail().
                withValidationIcon().
                withLabel("Yes")
            );
        });

    var example3 =
        W.select(
            0, 
            [
                {name: "naaaaa", value : true},
                {name: "No", value : false}
            ]
        ).
        withLabel("Yes or No").
        bind( function(choice) {
            if (choice) {
                return (
                    email.
                    withLabel("Yes")
                );
            }
            else {
                return (
                    W.input("").
                    withLabel("No")
                );                
            }
        });        
    
    


    
    example3.verticalTable().renderTo($("#demos"));
    
});
