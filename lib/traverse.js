var types = require("./types");
var Node = types.namedTypes.Node;
var isArray = types.builtInTypes.array;
var NodePath = require("./node-path");

module.exports = function(node, callback) {
    function traverse(path) {
        if (isArray.check(path.value)) {
            path.each(traverse);
        } else if (Node.check(path.value)) {
            var node = path.value;

            if (callback.call(path, node) === false) {
                return;
            }

            types.eachField(node, function(name, child) {
                // Need to create the child path manually because child
                // might not actually be identical to path.value[name],
                // if for instance a default field value was substituted.
                traverse(new NodePath(child, path, name));
            });
        }
    }

    traverse(new NodePath(node));
};