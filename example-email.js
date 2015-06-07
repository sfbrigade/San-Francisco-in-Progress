module.exports = function createEmail (email, address, hearingInfo) {
    return {
        "key": "7ZUL0_LO1EUZVpEF0FbzGw",
        "message": {
            "html": "<p>Upcoming public hearing for " + address + '</p>',
            "text": "A public hearing is scheduled for " + address,
            "subject": "A public hearing is scheduled for " + address,
            "from_email": "admin@sfinprogress.org",
            "from_name": "SF in Progress",
            "to": [
                {
                    "email": email,
                    "name": email,
                    "type": "to"
                }
            ],
            "headers": {
                "Reply-To": "mcelroyjessica@gmail.com"
            },
            "track_opens": null,
            "track_clicks": null,
        },
        "async": false,
    }
}