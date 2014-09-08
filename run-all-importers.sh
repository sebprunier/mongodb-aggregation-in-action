#!/bin/sh

IMPORTERS_DIR="src/importers"
DATABASE_NAME="aggregation-examples"

echo "Clean database..."
mongo $DATABASE_NAME --eval "printjson(db.dropDatabase())" --quiet

echo "Import Campings dataset..."
node "$IMPORTERS_DIR/campings-importer.js"

echo "Perform some checks..."
NUMBER_OF_CAMPINGS=`mongo $DATABASE_NAME --eval "printjson(db.campings.count())" --quiet`
echo "Number of campings: $NUMBER_OF_CAMPINGS"
