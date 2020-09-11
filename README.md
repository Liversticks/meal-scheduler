# meal-scheduler

Created by Oliver X. (Liversticks)
Front-end code is located [here](github.com/Liversticks/meal-client)

## API Reference

* POST `/api/signup`: Create a new user. Request must have a body with the following:
  * `username`: Your username (must not be blank and must not match an existing username)
  * `email`: Your email (must be a valid email address and must not match an existing email)
  * `password`: Your password
* POST `/api/login`: Log in. Credentials are stored in the body:
  * `username`: Your username
  * `password`: Your password
  * On successful login: `{
      accessToken: "YOUR_JSON_WEB_TOKEN"
    }`
  * On unsuccessful login: `{
      accessToken: null,
      message: "ERROR_MESSAGE"
    }`
* GET `/api/meals`: Gets meals from current date to (current date + 35 days) ordered by date ascending. Result object:
```javascript
{
    mm/dd/yyyy: {
      breakfast: {},
      lunch: {},
      dinner: {
        chef: USERNAME,
        meal_desc: MEAL_DESCRIPTION
      },
      snack: {}
    }
}
```
  Note that the result object's keys only exist for dates where at least one meal is already scheduled.

## Upcoming features

  * Add profile page for users
  * Add birthday to user model
  * Add tooltip to view meal descriptions by other users without opening modal
  * Add support for holidays
