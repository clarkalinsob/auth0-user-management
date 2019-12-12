# auth0-user-management

Auth0 and VueJS User Management App

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

1. You must have `docker` and `docker-compose` in your machine.

2. Create `auth_config.json` on `client` root folder and add your client credentials.
```
{
    "domain": YOUR_AUTH0_DOMAIN,
    "clientId": YOUR_AUTH0_CLIENT_ID,
    "audience": "https://YOUR_AUTH0_DOMAIN/api/v2/"
}
```

3. Create `.env.development.local` and `.env.production.local` on `client` root folder and add your URL.
```
VUE_APP_URL=YOUR_URL
```

4. Create `.env` on `server` root folder and add your client and m2m credentials.
```
AUTH0_DOMAIN=YOUR_AUTH0_DOMAIN
AUTH0_CLIENT_ID=YOUR_AUTH0_CLIENT_ID
AUTH0_CLIENT_SECRET=YOUR_AUTH0_CLIENT_ID

# FOR MACHINE TO MACHINE API ACCESS
AUTH0_M2M_CLIENT_ID=YOUR_AUTH0_M2M_CLIENT_ID
AUTH0_M2M_CLIENT_SECRET=YOUR_AUTH0_M2M_CLIENT_SECRET
```

### Running the App

Go to `root` directory and run the command

```
docker-compose build
```

After a successful build, run the command
```
docker-compose up
```
or
```
docker-compose up -d
```

## Author
**Clark Egbert Alinsob**

