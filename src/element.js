/**********************************************************************
* 
**********************************************************************/
(function(){
    var ELEMENT_TYPE = "Element";
    var id = 0;
    this.E = {
   
        /***********************************************************
        * Creaates and element
        *
        ***********************************************************/                                                            
        mk : function(name, attrs) {

            // Create element
            var elem = $("<" + name + "/>");
            var isRendered = false;
            var isRemoved = false;            
            if (attrs === undefined) {
                attrs = {};
            }
            if (attrs.children === undefined) {
                attrs.children = [];
            }
                                            
            return {
                
                /***********************************************************
                * Type identifier of element.
                ***********************************************************/                                                            
                type : ELEMENT_TYPE,
                
                /***********************************************************
                * Type identifier of element.
                ***********************************************************/
                jQuery : elem,
                
                /***********************************************************
                * Id of the element.
                ***********************************************************/                    
                id : id + 1,
                
                /***********************************************************
                * Append
                ***********************************************************/                                        
                append : function(child) {
                    attrs.children.push(child);
                    
                    // If already rendered
                    if(isRendered) {
                        if (child.type === ELEMENT_TYPE) {
                            child.renderTo(elem);
                        }
                        else {
                            elem.append(child);
                        }
                    }                    
                    return this;                                                
                },               
                
                /***********************************************************
                * @return - Weather or not the element has been removed.
                ***********************************************************/
                isRemoved : function () {
                    return this.isRemoved;
                },
                
                
                /***********************************************************
                * Removes the element node.
                ***********************************************************/                    
                remove : function(child) {
                    attrs = {};
                    elem.remove();
                    isRemoved = true;
                },                           
                
                /***********************************************************
                * @return - Number of elements.
                ***********************************************************/
                numElements : function () {
                    return 1;
                },                                        
                
                /***********************************************************
                * Renders to the given parent node.
                * @ param parent 
                * @ param offest the offest for where to insert.
                ***********************************************************/                
                renderTo : function(parent, offset){
                                            
                    // Set offset
                    if(offset === undefined) {
                        offset = 0;
                    }                    
                    
                    // Add attributes
                    if(attrs.attrs !== undefined) {
                        for(name in attrs.attrs) {
                            elem.attr(name, attrs.attrs[name]);
                        }
                    }                            

                    // If offset is zero then insert directly,
                    // else insert after the offset element.
                    if(offset === 0) {
                        parent.append(elem);
                    }
                    else {
                        parent.children(':eq(' + (offset - 1) +')')
                        .after(elem);
                    }

                    // Add events
                    if(attrs.events !== undefined) {
                        for(name in attrs.events) {
                            elem.bind(name, attrs.events[name]);
                        }                                    
                    }
                    
                    // Append all children
                    attrs.children.map(function(child) {
                        if (child.type === ELEMENT_TYPE) {                                    
                            child.renderTo(elem, 0);
                        }
                        else {                                    
                            elem.append(child);
                        }                             
                    });
                    
                    // Indicate that rendered
                    isRendered = true;
                    return 1;
                }
            }
        }
    }
})()
