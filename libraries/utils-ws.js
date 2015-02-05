(function()
{
	module.exports = // Package.
	{
		run: function(command, args)
		{
			command = String(command ? command : ''),
				args = String(args ? args : '');

			return this.app.doShellScript('/usr/local/bin/ws ' + command + (args ? ' ' + args : ''));
		}
	};
	module.exports.require = eval(module.jxa.pkg('require'));
	module.exports.app = module.exports.require(module.jxa, 'utils-app')();
})();