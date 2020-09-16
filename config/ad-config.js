module.exports = function (RED) {
    function ADConfigNode(n) {
        RED.nodes.createNode(this, n);

        const name = n.name;
        const options = {
            identityMetadata: n.identityMetadata,
            clientID: n.clientID
        }

        this.SqlString = SqlString;

        this.on('close', function (removed, done) {
            if (removed) {
                // This node has been disabled/deleted
            } else {
                // This node is being restarted
            }
            done();
        });
    }
    RED.nodes.registerType("ad-config", ADConfigNode);
}