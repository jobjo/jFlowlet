$(document).ready (function () {
    
    var demo1 =
        F.combine (
            function (n, e, c) {
                return {
                    Name : n,
                    Email : e,
                    ContactMe : c
                };
            },
            
            F.Control.input("").withLabel("Your Name"),
            F.Control.input("").withLabel("Your Email"),
            F.Control.select(
                0, 
                [
                    {name: "Yes", value : 0},
                    {name: "No", value : 1}
                ]
            ).withLabel("Contact Me")
        );
    
    
    
    demo1.horizontal().renderTo($("#demos"));  
    
    
    
});