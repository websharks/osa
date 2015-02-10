(function()
{
	module.exports = // Package.
	{
		eval     : function(code)
		{
			code = this.str.escShellArg(String(code ? code : ''));
			return this.app.doShellScript('/usr/bin/env php -r ' + code);
		},
		runScript: function(script, args)
		{
			script = String(script ? script : '').replace(/\.{2,}/g, ''),
				script = this.str.escShellArg(this.fs.wsOSADir() + '/scripts/php/' + script + '.php'),
				args = (args instanceof Array ? args.map(this.str.escShellArg) : []).join(' ');

			return this.app.doShellScript(script + (args ? ' ' + args : ''));
		}
	};
	module.exports.require = eval(module.jxa.pkg('require'));
	module.exports.app = module.exports.require(module.jxa, 'utils/app')();
	module.exports.str = module.exports.require(module.jxa, 'utils/str');
	module.exports.fs = module.exports.require(module.jxa, 'utils/fs');
})();