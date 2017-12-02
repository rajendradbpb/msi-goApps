angular.module('WebService', [])
.factory('API', function($http, $resource, EnvService) {
  return {
    getRole: {
      "url": "/role/",
      "method": "GET",
      "headers": {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      },
    },

    postRole: {
      url: "/role",
      method: "POST",
      "headers": {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      },
    },
    updateRole: {
      url: "/role/",
      method: "PUT",
      "headers": {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      },
    },
    deleteRole: {
      url: "/role/:_id",
      method: "DELETE",
      "headers": {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      },
    },
    userLogin : {
      url : "/user/login",
      method : "POST"
    },
    getUser : {
      url:"/user/",
      method: "GET"
    },
    postUser: {
      url: "/user/",
      method: "POST",
      "headers": {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      },
    },
    deleteUser: {
        url: "/user/:_id",
        method: "DELETE",
        "headers": {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
    },
    updateUser: {
        url: "/user/",
        method: "PUT",
        "headers": {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
    },

    getDistrict:{
      url:"/common/district",
       method: "GET",
    },
    getBlocks:{
      url:"/common/block",
       method: "GET",
    },
    getGPs:{
      url:"/common/gp",
       method: "GET",
    },
    getVle: {
      "url": "/vle",
      "method": "GET",
    },
    getAreatCount: {
      "url": "/vle/district",
      "method": "GET",
    },
    forgotPassword: {
        url: "/user/forgotPassword",
        method: "PUT",
        "headers": {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
    },
    changePassword: {
        url: "/user/changePassword",
        method: "PUT",
        "headers": {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
    },
    registerVle: {
        url: "/vle",
        method: "POST",
        "headers": {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
    },
    exportExcel: {
        url: "/vle/exportExcel",
        method: "POST",
        "headers": {
            // 'Content-Type': 'application/json',
            // 'Accept': 'application/json'
        },
    },
  }
})
.factory('ApiCall', function($http, $resource, API, EnvService,ApiGenerator) {
  return $resource('/',null, {
    getRole: ApiGenerator.getApi('getRole'),
    userLogin : ApiGenerator.getApi('userLogin'),
    getUser: ApiGenerator.getApi('getUser'),
    postUser: ApiGenerator.getApi('postUser'),
   registerVle: ApiGenerator.getApi('registerVle'),
    changePassword:  ApiGenerator.getApi('changePassword'),
    getDistrict:     ApiGenerator.getApi('getDistrict'),
    getBlocks:     ApiGenerator.getApi('getBlocks'),
    getVle:     ApiGenerator.getApi('getVle'),
    getAreatCount:     ApiGenerator.getApi('getAreatCount'),
    getGPs:     ApiGenerator.getApi('getGPs'),
    exportExcel:     ApiGenerator.getApi('exportExcel'),
  })
})

.factory('ApiGenerator', function($http, $resource, API, EnvService) {
    return {
      getApi: function(api) {
        var obj = {};
        obj = angular.copy(API[api]);
        obj.url = EnvService.getBasePath() + obj.url;
        return obj;
        console.log(obj);
      }
    }
})

.factory('EnvService',function($http,$localStorage){
  var envData = env = {};
  var settings =  {};

  return{
    setSettings : function(setting) {
      settings = setting;
      // setting env
      this.setEnvData(setting.envData);
    },
    getSettings : function(param) {
      if(param){
        return settings[param];
      }
      return null; // default
    },
    setEnvData: function (data) {
      envData = data[data.env];
    },
    getEnvData: function () {
      return envData;
    },
    getBasePath: function (env) {
      return this.getEnvData()['basePath']
    }
  }
});
