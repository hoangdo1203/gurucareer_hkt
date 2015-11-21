app.factory('User', ['$http', function($http) {  
    function User(UserData) {
        if (UserData) {
            this.setData(UserData);
        }
        // Some other initializations related to User
    };
    User.prototype = {
        setData: function(UserData) {
            angular.extend(this, UserData);
        },
        load: function(username) {
            var scope = this;
            $http.get('data/users.json').success(function(UserData) {
            	angular.forEach(UserData, function(user){
            		if(user.username == username)
            			scope.setData(user);
            	})
                
            });
        },
        /*load: function(id) {
            var scope = this;
            $http.get('ourserver/Users/' + UserId).success(function(UserData) {
                scope.setData(UserData);
            });
        },
        delete: function() {
            $http.delete('ourserver/Users/' + UserId);
        },
        update: function() {
            $http.put('ourserver/Users/' + UserId, this);
        },
        getImageUrl: function(width, height) {
            return 'our/image/service/' + this.User.id + '/' + width + '/' + height;
        },
        isAvailable: function() {
            if (!this.User.stores || this.User.stores.length === 0) {
                return false;
            }
            return this.User.stores.some(function(store) {
                return store.quantity > 0;
            });
        }*/
    };
    return User;
}]);