(function() // JXA output handler.
{
	var jxa = Library('websharks-osa/libraries/jxa');
	var args = new (eval(jxa.pkg('args')))(jxa);
	var require = eval(jxa.pkg('require'));
	var php = require(jxa, 'utils/php');

	var arguments = args.get();

	return php.runScript('idonethis', arguments);
})();