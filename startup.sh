#!/bin/bash
if [ -e homeutils ]
then cd homeutils && git reset --hard && git pull
else git clone https://github.com/emretapci/homeutils && cd homeutils
fi
npm i
cd frontend
npm i
npm run-script build
cd ..
npm start
