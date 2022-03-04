#!/bin/bash
set -v
RWD=../routes

rm $RWD/partners.js $RWD/promotions.js
cp $RWD/campsites.js $RWD/partners.js 
cp $RWD/campsites.js $RWD/promotions.js
sed -i 's|campsite|partner|g' $RWD/partners.js
sed -i 's|campsite|promotions|g' $RWD/promotions.js

echo 'all done'

