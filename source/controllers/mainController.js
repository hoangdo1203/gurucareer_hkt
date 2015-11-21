/**
 * Main controller 
 * Author : TrucHV
 */

app.controller('mainController', function($scope, $http, $routeParams, CommonSV) {
	$scope.username = '';
	$scope.password = '';
	$scope.showMenu = true;
	
	$scope.login = function(){
		$http.get('data/users.json').success(function(users) {
            $scope.users = users;
            var login = false;
    		angular.forEach($scope.users, function(user){	
        		if(user.username == $scope.username && user.password == $scope.password){	
        			login = true;	
    	   			CommonSV.setItem('role',  user.role);
    	   			window.location.href = "#/";
    	   			
        		}
        	})
    		if(!login){
    			alert("Username or password incorrect !");;
    		}
        });
	}
	
	$scope.logout = function(){
		CommonSV.logout();	
	}
});
