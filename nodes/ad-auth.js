module.exports = function (RED) {
    function ADBearerAuthNode(n) {
        RED.nodes.createNode(this, n);
        var node = this;
        const configNode = RED.nodes.getNode(n.config);

        node.options = {
            identityMetadata: configNode.options.identityMetadata,
            clientID: configNode.options.clientID
        };

        const passport = require('passport');
        const BearerStrategy = require('passport-azure-ad').BearerStrategy

        var bearerStrategy = new BearerStrategy(node.options,
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

        passport.use(bearerStrategy);

        node.on('input', function (msg) { 
        });
    }
    RED.nodes.registerType("ad-bearer-auth", ADBearerAuthNode);
}