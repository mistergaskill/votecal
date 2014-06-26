angular.module('voteCal', ['ngResource'])
  .controller("VoteCalCtrl", function ($scope, $resource) {
    function Event(title, start, length) {
      return {
        title: title,
        start: start,
        length: length || 1,
        end: function () { return start + length; },
        score: 2,
      };
    }
    var Events = $resource('/events.json');

    $scope.events = Events.get({}, function() {
      debugger;
    })
    $scope.events = [
      Event("House Ruled!", 10.5),
      Event("Keynote", 10.5),
      Event("RTSGuru.com", 10.5),
      Event("Q & A", 11.5),
      Event("Does Story Matter?", 11.5),
      Event("As Beta as You Wanna Be", 11.5),
      Event("Gamer Type", 11),
      Event("Evolution of a Game Developer", 11),
      Event("Everybody Wins", 12),
      Event("Rooster Teeth", 13),
      Event("Friday Night Concerts", 20.5, 3.5),
    ];

    $scope.calStart = 24;
    $scope.calEnd = 0;
    $scope.calRange = function () {
      var range = [];
      for(var i=$scope.calStart; i<=$scope.calEnd; i+=0.5) {
        range.push(i);
      }
      return range;
    };

    $scope.calender = buildCalendar();
    function buildCalendar () {
      var columns = [];

      function addToColumn(index, calEvent) {
        if (columns.length === index) {
          columns[index] = [];
        }

        if (fitsInColumn(calEvent, columns[index])) {
          if (calEvent.start < $scope.calStart ) {
            $scope.calStart = calEvent.start;
          }
          if (calEvent.end() > $scope.calEnd ) {
            $scope.calEnd = calEvent.end();
          }
          columns[index].push(calEvent);
        }
        else {
          addToColumn(index + 1, calEvent);
        }
      }

      function fitsInColumn(calEvent, column) {
        if (column.length === 0) {
          return true;
        }
        var lastEvent = column[column.length - 1];
        return lastEvent.start + lastEvent.length <= calEvent.start;
      }

      $scope.events.sort(function(a, b) {
        return a.start - b.start;
      }).forEach(function(calEvent) {
        addToColumn(0, calEvent);
      });
      return columns;
    }
  })
  .filter('time', function () {
    return function(time) {
      var hour = Math.floor(time),
          half = (time % 1 === 0.5) ? ":30" : ":00",
          suffix = 'am';

      if (hour >= 24) {
        hour -= 24;
      }
      if (hour >= 12) {
        suffix  = 'pm';
      }
      if (hour >= 12) {
        hour = hour - 12;
      }
      if (hour === 0) {
        hour = 12;
      }
      return hour.toString() + half + suffix;
    };
  });

