module.exports = function (RED) {
    function HttpADConfigNode(n) {
        RED.nodes.createNode(this, n);

        const BearerStrategy = require('passport-azure-ad').BearerStrategy

        const name = n.name;

        const bearerStrategy = new BearerStrategy({
            identityMetadata: n.identityMetadata,
            clientID: n.clientID
        },
            function (token, done) {
                log.info('verifying the user');
                log.info(token, 'was the token retreived');
                findById(token.oid, function (err, user) {
                    if (err) {
                        return done(err);
                    }
                    if (!user) {
                        // "Auto-registration"
                        log.info('User was added automatically as they were new. Their oid is: ', token.oid);
                        users.push(token);
                        owner = token.oid;
                        return done(null, token);
                    }
                    owner = token.oid;
                    return done(null, user, token);
                });
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