app.controller('MainController', ['$rootScope', '$scope', '$firebaseObject', '$firebaseArray', '$firebaseAuth', 'URL', function($rootScope, $scope, $firebaseObject, $firebaseArray, $firebaseAuth, URL) { 
    var ref_auth = new Firebase(URL);
	$rootScope.authObj = $firebaseAuth(ref_auth);
	$rootScope.user = $scope.authObj.$getAuth();
	
}])
.directive('login', function() {
	return {
		restrict: 'E',
		transclude: true,
		scope: true,
		controller: 'LoginController',
		templateUrl: 'login.html'
};
})
.directive('orderGroups', function(){
	return {
		restrict: 'E',
		transclude: true,
		scope: true,
		controller: 'GroupsController',
		templateUrl: 'order_groups.html'
	};
});