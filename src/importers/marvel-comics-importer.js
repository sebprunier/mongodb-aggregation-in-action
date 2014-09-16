'use strict';

var marvel = require('marvel-api');
var mongodb = require('mongodb');

var conf = require('../../conf/conf');

var MarvelClient = marvel.createClient({
    publicKey: conf.marvel.public_key,
    privateKey: conf.marvel.private_key
});

var MongoClient = mongodb.MongoClient;

MongoClient.connect(conf.mongodb.url, function (err, db) {
    if (err) throw err;

    function numberOfPages(results) {
        var totalDocs = results.meta.total;
        console.log(totalDocs + ' comics will be inserted...');
        return  Math.round(totalDocs / 100) + 1;
    }

    function insertComics(numberOfPages) {
        var comics = db.collection('comics');
        for (var i = 0; i < numberOfPages; i++) {
            var limit = 100;
            var offset = i * limit;
            MarvelClient.comics.findAll(limit, offset, function (err, results) {
                if (err) throw err;
                if (results.data) {
                    results.data.forEach(function (result) {
                        result['_id'] = result.id;
                        delete result.id;
                        // use 'save' instead of 'insert' because the marvel api returns duplicates...
                        comics.save(result, function (err) {
                            if (err) throw err;
                        });
                    });
                }
            });
        }
    }

    MarvelClient.comics.findAll(1, 0)
        .then(function (results) {
            return numberOfPages(results);
        })
        .then(function (numberOfPages) {
            insertComics(numberOfPages);
        })
        .fail(function (error) {
            throw error;
        })
        .done();

    // FIXME the script does not seem to terminate...
});
