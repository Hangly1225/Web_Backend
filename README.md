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
- **Lab 5**: Lightweight GraphQL-style sandbox and schema endpoint for querying products/categories and running product mutations.
- **Lab 6**: Request timing headers, ETag-based REST caching, short-lived in-memory caching and file uploads.

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

## Runtime configuration
Required variables:
- `PORT`: application port (Render provides this automatically)
- `SESSION_SECRET`: secret for session cookie signing
- `DATABASE_URL`: PostgreSQL connection string

## Main routes
- MVC home page: `/`
- MVC products: `/products`
- MVC brands: `/brands`
- MVC categories: `/categories`
- MVC orders: `/orders`
- MVC users: `/users`
- Swagger UI: `/api/docs`
- GraphQL sandbox: `/graphql`
- File upload page: `/files/upload`

- REST API base routes:
  - `/api/products`
  - `/api/brands`
  - `/api/categories`
  - `/api/orders`
  - `/api/users`

## Install
### development
```bash
npm run start
```

### watch mode
```bash
npm run start:dev
```

### production mode
```bash
npm run start:prod
```

## Database setup
```bash
npx prisma generate
npx prisma migrate dev --name init
npx prisma migrate deploy
```