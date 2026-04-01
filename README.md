## Author: Nguyen Thi Hang Ly
## Group: M3309
## Live demo
[Link] https://web-backend-bfmc.onrender.com

## Project scope
This project implements a multi-page MVC web app with NestJS, EJS templates, Prisma ORM and PostgreSQL.
- **Lab 1**: Render deployment, static frontend serving, EJS partials/layout, session-aware header blocks.
- **Lab 2**: Domain model with relational schema, Prisma migrations and ER diagram.
- **Lab 3**: Subdomain modules, MVC CRUD pages, service-layer business logic, and SSE realtime product updates.
- **Lab 4**: RESTful API controllers, Swagger/OpenAPI docs, validation, exception filtering and paginated collection endpoints.
- **Lab 5**: Code-first GraphQL schema with Apollo Sandbox, queries, mutations, field resolvers, pagination and complexity limits.
- **Lab 6**: Request timing headers, ETag-based REST caching, short-lived in-memory caching and file uploads.
- **Lab 7**: Authentication & authorization

## Domain model
Main entities:
- User
- Brand
- Category
- Product
- Order
- OrderItem
- CartItem

Core relations:
- One **Brand** has many **Category** records.
- One **Category** belongs to one **Brand** and has many **Product** records.
- One **Product** belongs to one **Category**.
- One **User** has many **Order** and **CartItem** records.
- **OrderItem** links **Order** and **Product**.

Relations are defined in `prisma/schema.prisma` and visualized in ERD:

![ER Diagram](./er-diagram.png)

## Runtime environment variables
Required:
- `PORT`
- `DATABASE_URL`
- `SESSION_SECRET`

Optional (object storage):
- `S3_ENDPOINT`
- `S3_REGION`
- `S3_BUCKET`
- `S3_ACCESS_KEY_ID`
- `S3_SECRET_ACCESS_KEY`
- `S3_PUBLIC_BASE_URL`

Optional (CORS):
- `CORS_ORIGIN` (comma-separated)

## Main routes
- Home: `/`
- MVC pages: `/products`, `/brands`, `/categories`, `/orders`, `/users`
- Swagger: `/api/docs`
- GraphQL (Apollo): `/graphql`
- Upload page: `/files/upload`

## REST API base routes
- `/api/auth`
- `/api/products`
- `/api/brands`
- `/api/categories`
- `/api/orders`
- `/api/users`
- `/api/files`

## Install & run
```bash
npm install
npm run build
npm run start:dev
```

## Production 
```bash
npm run build
npm run start:prod
```

## Database commands
```bash
npx prisma generate
npx prisma migrate dev --name init
npx prisma migrate deploy
```