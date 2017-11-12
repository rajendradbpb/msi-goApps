app.filter('dateformat', function(){
  return function(date){
    if(date){
      return moment(date).format("DD MMM, YYYY");
    }
  }
});
app.filter('getShortName', function () {
    return function (value) {
      if(value){
        var temp = angular.copy(value);
        temp = temp.split(" ");
        temp = temp[0].charAt(0)+temp[temp.length-1].charAt(0);
        return temp.toUpperCase();
      }
    };
});
app.filter('capitalize', function() {
    return function(input) {
      return (!!input) ? input.charAt(0,3).toUpperCase() : '';
    }
});