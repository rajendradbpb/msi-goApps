app.controller("User_Controller", function($scope, $rootScope, $state, $localStorage, ApiGenerator, NgTableParams, ApiCall, $timeout, UserModel, Util) {
  $scope.vle = {};
  $scope.row = {};
  $scope.filter = {};
  $scope.districtList = [];
  $scope.districtCount = {};
  $scope.urbanVleList = {};
  $scope.vleList = {};
  $scope.gpVleList = {};
  $scope.municipalityList = {};
  $scope.initVleList = function() {
    // get district list
    $scope.getDistrict();
    $scope.getVles();
  }
	$scope.vleRegdInit = function(){
		$scope.getDistrict();
	}
  $scope.registerVle = function() {
    $rootScope.showProloader = true;
    $scope.vle.role = "5a0baa97721f3f17b86d1119"; // remove static role
    ApiCall.registerVle($scope.vle, function(response) {
      $rootScope.showProloader = false;
      $state.go('thankYou');
    }, function(error) {
      $rootScope.showProloader = false;
    });
  }
  $scope.dashboardInit = function() {
    $rootScope.showProloader = true;
    ApiCall.getDashboard(function(response) {
      $rootScope.showProloader = false;
      $scope.dashboardDetails = response.data;
    }, function(error) {
      $rootScope.showProloader = false;
    });
  }
  $scope.getVles = function(type) {
    var loggedIn_user = UserModel.getUser();
    var obj = {};
    if (loggedIn_user && loggedIn_user.role && loggedIn_user.role.type == "district-admin") {
      obj.district = loggedIn_user.district;
    }
    if (type == "urban") {
      obj.urban = true;
    }
    if (type == "gp") {
      obj.urban = false;
    }

    ApiCall.getVle(obj, function(response) {
      $scope.row = response.data;
      if (obj.urban == true) {
        $scope.urbanVleList = $scope.row;
      }
      if (obj.urban == false) {
        $scope.gpVleList = $scope.row;
      }
      if (obj.urban == undefined) {
        $scope.vleList = $scope.row;
      }

      $scope.vleTabledata = new NgTableParams;
      $scope.vleTabledata.settings({
        dataset: $scope.row
      });
      // console.log("$scope.row   ",$scope.row);
    }, function(error) {
      console.log(error);
    });
  }

  $scope.filterVles = function() {
    var obj = {};
    var loggedIn_user = UserModel.getUser();
    if ($scope.filter.district)
      obj.district = $scope.filter.district;
    if ($scope.filter.block)
      obj.block = $scope.filter.block;
    if ($scope.filter.gp)
      obj.gp = $scope.filter.gp;
    if (loggedIn_user.role.type == "district-admin") {
      obj.district = loggedIn_user.district;
    }
    // update link for the vle update
    $scope.exportLink = (function(params) {
      var temp = ApiGenerator.getApi('exportExcel').url + "?";
      var flag = false;
      Object.keys(params).forEach(function(key, index) {
        if (params[key]) {
          if (!flag) {
            temp += key + "=" + params[key];
            flag = true;
          } else {
            temp += "&" + key + "=" + params[key];
          }

        }
      });
      return temp;

    })(obj);
    ApiCall.getVle(obj, function(response) {
      $scope.vleTabledata = new NgTableParams;
      $scope.vleTabledata.settings({
        dataset: response.data
      });

    }, function(error) {
      console.log(error);
    });
  }
  $scope.getDistrict = function(row) {
    var loggedIn_user = UserModel.getUser();
    var obj = {};
    // if($state.current.name == "vle-list" && row.district){
    //  obj._id = row.district;
    // }
    if (loggedIn_user && loggedIn_user.role.type == "district-admin" && $state.current.name != "vle") {
      obj._id = loggedIn_user.district;
    }
    ApiCall.getDistrict(obj, function(response) {
      $scope.districtList = response.data;
      $scope.districtList.unshift({
        _id: null,
        name: "Select District"
      });
      $scope.filter.district = $scope.districtList[0]._id;
    }, function(error) {
      console.log(error);
    });
  }
  $scope.getBlocks = function(selectedDistrict) {
    var obj = {};
    var loggedIn_user = UserModel.getUser();
    obj.district = selectedDistrict;
    ApiCall.getBlocks(obj, function(response) {
      $scope.blockList = response.data;
      $scope.blockList.unshift({
        _id: null,
        name: "Select Block"
      });
      $scope.filter.block = $scope.blockList[0]._id;
    }, function(error) {
      console.log(error);
    });
  }
  $scope.getGps = function(selectedBlock) {
    var obj = {};
    obj.block = selectedBlock;
    ApiCall.getGPs(obj, function(response) {
      $scope.gpList = response.data;
      $scope.gpList.unshift({
        _id: null,
        name: "Select GP"
      });
      $scope.filter.gp = $scope.gpList[0]._id;
    }, function(error) {
      console.log(error);
    });
  }
  $scope.getAreaCount = function(areaType) {
    var obj = {};
    var loggedIn_user = UserModel.getUser();
    if (loggedIn_user && loggedIn_user.role && loggedIn_user.role.type == "district-admin") {
      obj.district = loggedIn_user.district;
    }
    if (areaType == "district") {
      obj.distinct = "district";
    }
    if (areaType == "gp") {
      obj.distinct = "gp";
    }
    // if(areaType == "Municipality"){
    // 	obj.urbanType = "Municipality";
    // 	obj.distinct = "Municipality";
    // }
    ApiCall.getAreatCount(obj, function(response) {
      if (obj.distinct == "district") {
        $scope.districtCount = response.data;
      }
      if (obj.distinct == "gp") {
        $scope.gpList = response.data;
      }
      if (obj.distinct == "Municipality") {
        $scope.municipalityList = response.data;
      }

    }, function(error) {

    });
  }
});
