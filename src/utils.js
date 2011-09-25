(function () {
    Array.prototype.map = function(f) {
        var arr = [];
        for (var ix = 0; ix < this.length; ix++) {
            arr.push(f(this[ix], ix));
        }
        return arr;
    };
})();
