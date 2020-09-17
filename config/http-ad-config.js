module.exports = function (RED) {
    function HttpADConfigNode(n) {
        RED.nodes.createNode(this, n);

        const BearerStrategy = require('passport-azure-ad').BearerStrategy

        const name = n.name;

        const bearerStrategy = new BearerStrategy({
            identityMetadata: n.identityMetadata,
            clientID: n.clientID,
            scope: [n.scope],
            passReqToCallback: false
            //loggingLevel: "info"
        },
            function (token, done) {
                if (!token.oid)
                    done(new Error('oid is not found in token'));
                else {
                    owner = token.oid;
                    done(null, token);
                }
            }
        );

        this.name = name;
        this.bearerStrategy = bearerStrategy;

        this.on('close', function (removed, done) {
            if (removed) {
                // This node has been disabled/deleted
            } else {
                // This node is being restarted
            }
            done();
        });
    }
    RED.nodes.registerType("http-ad-config", HttpADConfigNode);
}