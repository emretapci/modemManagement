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
WORKDIR /modemManagement
EXPOSE 3001

CMD ["npm", "start"]
