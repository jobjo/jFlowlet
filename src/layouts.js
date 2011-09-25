(function () {
    Flowlet.Factory.extend ( {

        /************************************************************************
         * Wraps flowlet in container.
         ***********************************************************************/        
        withContainer : function(f) {
            this.container.withContainer(f);
            return this;
        },

        /************************************************************************
         * Wraps elements
         ***********************************************************************/
        withElementWrapper : function(f) {
            this.container.addWrapper(f);
            return this;
        },
        
        
        /************************************************************************
         * Enhances the form with a vertical table layout
         ***********************************************************************/
        verticalTable : function() {
            return (
                this
                .withElementWrapper(function(el,l) {
                
                    var labelCell = E.mk("td");
                    if(l !== undefined) {
                        labelCell.append(l);
                    }                
                    
                    return ( 
                        E.mk("tr", {
                            children: [
                                labelCell,
                                E.mk("td", {
                                    children : [el]
                                })
                            ]
                        })
                    );
                })
                .withContainer(function() {
                    var inner = E.mk("tbody");            
                    var outer = 
                        E.mk("table", {
                            children : [inner]
                        });
                    return {
                        outer : outer,
                        inner : inner
                    };                                           
                })
            );
        },
        
        horizontalTable : function() {
            return (
                this
                .withElementWrapper(function(el,label) {
                    if(label === undefined) {
                        label = "";
                    }
                    return ( 
                        E.mk("td", {
                            children: [label, el]
                        })
                    );
                })
                .withContainer(function() {
                    var inner = E.mk("tr");            
                    var outer = 
                        E.mk("table", {
                            children : [
                                E.mk("tbody", {
                                    children: [inner]
                                })
                            ]
                        });
                    return {
                        outer : outer,
                        inner : inner
                    };                                           
                })
            );
        }
    });
}());