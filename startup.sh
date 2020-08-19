#!/bin/bash
git clone https://github.com/emretapci/modemManagement
cd modemManagement
npm i
cd frontend
npm i
npm run-script build
cd ..
npm start
