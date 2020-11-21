# meal-scheduler

Meal scheduling server. Allows you to claim a meal spot and announce your recipe ahead of time.

Created by Oliver X. (Liversticks).  

Latest revision: November 21, 2020

## Goals

Create an API that supports CRUD operations and gain more familiarity with Node.

## Frameworks + Stack

* NodeJS
* Express
* Sequelize + PostgreSQL
* [Front-end client](https://github.com/Liversticks/meal-client) sold separately

## Installation

This assumes you are using PostgreSQL as the database engine.

* If not using Postgres, edit `./config/db.js` and configure your preferred DB
* Set environment variables: LOCALDATABASE or DATABASE_URL (connection string)
* `npm install` to fetch external dependencies
* `npm start` to start server

## API Reference

### POST `/api/signup`

Create a new user.

Request fields:
* `username`
* `email` 
* `password`
* `birthday` (format YYYY-MM-DD)

Response object will contain a `message` field.

Example request:
```
{
  "username": "admin",
  "email": "test-email@test.com",
  "password": "s!f239fJ2",
  "birthday": "1981-09-30"
}
```
Response:
```
{
  "message": "Signed up successfully!"
}
```

### POST `/api/login`

Log in. 

Request fields:
* `username` (must already exist)
* `password`

On success, returns a JWT token that is used for requests to authentication-required routes.

Example request:
```
{
  "username": "admin",
  "password": "Lsd0WShME9$"
}
```
Response if successful:
```
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjA0NjMzNDg4LCJleHAiOjE2MDQ2NzY2ODh9.sEPGYjZHJV3Dp-3oXmCNGZXh31xIlxP3K1ITmjOO13E"
}
```
Response if unsuccessful:
```
{
  "accessToken": null,
  "message": "Authentication error - invalid username or password."
}
```

### GET `/api/meals`

Fetches database rows, scheduled meals, holiday (if applicable) from current date to (current date + 35 days) ordered by date ascending. `x-access-token` header necessary for access.

Example request:
```
x-access-token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjA0NjMzNDg4LCJleHAiOjE2MDQ2NzY2ODh9.sEPGYjZHJV3Dp-3oXmCNGZXh31xIlxP3K1ITmjOO13E'
```
Response:
```
{
  "11/20/2020": {
    "breakfast": {},
    "lunch": {},
    "dinner": {
      "chef": "admin",
      "meal_desc": "Beans and rice."
    },
    "snack": {}
  },
  "11/21/2020": {
    "breakfast": {
      "chef": "another_user",
      "meal_desc": "Congee with spicy pickled vegetables."
    },
    "lunch": {},
    "dinner": {},
    "snack": {}
  },
  ...
  "12/25/2020": {
    "breakfast": {},
    "lunch": {},
    "dinner": {},
    "snack": {
      "chef": "secret_elf",
      "meal_desc": "Double chocolate chip cookies with whole milk."
    },
    "holiday": "Christmas"
  }
}
```

### POST `/api/meals`

Creates a new meal. `x-access-token` header necessary for access as the username is encoded in the JWT.

Request fields: 
* `meal_date` (MM/DD/YYYY between the current date and 75 days from now)
* `meal_type` (breakfast, lunch, dinner, or snack)
* `meal_desc` (description)

Response object always contains a `message` field.

Example request:
```
x-access-token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjA0NjMzNDg4LCJleHAiOjE2MDQ2NzY2ODh9.sEPGYjZHJV3Dp-3oXmCNGZXh31xIlxP3K1ITmjOO13E'
{
  "meal_date": "11/21/2020",
  "meal_type": "lunch",
  "meal_desc": "Tuna salad sandwiches."
}
```
Response:
```
{
  "message": "Meal scheduled successfully!"
}
```

### PUT `/api/meals`

Updates an existing meal. `x-access-token` header necessary for access as the username is encoded in the JWT. 

Request fields:
* `meal_date` (MM/DD/YYYY between the current date and 75 days from now)
* `meal_type` (breakfast, lunch, dinner, or snack)
* `meal_desc` (description)

If no meal entry exists in the database with the exact same chef, `meal_date`, and `meal_type`, the update fails. Response object always contains a `message` field.

Example request:
```
x-access-token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjA0NjMzNDg4LCJleHAiOjE2MDQ2NzY2ODh9.sEPGYjZHJV3Dp-3oXmCNGZXh31xIlxP3K1ITmjOO13E'
{
  "meal_date": "11/21/2020",
  "meal_type": "lunch",
  "meal_desc": "Egg salad sandwiches."
}
```
Response:
```
{
  "message": "Meal details updated successfully!"
}
```

### DELETE `/api/meals`

Deletes (cancels) an existing meal. `x-access-token` header necessary for access as the username is encoded in the JWT. 

Request fields: 
* `meal_date` (MM/DD/YYYY between the current date and 75 days from now)
* `meal_type` (breakfast, lunch, dinner, or snack)

If no meal entry exists in the database with the exact same chef, `meal_date`, and `meal_type`, the delete fails. Response object always contains a `message` field.

Example request:
```
x-access-token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjA0NjMzNDg4LCJleHAiOjE2MDQ2NzY2ODh9.sEPGYjZHJV3Dp-3oXmCNGZXh31xIlxP3K1ITmjOO13E'
{
  "meal_date": "11/21/2020",
  "meal_type": "lunch",
}
```
Response:
```
{
  "message": "Meal successfully deleted."
}
```

### GET `/api/users`

Returns more information about the current user. `x-access-token` header necessary for access as the username is encoded in the JWT. 

Response fields:
* `username`: The requester's username
* `email`: The requeseter's email
* `birthday`: The requester's birthday (YYYY-MM-DD)
* `found`: True if the requester has their own profile picture, false otherwise

Example request:
```
x-access-token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjA0NjMzNDg4LCJleHAiOjE2MDQ2NzY2ODh9.sEPGYjZHJV3Dp-3oXmCNGZXh31xIlxP3K1ITmjOO13E'
```
Response:
```
{
  "username": "admin",
  "email": "test-email@test.com",
  "birthday": "1981-09-30",
  "found": false
}
```

### POST `/api/users`

Uploads a new user profile picture. `x-access-token` header necessary for access as the username is encoded in the JWT.

Request fields:
* `file`: A `.jpeg`, `.jpg`, `.png`, or `.gif` image
Response object always contains the `message` field. 

If the user already has a profile picture, the previous one is deleted and replaced by the newer one.

Example request:
```
x-access-token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjA0NjMzNDg4LCJleHAiOjE2MDQ2NzY2ODh9.sEPGYjZHJV3Dp-3oXmCNGZXh31xIlxP3K1ITmjOO13E'
{
  "file": new_profile_picture.png
}
```
Response:
```
{
  "message": "Image successfully uploaded!"
}
```

### DELETE `/api/users`

Deletes an existing user profile picture. `x-access-token` header necessary for access as the username is encoded in the JWT. The request fails if the user does not have an existing picture.
Response object always contains the `message` field.

Example request:
```
x-access-token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjA0NjMzNDg4LCJleHAiOjE2MDQ2NzY2ODh9.sEPGYjZHJV3Dp-3oXmCNGZXh31xIlxP3K1ITmjOO13E'
```
Response:
```
{
  "message": "Successfully deleted previous profile picture."
}
```

## Tests

Before running tests, set the following environment variables:
* LOCAL_USERNAME
* LOCAL_PASSWORD
* LOCAL_EMAIL
* LOCAL_BIRTHDAY

From the main directory, run `npm test`. Unit tests are written with Mocha and Chai.

## Upcoming features

  * Beautify profile page and allow access by other users
  * Add birthdays to the main meals table
  * Store images associated with meals
  

## License

MIT License

Copyright (c) 2020 Oliver Xie

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
