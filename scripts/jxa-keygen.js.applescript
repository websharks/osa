var jxa = Library('websharks-osa/libraries/jxa');
var args = new (eval(jxa.pkg('args')))(jxa);
var require = eval(jxa.pkg('require'));
var enc = require(jxa, 'utils-enc');

for(var i = 0, arguments = args.get(); i < arguments.length; i++)
	if(i === 0) // First argument is password length.
		arguments[i] = Number(arguments[i].js);
	else arguments[i] = /^(?:1|on|yes|true)$/i.test(arguments[i].js);

enc.keyGen.apply(this, arguments);