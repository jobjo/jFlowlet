/**
 * Loading this script file extends all flowlet objects with
 * validation capabilities.
 */
(function () {
    
    Flowlet.Factory.extend ( {
                
        /**
         * 
         */
        withValidationIcon : function () {
            var form =
                this
                .withElementWrapper(function(el,l) {
                    var pan = Element.mk("div");
                    var icon = Element.mk("div", {attrs: {'class' : 'valid'}});
                    
                    var label = Element.mk("label");
                    if(l !== undefined) {
                        label.append(l);
                    }
                    pan.append(label);
                    pan.append(el);
                    pan.append(icon);
                    return pan;
                });
                
            return form;
        }
    });

}());


