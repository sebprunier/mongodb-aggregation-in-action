#!/bin/sh

IMPORTERS_DIR="src/importers"
DATABASE_NAME="aggregation-examples"

echo "Clean database..."
mongo $DATABASE_NAME --eval "printjson(db.dropDatabase())" --quiet

echo "Import Campings dataset..."
node "$IMPORTERS_DIR/campings-importer.js"

echo "Import Marvel Comics dataset..."
unzip -o -d /tmp data/marvel-comics.json.zip
mongoimport --collection comics --db aggregation-examples --file /tmp/marvel-comics.json --quiet

echo "Perform some checks..."
NUMBER_OF_CAMPINGS=`mongo $DATABASE_NAME --eval "printjson(db.campings.count())" --quiet`
echo "Number of campings: $NUMBER_OF_CAMPINGS"
NUMBER_OF_COMICS=`mongo $DATABASE_NAME --eval "printjson(db.comics.count())" --quiet`
echo "Number of comics: $NUMBER_OF_COMICS"
