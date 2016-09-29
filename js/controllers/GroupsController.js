app.controller('GroupsController', ['$rootScope', '$scope', '$firebaseObject', '$firebaseArray', '$mdDialog', '$mdMedia', 'URL', function($rootScope, $scope, $firebaseObject, $firebaseArray, $mdDialog, $mdMedia, URL) {
	var orders_ref = new Firebase(URL).child("orders");
	var items_ref = new Firebase(URL).child('items');
	// var all_items = $firebaseArray(items_ref);
	$scope.orders = $firebaseArray(orders_ref);
	$scope.activeItem = null;
	$scope.addOrder = function(obj){
			console.log(obj);
			obj.items_nr = 0;
			obj.total = 0; 
			obj.admin_name = $scope.user.google.displayName;
			obj.admin_uid = $scope.user.uid;
		$scope.orders.$add(obj);
	};
	$scope.updateOrder = function(obj, index){
		console.log(index);
		var ref = orders_ref.child($scope.orders.$keyAt(index));
		console.log(obj);
		delete obj.$id;
		delete obj.$priority;
		delete obj.location.$$mdSelectId;
		delete obj.location.$id;
		delete obj.location.$priority;
		delete obj.location.$$hashKey;

		ref.update(obj);
	};
	$scope.getLocation = function(obj){
		// var location_ref = new Firebase(URL+'/locations').child(obj.location_id);
		// $scope.location = $firebaseObject(location_ref);
	};
	$scope.getItems = function(index){
		$scope.ref = orders_ref.child($scope.orders.$keyAt(index)+'/items_nr');
        // $scope.items = all_items[all_items.$indexFor($scope.orders.$keyAt(index))];
		$scope.items = $firebaseArray(new Firebase(URL).child("items/"+$scope.orders.$keyAt(index)));
	};
	$scope.addItem = function(obj, index){
		console.log(obj);
		$scope.ref = orders_ref.child($scope.orders.$keyAt(index)+'/items_nr');
		var ref_price = orders_ref.child($scope.orders.$keyAt(index)+'/total');
		$scope.items = $firebaseArray(new Firebase(URL).child("items/"+$scope.orders.$keyAt(index)));
		obj.user_id = $scope.user.uid;
		obj.name = $scope.user.google.displayName;
		obj.img = $scope.user.google.profileImageURL;
		$scope.items.$add(obj);
		ref_price.transaction(function(current) {
		  return current + obj.price;
		});
		$scope.ref.transaction(function(current){
			return current + 1;

		});
	};
	$scope.updateItem = function(obj, index){
		console.log('update'+index);
		var ref_price = orders_ref.child($scope.orders.$keyAt(index)+'/total');
		var ref = items_ref.child($scope.orders.$keyAt(index)+'/'+obj.$id);
		var item_object = $firebaseObject(ref);
		item_object.$loaded().then(function() {
			var old_price = item_object.price;
			console.log('old'+old_price);
			ref.update(obj);
			ref_price.transaction(function(current) {
			  return current - old_price + obj.price;
			});
		});
		delete obj.$id;
		delete obj.$$hashKey;
		delete obj.$priority;
		
	
		
	}
	$scope.removeItem = function(obj, index){
		var ref_price = orders_ref.child($scope.orders.$keyAt(index)+'/total');
		$scope.items.$remove(obj);
		ref_price.transaction(function(current) {
		  return current - obj.price;
		});
		$scope.ref.transaction(function(current) {
		  return current - 1;
		});
	};

     // $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
	 $scope.addNew = function(ev, type, obj, index) {
	 
	    var newObj= angular.copy(obj);
	    console.log('add new order/item');
	    console.log(newObj);

		    $mdDialog.show({
		      locals:{obj: newObj,
		      		  type: type 
		      		},  
		      scope: $scope.$new(),
		      controller: 'DialogController as dialog',
		      templateUrl: 'order_dialog.html',
		      parent: angular.element(document.body),
		      targetEvent: ev,
		      clickOutsideToClose:true,
		      fullscreen: null
		    })
		    .then(function(answer) {
		    	var update = answer.update;
		    	var obj = answer.obj;
		    	console.log('update is '+ update);
		    	if (update && type == 'order'){
		    		console.log('update order;');
		    		$scope.updateOrder(obj, index);
		    	}
		    	else if(update && type == 'item'){
		    		console.log('update item');
		    		$scope.updateItem(obj, index);
		    	}
		    	else if(!update && type == 'order'){
		    		console.log('add rder');
		    		$scope.addOrder(obj);
		    	}
		    	else if (!update && type == 'item'){
		    		console.log('add item');
		    		console.log(obj);
		    		$scope.addItem(obj, index);
		    	}
		      
		    });
	
	
		
	
	    // $scope.$watch(function() {
	    //   return $mdMedia('xs') || $mdMedia('sm');
	    // }, function(wantsFullScreen) {
	    //   $scope.customFullscreen = (wantsFullScreen === true);
	    // });
  };

  $scope.showDetails = function(obj){
  	return $scope.activeItem == obj || $scope.activeItem == null;
  };
  $scope.setItem = function(obj, index){
  	console.log('setItem');
  	$scope.activeItem = obj;
  	$scope.getItems(index);
  };
  $scope.unsetItem = function(obj){
  	console.log('unsert00setItem');
  	$scope.activeItem = null;
  };
  $scope.logout = function(){
  	$rootScope.authObj.$unauth()
  	$rootScope.user = null;
  };
}]);
