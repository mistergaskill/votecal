var fs = require('fs');

fs.readFile('print_schedule.txt', 'utf8', function(err, data) {
  if (err) return console.err(err);

  console.log(parseDays(data));
});

function parseDays(data) {
  var days = data.split('<div class="day">').slice(1);
  return days.map(function(day) {
    return {
      name: day.split('<h2>')[1].split(" ")[0],
      events: parseEvents(day),
    };
  });
}

function parseEvents(data) {
  var events = data.split('class=\'event\'><p><strong>').slice(1);
  return events.map(function(eventString) {
    function iOf(string) { return eventString.indexOf(string); }
    function matchSlice(start, end) {
      return eventString.slice(iOf(start) + start.length, iOf(end));
    }

    var times = matchSlice(']</strong> ', '</p></li>').split(" - ");

    return {
      title: eventString.slice(0, iOf('</strong>')),
      venue: matchSlice('upper\'>[', ']</strong'),
      start: parseTime(times[0]),
      end: parseTime(times[1]),
    };
  });
}

function parseTime(timeString) {
  var time = parseInt(timeString.split(':')[0], 0);
  time += parseInt(timeString.split(':')[1].slice(0, -2), 0) / 60;
  if (timeString.slice(-2) === "pm") {
    time += 12;
  }
  return time;
}
