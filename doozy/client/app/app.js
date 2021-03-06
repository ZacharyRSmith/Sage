angular.module('app', [
  'app.services',
  'app.tasks',
  'app.auth',
  'ngRoute',
  'ngAnimate',
  'ngFx'
])
.config(function($routeProvider, $httpProvider) {
  $routeProvider
    .when('/signin', {
      templateUrl: '/app/auth/signin.html',
      controller: 'AuthController'
    })
    .when('/signup', {
      templateUrl: '/app/auth/signup.html',
      controller: 'AuthController'
    })
    .when('/tasks', {
      templateUrl: '/app/tasks/tasks.html',
      controller: 'TasksController',
      authenticate: true,
    })
    .otherwise({
      redirectTo: '/tasks'
    });

  $httpProvider.interceptors.push('AttachTokens');
})
.factory('AttachTokens', function ($window) {
  // adds web token to headers
  var attach = {
    request: function (object) {
      var jwt = $window.localStorage.getItem('auth-token');
      if (jwt) {
        object.headers['x-access-token'] = jwt;
      }
      object.headers['Allow-Control-Allow-Origin'] = '*';
      return object;
    }
  };
  return attach;
})
.run(function ($rootScope, $location, Auth) {
  // checks if user is logged in with any route change
  $rootScope.$on('$routeChangeStart', function (evt, next, current) {
    if (next.$$route && next.$$route.authenticate && !Auth.isAuth()) {
      $location.path('/signin');
    }
  });
});
