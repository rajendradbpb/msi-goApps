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
  $scope.vleFilter = {}; // global object to filter vle
  $scope.selectAll = false;
  $scope.vleExportProperties = [
    "role","name","mobile", "altMobile", "email" ,"digiMail" ,"cscId" ,"religion", "state","district", "block" ,"gp" ,
    "village", "urban", "urbanType","ward" ,"dob" ,"gender" ,"caste", "pan", "adhar", "plotNo", "lane",
    "at", "po" , "city"  ,"dist",  "country" ,"pin", "matricBoard", "matricInstitute" ,"matricPassout",
    "matricPercent", "interBoard" ,"interInstitute" ,"interPassout" ,"interPercent" ,"gradBoard" ,
    "gradInstitute", "gradPassout", "gradPercent" ,"pgBoard", "pgInstitute", "pgPassout", "pgPercent",
    "otherQualification", "cscBuildingArea" ,"personEngaged" ,"webCamera" ,  "furnitureDetails" ,
    "vsatBbDcNofn" ,"pmgDishaId" , "kit" , "providingInsurance" , "eWallet"  ,  "censusCode",
    "cscLattitude", "buildingOwnership"   ,"noOfLaptop", "noOfPrinters", "bioMetric", "commonBranding",
    "powerBackUp" ,"tab", "ProvidingEDistrictServices" , "cscLocation" ,"ownership" ,"cscLongitude" ,
    "cscPin", "status", "isDelete"
  ]
  $scope.initVleList = function() {
    $scope.vleFilter = {};
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
  $scope.exportVleSummary = function(filter){
    $scope.vleFilter = Object.assign($scope.vleFilter,filter);
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'view/modals/exportVleModal.html',
      controller: 'exportVleModalCtrl',
      size: 'sm',
      resolve: {
        vleExportProperties: function () {
          return $scope.vleExportProperties;
        },
        exportVle: function () {
          return $scope.exportVle;
        }

      }
    });
  }
  $scope.dashboardInit = function() {
    $scope.vleFilter = {};
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
      // $scope.vleFilter = {}; // reset filter
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
      // $scope.vleFilter = {}; // reset filter
      $scope.vleTabledata = new NgTableParams;
      $scope.vleTabledata.settings({
        dataset: response.data
      });

    }, function(error) {
      console.log(error);
    });
  }

  $scope.exportVle = function(exportProperties){
    exportProperties = exportProperties.toString();
    var obj = {
      exportProperties:exportProperties
    }
    window.open($scope.setExportLink(obj));
  }
  $scope.exportVleModal = function(){
    //window.open('http://localhost/vle/exportExcel?district=5a219ba7b89e890484c216ad');
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'view/modals/exportVleModal.html',
      controller: 'exportVleModalCtrl',
      size: 'sm',
      resolve: {
        vleExportProperties: function () {
          return $scope.vleExportProperties;
        },
        exportVle: function () {
          return $scope.exportVle;
        }

      }
    });

  }
  $scope.setExportLink = function(obj) {
    var loggedIn_user = UserModel.getUser();
    if(loggedIn_user.role.type == "district-admin"){
      obj.district = loggedIn_user.district;
    }
    $scope.vleFilter = Object.assign($scope.vleFilter,obj);

    var temp = $state.current.name == "dashboard"  ? ApiGenerator.getApi('exportVleSummary').url + "?" : ApiGenerator.getApi('exportExcel').url + "?";
    var flag = false;
    Object.keys($scope.vleFilter).forEach(function(key, index) {
      if ($scope.vleFilter[key]) {
        if (!flag) {
          temp += key + "=" + $scope.vleFilter[key];
          flag = true;
        } else {
          temp += "&" + key + "=" + $scope.vleFilter[key];
        }

      }
    });
    console.log("#####  "+temp+" ########");
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
    // $scope.vleFilter = {}; // reset filter
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
app.controller('exportVleModalCtrl',function($scope, $state, $uibModalInstance,ApiCall,vleExportProperties,exportVle){
  $scope.modalInit = function(){
    $scope.selectAll = false;
    $scope.vleExport = {};
    for(var i in vleExportProperties){
      $scope.vleExport[vleExportProperties[i]] = false;
    }

  }
  $scope.changeSelectAll = function(){
    console.log($scope.selectAll);
    if($scope.selectAll){
      angular.forEach($scope.vleExport, function(value, key) {
        $scope.vleExport[key] = true;
      });
    }
    else{
      angular.forEach($scope.vleExport, function(value, key) {
        $scope.vleExport[key] = false;
      });
    }
  }
  $scope.vleExportProperties = vleExportProperties;
  $scope.vleExport = {};
  $scope.ok = function () {
    console.log($scope.vleExport);
    // make api call
    var exportProperties = [];
    var count = 0;
    var limit = Object.keys($scope.vleExport).length;
    angular.forEach($scope.vleExport, function(value, key) {
      count++;
      if(value){
        exportProperties.push(key);
      }
      if(count >= limit){
        if(!exportProperties.length){
          alert("No item selected");
        }
        else{
          exportVle(exportProperties);
          $uibModalInstance.close();

        }
      }
    });

  };
  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});
