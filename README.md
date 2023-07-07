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

# supported file formats
SUPPORTED_FILE_FORMATS=application/pdf,image/jpeg,image/png,audio/mpeg,video/mp4

# supported max file size(here 10MB)
SUPPORTED_MAX_FILE_SIZE=1048576
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
