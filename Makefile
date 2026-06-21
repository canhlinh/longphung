run:
	docker compose up -d
	npm run seed
	npm run dev