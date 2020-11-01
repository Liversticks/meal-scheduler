//Rules for holidays:

//New Years Day - Jan 1
//Family Day - third Monday of February
//Good Friday - ??
//Victoria Day - Monday preceeding May 25
//Canada Day - July 1
//BC Day - first Monday of August
//Labor Day - first Monday of September
//Thanksgiving - second Monday of October
//Halloween - Oct 31
//Remembrance Day - Nov 11
//Christmas - Dec 25

const moment = require('moment')

module.exports = {

  //Takes a moment object, returns a string with the name of the holiday (or '' if not holiday)
  isHoliday: (testMoment) => {
    //Good Friday check
    if (testMoment.day() === 5 && (testMoment.month() === 3 || testMoment.month() === 4)) {
      //adapted from http://www.maa.clell.de/StarDate/publ_holidays.html
      let a = testMoment.year() % 19
      let b = testMoment.year() % 4
      let c = testMoment.year() % 7
      let d = (19 * a + 24) % 30
      let e = (2 * b + 4 * c + 6 * d + 5) % 7
      var es = 22 + d + e
      var month = 4
      if (es > 31) {
        es = d + e - 9
        month = 4
      }
      if (es === 26 && month === 4) {
        es = 19
      }
      if (es === 25 && month === 4 && d === 28 && e === 6 && a > 10) {
        es = 18
      }
      let gf = es - 2
      if (testMoment.month() === month) {
        if (testMoment.day() === gf) {
          return "Good Friday"
        }
      }
      return ''
    }

    switch (testMoment.month()) {
      case 0:
        //New Year's Day
        if (testMoment.date() === 1) {
          return "New Year's Day"
        }
        return ''
      case 1:
        {
          //Family Day
          let febStart = testMoment.clone().startOf('month')
          let targetDate = febStart.day() <= 1 ?
          febStart.clone().date(16 - febStart.day()) :
          febStart.clone().date(23 - febStart.day())
          if (testMoment.date() === targetDate.date()) {
            return "Family Day"
          }
          return ''
        }
      case 2:
        return ''
      case 3:
        //add Good Friday in later
        return ''
      case 4:
        {
          //Victoria Day
          let mayStart = testMoment.clone().startOf('month')
          let targetDate = mayStart.day() === 6 ?
          mayStart.clone().date(24) :
          mayStart.clone().date(23 - mayStart.day())
          if (testMoment.date() === targetDate.date()) {
            return "Victoria Day"
          }
          return ''
        }
      case 5:
        return ''
      case 6:
        if (testMoment.date() === 1) {
          return "Canada Day"
        }
        return ''
      case 7:
        {
          //BC Day
          let augStart = testMoment.clone().startOf('month')
          let targetDate = augStart.day() <= 1 ?
          augStart.clone().date(2 - septStart.day()) :
          augStart.clone().date(9 - septStart.day())
          if (testMoment.date() === targetDate.date()) {
            return "BC Day"
          }
          return ''
        }
      case 8:
        {
          //Labour Day
          let septStart = testMoment.clone().startOf('month')
          let targetDate = septStart.day() <= 1 ?
          septStart.clone().date(2 - septStart.day()) :
          septStart.clone().date(9 - septStart.day())
          if (testMoment.date() === targetDate.date()) {
            return "Labour Day"
          }
          return ''
        }
      case 9:
        {
          if (testMoment.date() === 31) {
            return "Halloween"
          } else {
            let octStart = testMoment.clone().startOf('month')
            let targetDate = octStart.day() <= 1 ?
            octStart.clone().date(9 - octStart.day()) :
            octStart.clone().date(16 - octStart.day())
            if (testMoment.date() === targetDate.date()) {
              return "Thanksgiving"
            }
            return ''
          }
        }
      case 10:
        if (testMoment.date() === 11) {
          return "Remembrance Day"
        }
        return ''
      case 11:
        if (testMoment.date() === 25) {
          return "Christmas"
        }
        return ''
      default:
        return ''
    }

  }
}
