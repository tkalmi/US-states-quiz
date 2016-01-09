var Mapquiz = angular.module('Mapquiz', []);

Mapquiz.filter('secondsToDateTime', [function() {
    return function(seconds) {
        return new Date(1970, 0, 1).setSeconds(seconds);
    };
}]);

Mapquiz.controller('MapquizController', function($scope, $interval) {
  $scope.buttonText = "Start!";
  $scope.timeRemaining = 600;
  $scope.start = false;
  $scope.userInput = "";
  $scope.statesFound = [];

  var states = {'Alabama':['text885','AL'], 'Alaska':['text950','AK'], 'Arizona':['text834','AZ'],
  'Arkansas':['text873','AR'], 'California':['text805','CA'], 'Colorado':['text831', 'CO'],
  'Connecticut':['text935','CT'],'Delaware':['text944','DE'],'Florida':['text907','FL'],'Georgia':['text888','GA'],
  'Hawaii':['text953','HI'],'Idaho':['text815','ID'],'Illinois':['text867','IL'],'Indiana':['text899','IN'],
  'Iowa':['text861','IA'],'Kansas':['text846','KS'],'Kentucky':['text902','KY'],'Louisiana':['text876','LA'],
  'Maine':['text923','ME'],'Maryland':['text947','MD'],'Massachusetts':['text932','MA'],'Michigan':['text908','MI'],
  'Minnesota':['text858','MN'],'Mississippi':['text879','MS'],'Missouri':['text870','MO'],'Montana':['text820','MT'],
  'Nebraska':['text849','NE'],'Nevada':['text810','NV'],'New Hampshire':['text929','NH'],
  'New Jersey':['text941','NJ'],'New Mexico':['text837','NM'],'New York':['text920','NY'],
  'North Carolina':['text914','NC'],'North Dakota':['text855','ND'],'Ohio':['text905','OH'],
  'Oklahoma':['text843','OK'],'Oregon':['text800','OR'],'Pennsylvania':['text917','PA'],'Rhode Island':['text938','RI'],
  'South Carolina':['text891','SC'],'South Dakota':['text852','SD'],'Tennessee':['text882','TN'],
  'Texas':['text840','TX'],'Utah':['text828','UT'],'Vermont':['text926','VT'],'Virginia':['text911','VA'],
  'Washington':['text776','WA'],'West Virginia':['text937','WV'],'Wisconsin':['text864','WI'],'Wyoming':['text825','WY']};

  var statesLowerCase = {};
  angular.forEach(states, function(value, key) {
    statesLowerCase[key.toLowerCase()] = key;
  });

  function init() {
    var keys = Object.keys(states);
    for (var i = 0; i < keys.length; i++) {
      var txt = document.getElementById("us-map").getSVGDocument();
      var xd = txt.getElementById(states[keys[i]][0]);
      document.getElementById("us-map").getSVGDocument().getElementById(states[keys[i]][1]).setAttribute('style','fill:#ffffff');
      txt.textContent = "";
    }
    document.getElementById("us-map").getSVGDocument().getElementById("path3106").setAttribute('style','fill:#ffffff');
    $scope.statesFound = [];
    $scope.userInput = "";
  }

  $scope.startButton = function() {
    $scope.start = true;
    $scope.timeRemaining = 600;
    $scope.userInput = "";
    document.getElementById("userInput").focus();
    $scope.statesFound = [];
    init();
  };

  $scope.stopButton = function() {
    $scope.start = false;
    $scope.buttonText = "Try Again!";
    var keys = Object.keys(statesLowerCase);
    for (var i = 0; i < keys.length; i++) {
      if ($scope.statesFound.indexOf(keys[i]) < 0) {
        var txt = document.getElementById("us-map").getSVGDocument().getElementById(states[statesLowerCase[keys[i]]][0]);
        txt.textContent = statesLowerCase[keys[i]];
        document.getElementById("us-map").getSVGDocument().getElementById(states[statesLowerCase[keys[i]]][1]).setAttribute('style','fill:#ff0000');
        if (keys[i] === "virginia")
          document.getElementById("us-map").getSVGDocument().getElementById("path3106").setAttribute('style','fill:#ff0000');
      }
    }
    alert("Quitter!\nYou got right " + $scope.statesFound.length + " out 50 states in " + Math.floor((600 - $scope.timeRemaining) / 60) + " minutes and " + (600 - $scope.timeRemaining) % 60 + " seconds.");
  };


  $scope.$watch('timeRemaining', function(newValue, oldValue) {
    if (newValue === 0) {
      $scope.start = false;
      $scope.buttonText = "Try Again!";
      var keys = Object.keys(statesLowerCase);
      for (var i = 0; i < keys.length; i++) {
        if ($scope.statesFound.indexOf(keys[i]) < 0) {
          var txt = document.getElementById("us-map").getSVGDocument().getElementById(states[statesLowerCase[keys[i]]][0]);
          txt.textContent = statesLowerCase[keys[i]];
          document.getElementById("us-map").getSVGDocument().getElementById(states[statesLowerCase[keys[i]]][1]).setAttribute('style','fill:#ff0000');
          if (keys[i] === "virginia")
            document.getElementById("us-map").getSVGDocument().getElementById("path3106").setAttribute('style','fill:#ff0000');
        }
      }
      alert("Time's up!\nYou got right " + $scope.statesFound.length + " out 50 states in " + Math.floor((600 - $scope.timeRemaining) / 60) + " minutes and " + (600 - $scope.timeRemaining) % 60 + " seconds.");
    }
  });


  $scope.$watch('userInput', function(newValue, oldValue) {
    var input = "";
    if (typeof newValue !== "undefined")
      input = newValue;
    input = input.toLowerCase();
    if ($scope.start && Object.keys(statesLowerCase).indexOf(input) >= 0 && $scope.statesFound.indexOf(input) < 0) {
      // MUUTA osavaltion tekstiä! JA KIRJAA SE TAULUKKOON ja statesFoundiin
      var txt = document.getElementById("us-map").getSVGDocument().getElementById(states[statesLowerCase[input]][0]);
      txt.textContent = statesLowerCase[input];
      document.getElementById("us-map").getSVGDocument().getElementById(states[statesLowerCase[input]][1]).setAttribute('style','fill:#00ff00');
      $scope.statesFound.push(input);
      $scope.userInput = "";
      if (input === "virginia")
        document.getElementById("us-map").getSVGDocument().getElementById("path3106").setAttribute('style','fill:#00ff00');
      if ($scope.statesFound.length === 50) {
        alert("Congratulations!\nYou got right all 50 states in " + Math.floor((600 - $scope.timeRemaining) / 60) + " minutes and " + (600 - $scope.timeRemaining) % 60 + " seconds.");
        $scope.start = false;
      }
    }
  });

  $interval(function() {
    if($scope.start && $scope.timeRemaining > 0) {
      $scope.timeRemaining--;
    }
  }, 1000);

});
