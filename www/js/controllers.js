angular.module('starter.controllers', ['ionic', 'utils'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $localstorage) {
  //$scope.home = new Home();
  // Form data for the login modal
  $scope.loginData = {};
  var loggedUser = $localstorage.get('user');
  if(loggedUser) {
    $scope.loginData.username = loggedUser;
  }

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);
    $localstorage.set('user', $scope.loginData.username)
    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };

})

.controller('SectionsCtrl', function($scope) {
  $scope.sections = sections;
})

.controller('SectionCtrl', function($scope, $stateParams, $state, $timeout, $ionicNavBarDelegate) {
  if(sections && $stateParams.sectionId) {
    $scope.section = findSection(sections, $stateParams.sectionId);
    if(!$scope.section) {
      $state.transitionTo('app.sections');
    }
  }

  $scope.saveChanges = function(section) {
    console.log("saving changes");
    console.log(section);
    section.onChange();
    $state.transitionTo('app.sections');
  };

  function findSection(allSections, sectionId) {
    for(var i=0; i<allSections.length; ++i) {
      if(allSections[i].id == sectionId) {
        return allSections[i];
      }
    }
  }

});



function Entry(name, type, onChange) {
    this.name = name;
    this.type = type;
    this.onChange = onChange;
    this.value = undefined;
}

function TextEntry(name, onChange) {
  Entry.call(this, name, "text", onChange);
  this.value = "";
}

function OptionsEntry(name, options, onChange) {
  Entry.call(this, name, "options", onChange);
  
  this.options = options;
  
  this.isValid = function(option) {
    return !options || options.indexOf(option) != -1;
  };
  
  if(options) {
    this.value = options[0];
  }
}

function BooleanEntry(name, onChange) {
  Entry.call(this, name, "boolean", onChange);
  this.value = true;
}

function NullableBooleanEntry(name, onChange) {
  OptionsEntry.call(this, name, ["yes", "no", "unknown"], onChange);
}

function CurrencyEntry(name, onChange) {
  OptionsEntry.call(this, name, "EUR", ["EUR"], onChange);
}

function NumberEntry(name, onChange) {
  Entry.call(this, name, "number", onChange);
  this.value = 1;
}

function savePropertie(home_propertie) {
  return function(value) {
    var properties_names = home_propertie.split('.');
    var last_name = properties_names.pop();
    searchPropertie(home, properties_names)[last_name] = value;
  };

  function searchPropertie(obj, properties_names) {
    if(properties_names) {
      var search = properties_names.shift();
      if(properties_names.length == 0) {
        return obj;
      } else {
        return searchPropertie(obj[search], properties_names);
      }
    }
    return obj;
  }

  function toArray(obj) {
    var result = [];
    for (var prop in obj) {
        var value = obj[prop];
        if (typeof value === 'object') {
            result.push(toArray(value)); // <- recursive call
        }
        else {
            result.push(value);
        }
    }
    return result;
  }
}

function Section(name, entries) {
  this.id = createid();
  this.name = name;
  this.entries = entries;
  this.onChange = function() {
    entries.forEach(function(entry) {
      if(entry.onChange) {
        entry.onChange(entry.value);
      }
    });
  };
  function createid() {
    return Math.random().toString(16).slice(2);
  }
}


var sections = newSections();

function newSections() {
  var initialSection = new Section("Overview", [
      new TextEntry("Photographer", savePropertie('photographer_id')),
      new TextEntry("Provider", savePropertie("accommodation_provider.name")),
      new OptionsEntry("Rent as", ["whole","room"], savePropertie("rent_as")),
      new BooleanEntry("Real", function(){})
    ]);

  var typologySection = new Section("Typology", [
      new OptionsEntry("Type", ["house", "apartment", "studio"], savePropertie('typology.type_code')),
      new OptionsEntry("Accomodation type", ["residence","hotel","hostel","private"], savePropertie("typology.accommodation_type_code")),
      new NumberEntry("Number of bedrooms", savePropertie("typology.number_of_bedrooms")),
      new NumberEntry("Number of bathrooms", savePropertie("typology.number_of_bathrooms")),
      new NumberEntry("Number of wc", savePropertie("typology.number_of_wc")),
      new NumberEntry("Area", savePropertie("typology.area"))
    ]);

  return [
    initialSection,
    typologySection
  ];
}

var home = {};