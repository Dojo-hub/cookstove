# Cookstove Platform

## Backend

### Setup

Install only backend dependencies

```
yarn workspace backend install
```

Add .env file with database credentials. An example env file is included.

### Run

```
cd backend
yarn start
```

### Endpoints

Server is exposed on
`localhost:3000`

Authentication endpoints

`POST /register`

`POST /login`

`PUT /change-password`

`GET /profile`

Device endpoints

`GET /devices - get all devices`

`GET /devices/:id - get device by id`

`PUT /devices/:id - update device`

`POST /devices - add a new device`

`DELETE /devices/:id - delete a device`

### Test

Run in the backend directory

```
yarn test
```
