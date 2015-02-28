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

.controller('HomesCtrl', function($scope, $timeout, $state, $localstorage, $homesStorage) {
  $timeout(function() {
    if(!$localstorage.get('user')) {
      $state.transitionTo('app.login');
    } else {
      $scope.homes = $homesStorage.getAllHomes();
    }
  });

  $scope.create = function() {
    $timeout(function() {
      debugger;
      var homeId = createid();
      $homesStorage.saveHome(new Home(homeId));
      $state.transitionTo('app.sections', {homeId: homeId});  
    });

   function createid() {
      return Math.random().toString(16).slice(2);
    } 
  };

})

.controller('SectionsCtrl', function($scope, $stateParams, $state, $timeout, $homesStorage) {
  $scope.homeId = $stateParams.homeId;
  //$scope.sections = sections;

  $timeout(function(){
    $scope.home = $homesStorage.getHomeById($stateParams.homeId);
    if($scope.home) {
      $scope.sections = $scope.home.getSections();
    } else {
      $state.transitionTo('app.homes')
    }
  });

})

.controller('SectionCtrl', function($scope, $stateParams, $state, $timeout, $ionicNavBarDelegate, $homesStorage) {
  var home = $homesStorage.getHomeById($stateParams.homeId);
  if(home && home.getSections() && $stateParams.sectionId) {
    $scope.section = findSection(home.getSections(), $stateParams.sectionId);
    if(!$scope.section) {
      $state.transitionTo('app.sections');
    }
  }

  $scope.saveChanges = function(section) {
    console.log("saving changes");
    console.log(section);
    $timeout(function(){
      section.onChange();
      $homesStorage.getHomeById()
      $state.transitionTo('app.sections');  
    });
  };

  function findSection(allSections, sectionId) {
    for(var i=0; i<allSections.length; ++i) {
      if(allSections[i].id == sectionId) {
        return allSections[i];
      }
    }
  }

});

  function Home(id, sections) {
    this.id = id;
    this.date_of_session = new Date();
    
    this.getSections = function() {
      if(!sections || sections.length == 0) {
        sections = newSections(id);
      }
      return sections;
    };

    function newSections(homeId) {
        var initialSection = new Section(homeId, "Overview", [
            new TextEntry("Photographer", propertie('photographer_id')),
            new TextEntry("Provider", propertie("accommodation_provider.name")),
            new OptionsEntry("Rent as", ["whole","room"], propertie("rent_as")),
            new BooleanEntry("Real", function(){})
          ]);

        var typologySection = new Section(homeId, "Typology", [
            new OptionsEntry("Type", ["house", "apartment", "studio"], propertie('typology.type_code')),
            new OptionsEntry("Accomodation type", ["residence","hotel","hostel","private"], propertie("typology.accommodation_type_code")),
            new NumberEntry("Number of bedrooms", propertie("typology.number_of_bedrooms")),
            new NumberEntry("Number of bathrooms", propertie("typology.number_of_bathrooms")),
            new NumberEntry("Number of wc", propertie("typology.number_of_wc")),
            new NumberEntry("Area", propertie("typology.area"))
          ]);

        return [
          initialSection,
          typologySection
        ];
      }
  }

  function Entry(name, type, propertie_name, home) {
      this.name = name;
      this.type = type;
      this.value = undefined;

      this.onChange = function() {
       return function(value) {
        var properties_names = propertie_name.split('.');
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
  }

  function TextEntry(name, onChange, home) {
    Entry.call(this, name, "text", onChange, home);
    this.value = "";
  }

  function OptionsEntry(name, options, onChange, home) {
    Entry.call(this, name, "options", onChange, home);
    
    this.options = options;
    
    this.isValid = function(option) {
      return !options || options.indexOf(option) != -1;
    };
    
    if(options) {
      this.value = options[0];
    }
  }

  function BooleanEntry(name, onChange, home, home) {
    Entry.call(this, name, "boolean", onChange, home);
    this.value = true;
  }

  function NullableBooleanEntry(name, onChange, home) {
    OptionsEntry.call(this, name, ["yes", "no", "unknown"], onChange, home);
  }

  function CurrencyEntry(name, onChange, home) {
    OptionsEntry.call(this, name, "EUR", ["EUR"], onChange, home);
  }

  function NumberEntry(name, onChange, home) {
    Entry.call(this, name, "number", onChange, home);
    this.value = 1;
  }

  function Section(homeId, name, entries) {
    this.homeId = homeId;
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
}

function createid() {
  return Math.random().toString(16).slice(2);
}

function propertie(x){return x;}




}