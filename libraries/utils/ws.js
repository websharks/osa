(function()
{
	module.exports = // Package.
	{
		run: function(command, args)
		{
			command = String(command ? command : ''),
				command = this.str.escShellArg(command),
				args = (args instanceof Array ? args.map(this.str.escShellArg) : []).join(' ');

			return this.app.doShellScript('/usr/local/bin/ws ' + command + (args ? ' ' + args : ''));
		}
	};
	module.exports.require = eval(module.jxa.pkg('require'));
	module.exports.app = module.exports.require(module.jxa, 'utils/app')();
	module.exports.str = module.exports.require(module.jxa, 'utils/str');
})();