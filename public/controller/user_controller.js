app.controller("User_Controller",function($scope,$rootScope,$rootScope,$state,$localStorage,NgTableParams,ApiCall, $timeout,UserModel,Util){
$scope.vle = {};
$scope.districtList = [];
$scope.registerVle = function(){
	$scope.vle.role = "5a0baa97721f3f17b86d1119";  
	ApiCall.registerVle($scope.vle,function(response){
	},function(error){

	});	
}
$scope.getVles = function(){
	ApiCall.getVle(function(response){
		console.log(response);
	},function(error){
		console.log(error);
	});
}
 $scope.getDistrict = function(){
 	ApiCall.getDistrict(function(response){
 		angular.forEach(response.data,function(item){
 			$scope.districtList.push(item);
 		});
 	},function(error){
 		console.log(error);
 	});
 }
});