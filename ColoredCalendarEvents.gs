function ColorEvents() {
 
  var today = new Date();
  var nextmonth = new Date();
  // Below line sets the span of time this function will cover. Currently its set to 31 days after today.
  nextmonth.setDate(nextmonth.getDate() + 31);
  Logger.log(today + " " + nextmonth);
 
  var calendars = CalendarApp.getAllOwnedCalendars();
  Logger.log("found number of calendars: " + calendars.length);
  
  // Below is a function that determines the company email domain to be used as a filter later (i.e. events from external parties).
  function checkEmail(email) {
    return email.includes("@coffeemeetsbagel.com")
  }

  // Below is a loop that will iterate through all the calendars.
  for (var i=0; i<calendars.length; i++) {
    var calendar = calendars[i];
    var events = calendar.getEvents(today, nextmonth);
    // Below is a loop that will iterate through all the events within above calendars with below actions.
    for (var j=0; j<events.length; j++) {
      // The below variables ("var") define the specific details of the event, from title, description, organizer, guest list and guest emails.
      var e = events[j];
      var title = e.getTitle();
      var description = e.getDescription();
      var organizer = e.getCreators();
      var guestlist = e.getGuestList();
      // The below creates an iterative loop that adds the emails of all guests into an array which can be called on later.
      var guestEmails = [];
      for (var x = 0; x < guestlist.length; x++){
        guestEmails.push(guestlist[x].getEmail());
      }
      // Below is the first if statement check that looks at if a meeting has 2 or more guests.  If true it will then proceed to check on the below nested if statements.
     if (guestlist.length >= 2) {
       // This if statement looks if the title contains "Weekly" OR "All hands". If so it will set the event color to yellow.
        if (title.includes("Weekly") || title.includes("All hands")) {
        e.setColor(CalendarApp.EventColor.YELLOW);
        }  
        // This else if statement will trigger if the above if statement is false and then looks if the description contains "Calendly.com". If so it will set the event color to cyan.
        else if (description.includes("Calendly.com")) {
        e.setColor(CalendarApp.EventColor.CYAN);
        }
        // This else if statement will trigger if the above if statement is false and then looks if all the guest emails have "@coffeemeetsbagel.com" which is our condition to determine if this is an internal only company meeting. If so it will set the event color to yellow.
        else if (guestEmails.every(checkEmail)) {
        e.setColor(CalendarApp.EventColor.YELLOW);
        } 
        // This else if statement will trigger if the above if statement is false and then looks if even one of the guest emails do NOT have "@coffeemeetsbagel.com" which is our condition to determine if this meeting has external parties. If so it will set the event color to cyan.
        else if (!guestEmails.every(checkEmail)) {
        e.setColor(CalendarApp.EventColor.CYAN);
        } 
     }
     // This else if statement will do a check if the guest list if statement is false. If true it will then proceed to check on the below nested if statements.
       else if (guestlist.length == 1) {
         // This if statement looks if the title contains "1:1". If so it will set the event color to pale green.
          if (title.includes("1:1")) {
          e.setColor(CalendarApp.EventColor.PALE_GREEN);
          } 
          // This else if statement will trigger if the abvove if statement is false and then looks if the organizer email has a "coffeemeetsbagel.com" domain. If true it will set the event color to cyan.
          else if (organizer.findIndex((x) => x > "coffeemeetsbagel.com") === -1) {
          e.setColor(CalendarApp.EventColor.CYAN);
          }
          // This else statement will trigger if the above 2 if and else if statements are false. It will then set the event color to pale green.
          else {
          e.setColor(CalendarApp.EventColor.PALE_GREEN);  
          }
        }
        // This else if statement will do a check if the two earlier guest list if and else if statements are false. If true it will then proceed to check on the below nested if statements.
        else if (guestlist.length == 0) {
          //This if statement will look if the description contains "Recurring". If so it will set the event color to pale blue.
          if (description.includes("Recurring")) {
          e.setColor(CalendarApp.EventColor.PALE_BLUE);
          } 
          //This if statement will look if the description contains "asana" or "Asana". Take note the strings are case sensitive. If so it will set the event color to pale blue.
          else if (description.includes("asana") || description.includes("Asana")) {
          e.setColor(CalendarApp.EventColor.BLUE);
          }
          //This if statement will look if the description contains "Personal Time". If so it will set the event color to pale blue.
          else if (description.includes("Personal Time")) {
          e.setColor(CalendarApp.EventColor.PALE_RED);
          }
        }
    }
  }
}
