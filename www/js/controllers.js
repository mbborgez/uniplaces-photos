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
            console.log('Doing login', $scope.loginData);
            $localstorage.set('user', $scope.loginData.username)
            // Simulate a login delay. Remove this and replace with your login
            // code if using a login system
            $timeout(function () {
                $scope.closeLogin();
            }, 1000);
        };

    })

    .controller('HomesCtrl', function ($scope, $timeout, $state, $localstorage, $homesStorage) {
        $timeout(function () {
            if (!$localstorage.get('user')) {
                $state.transitionTo('app.login');
            } else {
                $scope.homes = $homesStorage.getAllHomes();
            }
        });

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
                console.log("saving changes..", section);
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
                console.log(entry.name)
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
    if(!home) { return;}
    var initialSection = new Section(home, "Overview", [
        new TextEntry("Photographer", propertie('photographer_id'), home),
        new TextEntry("Provider", propertie("accommodation_provider.name"), home),
        new OptionsEntry("Rent as", ["whole", "room"], propertie("rent_as"), home),
    ]);

    var typologySection = new Section(home, "Typology", [
        new OptionsEntry("Type", ["house", "apartment", "studio"], propertie('typology.type_code'), home),
        new OptionsEntry("Accomodation type", ["residence", "hotel", "hostel", "private"], propertie("typology.accommodation_type_code"), home),
        new NumberEntry("Number of bedrooms", propertie("typology.number_of_bedrooms"), home),
        new NumberEntry("Number of bathrooms", propertie("typology.number_of_bathrooms"), home),
        new NumberEntry("Number of wc", propertie("typology.number_of_wc"), home),
        new NumberEntry("Area", propertie("typology.area"), home)
    ]);

    var rules = new Section(home, "Rules", [
            new NullableBooleanEntry("Pets alowed", "rules.pets_allowed", home),
            new NullableBooleanEntry("females_only", "rules.females_only", home),
            new NullableBooleanEntry("international_only", "rules.international_only", home),
            new NullableBooleanEntry("students_only", "rules.students_only", home),
            new NullableBooleanEntry("males_only", "rules.males_only", home),
            new NullableBooleanEntry("overnight_guests_allowed", "rules.overnight_guests_allowed", home),
            new NullableBooleanEntry("smoking_allowed", "rules.smoking_allowed", home),
            new NullableBooleanEntry("postgraduates_only", "rules.postgraduates_only", home)
        ]);
    var address = new Section(home, "Address",  [
        new TextEntry("city_code", propertie('address.city_code'), home),
        new TextEntry("street", propertie('address.photographer_id'), home),
        new NumberEntry("number", propertie('address.number'), home),
        new TextEntry("extra", propertie('address.extra'), home),
        new TextEntry("postal_code", propertie('address.postal_code'), home)
    ]); 

    var property_features = new Section(home, "Property_Features", [
            new NullableBooleanEntry("accessibility", "property_features.accessibility", home),
            new NullableBooleanEntry("wi_fi", "property_features.females_only", home),
            new NullableBooleanEntry("resident_landlord", "property_features.international_only", home),
            new NullableBooleanEntry("students_only", "property_features.students_only", home),
            new NullableBooleanEntry("cable_tv", "property_features.cable_tv", home),
            new NullableBooleanEntry("central_heating", "property_features.central_heating", home),
            new NullableBooleanEntry("air_conditioning", "property_features.air_conditioning", home),
            new NullableBooleanEntry("towels", "property_features.towels", home),
            new NullableBooleanEntry("bed_linen", "property_features.bed_linen", home)
        ]);
    var services = new Section(home, "Services",  [
        new OptionsEntry("cleaning periodicity", ["none","monthly","fortnight","weekly","biweekly","triweekly","daily"], 'services.cleaning.periodicity', home),
        new OptionsEntry("cleaning type", ["common","full"], 'services.cleaning.type', home)
    ]);

    var bills = new Section(home, "bills",  [
        new BooleanEntry("bills maximum capped", 'bills.maximum.capped', home),
        new CurrencyEntry("bills currency_code", 'bills.maximum.max.currency_code', home),
        new BooleanEntry("bills water included", 'bills.water.included', home),
        new BooleanEntry("bills electricity included", 'bills.electricity.included', home),
        new BooleanEntry("bills gas present", 'bills.gas.present', home),
        new BooleanEntry("bills gas included", 'bills.gas.included', home),
        new BooleanEntry("bills internet included", 'bills.internet.included', home),
    ]);

    var conditions = new Section(home, "conditions", [
        new OptionsEntry("conditions cancellation_policy", ["flexible","moderate","strict","super_strict"], propertie('conditions.cancellation_policy'), home),
        new NumberEntry("conditions minimum_nights", propertie('conditions.minimum_nights'), home)
    ]);
    var x = [
        initialSection,
        typologySection,
        rules,
        address,
        property_features,
        services,
        bills,
        conditions
    ];

    x.forEach(function (s) {
        s.onLoad();
    });

    home.sections = x;

    return x;

}