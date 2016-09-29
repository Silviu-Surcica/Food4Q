app.controller('LoginController', ['$rootScope', '$scope', '$firebaseAuth', 'URL', function($rootScope, $scope, $firebaseAuth, URL) {
			var ref_auth = new Firebase(URL);
			$rootScope.authObj = $firebaseAuth(ref_auth);
			$rootScope.user = $scope.authObj.$getAuth();
			var login = function(){
		$scope.authObj.$authWithOAuthToken("google", $scope.token).then(function(authData) {
			console.log("Logged in as:", authData.uid);
			$rootScope.user = $rootScope.authObj.$getAuth();
			console.log($rootScope.user);
		}).catch(function(error) {
			console.log("Authentication failed:", error);
		});
	};
			var getAuthToken = function(options) {
				chrome.identity.getAuthToken({ 'interactive': options.interactive }, options.callback);
			};
			$scope.getAuthTokenInteractive = function() {
				getAuthToken({
					'interactive': true,
					'callback': getAuthTokenInteractiveCallback,
				});
				// $rootScope.user = {
				// 	provider: 'google',
				// 	uid: "google:116961594724817319833",
				// 	token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJwcm92aWRlc…UifX0.38C3rlWpm0Nidrn4tvYfm8ARENsBna7PlzBsFBJJhOs",
				// 	google: {
				// 		accessToken: "ya29.CjLlAidcDJPVIfbSk4Pu94uWWenaraHn3sH_pDwvZ1K9Lm6QxFOfWCcEOZH40xRgaNaOow",
				// 		displayName: "Silviu Surcica",
				// 		id: "116961594724817319833",
				// 		profileImageURL: "https://lh4.googleusercontent.com/-Rp7sOE0qk5g/AAAAAAAAAAI/AAAAAAAAACs/yEJl7vMRy60/photo.jpg"
				// 	}

				// };
			};
			var getAuthTokenInteractiveCallback=function(token) {
				$scope.token = token;
				if (chrome.runtime.lastError) {
					alert('error');}
    // Catch chrome error if user is not authorized.
			    else{
			    	 login();
			  	  }
		    
			};
}]);