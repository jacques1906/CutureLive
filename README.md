# Backend Notification Service for Film Rentals

## Context

As a backend developer for a film rental company, the goal is to improve the management of film returns by reminding customers of their rental return due date to avoid delays.

## Objective

This service sends email notifications to customers 5 days (J-5) and 3 days (J-3) before their rental return date, at 12:00 local time, taking into account the customer's time zone.

## Features

- Customer management (add/modify)
- Film rental management (create and manage)
- Scheduled tasks to send email notifications to customers before their rental due date:
  - 5 days (J-5) before at 12:00
  - 3 days (J-3) before at 12:00
- API to:
  - Add/modify a customer
  - Perform a rental
  - List all scheduled tasks
  - Manually trigger a scheduled task
  - Check the execution status of a scheduled task

## Technical Requirements

- **Database**: PostgreSQL with the "Sakila" schema available [here](https://github.com/jOOQ/sakila/tree/main/postgres-sakila-db)
- **Framework**: NestJS
- **ORM**: TypeORM
- **Scheduled tasks management**: Using the `@nestjs/schedule` package
- **TimeZone**:
- **Mail service simulation**: Simple log for email notifications

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/jacques1906/CutureLive
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Install the PostgreSQL "Sakila" database with the schema and data:
   - Link to the database: [Sakila PostgreSQL](https://github.com/jOOQ/sakila/tree/main/postgres-sakila-db)
   
4. Adding table "task"  to the Database:
- Open a Bash terminal.
- Use the following command to import a .sql file: "psql -U <username> -d <dbname> -f <path_to_file_Add_Task_pgadmin.sql>.sql"

5. Configure environment variables (example `.env`):
   ```
   DATABASE_URL=postgresql://user:password@localhost:5432/sakila
   ```

## Running the Application

- To start the NestJS application:
  ```bash
  npm run start
  ```

- Access the API at the following URL: `http://localhost:3000`

## API Request

1. **Add a customer**:
   - `POST /customers`
   - Payload:
     ```json
{
    "first_name": "Joean",
    "last_name": "Test",
    "email": "john.do@example.com",
    "store_id": 1,
    "address": "asa",
    "district": "iriw",
    "postal_code": "75200",
    "phone": "011232432322",
    "city_name": "Mahajanga",
    "country_name": "Sezn"

}
     ```
2. **Update a customer**:
    - `PUT /customers/:id`
    -Payload:
      ```json
    {
      "first_name": "John",
      "last_name": "Doe",
      "email": "john.doe@example.com",
      "address": "New Street 123",
      "district": "New District",
      "postal_code": "12345",
      "phone": "123-456-78290",
      "city": "Ziguinchor",
      "country": "Moldova"
    }
    ```

2. **Create a rental**:
   - `POST /rentals`
   - Payload:
     ```json
    {
      "customer_id": 90,
      "inventory_id": 68,
      "staff_id": 2,
      "rental_date": "2024-10-10",
      "return_date": "2024-10-21"
    }

     ```

3. **List scheduled tasks**:
   - `GET /tasks`

4. **Manually trigger a scheduled task**:
   - `POST /tasks/:id/run`

5.  **Check the execution status of a scheduled task**:
    - `GET /tasks/:id/status`

## Tests

- To run tests:
  ```bash
  npm run test
  ```
