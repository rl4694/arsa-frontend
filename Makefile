.PHONY: dev dev-pa github lint test all_tests dev_env build preview prod clean

dev:
	. scripts/dev_env.sh && npm run dev

dev-pa:
	. scripts/prod_env.sh && npm run dev

github:
	- git commit -a
	git push origin master

lint:
	npm run lint

test:
	npm run test -- --run

# CI pipeline style full
all_tests: lint test

dev_env:
	npm install

build:
	. scripts/prod_env.sh && npm run build

preview:
	npm run preview

# Production pipeline
prod: all_tests github

clean:
	rm -rf node_modules
	rm -rf dist
