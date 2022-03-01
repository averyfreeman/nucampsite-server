#!/bin/bash

cd routes
rm partners.js promotions.js
cp campsites.js partners.js 
cp campsites.js promotions.js
sed -i 's|campsite|partner|g' partners.js
sed -i 's|campsite|promotions|g' promotions.js

cd ..

