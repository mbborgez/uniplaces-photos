angular.module('starter.controllers', ['ionic', 'utils'])

    .controller('AppCtrl', function ($scope, $ionicModal, $timeout, $localstorage, $state) {
        //$scope.home = new Home();
        // Form data for the login modal
        $scope.loginData = {};
        var loggedUser = $localstorage.get('user');
        if (loggedUser) {
            $scope.loginData.username = loggedUser;
        }

        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('templates/login.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });

        // Triggered in the login modal to close it
        $scope.closeLogin = function () {
            $scope.modal.hide();
            $state.transitionTo('app.homes');
        };

        // Open the login modal
        $scope.login = function () {
            $scope.modal.show();
        };

        // Perform the login action when the user submits the login form
        $scope.doLogin = function () {
            $localstorage.set('user', $scope.loginData.username)
            // Simulate a login delay. Remove this and replace with your login
            // code if using a login system
            $timeout(function () {
                $scope.closeLogin();
            }, 1000);
        };

    })

    .controller('HomesCtrl', function ($scope, $timeout, $state, $localstorage, $homesStorage, $interval) {
        $interval(function () {
            if (!$localstorage.get('user')) {
                $state.transitionTo('app.login');
            } else {
                $scope.homes = $homesStorage.getAllHomes();
            }
        }, 10);

        $scope.create = function () {
            $timeout(function () {
                var id = createid();
                $homesStorage.saveHome(new Home(id));
                $state.transitionTo('app.sections', {homeId: id});
            });

            function createid() {
                return Math.random().toString(16).slice(2);
            }
        };

        $scope.sync = function() {  
            $scope.synching = true;
            $timeout(function(){
                console.log("SEND VIA HTTP REQUEST:");
                console.log(JSON.stringify($homesStorage.getAllHomes()));
                $scope.synching = false;
            }, 1000);
        }

    })

    .controller('SectionsCtrl', function ($scope, $stateParams, $state, $timeout, $homesStorage) {
        $scope.homeId = $stateParams.homeId;
        //$scope.sections = sections;

        $timeout(function () {
            $scope.home = $homesStorage.getHomeById($stateParams.homeId);
            newSections($scope.home);

            if ($scope.home) {
                $scope.sections = $scope.home.sections;
            } else {
                $state.transitionTo('app.homes')
            }
        });

        $scope.back = function() {
            $state.transitionTo('app.homes');
        }

    })

    .controller('SectionCtrl', function ($scope, $stateParams, $state, $timeout, $ionicNavBarDelegate, $homesStorage) {
        var home = $homesStorage.getHomeById($stateParams.homeId);
        newSections(home);
        if (home && home.sections && $stateParams.sectionId) {
            $scope.section = findSection(home.sections, $stateParams.sectionId);
            if (!$scope.section) {
                $state.transitionTo('app.sections', {homeId: $stateParams.homeId});
            }
        }

        $scope.saveChanges = function (section) {
            $timeout(function () {
                section.onChange();
                $homesStorage.saveHome(home);
                $state.transitionTo('app.sections', {homeId: $stateParams.homeId});
            });
        };

        function findSection(allSections, sectionId) {
            for (var i = 0; i < allSections.length; ++i) {
                if (allSections[i].id == sectionId) {
                    return allSections[i];
                }
            }
        }

    });

function Home(id, sections) {
    this.id = id;
    this.date_of_session = new Date();

    this.getSections = function () {
        if (!sections || sections.length == 0) {
            newSections(this);
        }
        return sections;
    };
}

function Entry(name, type, propertie_name, home) {
    var self = this;
    this.name = name;
    this.type = type;
    this.value = undefined;

    var findProperties = function(obj, properties_names) {
        if (obj && properties_names) {
            var search = properties_names.shift();
            if(obj[search]) {
                if (properties_names.length == 0) {
                   self.value = obj[search];
                } else {
                    findProperties(obj[search], properties_names);
                }
            }
        }
    }

    var createProperties = function(obj, properties_names) {
        if (obj && properties_names) {
            var search = properties_names.shift();
            if(!obj[search] && properties_names.length > 0) {
                obj[search] = {};
            }
            if (properties_names.length == 0) {
                obj[search] = self.value;
            } else {
                createProperties(obj[search], properties_names);
            }
        }
    }

    this.onChange = function (value) {
        var properties_names = propertie_name.split('.');
        createProperties(home, properties_names);
    };

    this.onLoad = function () {
        var properties_names = propertie_name.split('.');
        findProperties(home, properties_names);
    };

    this.valueOf = function() {
        return self.value;
    };
}

function TextEntry(name, onChange, home) {
    Entry.call(this, name, "text", onChange, home);
    this.value = "";
}

function OptionsEntry(name, options, onChange, home) {
    Entry.call(this, name, "options", onChange, home);

    this.options = options;

    this.isValid = function (option) {
        return !options || options.indexOf(option) != -1;
    };

    if (options) {
        this.value = options[0];
    }
}

function BooleanEntry(name, onChange, home) {
    Entry.call(this, name, "boolean", onChange, home);
    this.value = true;
}

function NullableBooleanEntry(name, onChange, home) {
    OptionsEntry.call(this, name, ["yes", "no", "unknown"], onChange, home);
}

function CurrencyEntry(name, onChange, home) {
    OptionsEntry.call(this, name, ["EUR"], onChange, home);
}

function NumberEntry(name, onChange, home) {
    Entry.call(this, name, "number", onChange, home);
    this.value = 1;
}

function Section(home, name, entries) {
    //this.home = home;
    this.name = name;
    this.id = hashCode(name);
    this.entries = entries;

    this.onChange = function () {
        entries.forEach(function (entry) {
            if (entry.onChange) {
                entry.onChange(entry.value);
            }
        });
    };

    this.onLoad = function () {
        entries.forEach(function (entry) {
            if (entry.onLoad) {
                entry.onLoad(home);
            }
        })
    }
    function hashCode(s){
      return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);              
    }
}

function createid() {
    return Math.random().toString(16).slice(2);
}

function propertie(x) {
    return x;
}

function newSections(home) {

    var x = loadData(home);

    x.forEach(function (s) {
        s.onLoad();
    });

    home.sections = x;

    return x;
}