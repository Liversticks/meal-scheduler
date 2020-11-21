# meal-scheduler

Meal scheduling server. Allows you to claim a meal spot and announce your recipe ahead of time.
Created by Oliver X. (Liversticks).  
Latest revision: November 20, 2020

## Goals

Create an API that supports CRUD operations and gain more familiarity with Node.

## Frameworks + Stack

* NodeJS
* Express
* Sequelize + PostgreSQL
* [Front-end client](https://github.com/Liversticks/meal-client) sold separately

## API Reference

### POST `/api/signup`

Create a new user. Request must contain a username, email, password, and birthday (format YYYY-MM-DD). Response will contain a `message` field.
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

Log in. Request must contain a username and password that already exists in the database. On success, returns a JWT token that is used for requests to authentication-required routes.
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

Creates a new meal. `x-access-token` header necessary for access. Required fields: `chef`, `meal_date` (MM/DD/YYYY between the current date and 75 days from now), `meal_type` (breakfast, lunch, dinner, or snack), and `meal_desc`. Response object always contains a `message` field.
Example request:
```
x-access-token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjA0NjMzNDg4LCJleHAiOjE2MDQ2NzY2ODh9.sEPGYjZHJV3Dp-3oXmCNGZXh31xIlxP3K1ITmjOO13E'
{
  "chef": "admin",
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

## Upcoming features

  * Add profile page for users
  * Add birthday to user model
  * Add support for holidays

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
