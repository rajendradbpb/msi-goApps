app.controller("User_Controller", function($scope, $stateParams,$rootScope, $uibModal,$state, $localStorage, ApiGenerator, NgTableParams, ApiCall, $timeout, UserModel, Util) {
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
    ApiCall.getRole({type:"vle"},function(response) {
      $scope.vle.role = response.data[0]._id;
    },function(error) {
      Util.alertMessage('danger',error.message);
    })
	}
  $scope.registerVle = function() {
    $rootScope.showProloader = true;
    // $scope.vle.role = "5a0baa97721f3f17b86d1119"; // remove static role
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
    if($stateParams.urban) {
      obj.urban = $stateParams.urban;
    }
    if (loggedIn_user && loggedIn_user.role && loggedIn_user.role.type == "district-admin") {
      obj.district = loggedIn_user.district;
    }
    if (type == "urban") {
      obj.urban = true;
    }
    // if (type == "gp") {
    //   obj.urban = false;
    // }
    $scope.exportLink = $scope.setExportLink(obj);
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
    if ($scope.filter.district && $scope.filter.district != "Select District")
      obj.district = $scope.filter.district;
    if ($scope.filter.block != "" && $scope.filter.block != "Select Block")
      obj.block = $scope.filter.block;
    if ($scope.filter.gp && $scope.filter.gp != "Select GP")
      obj.gp = $scope.filter.gp;
    if (loggedIn_user.role.type == "district-admin") {
      obj.district = loggedIn_user.district;
    }
    // update link for the vle update
    $scope.exportLink = $scope.setExportLink(obj);
    ApiCall.getVle(obj, function(response) {
      $scope.vleTabledata = new NgTableParams;
      $scope.vleTabledata.settings({
        dataset: response.data
      });

    }, function(error) {
      console.log(error);
    });
  }

  $scope.setExportLink = function(obj) {
    var temp = ApiGenerator.getApi('exportExcel').url + "?";
    var flag = false;
    Object.keys(obj).forEach(function(key, index) {
      if (obj[key]) {
        if (!flag) {
          temp += key + "=" + obj[key];
          flag = true;
        } else {
          temp += "&" + key + "=" + obj[key];
        }

      }
    });
    return temp;

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
  $scope.moreVleDetail = function(vleId){
    $scope.modalInstance = $uibModal.open({
      animation : true,
      templateUrl : 'view/modals/moreDetails.html',
      controller : 'VleDetailsModalCtrl',
      size: 'md',
      resolve:{
        vleData : function(){
            return vleId
          }
        }

   })
  }
});
// ************************************************************************************************//
//*************************************************************************************************//
app.controller('VleDetailsModalCtrl',function($scope, $state, $uibModalInstance,ApiCall,vleData){
  var obj = {
    _id:vleData
  }
  ApiCall.getVle(obj,function(response) {
    $scope.vle = response.data[0];
  },function(err){

  })
  $scope.failTransaction = {};
  $scope.active_tab = 'BD';
  $scope.tabChange = function(tab){
    $scope.active_tab = tab;
  }
  $scope.fail = function () {
    sendFailMessage($scope.failTransaction);
    $uibModalInstance.close();
  };
  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});
