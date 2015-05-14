var nodemailer = require('nodemailer'),
    dataurl = require('dataurl');


exports.start = function (config_manager) {
    var transport;

    function updateConfig(appcfg) {
        var cfg = {
            host: appcfg.email_host,
            port: appcfg.email_port,
            auth: {
                user: appcfg.email_user,
                pass: appcfg.email_pass
            },
            secureConnection: appcfg.email_secure,
            service: appcfg.email_service
        };
        if (transport) {
            // retire old connection pool
            var _transport = transport;
            _transport.close();
        }
        // create new connection pool with updated config
        transport = nodemailer.createTransport("SMTP", cfg);
    }

    // set up initial config
    updateConfig(config_manager.getAppConfig());

    return {
        updateConfig: updateConfig,
        sendEmail: function (opt, callback) {
            try {
                // clone opt object as sendMail will extend it with
                // non JSON-serializable 'transport' property
                var email = JSON.parse(JSON.stringify(opt));
            }
            catch (e) {
                return callback(e);
            }
            if (email.attachments) {
                email.attachments = email.attachments.map(function (att) {
                    // strip filePath properties from attachments
                    delete att.filePath;
                    // parse dataURI properties
                    if (att.dataURI) {
                        var parsed = dataurl.parse(att.dataURI);
                        att.contents = parsed.data;
                        att.contentType = parsed.mimetype;
                        delete att.dataURI;
                    }
                    return att;
                });
            }
            return transport.sendMail(email, callback);
        },
        stop: function (callback) {
            return transport.close(callback);
        }
    };
};
