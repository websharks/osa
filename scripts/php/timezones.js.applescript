(function() // JXA output handler.
{
	var jxa = Library('websharks-osa/libraries/jxa');
	var args = new (eval(jxa.pkg('args')))(jxa);
	var require = eval(jxa.pkg('require'));
	var php = require(jxa, 'utils/php');

	var arguments = args.get();
	if(arguments && arguments.length === 1)
		arguments[1] = $.NSTimeZone.localTimeZone.name.js;

	return php.runScript('timezones', arguments);
})();