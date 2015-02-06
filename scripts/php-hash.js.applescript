var jxa = Library('websharks-osa/libraries/jxa');
var args = new (eval(jxa.pkg('args')))(jxa);
var require = eval(jxa.pkg('require'));
var str = require(jxa, 'utils-str');
var php = require(jxa, 'utils-php');

for(var i = 0, arguments = args.get(); i < arguments.length; i++)
	arguments[i] = String(arguments[i].js);

var algo = arguments[0] ? arguments[0] : 'sha1',
	string = arguments[1] ? arguments[1] : '';

php.eval("echo hash('" + str.escSq(algo) + "', '" + str.escSq(string) + "');");