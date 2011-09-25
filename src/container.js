var Container = (function() {

    var CONTAINER_TYPE = "Container";
    
    var id = 0;
    
    var mkSingle = function (siblings) {
        id = id + 1;
        var cId = id;
                
        if (siblings === undefined) {
            siblings = [];
        }
                    
        // State variables
        var parentContainer;
        
        // Node to which the container is rendered.
        var containerNode;
        
        // Element to which the children are rendered.
        var containerElement;
                
        // Label
        var label;
        
        var isRendered = false;        
        var renderedElements = [];
        
        // Function defining wrapping of elements.
        var elementWrapper;
        
        // Returns element wrapper.
        var wrapElement = function(el, label) {
            // Get parent wrapper
            if (containerElement === undefined && parentContainer !== undefined) {
                if (elementWrapper === undefined) {
                    return parentContainer.wrapElement(el, label);
                }
                else {
                    return parentContainer.wrapElement(elementWrapper(el, label));
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

        // Sets the parent container.
        var setParentContainer = function (pl) {
            if (parentContainer === undefined) {
                parentContainer = pl;
            }
            else {
                // TODO: ERROR
            }
        };
        
        var setContainerNode = function (node) {
            containerNode = node;
        };
        
        var getContainerNode = function() {            
            // First check container
            if (containerElement !== undefined) {
                return containerElement.inner.jQuery;           
            }
            else {
                if (parentContainer === undefined) {                    
                    return containerNode;
                }
                else {
                    return parentContainer.getContainerNode();
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
                    return wrapper(el, label);
                }
            };
        };
              
        // Get list of leaf elements.
        var getElementList = function () {        
            elems = [];            
            if(containerElement !== undefined) {
                siblings.map(function(sibling, ix) {            
                    if(sibling.type === CONTAINER_TYPE) {
                        $(sibling.getElementList()).each(function(ix,elem) {
                            containerElement.inner.append(elem);    
                        });
                    }
                    else {
                        containerElement.
                        inner.
                        append( wrapElement(sibling, label));
                    }
                });
                
                
                // Include parent container wrapper
                if (parentContainer !== undefined) {
                    renderedElements =
                        [
                            parentContainer.wrapElement(
                                containerElement.outer, label
                            )
                        ];
                }   
                else {
                    renderedElements = [containerElement.outer];
                }
            }
            else {                
                // No container element.
                siblings.map (function (sibling) {
                    if(sibling.type === CONTAINER_TYPE) {
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
            type : CONTAINER_TYPE,      

            
            setLabel : function(l) {
                label = l;
            },
            
            getRenderedElements : function () {
                if (renderedElements !== undefined) {
                    return renderedElements;
                }
                else {
                    return [];
                }
            },
            
            setRendered : function () {
                isRendered = true;
                $(siblings).each(function(ix,sibling) {
                    if (sibling.type === CONTAINER_TYPE) {
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
            setParentContainer : setParentContainer,
            
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
                    count += siblings[i].numElements();
                }
                return count;
            },
            
            /***********************************************************
            * @return Offset
            ***********************************************************/                                                            
            withContainer : function(f) {
                containerElement = f ();
                this.getOffset = function () {
                    return 0;
                };
            },
            
            /***********************************************************
            * @return Offset
            ***********************************************************/                                                            
            getOffset : function() {return 0;},              

            /***********************************************************
            * Append an element or container.
            ***********************************************************/                    
            append : function(sibling) {
                
                // Set the parent container of the sibling
                if (sibling.type === CONTAINER_TYPE) {
                    sibling.setParentContainer(this);
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
                        while (sibling[i] !== undefined && sibling[i].id !== sibling.id) { 
                            count += siblings[i].numElements();
                            i = i + 1;
                        }
                        return count + getOffset();
                    };
                
                
                // If container is rendered, then render teh container to
                // the parent element.
                if(isRendered) {
                    sibling.renderTo(getContainerNode());
                }                    
                
                // Add sibling to list of siblings.
                siblings.push(sibling);

                return this;          
            },
                              
            /***********************************************************
            * Remove the container
            ***********************************************************/                                        
            remove : function() {
                
                // Remove all siblings
                $(siblings).each(function(ix,sibling) {
                    sibling.remove();
                });                                                      
                
                for (var ix = 0; ix < renderedElements.length; ix++) {
                    renderedElements[ix].remove();
                }
                siblings = [];
            },
                
            /***********************************************************
            * @return - number of nested container elements.
            ***********************************************************/                                        
            numContainers : function() {
                var count = 0;
                for(var i = 0; i < siblings.length; i++) {
                    if (siblings.type == CONTAINER_TYPE) {
                        count += (1 + siblings[i].numContainers());
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
            * Return weather a custom container is assiged.
            * @return - true if has custom container.
            ***********************************************************/                                                    
            hasCustomContainer : function () {
                return elementWrapper !== undefined;
            },
            
            /***********************************************************
            * Return all leaf elements.
            * @return - an array of all leaf elements.
            ***********************************************************/                                                    
            getElementList :getElementList,
            

            /***********************************************************
            * Render the container to a jQuery element.
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
                (getElementList()).map (function (element) {
                    element.renderTo(containerNode, offset + count);
                    count = count + 1;                    
                });
                
                // Set rendered
                this.setRendered();
                
                return count;
            }
        };
    };    
    
    return {
        
        /***********************************************************
         *
         ***********************************************************/
        Factory : {
            create : function (elems) {
                
                if (elems === undefined) {
                    elems = [];
                }
                
                var lastContainer = mkSingle();
                elems.map (function(elem, ix) {
                    var l = mkSingle(elem.Name, elem.Attrs, elem.Events);
                    if (lastContainer !== undefined) {
                        lastContainer.append(l);
                    }
                    
                });
                
                return lastContainer;
            }
        },
        
        
        /***********************************************************
         *
         ***********************************************************/                    
        sequence : function(containers) {
            var container;
            containers.map (function(l) {
                if (container === undefined) {
                    container = l;
                } else {
                    container.append(l);
                }
            });
            return container;
        }
    };
    
    
}());
