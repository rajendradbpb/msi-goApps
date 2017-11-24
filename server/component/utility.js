var constants = require('./../../config/constants');
var response = require("./../component/response");
var LOG = require('./../component/LOG');
var models = require('./../models/index');

var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var moment = require('moment');
var config = require("config");
var excel = require('node-excel-export');
var utility = {};
utility.isEmpty = function(data) {
  if (!data || data == "")
    return true;
  else {
    return false;
  }
}
utility.sendVerificationMail = function(userObj, callback) {
  // var transporter = nodemailer.createTransport("SMTP", {
  //   service: "Gmail",
  //   auth: {
  //     user: constants.gmailSMTPCredentials.username,
  //     pass: constants.gmailSMTPCredentials.password
  //   }
  //   // host: 'smtp.goappssolutions.com',
  //   // port: 587,
  //   // secure: false, // upgrade later with STARTTLS
  //   // auth: {
  //   //     user: 'rajendra',
  //   //     pass: 'infy@123'
  //   // }
  // });
  // transporter = nodemailer.createTransport({
  //   SES: new aws.SES({
  //     apiVersion: '2010-12-01'
  //   })
  // });


  // var transporter = nodemailer.createTransport("SES", {
  //   AWSAccessKeyID: "AKIAIYBJ5Z45D2OFLVRQ",
  //   AWSSecretKey: "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",
  //   SeviceUrl: "http://ec2-52-23-158-141.compute-1.amazonaws.com"
  // });


  var transporter = nodemailer.createTransport("SMTP", {
    host: "email-smtp.us-east-1.amazonaws.com",
    secureConnection: true,
    port: 465,
    auth: {
      user: "AKIAJQ645MHEM3FQ25UA",
      pass: "AlwqDZB59eCXQvpSZ44gsuVkTCfo3s/5yLL7I+6CnO9d"
    }
  });

  // getting template details
  models.templateModel.findOne({type:userObj.templateType}).exec()
  .then(function(template) {
    // udpate data as per the user input
    var mailOptions = {
      from: constants.gmailSMTPCredentials.mailUsername + "<" + constants.gmailSMTPCredentials.verificationMail + ">",
      // to: userObj.email,
      transport: transporter,
      to: userObj.email,
      subject: template.header,
      text: template.htmlcontent
        .replace(/{{name}}/g, userObj.name)
        .replace(/{{email}}/g, userObj.email)
        .replace(/{{password}}/g, userObj.password)
        .replace(/{{mobile}}/g, userObj.mobile)
        .replace(/{{company}}/g, userObj.company)
        .replace(/{{referredBy}}/g, userObj.referredBy)
        .replace(/{{signUpUrl}}/g, userObj.signUpUrl)
    }
    LOG.info(JSON.stringify(mailOptions));
    // verify connection configuration
    nodemailer.sendMail(mailOptions, function(err, res) {
      if (err) {
        console.log("Message sent: Error" + err.message);
        callback(err, null)
      } else {
        console.log("Message sent: " + res);
        callback(null, true)
      }
    });
  })
  .catch(function(err) {
    LOG.error("Error in sending mail ",err)
  })


}
/**
 * functionName :utility.stringify()
 * Info : used to stringify the content of the object or the array of object
 * input : object or the array of object
 * output :string
 * createdDate - 22-9-16
 * updated on - 22-9-16
 */
utility.stringify = function(objData) {
  return JSON.stringify(objData);
}
/**
 * functionName :utility.getDateFormat()
 * Info : used to get the calculated date from the given paramereres with the format
 * @param
      operation - date operaton like add,substract
      startDate - start date of the calculation
      mode      - mode of calculation like day , hour etc
      count     - count to of the operation
 * output :string
 * createdDate - 24-9-16
 * updated on - 24-9-16
 */
utility.getDateFormat = function(objData) {
  var formatDate = null;
  switch (objData.operation) {
    case 'add':
      formatDate = moment(new Date(objData.startDate)).add(objData.mode, objData.count).format()
      break;
    default:
      console.log("getDateFormat  not mentioned ");
  }
  return new Date(formatDate); // here we converted to the javascript format as mongo db do not recognise momoment format
}

/**
 * functionName :utility.dateDiff()
 * Info : used to get the date difference
 * @param
      startDate , end date
 * output :Number
 * createdDate - 01-10-16
 * updated on - 01-10-16
 */
utility.dateDiff = function(startDate, endDate) {
  startDate = moment(new Date(startDate));
  endDate = endDate ? moment(new Date(endDate)) : moment(new Date());
  var days = endDate.diff(startDate, 'days');
  days = days || 1;
  console.log("days  ", days);
  return days;
}
/**
 * functionName :utility.isDataExist()
 * Info : to check wheather data present or blank , where checking ZERo optional
 * @param
      data - variable to be check
      isZero - check condition for the zero
 * output :Number
 * createdDate - 16-10-2016
 * updated on - 16-10-2016
 */
utility.isDataExist = function(data, isZero) {
  var status = true;
  if (data == undefined || data == null) {
    status = false;
  }
  if (isZero) {
    status = data == 0 ? false : true;
  }
  return status;
}
utility.getDateFormat = function(date) {
  return (date.getDate().toString() + date.getMonth().toString() + date.getFullYear().toString());
}

utility.uploadImage = function(imageDetail, callback) {
  var imagePath = config.get(config.get('env') + ".uploadPath") + "/" + Date.now() + "_" + imageDetail.fileName;
  require('fs').writeFile(imagePath, imageDetail.base64, {
    encoding: 'base64'
  }, function(err, data) {
    if (!err) {
      imagePath = imagePath.replace('./public', ""); // to remove . at begining of path
      callback(false, imagePath); // sending file path
    } else {
      callback(err, false);
    }

  });
}
/**
 * making dynamically validation for the fields passed in the request STARTS
 @param 1st - represents req
 @param 2nd - represents res
 @param 3rd - container where the request paramereres are sent,  body,query or param
 * Make sure the the first , second,third must be present paramereres while calling this function
 * must be the req and the res object and rest are checked with the null validation
 */
utility.validateNull = function() {
  var args = arguments;
  if (args.length < 3) {
    throw Error("Invalid paramereres supplied to  validation");
  }
  console.log(args.length);
  for (var i in args) {
    if (i <= 2)
      continue; // skip the req and res object
    if (!args[0][args[2]][args[i]]) {
      return response.sendResponse(args[1], 402, "error", constants.messages.errors.validationError, args[i] + " can not be blank");

    }

  }
}

utility.getAlphaNumeric = function(precision) {
  precision = precision || constants.forgotPasswordPrec;
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < precision ; i++){
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return "@"+text;
}

/**
 * making dynamically validation for the fields passed in the request ENDS
 */

 utility.downloadXls = function(data,res){
   var dataset = [{name:"name1"},{name:"name2"},{name:"name3"}];
   const heading = [['state','asdf']];
   var specification = {
     name: { // <- the key should match the actual data key
       displayName: 'State', // <- Here you specify the column header
       width: 120 // <- width in pixels
     }
   };
   var report = excel.buildExport(
     [{
       name: 'State',
       heading: heading,
       specification: specification,
       data: dataset // <-- Report data
     }]
   );
   res.attachment('state.xlsx');
   return res.send(report);
 }
module.exports = utility;
