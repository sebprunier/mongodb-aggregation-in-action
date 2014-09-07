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

    var nbInsertedCampings = 0;

    var campings = db.collection('campings');

    //DATE DE CLASSEMENT;DATE DE PUBLICATION DE L'ETABLISSEMENT;TYPOLOGIE ÉTABLISSEMENT;CLASSEMENT;CATÉGORIE;MENTION;NOM COMMERCIAL;ADRESSE;CODE POSTAL;COMMUNE;TÉLÉPHONE;COURRIEL;SITE INTERNET;TYPE DE SÉJOUR;CAPACITÉ D'ACCUEIL (PERSONNES);NOMBRE DE CHAMBRES;NOMBRE D'EMPLACEMENTS;NOMBRE D'UNITES D'HABITATION;NOMBRE DE LOGEMENTS
    var columns = ['date_classement', 'date_publication', 'typologie', 'classement', 'categorie', 'mention', 'nom', 'adresse', 'code_postal', 'commune', 'telephone', 'courriel', 'site_internet', 'type_sejour', 'capacite', 'nb_chambres', 'nb_emplacements', 'nb_unites_habitation', 'nb_logements'];

    var parser = csv.parse({delimiter: ';'});
    var input = fs.createReadStream(__dirname + '/../../data/campings.csv');

    parser.on('readable', function () {
        var record;
        while (record = parser.read()) {
            var camping = _.object(columns, record);
            camping['date_classement'] = moment(camping['date_classement'], 'DD/MM/YYYY').toDate();
            camping['date_publication'] = moment(camping['date_publication'], 'DD/MM/YYYY').toDate();
            // insert camping
            campings.insert(camping, function (err) {
                if (err) throw err;
                nbInsertedCampings++;
            });
        }
    });

    parser.on('error', function (err) {
        throw err;
    });

    parser.on('finish', function (err) {
        if (err) throw err;
        console.log(nbInsertedCampings + ' camping inserted!');
        process.exit();
    });

    input.pipe(parser);
});
