'use strict';

var csv = require('csv');
var fs = require('fs');
var mongodb = require('mongodb');
var moment = require('moment');
var _ = require('underscore');

var conf = require('../../conf/conf');

var MongoClient = mongodb.MongoClient;

MongoClient.connect(conf.MONGO_URL, function (err, db) {
    if (err) throw err;

    var campings = db.collection('campings');

    /*
     CSV columns translation :
     - DATE DE CLASSEMENT                     -> raking date
     - DATE DE PUBLICATION DE L'ETABLISSEMENT -> publication date
     - TYPOLOGIE ÉTABLISSEMENT                -> typology
     - CLASSEMENT                             -> ranking
     - CATÉGORIE                              -> category
     - MENTION                                -> mention
     - NOM COMMERCIAL                         -> commercial name
     - ADRESSE                                -> address
     - CODE POSTAL                            -> zip code
     - COMMUNE                                -> city
     - TÉLÉPHONE                              -> phone
     - COURRIEL                               -> email
     - SITE INTERNET                          -> website
     - TYPE DE SÉJOUR                         -> visit type
     - CAPACITÉ D'ACCUEIL (PERSONNES)         -> capacity
     - NOMBRE DE CHAMBRES                     -> number of rooms
     - NOMBRE D'EMPLACEMENTS                  -> number of spaces
     - NOMBRE D'UNITES D'HABITATION           -> number of housing units
     - NOMBRE DE LOGEMENTS                    -> number of chambers
     */
    var columns = [
        'raking_date',
        'publication_date',
        'typology',
        'ranking',
        'category',
        'mention',
        'commercial_name',
        'address',
        'zip_code',
        'city',
        'phone',
        'email',
        'website',
        'visit_type',
        'capacity',
        'number_of_rooms',
        'number_of_spaces',
        'number_of_housing_units',
        'number_of_chambers'
    ];

    var parser = csv.parse({
        delimiter: ';',
        comment: '#'
    });
    var input = fs.createReadStream(__dirname + '/../../data/campings.csv');

    parser.on('readable', function () {
        var record;
        while (record = parser.read()) {
            var camping = _.object(columns, record);
            camping['raking_date'] = moment(camping['raking_date'], 'DD/MM/YYYY').toDate();
            camping['publication_date'] = moment(camping['publication_date'], 'DD/MM/YYYY').toDate();
            // insert camping
            campings.insert(camping, function (err, obj) {
                if (err) throw err;
            });
        }
    });

    parser.on('error', function (err) {
        throw err;
    });

    parser.on('finish', function (err) {
        if (err) throw err;
        console.log('Campings insertion successful!');
        process.exit();
    });

    input.pipe(parser);
});
