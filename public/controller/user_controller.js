app.controller("User_Controller",function($scope,$rootScope,$rootScope,$state,$localStorage,NgTableParams,ApiCall, $timeout,UserModel,Util){
$scope.vle = {};
$scope.districtList = [];
$scope.registerVle = function(){
	$scope.vle.role = "5a0baa97721f3f17b86d1119";  
	ApiCall.registerVle($scope.vle,function(response){
		console.log(response);
	},function(error){

	});	
}
 $scope.getDistrict = function(){
 	ApiCall.getDistrict(function(response){
 		angular.forEach(response.data,function(item){
 			$scope.districtList.push(item);
 		});
 		console.log($scope.districtList);
 	},function(error){
 		console.log(error);
 	});
 }
});