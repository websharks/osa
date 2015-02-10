(function() // JXA output handler.
{
	var jxa = Library('websharks-osa/libraries/jxa');
	var require = eval(jxa.pkg('require'));
	var chrome = require(jxa, 'utils/chrome');

	chrome.setGitHubIssueLabels();

	return ''; // No output from this.
})();