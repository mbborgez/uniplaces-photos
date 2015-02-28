angular.module('utils', ['ionic'])

.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    },
    setArray: function(key, array) {
      this.set(key, JSON.stringify(array));
    },
    getArray: function(key) {
      return JSON.parse($window.localStorage[key] || '[]');
    }
  }
}])


.factory('$homesStorage', ['$localstorage', function($localstorage) {
  return {

    getAllHomes: function() {
      return $localstorage.getArray('homes') || [];
    },


    getHomeById: function(id) {
      console.log('getHomeById', id);
      var allHomes = this.getAllHomes();
      for(var i=0; i< allHomes.length; ++i) {
        if(allHomes[i] && allHomes[i].id && allHomes[i].id == id) {
          return allHomes[i];
        }
      }
    },

    saveHomes: function(allHomes) {
      $localstorage.setArray('homes', allHomes);
    },

    saveHome: function(newHome) {
      var homes = this.getAllHomes();
      homes.push(newHome);
      this.saveHomes(homes);
    }

  };
}]);