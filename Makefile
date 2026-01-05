.PHONY: help install build dev start deploy logs lint clean

# Default target
help:
	@echo "Available commands:"
	@echo "  make install    - Install dependencies"
	@echo "  make build      - Build the application"
	@echo "  make dev        - Start development server"
	@echo "  make start      - Start production server"
	@echo "  make deploy     - Run deployment script"
	@echo "  make logs       - View logs (Docker)"
	@echo "  make lint       - Run linter"
	@echo "  make clean      - Clean up build artifacts and caches"

install:
	npm install
	npx prisma generate

build:
	npx prisma generate
	npm run build

dev:
	npm run dev

start:
	npm start

deploy:
	./deploy.sh

logs:
	docker-compose logs -f

lint:
	npm run lint

clean:
	rm -rf .next
	rm -rf node_modules
	rm -rf .swc
	echo "Cleaned up build artifacts."
