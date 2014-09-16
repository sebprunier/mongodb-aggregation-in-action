MongoDb Aggregation Framework In Action !
=========================================

# How to import datasets?

This is very simple! All you have to do is tu run the script `run-all-importers.sh`

## Marvel dataset online importer

By default, the script `run-all-importers.sh` uses data available in the `data` folder.
If you have a Marvel account and want to get some fresh data, run the script `marvel-comics-importer` from the `src/importers` directory :

    MARVEL_PUBLIC_KEY=<your_marvel_public key> MARVEL_PRIVATE_KEY=<your_marvel_private_key> node marvel-comics-importer.js

For more details, see [developer.marvel.com](http://developer.marvel.com/)


# Campings dataset

## Group by ranking

Query:

    db.campings.aggregate([
        {$group : {_id : "$ranking", total : {$sum : 1}}}
    ])

Results:

    { "_id" : "5 étoiles", "total" : 177 }
    { "_id" : "4 étoiles", "total" : 940 }
    { "_id" : "3 étoiles", "total" : 2224 }
    { "_id" : "2 étoiles", "total" : 1681 }
    { "_id" : "1 étoile", "total" : 389 }

## Top 5 cities with the highest number of campings

Query:

    db.campings.aggregate([
        {$group : {_id : "$city", total : {$sum : 1}}},
        {$sort : {total : -1}},
        {$limit : 5},
        {$project: {_id: 0, city : "$_id", total: 1}}
    ])

Results:

    { "_id" : "ARGELÈS-SUR-MER", "total" : 29 }
    { "_id" : "AGDE", "total" : 23 }
    { "_id" : "VIAS", "total" : 20 }
    { "_id" : "SAINT-JEAN-DE-MONTS", "total" : 20 }
    { "_id" : "LES MATHES", "total" : 17 }

## Number of cities with only one camping

Query:

    db.campings.aggregate([
        {$group : {_id : "$city", total : {$sum : 1}}},
        {$match : {total : 1}},
        {$group: {_id: null, count: {$sum: 1 }}},
        {$project: {_id: 0, count: 1}}
    ])

Results:

    { "count" : 2802 }


# Marvel Comics dataset

## Top 5 characters with the highest number of comics

Query:

    db.comics.aggregate([
        {$match : {"characters.returned" : {$gt : 0}}},
        {$project : {title : 1, characters : 1}},
        {$unwind : "$characters.items"},
        {$group : {_id : "$characters.items.name", total : {$sum : 1}}},
        {$sort : {total : -1}},
        {$limit : 5}
    ])

Results:

    {"_id": "Spider-Man","total": 2413}
    {"_id": "X-Men","total": 2320}
    {"_id": "Iron Man","total": 1904}
    {"_id": "Wolverine","total": 1594}
    {"_id": "Captain America","total": 1367}


## Create the `characters` collection from the `comics` collection

Query:

    db.comics.aggregate([
        {$match : {"characters.returned" : {$gt : 0}}},
        {$project : {title : 1, characters : 1}},
        {$unwind : "$characters.items"},
        {$group : {_id : "$characters.items.name", total : {$sum : 1}, comics : {$push : {id : "$_id", title : "$title"}}}},
        {$out : "characters"}
    ])

Results (`findOne()` query from the `characters` collection):

    {
      "_id": "Frog-Man",
      "total": 2,
      "comics": [
        {
          "id": 38126,
          "title": "Spider-Man: New York Stories (Trade Paperback)"
        },
        {
          "id": 39753,
          "title": "Spider-Island: Avengers (2011) #1"
        }
      ]
    }
