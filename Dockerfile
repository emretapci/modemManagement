FROM node AS frontendBuilder
RUN git clone https://github.com/emretapci/modemManagementFrontend && \
	cd modemManagementFrontend && \
	npm i && \
	npm run-script build

FROM node
RUN git clone https://github.com/emretapci/modemManagement && \
	cd modemManagement && \
	npm i
COPY --from=frontendBuilder /modemManagementFrontend/build /modemManagement/public

CMD["npm", "start"]
