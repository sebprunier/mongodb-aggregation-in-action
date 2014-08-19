MongoDb Aggregation Framework In Action !
=========================================

# Campings

## Groupement par classement

Requête :

    db.campings.aggregate([{$group : {_id : "$classement", total : {$sum : 1}}}])

Résultat :

    { "_id" : "5 étoiles", "total" : 177 }
    { "_id" : "1 étoile", "total" : 389 }
    { "_id" : "2 étoiles", "total" : 1681 }
    { "_id" : "4 étoiles", "total" : 940 }
    { "_id" : "3 étoiles", "total" : 2224 }

