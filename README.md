MongoDb Aggregation Framework In Action !
=========================================

# Campings

## Groupement par classement

Requête :

    db.campings.aggregate([
        {$group : {_id : "$classement", total : {$sum : 1}}}
    ])

Résultat :

    { "_id" : "5 étoiles", "total" : 177 }
    { "_id" : "1 étoile", "total" : 389 }
    { "_id" : "2 étoiles", "total" : 1681 }
    { "_id" : "4 étoiles", "total" : 940 }
    { "_id" : "3 étoiles", "total" : 2224 }

## Top 5 des villes avec le plus de campings

Requête :

    db.campings.aggregate([
        {$group : {_id : "$commune", total : {$sum : 1}}},
        {$sort : {total : -1}},
        {$limit : 10}
    ])

Résultat :

    { "_id" : "ARGELÈS-SUR-MER", "total" : 32 }
    { "_id" : "AGDE", "total" : 23 }
    { "_id" : "VIAS", "total" : 20 }
    { "_id" : "SAINT-JEAN-DE-MONTS", "total" : 20 }
    { "_id" : "LES MATHES", "total" : 17 }

## Nombre de villes n'ayant qu'un seul camping

Requête :

    db.campings.aggregate([
        {$group : {_id : "$commune", total : {$sum : 1}}},
        {$match : {total : 1}},
        {$group: {_id: null, count: {$sum: 1 }}}
    ])

Resultat :

    { "_id" : null, "count" : 2802 }

