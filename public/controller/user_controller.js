app.controller("User_Controller",function($scope,$rootScope,$state,$localStorage,ApiGenerator,NgTableParams,ApiCall, $timeout,UserModel,Util){
$scope.vle = {};
$scope.row = {};
$scope.filter = {};
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
	var loggedIn_user = UserModel.getUser();
	var obj = {};
	if(loggedIn_user && loggedIn_user.role && loggedIn_user.role.type == "district-admin"){
		obj.district = loggedIn_user.district;
	}
	if(type == "urban"){
		obj.urban = true;
	}
	if(type == "gp"){
		obj.urban = false;
	}

	ApiCall.getVle(obj, function(response){
		$scope.row = response.data;
		if(obj.urban == true){
			$scope.urbanVleList = $scope.row;
		}
		if(obj.urban == false){
			$scope.gpVleList = $scope.row;
		}
		if(obj.urban == undefined){
			$scope.vleList = $scope.row;
		}

		$scope.vleTabledata = new NgTableParams;
		$scope.vleTabledata.settings({
			dataset : $scope.row
		});
		// console.log("$scope.row   ",$scope.row);
	},function(error){
		console.log(error);
	});
}

$scope.filterVles = function(){
	var obj = {};
	var loggedIn_user = UserModel.getUser();
	obj.district = loggedIn_user.district;
	obj.block = $scope.filter.block;
	obj.gp = $scope.filter.gp;
	if(loggedIn_user.role.type = "district-admin"){
		obj.district = loggedIn_user.district;
	}
	// update link for the vle update
	$scope.exportLink = (function(params) {
		var temp = ApiGenerator.getApi('exportExcel').url+"?";
		var flag = false;
		Object.keys(params).forEach(function(key,index) {
			if(params[key]){
				if(!flag){
					temp+=key+"="+params[key];
					flag = true;
				}
				else{
					temp+="&"+key+"="+params[key] ;
				}

			}
		});
		return temp;

	})(obj);
	console.log(">>>>>>>>>>>>>>  ",$scope.exportLink,obj );
	ApiCall.getVle(obj, function(response){
		$scope.row = response.data;
		$scope.vleTabledata = new NgTableParams;
		$scope.vleTabledata.settings({
			dataset : $scope.row
		});

	},function(error){
		console.log(error);
	});
}
 $scope.getDistrict = function(row){
	 var loggedIn_user  = UserModel.getUser();
	 var obj = {};
	 if($state.current.name == "vle-list" && row.district){
		 obj._id = row.district;
	 }
	 if(row=="filter" && $state.current.name == "vle-list" ){
		obj._id = loggedIn_user.district;
	}
 	ApiCall.getDistrict(obj, function(response){
		if($state.current.name == "vle-list" && row.district){
			row.districtDetails = response.data[0];
		}
 		$scope.districtList = [];
 		angular.forEach(response.data,function(item){
 			$scope.districtList.push(item);
 		});

 	},function(error){
 		console.log(error);
 	});
 }
 $scope.getBlocks = function(row){
	var loggedIn_user  = UserModel.getUser();
	var obj = {};
	if($state.current.name == "vle" && $scope.vle.district){
		obj.district = $scope.vle.district;
	}
	if($state.current.name == "vle-list" && row.block){
		obj._id = row.block;
	}
	if(row=="blockFilter" && $state.current.name == "vle-list" ){
		obj.district = loggedIn_user.district;
	}
	if(row=="changeBlock" && $scope.filter.district && $state.current.name == "vle-list" ){
		obj.district = $scope.filter.district;
	}
		 ApiCall.getBlocks(obj, function(response){
			if($state.current.name == "vle-list" && row.block){
				row.blockDetails = response.data[0];
			}
			else {
			$scope.blockList = [];
			angular.forEach(response.data,function(item){
				$scope.blockList.push(item);
			 });
			}
		 },function(error){
			 console.log(error);
		 });
	 }
	 $scope.getGps = function(row){
		var obj = {};
		if($state.current.name == "vle" && $scope.vle.block){
			obj.block = $scope.vle.block;
		}
		if($state.current.name == "vle-list" && row.gp){
			obj._id = row.gp;
		}
		if(row=="changeGps" && $scope.filter.block && $state.current.name == "vle-list" ){
			obj.block = $scope.filter.block;
		}
			 ApiCall.getGPs(obj, function(response){
				if($state.current.name == "vle-list" && row.gp){
					row.gpDetails = response.data[0];
				}
				else {
				$scope.gpList = [];
				angular.forEach(response.data,function(item){
					$scope.gpList.push(item);
				 });
				}
			 },function(error){
				 console.log(error);
			 });
		 }
 $scope.getAreaCount = function(areaType){
	 var obj = {};
	 var loggedIn_user = UserModel.getUser();
	 if(loggedIn_user && loggedIn_user.role && loggedIn_user.role.type == "district-admin"){
		obj.district = loggedIn_user.district;
	}
 	if(areaType == "district"){
 		obj.distinct = "district";
 	}
 	if(areaType == "gp"){
 		obj.distinct = "gp";
 	}
 	// if(areaType == "Municipality"){
 	// 	obj.urbanType = "Municipality";
 	// 	obj.distinct = "Municipality";
 	// }
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

 	},function(error){

 	});
 }
});
