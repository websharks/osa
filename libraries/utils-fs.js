(function()
{
	module.exports = // Package.
	{
		dirname: function(path)
		{
			path = String(path ? path : '');
			return path.replace(/\/[^\/]*\/?$/, '');
		},
		homeDir: function()
		{
			return $('~').stringByExpandingTildeInPath.js;

		},
		wsDir  : function()
		{
			return this.homeDir() + '/library/script libraries/websharks';
		}
	};
})();