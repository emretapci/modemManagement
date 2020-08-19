#!/bin/bash
if [ -e modemManagement ]
then cd modemManagement && git pull
else git clone https://github.com/emretapci/modemManagement && cd modemManagement
fi
npm i
cd frontend
npm i
npm run-script build
cd ..
npm start
