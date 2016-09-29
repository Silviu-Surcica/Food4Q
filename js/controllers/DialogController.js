app.controller('DialogController', ['$scope', 'obj', 'type', '$mdDialog', '$firebaseArray', '$http', 'URL', function($scope, obj, type, $mdDialog, $firebaseArray, $http, URL){
	 var vm = this;
	 vm.init = function(){
	 	vm.showLocation = false;
	 	vm.showOrder = false;
	 	vm.searchTerm = '';
	 	vm.location = {};
	 	var ref = new Firebase(URL).child('locations');

	 	vm.locations = $firebaseArray(ref);
		 vm.x = {};
		 if (obj){
		 	console.log('szzz');
		 	vm.x = obj;
		 	vm.update = true;
		 }
		 if (type == 'order') {
		 	console.log('showOrder');
		 	vm.showOrder = true;
		 }
	 };
     vm.init();

	 vm.hide = function(){
	    $mdDialog.hide();
	  };
	  vm.cancel = function(){
	    $mdDialog.cancel();
	  };
	  vm.save = function(a, update) {
	  	console.log('obj='+a +'update'+update);
	  	var response = {obj: a, update: update};
	    $mdDialog.hide(response);
	  };
	  vm.getOption = function(){
	  	console.log('selected_itemsss: '+vm.x.location);
	  	if (vm.x.location == undefined){
	  		return 'Select the location';
	  	}
	  	if (vm.x.location == 'Add new location') {
          vm.showLocation = true;
        }
        else {
        	return vm.x.location.name;
        }
	  };

	  vm.clearSearchTerm = function(){
	  	 vm.searchTerm = '';
	  };
	  vm.showOption = function(){
	  	if (vm.showLocation && vm.showOrder)
	  		return true;
	  	else if(vm.showLocation == false && vm.showOrder == true)
	  		return false;
	  	else 
	  		return true;
	  };  	
		

	  vm.addLocation = function(url){
	  	var result = {};
	  	var key = 'fd198468886247af8df06197c93248b3';
	  	var escapedUrl = encodeURI(url);
	  	var embedlyRequest = 'https://api.embed.ly/1/extract?secure=true&frame=true&key=' + key;
	  	embedlyRequest += '&url=' + escapedUrl;
	  	var get = $http({method: 'GET', url: embedlyRequest});
	  	console.log(vm.locations);
	  	get.then(function(response){
	  		console.log(response);
		  	result.image = response.data.images[0].url;
			result.name = response.data.provider_name;
			result.description = response.data.description;
			result.url = response.data.provider_url;
			vm.locations.$add(result);
			vm.showLocation = false;
			vm.x.location = result;
			console.log('show location is '+ vm.showLocation);
		});
	  };


}]);