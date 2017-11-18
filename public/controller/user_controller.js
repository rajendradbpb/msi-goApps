app.controller("User_Controller",function($scope,$rootScope,$rootScope,$state,$localStorage,NgTableParams,ApiCall, $timeout,UserModel,Util){
$scope.vle = {};
$scope.districtList = [];
$scope.districtCount = {};
$scope.urbanVleList = {};
$scope.vleList = {};
$scope.gpVleList = {};
$scope.municipalityList = {};
$scope.registerVle = function(){
	$rootScope.showProloader = true;
	$scope.vle.role = "5a0baa97721f3f17b86d1119";  
	ApiCall.registerVle($scope.vle,function(response){
		$rootScope.showProloader = false;
		$state.go('thankYou');
	},function(error){
		$rootScope.showProloader = false;
	});	
}
$scope.getVles = function(type){
	var obj = {};
	if(type == "urban"){
		obj.urban = true;
	}
	if(type == "gp"){
		obj.urban = false;
	}
	ApiCall.getVle(obj, function(response){
		if(obj.urban == true){
			$scope.urbanVleList = response.data;
		}
		if(obj.urban == false){
			$scope.gpVleList = response.data;
		}
		if(obj.urban == undefined){
			$scope.vleList = response.data;
		}

	},function(error){
		console.log(error);
	});
}
 $scope.getDistrict = function(){

 	ApiCall.getDistrict(function(response){
 			$scope.districtList = [];
 		angular.forEach(response.data,function(item){
 			$scope.districtList.push(item);
 		});
 		
 	},function(error){
 		console.log(error);
 	});
 }
 $scope.getAreaCount = function(areaType){
 	var obj = {};
 	if(areaType == "district"){
 		obj.distinct = "district";
 	}
 	if(areaType == "gp"){
 		obj.distinct = "gp";
 	}
 	if(areaType == "Municipality"){
 		obj.urbanType = "Municipality";
 		obj.distinct = "Municipality";
 	}
 	ApiCall.getAreatCount(obj, function(response){
 		if(obj.distinct == "district"){
			$scope.districtCount = response.data;
		}
		if(obj.distinct == "gp"){
			$scope.gpList = response.data;
		}
		if(obj.distinct == "Municipality"){
			$scope.municipalityList = response.data;
		}
		console.log($scope.municipalityList);
 	},function(error){

 	});
 }
});