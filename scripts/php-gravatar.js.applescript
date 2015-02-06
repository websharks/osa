var jxa = Library('websharks-osa/libraries/jxa');
var args = new (eval(jxa.pkg('args')))(jxa);
var require = eval(jxa.pkg('require'));
var str = require(jxa, 'utils-str');
var php = require(jxa, 'utils-php');

for(var i = 0, arguments = args.get(); i < arguments.length; i++)
	arguments[i] = String(arguments[i].js);

var email = arguments[0] ? arguments[0] : 'jas@wsharks.com';

php.eval("echo 'https://www.gravatar.com/avatar/'.urlencode(md5('" + str.escSq(email) + "')).'.jpg?s=512';");