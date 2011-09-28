/**
 * Loading this script file extends all flowlet objects with
 * layout capabilities.
 */
(function () {
    Flowlet.Factory.extend ( {
        
        /**
         * Wraps a flowlet in a container.
         * @param {function} gen Container generator function. 
         * @return {flowlet} The flowlet object.
         */
        withContainer : function(gen) {
            this.container.withContainer(gen);
            return this;
        },

        /**
         * Wraps all elements of all nested containers of the flowlet.
         * @param {function} gen Element generator function from an element and
         * label pair to an element.   
         * @return {flowlet} The flowlet object.
         */
        withElementWrapper : function(gen) {
            this.container.addWrapper(gen);
            return this;
        },
        
        /**
         * Enhances the form with a vertical table layout.
         * @return {flowlet} The flowlet object.
         */
        vertical : function() {
            return (
                this
                .withElementWrapper(function(el,l) {
                    var labelCell = Element.mk("label");
                    if(l !== undefined) {
                        labelCell.append(l);
                    }
                    return Element.mk("div", {children: [labelCell, el]});
                })
            );
        },
        
        /**
         * Enhances the form with a vertical table layout.
         * @return {flowlet} The flowlet object.
         */
        verticalTable : function() {
            return (
                this
                .withElementWrapper(function(el,l) {
                
                    var labelCell = Element.mk("td");
                    if(l !== undefined) {
                        labelCell.append(l);
                    }                
                    
                    return ( 
                        Element.mk("tr", {
                            children: [
                                labelCell,
                                Element.mk("td", {
                                    children : [el]
                                })
                            ]
                        })
                    );
                })
                .withContainer(function() {
                    var inner = Element.mk("tbody");            
                    var outer = 
                        Element.mk("table", {
                            children : [inner]
                        });
                    return {
                        outer : outer,
                        inner : inner
                    };                                           
                })
            );
        },
        
        /**
         * Enhances the form with a horizontal table layout.
         * @return {flowlet} The flowlet object.
         */
        horizontalTable : function() {
            return (
                this
                .withElementWrapper(function(el,label) {
                    if(label === undefined) {
                        label = "";
                    }
                    return ( 
                        Element.mk("td", {
                            children: [label, el]
                        })
                    );
                })
                .withContainer(function() {
                    var inner = Element.mk("tr");            
                    var outer = 
                        Element.mk("table", {
                            children : [
                                Element.mk("tbody", {
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