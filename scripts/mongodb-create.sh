#!/bin/bash
podman run -it --entrypoint=/bin/bash --name nucampsitedb -v ./data/db:/data/db -p 27017-27019:27017-27019 fc8dd96847d4 &
