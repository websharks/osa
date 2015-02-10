(function() // JXA output handler.
{
	var jxa = Library('websharks-osa/libraries/jxa');
	var args = new (eval(jxa.pkg('args')))(jxa);
	var require = eval(jxa.pkg('require'));
	var google = require(jxa, 'utils/google');

	var arguments = args.get();

	return google.cse.apply(google, arguments);
})();