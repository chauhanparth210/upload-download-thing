## upload_download_thing

A backend module that can handle file upload, download & metadata

#### [Product documentation](https://docs.google.com/document/d/1pLZfXYkkU2WzHAvS8mzg6n3mP3JT5RAe2Nch0lFgghE/edit?usp=sharing)

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

# supported max file size (should be in MBs)
SUPPORTED_MAX_FILE_SIZE=10
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
