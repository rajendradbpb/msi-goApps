app.constant("Constants", {
        "debug":true,
        "storagePrefix": "goAppAccount$",
        "getTokenKey" : function() {return this.storagePrefix + "token";},
        "getLoggedIn" : function() {return this.storagePrefix + "loggedin";},
        "alertTime"   : 3000,
        "getUsername" : function() {return this.storagePrefix + "username";},
        "getPassword" : function() {return this.storagePrefix + "password";},
        "getIsRemember" : function() {return this.storagePrefix + "isRemember";},
        "hashKey" : "goAppAccount",
        "envData" : {
          "env":"dev",
          "dev" : {
            "basePath" :"http://localhost",
            "appPath"  :"http://localhost",
          },
          "prod" : {
            "basePath" :"http://ec2-52-23-158-141.compute-1.amazonaws.com",
            "appPath"  :"http://ec2-52-23-158-141.compute-1.amazonaws.com",
          }
        },
});
