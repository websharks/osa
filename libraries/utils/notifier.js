(function()
{
	module.exports = // Package.
	{
		notify: function(title, message, args)
		{
			title = String(title ? title : ''),
				message = String(message ? message : '');

			if(!message) // No message?
				return; // Not applicable.

			var defaultArgs = {
				subtitle: undefined,
				sound   : 'default',
				sender  : undefined,
				group   : 'websharks-osa',
				open    : undefined, execute: undefined,
				appIcon : undefined, contentImage: this.fs.wsOSADir() + '/libraries/images/icon.icns'
			}, applicableArgs, shellArgs = '', arg;

			args = this.obj.extend({}, defaultArgs, args);

			applicableArgs = {'-title': title, '-message': '\\' + message};

			if(args.subtitle !== undefined)
				applicableArgs['-subtitle'] = String(args.subtitle);

			if(args.sound !== undefined)
				applicableArgs['-sound'] = String(args.sound);

			if(args.sender !== undefined)
				applicableArgs['-sender'] = String(args.sender);

			if(args.group !== undefined)
				applicableArgs['-group'] = String(args.group);

			if(args.open !== undefined)
				applicableArgs['-open'] = String(args.open);

			if(args.execute !== undefined)
				applicableArgs['-execute'] = String(args.execute);

			if(args.appIcon !== undefined)
				applicableArgs['-appIcon'] = String(args.appIcon);

			if(args.contentImage !== undefined)
				applicableArgs['-contentImage'] = String(args.contentImage);

			for(arg in applicableArgs) if(applicableArgs.hasOwnProperty(arg))
				shellArgs += ' ' + arg + ' ' + this.str.escShellArg(applicableArgs[arg]);

			this.app.doShellScript('/usr/local/bin/terminal-notifier' + shellArgs);
			// See: <https://github.com/alloy/terminal-notifier>
		}
	};
	module.exports.require = eval(module.jxa.pkg('require'));
	module.exports.app = module.exports.require(module.jxa, 'utils/app')();
	module.exports.obj = module.exports.require(module.jxa, 'utils/obj');
	module.exports.str = module.exports.require(module.jxa, 'utils/str');
	module.exports.fs = module.exports.require(module.jxa, 'utils/fs');
})();