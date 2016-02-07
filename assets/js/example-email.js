module.exports = function createEmail (email, address, hearingInfo) {
    return {
        confirmation: {
            "key": "7ZUL0_LO1EUZVpEF0FbzGw",
            "message": {
                "html": "<p>You are now following " + address + '</p>',
                "text": "You are now following " + address,
                "subject": "You are now following  " + address,
                "from_email": "admin@sfinprogress.org",
                "from_name": "SF in Progress",
                "to": [
                    {
                        "email": email || 'mcelroyjessica@gmail.com',
                        "name": email || 'mcelroyjessica@gmail.com',
                        "type": "to"
                    }
                ],
                "headers": {
                    "Reply-To": "admin@sfinprogress.org"
                },
                "track_opens": null,
                "track_clicks": null,
            },
            "async": false,
        }
        , announcement: {
            "key": "7ZUL0_LO1EUZVpEF0FbzGw",
            "message": {
                "html": "<p>Upcoming public hearing for " + address + '</p>',
                "text": "A public hearing is scheduled for " + address,
                "subject": "A public hearing is scheduled for " + address,
                "from_email": "admin@sfinprogress.org",
                "from_name": "SF in Progress",
                "to": [
                    {
                        "email": email || 'mcelroyjessica@gmail.com',
                        "name": email || 'mcelroyjessica@gmail.com',
                        "type": "to"
                    }
                ],
                "headers": {
                    "Reply-To": "admin@sfinprogress.org"
                },
                "track_opens": null,
                "track_clicks": null,
            },
            "async": false,
        }
    }
}