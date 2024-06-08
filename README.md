  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

This Api provides user to post information about homes. It supports three types of users "BUYER", "REALTOR", "ADMIN" adding multitenancy to this API. It also provides JWT token based authentication and authorization. This Api is currently hosted on render. Anyone can use this API for making projects on frontend. 

<i><strong>Tech Stack</strong></i>: NestJS, PostgreSQL, Prisma ORM, Swagger, JWT, Bcryptjs.

API Link(BASE): https://realtor-app-api.onrender.com

Swagger Documentation Link: https://realtor-app-api.onrender.com/api

![image](https://github.com/609harsh/realtor-app/assets/97297407/f9354923-fcf3-41ad-9b42-e22d8be674a1)

ALL Routes
![image](https://github.com/609harsh/realtor-app/assets/97297407/a8ad7f1d-c582-491c-854e-b2da0b32a4b4)

DTO'S
![image](https://github.com/609harsh/realtor-app/assets/97297407/c0b1a369-f48e-4c14-a274-c1f327bff1d3)


## Installation

```bash
$ npm install
$ npx prisma generate
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

### ENV Variables 
- DATABASE_URL=<POSTGRESQL_DATABASE_URL>
- JWT_TOKEN=<TOKEN>
- PRODUCT_KEY=<PRODUCT_KEY>
## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

