@echo off
echo "********setting up seed file with package.json ********* \n"
echo "Press enterto give defult vlaues \n"
npm init
echo "********Generate Express framework ***********************\n"
express
echo "********Installing node modules ***********************\n"
npm install async async-waterfall body-parser color config connect-mongodb-session cookie-parser debug express express-session grunt jade jsonwebtoken jwt-simple log4js make-unique mongoose moment mongoose-dateonly mongoose-deep-populate morgan passport passport-http passport-http-bearer passport-local password-hash-and-salt q serve-favicon validator --save

echo "********Installing grunt modules ***********************\n"
npm install grunt-contrib-concat grunt-contrib-uglify grunt-stripcomments grunt-ng-annotate grunt-contrib-watch grunt-contrib-cssmin grunt-contrib-clean grunt-cache-breaker grunt-contrib-copy grunt-notify grunt-contrib-htmlmin grunt-nodemon --save-dev
