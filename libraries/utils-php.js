(function()
{
	module.exports = // Package.
	{
		eval: function(code)
		{
			code = this.str.escShellArg(String(code ? code : ''));
			return this.app.doShellScript('/usr/bin/env php -r ' + code);
		}
	};
	module.exports.require = eval(module.jxa.pkg('require'));
	module.exports.app = module.exports.require(module.jxa, 'utils-app')();
	module.exports.str = module.exports.require(module.jxa, 'utils-str');
})();