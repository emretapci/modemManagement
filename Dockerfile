FROM node
EXPOSE 4001
COPY startup.sh .
CMD ./startup.sh
