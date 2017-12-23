/*****************************************************************************************************************/
/*****************************************************************************************************************/
/*****************************************************************************************************************/
app.controller("Main_Controller",function($scope,$rootScope,$state,$localStorage,LOG,NgTableParams,ApiCall,EnvService,UserModel,$uibModal,$stateParams,Util,$timeout){

  //$scope.dashboard = {};
   var loggedIn_user = UserModel.getUser();
   $scope.active_tab = 'BD';
   $scope.tabChange = function(tab){
    $scope.active_tab = tab;
   }
   $scope.validateUser = function(role) {
    var loggedIn_user = UserModel.getUser();
    return (loggedIn_user.role.type == role ? true :false);
   }
   $scope.getSummary = function() {
    $scope.exportSummaryLink = EnvService.getBasePath()+"/vle/exportSummary?download=true";
     $scope.summaryList = [];
     ApiCall.getSummary(function(data) {
      console.log(data);
      $scope.summaryList = data.data;
      $scope.summaryData = new NgTableParams;
      console.log($scope.summaryList);
      $scope.summaryData.settings({
        dataset:$scope.summaryList
      })
     },function(error) {
       Util.alertMessage('warning',"Error in summary data");
       console.error("Error  ",error)
     })
   }
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
  /*********FUNCTION IS USED TO CHECK PASSOWORD***********/
  /*******************************************************/
  $scope.changePass = {
    newPassword:"",
    Repassword:""
  }
  $scope.checkPassword = function(password, confirmPassword) {
    console.log("checkPassword   ",password,confirmPassword);
    if (password != confirmPassword) {
      $scope.showPasswordMisMatch = true;
    }
    if (password == confirmPassword) {
      $scope.showPasswordMisMatch = false;
    }
  }
 /*******************************************************/
  /*********FUNCTION IS USED TO CHANGE PASSOWORD***********/
  /*******************************************************/
  $scope.changePassword = function(changePass){
    $rootScope.showPreloader = true;
    ApiCall.changePassword(changePass, function(response) {
      console.log(response);
      $rootScope.showPreloader = false;
      LOG.info(response.message);
      $state.go('dashboard');
    },function(error){
      $rootScope.showPreloader = false;
       if(error.data.statusCode == 401){
        LOG.error(error.message);
       }
    });

  }
  $scope.checkStateAdmin = function(){
    $scope.stateAdmin = false;
      var loggedIn_user = UserModel.getUser();
      if(loggedIn_user && loggedIn_user.role && loggedIn_user.role.type == "state-admin"){
        $scope.stateAdmin = true;
      }
      else{
        $scope.stateAdmin = false;
      }
      return  $scope.stateAdmin;
  }


  $scope.getUserDetails = function(){
    var loggedIn_user = UserModel.getUser();
    if(!loggedIn_user) return;
    var obj = {
        '_id' : loggedIn_user._id,
      }
        ApiCall.getUser(obj, function(response){
          $scope.userDetails = response.data;
        },function(error){
        });
      }



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
