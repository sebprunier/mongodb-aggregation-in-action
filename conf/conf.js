'use strict';

var Conf = {
    tmpdir: process.env.TMPDIR || '/tmp',
    mongodb: {
        url: process.env.MONGO_URL || 'mongodb://localhost:27017/aggregation-examples'
    },
    marvel: {
        public_key: process.env.MARVEL_PUBLIC_KEY,
        private_key: process.env.MARVEL_PRIVATE_KEY
    }
};

module.exports = Conf;