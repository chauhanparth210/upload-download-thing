## Upload_Download_Thing

A backend module that can handle file upload, download & metadata

## Installation

```bash
$ pnpm install
```

## Environment variables

Create `.env` file inside the root of this project

```
POSTGRES_HOST
POSTGRES_PORT
POSTGRES_USER
POSTGRES_PASSWORD
POSTGRES_DB
APPLICATION_PORT
```

## Running the app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Test

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```
