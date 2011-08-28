/**********************************************************************
* 
**********************************************************************/
(function(){

    var LAYOUT_TYPE = "Layout"    
    var id = 0;
    var mkSingle = function(siblings) {
        id = id + 1;
        var cId = id;
                
        if(siblings === undefined) {
                siblings = [];
            }
                    
        // State variables
        var parentLayout = undefined;
        
        // Node to which the layout is rendered.
        var containerNode = undefined;        
        
        // Element to which the children are rendered.
        var containerElement = undefined;
                
        // Label
        var label = undefined;
        
        var isRendered = false;        
        var renderedElements = [];
        
        // Function defining wrapping of elements.
        var elementWrapper = undefined;
        
        // Returns element wrapper.
        var wrapElement = function(el, label) {
            console.log("LABEL", label);
            // Get parent wrapper
            if (containerElement === undefined && parentLayout !== undefined) {
                if (elementWrapper === undefined) {
                    return parentLayout.wrapElement(el, label);
                }
                else {
                    return parentLayout.wrapElement(elementWrapper(el, label));
                }
            }
            else {
                if (elementWrapper === undefined) {                    
                    if (label === undefined) {
                        return el;
                    }
                    else {
                        // We have a label but no elementWrapper.
                        var p = E.mk("div");
                        p.append(label);
                        p.append(el);
                        return p;
                    }
                }
                else {
                    return elementWrapper(el,label);
                }
            }
        };        
        
        // Sets the parent layout.
        var setParentLayout = function (pl) {
            if (parentLayout === undefined) {
                parentLayout = pl;
            }
            else {
                // TODO: ERROR
            }
        };
        
        var setContainerNode = function (node) {
            containerNode = node;
        }
        
        var getContainerNode = function() {            
            // First check container
            if(containerElement !== undefined) {
                return containerElement.inner.jQuery;           
            }
            else {
                if (parentLayout === undefined) {                    
                    return containerNode;
                }
                else {
                    console.log("B");
                    return parentLayout.getContainerNode();
                }    
            }
        };
                
        // Adds a wrapper function.
        var addWrapper = function(wrapper) {
            var old = elementWrapper;            
            elementWrapper = function (el,label) {
                if (old !== undefined) {
                    return wrapper (old (el,label));
                }
                else {
                    console.log("L", label);
                    return wrapper(el, label);
                }
            }
        };
              
        // Get list of leaf elements.
        var getElementList = function () {        
            elems = [];            
            if(containerElement !== undefined) {
                $(siblings).each(function(ix, sibling) {            
                    if(sibling.type === LAYOUT_TYPE) {
                        $(sibling.getElementList()).each(function(ix,elem) {
                            containerElement.inner.append(elem);    
                        });
                    }
                    else {
                        containerElement.inner.append(wrapElement(sibling));
                    }
                });
                // Include parent layout wrapper
                if (parentLayout !== undefined) {
                    renderedElements =
                        [parentLayout.wrapElement(containerElement.outer, label)];
                }   
                else {
                    renderedElements = [containerElement.outer];
                }

            }
            else {                
                // No container element.
                $(siblings).each(function(ix, sibling) {
                    if(sibling.type === LAYOUT_TYPE) {
                        elems = 
                            elems.concat(sibling.getElementList());
                    }
                    else {
                        elems.push(wrapElement (sibling, label));
                    }
                });
                
                renderedElements = elems;            
            }
                                    
            return renderedElements;    
        };        

        return {
            id : id,
            
            /***********************************************************
            * Type of object.
            ***********************************************************/
            type : LAYOUT_TYPE,      

            
            setLabel : function(l) {
                label = l;
            },
            
            setRendered : function () {
                isRendered = true;
                $(siblings).each(function(ix,sibling) {
                    if (sibling.type === LAYOUT_TYPE) {
                        sibling.setRendered();
                    }
                });
            },
            
            hasContainer : function() {
                return containerElement !== undefined;
            },
            
            wrapElement : wrapElement,
            
            /***********************************************************
            * @return Set parent
            ***********************************************************/                                                    
            setParentLayout : setParentLayout,
            
            /***********************************************************
            * @return The container node.
            ***********************************************************/                                                                
            getContainerNode : getContainerNode,
            
                        
            /***********************************************************
            * @return Number of elements.
            ***********************************************************/                                        
            numElements : function () {
                var count = 0;
                for (var i = 0; i < siblings.length; i++) {
                    var sibId = siblings[i].id;
                    count += siblings[i].numElements()
                }
                return count;
            },
            

            withContainer : function(f) {
                containerElement = f ();
                this.getOffset = function () {
                    return 0;
                }
            },
            
            /***********************************************************
            * @return Offset
            ***********************************************************/                                                            
            getOffset : function() {return 0;},              

            /***********************************************************
            * Append an element or layout.
            ***********************************************************/                    
            append : function(sibling) {
                
                // Set the parent layout of the sibling
                if (sibling.type === LAYOUT_TYPE) {
                    console.log("set parent layout of ", sibling.id, " to ",  this.id);
                    sibling.setParentLayout(this);
                }
                
                
                
                // Set the remove function
                var remove = sibling.remove;
                var siblingIndex = siblings.length;
                sibling.remove = function () {
                    remove();
                    siblings.splice(siblingIndex, 1);
                };                            
                
                // Offset function.
                var getOffset = this.getOffset;
                
                // Set the offset function for the sibling.
                sibling.getOffset = 
                    function () {
                        var count = 0;
                        var i = 0;
                        while (sibling[i] != undefined 
                                && sibling[i].id !== sibling.id) { 
                            count += siblings[i].numElements();
                            i = i + 1;
                        }
                        return count + getOffset();
                    };
                
                
                // If layout is rendered, then render teh layout to
                // the parent element.
                if(isRendered) {
                    console.log("isRender -> getContainerNode()", getContainerNode());
                    sibling.renderTo(getContainerNode());
                }                    
                
                // Add sibling to list of siblings.
                siblings.push(sibling);

                return this;          
            },
                              
            /***********************************************************
            * Remove the layout
            ***********************************************************/                                        
            remove : function() {
                
                // Remove all siblings
                $(siblings).each(function(ix,sibling) {
                    sibling.remove();
                });                                                      
                
                for (var ix = 0; ix < renderedElements.length; ix++) {
                    console.log("REMOVE");
                    renderedElements[ix].remove();
                }
                siblings = [];
            },
                
            /***********************************************************
            * @return - number of nested layout elements.
            ***********************************************************/                                        
            numLayouts : function() {
                var count = 0;
                for(var i = 0; i < siblings.length; i++) {
                    if (siblings.type == LAYOUT_TYPE) {
                        count += (1 + siblings[i].numLayouts());
                    }
                    else {
                        count += 1;
                    }
                }
                return count;
            },


            
            /***********************************************************
            * Add a wrapper funciton.
            * @return - same object.
            ***********************************************************/                                                    
            addWrapper : addWrapper,
                        
            
            /***********************************************************
            * Return weather a custom layout is assiged.
            * @return - true if has custom layout.
            ***********************************************************/                                                    
            hasCustomLayout : function () {
                return elementWrapper !== undefined;
            },
            
            /***********************************************************
            * Return all leaf elements.
            * @return - an array of all leaf elements.
            ***********************************************************/                                                    
            getElementList :getElementList,
            

            /***********************************************************
            * Render the layout to a jQuery element.
            * @ parent - the parent node to be rendered to.
            * @ offset (optional) - Offset index relative to the children
            *                       of the parent node.
            * @return - the new offset.
            ***********************************************************/                                        
            renderTo : function(containerNode, offset){
                    
                setContainerNode(containerNode);                
                
                // Init offset to zero if not set.
                if(offset === undefined) {
                    offset = this.getOffset();
                }                            
                
                                
                // Keep track of the total number of sub elements.
                var count = 0;
                
                // Render leaf elements.
                $(getElementList()).each(function(ix,element) {
                    element.renderTo(containerNode, offset + count);
                    count = count + 1;                    
                });
                
                // Set rendered
                this.setRendered();
                
                return count;
            }
        }
    };    
    
    this.L = {
        
        mk : mkSingle,          
        mk2 :
            function (elems) {
                var lastLayout = mkSingle();
                $(elems).each(function(ix, elem) {
                    var l = mkSingle(elem.Name, elem.Attrs, elem.Events);
                    if (lastLayout != undefined) {
                        lastLayout.append(l);
                    }
                    
                });
                return lastLayout;
            }
    }
})()
