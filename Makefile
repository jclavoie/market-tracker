.PHONY: build run stop clean help

IMAGE := market-tracker
CONTAINER := market-tracker
PORT := 3000

help:
	@echo "Usage:"
	@echo "  make build   Build the Docker image"
	@echo "  make run     Run the container"
	@echo "  make stop    Stop the container"
	@echo "  make clean   Remove image and container"

build:
	docker build -t $(IMAGE) .

run: stop
	docker run -d --name $(CONTAINER) -p $(PORT):$(PORT) $(IMAGE)
	@echo "Running at http://localhost:$(PORT)"

stop:
	docker stop $(CONTAINER) 2>/dev/null || true
	docker rm $(CONTAINER) 2>/dev/null || true

clean: stop
	docker rmi $(IMAGE) 2>/dev/null || true
