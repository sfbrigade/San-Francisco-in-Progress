window.Mocks or= { Hoodie: {} }

window.Mocks.usersAllDocsResponse = ->
    "total_rows": 2,
    "offset": 1,
    "rows": [
        {
            "id": "org.couchdb.user:user/testf8le0@example.com",
            "key": "org.couchdb.user:user/testf8le0@example.com",
            "value": {
                "rev": "2-120973b883d8abe355fa58cf68167eca"
            },
            "doc": {
                "_id": "org.couchdb.user:user/testf8le0@example.com",
                "_rev": "2-120973b883d8abe355fa58cf68167eca",
                "name": "user/testf8le0@example.com",
                "type": "user",
                "roles": [
                    "testf8le0",
                    "confirmed"
                ],
                "ownerHash": "testf8le0",
                "database": "user/testf8le0",
                # "updatedAt": "2013-04-15T18:08:01.593Z",
                # "createdAt": "2013-04-15T18:08:01.593Z",
                "signedUpAt": "2013-04-15T18:08:01.593Z",
                "password_sha": "61a4c8acb6ff993389e31e7a7cdf3ab02d9fb810",
                "salt": "9303e4d96ebdb4fe926f5f57ded5f677",
                "$state": "confirmed"
            }
        }
    ]