app.config(function($routeProvider) {
	$routeProvider
		//---------------Auth pages----------------//
		.when('/signin', {
			templateUrl : 'views/signin.html',
			controller  : 'mainController',
		}) 
		.when('/', {
			templateUrl : 'views/home.html',
			controller  : 'homeController',
		})
		.when('/detail/:com_id', {
			templateUrl : 'views/view-detail.html',
			controller  : 'homeController',
		})
		.when('/schedule', {
			templateUrl : 'views/schedule.html',
			controller  : 'homeController',
		});
		/*.otherwise({ 
			redirectTo: '/not-found.html' 
		});*/
	
	

});

