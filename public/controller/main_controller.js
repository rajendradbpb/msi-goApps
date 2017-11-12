/*****************************************************************************************************************/
/*****************************************************************************************************************/
/*****************************************************************************************************************/
app.controller("Main_Controller",function($scope,$rootScope,$state,$localStorage,NgTableParams,ApiCall,UserModel,$uibModal,$stateParams,Util,$timeout){
  $scope.userList = {};
  $scope.dashboard = {};
  $scope.referList = {};
   var loggedIn_user = UserModel.getUser();
   // event listener
  //  $rootScope.$on("LOGGED_IN",function() {
  //    $scope.getUserDetails();;
  //  });
  /*******************************************************/
  /*********FUNCTION IS USED TO SIGN OUT PROFILE**********/
  /*******************************************************/
  $scope.signOut = function(){
    delete $localStorage.token;
    $rootScope.is_loggedin = false;
    UserModel.unsetUser();
    $state.go('login');
  }

  /*******************************************************/
  /*********FUNCTION IS USED TO GET USER LIST*************/
  /*******************************************************/
  $scope.getInternalUsers = function(data){
    $scope.internalCount = 0;
    var obj = {
      'userType':data,
    }
    ApiCall.getUser(obj, function(response){
     $scope.internalCount = response.data.length;

      },function(error){
      })
  }
 /*******************************************************/
  /*********FUNCTION IS USED TO GET USER Details*************/
  /*******************************************************/
  $scope.getUserDetails = function(){
    var loggedIn_user = UserModel.getUser();
    var obj = {
        '_id' : loggedIn_user._id,
      }
        ApiCall.getUser(obj, function(response){
          console.log(response);
          $scope.userDetails = response.data;
        },function(error){
        });
      }


   /*******************************************************/
  /*********FUNCTION IS USED TO GET Client USER LIST*************/
  /*******************************************************/
  $scope.getClientUsers = function(){
    $scope.clientCount = 0;
    $scope.clientUsers = [];
    ApiCall.getUser( function(response){
      console.log(response);
      angular.forEach(response.data, function(item){
            if(item.role.type == "client"){
                $scope.clientUsers.push(item);
                $scope.clientCount++;
               }
          });
      console.log($scope.clientUsers);
      },function(error){
      })
  }

  /*******************************************************/
  /*********FUNCTION IS USED TO CHECK ADMIN USER**********/
  /*******************************************************/
  $scope.checkAdmin = function(){
    $scope.superAdmin = false;
      var loggedIn_user = UserModel.getUser();
      if(loggedIn_user && loggedIn_user.role && loggedIn_user.role.type == "superAdmin"){
        $scope.superAdmin = true;
      }
      else{
        $scope.superAdmin = false;
      }
      return  $scope.superAdmin;
  }
  /*******************************************************/
  /*********FUNCTION IS USED TO CHECK CLIENT USER**********/
  /*******************************************************/
  $scope.checkClient = function(){
    $scope.client = false;
      var loggedIn_user = UserModel.getUser();
      if(loggedIn_user && loggedIn_user.role && loggedIn_user.role.type == "client"){
        $scope.client = true;
      }
      else{
        $scope.client = false;
      }
      return  $scope.client;
  }
  /*******************************************************/
  /*********FUNCTION IS USED TO CHECK INTERNAL USER**********/
  /*******************************************************/
  $scope.checkInternalUser = function(){
    $scope.internalUser = false;
      var loggedIn_user = UserModel.getUser();
      if(loggedIn_user && loggedIn_user.role && ( loggedIn_user.role.type == "client" || loggedIn_user.role.type == "superAdmin")){
        $scope.internalUser = false;
      }
      else {
        $scope.internalUser = true;
      }
      return  $scope.internalUser;
  }
  /*******************************************************/
  /******FUNCTION IS USED TO OPEN DELETE USER MODAL*******/
  /*******************************************************/
  $scope.deleteUser = function(data){
   $scope.deleteUserId = data._id;
   $scope.modalInstance = $uibModal.open({
      animation : true,
      templateUrl : 'view/modals/user-delete-modal.html',
      controller : 'daleteUserModalCtrl',
      size: 'md',
      resolve:{
        userDelete : function(){
           return $scope.userDelete;
        }
      }
   })
  }
  /*******************************************************/
  /******FUNCTION IS USED TO Givr Referral list*******/
  /*******************************************************/
  // $scope.referralList = function(){
  //  ApiCall.getReferralList(function(response){
  //   $scope.referList = response.data;
  //   $scope.listData = new NgTableParams;
  //   $scope.listData.settings({
  //     dataset:$scope.referList
  //   })
  //  },function(error){
  //    console.log("error");
  //  });
  // }

  /*******************************************************/
  /*********FUNCTION IS USED TO DELETE USER***************/
  /*******************************************************/
  $scope.userDelete = function(){
    ApiCall.deleteUser({
      _id: $scope.deleteUserId
    }, function(res) {
      Util.alertMessage('success', res.message);
      $scope.getAllUsers();
    }, function(error) {
    })
  }
  /*******************************************************/
  /******FUNCTION IS USED TO GET RETURN FILE COUNT********/
  /*******************************************************/
  $scope.getReturnCount = function(){
    ApiCall.getcount(function(response){
     $scope.returnFilesCounts = response.data;
    },function(error){
    })
  }
});
/*****************************************************************************************************************/
/*****************************************************************************************************************/
/*****************************************************************************************************************/
app.controller('daleteUserModalCtrl',function($scope, $uibModalInstance,userDelete){
  $scope.ok = function () {
    userDelete();
    $uibModalInstance.close();
  };
  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});
/*****************************************************************************************************************/
/*****************************************************************************************************************/
/*****************************************************************************************************************/
app.controller('DatePickerCtrl' , ['$scope', function ($scope) {
    // $scope.task = {};
    // $scope.ClosingDateLimit  = function(){
    //   $scope.startDates = $scope.task.startDate;
    //   console.log($scope.startDates);
    // }
        $scope.today = function() {
            $scope.dt = new Date();
        };
        $scope.today();

        $scope.clear = function () {
            $scope.dt = null;
        };

        // Disable weekend selection
        /*
         $scope.disabled = function(date, mode) {
         return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
         };*/

        $scope.toggleMin = function() {
            // $scope.minDate = $scope.task.startDate;
            $scope.minDate = new Date();
            $scope.maxDate = new Date();
            $scope.dateMin = null || new Date();
        };
        $scope.toggleMin();

        $scope.open1 = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.opened = true;
        };

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        $scope.mode = 'month';

        $scope.initDate = new Date();
        $scope.formats = ['MM-dd-yyyy', 'dd-MMM-yyyy', 'dd-MMMM-yyyy', 'yyyy-MM-dd', 'dd/MM/yyyy', 'yyyy-MMM','shortDate'];
        $scope.format = $scope.formats[4];
        $scope.format1 = $scope.formats[5];

    }
]);

/*****************************************************************************************************************/
/*****************************************************************************************************************/
/*****************************************************************************************************************/

/*****************************************************************************************************************/
/*****************************************************************************************************************/
/*****************************************************************************************************************/

/*****************************************************************************************************************/
/*****************************************************************************************************************/
/*****************************************************************************************************************/
