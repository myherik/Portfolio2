#! /bin/bash

cd node_exporter-1.1.2.linux-amd64

# running in background mode
./node_exporter &

cd ..

npm start