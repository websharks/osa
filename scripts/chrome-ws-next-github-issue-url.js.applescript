var jxa = Library('websharks-osa/libraries/jxa');
var require = eval(jxa.pkg('require'));
var chrome = require(jxa, 'utils-chrome');
var ws = require(jxa, 'utils-ws');

var activeTab = chrome.activeTab();
var url = activeTab ? activeTab.url() : '';

if(url.indexOf('//github.com/') !== -1)
	ws.run('github', 'next-issue-url '+chrome.activeTab().url());
else ''; // Not a GitHub URL.