var jxa = new (function()
{
	/* Package
	 -------------------------------------------------------------------- */

	this.pkg = function(pkg)
	{
		pkg = String(pkg ? pkg : '');
		pkg = this[pkg].toString();
		return '(' + pkg + ')';
	};

	/* Arguments Package
	 -------------------------------------------------------------------- */

	this.args = function(jxa)
	{
		this.get = function(slice)
		{
			if(typeof slice !== 'number')
				slice = 4; // Default slice.

			var nsArgs = $.NSProcessInfo.processInfo.arguments.js.slice(slice);

			for(var i = 0, args = []; i < nsArgs.length; i++)
			{
				if(/^(?:on|off|yes|no|true|false)$/i.test(nsArgs[i].js))
					args.push(/^(?:on|yes|true)$/i.test(nsArgs[i].js));
				else args.push(nsArgs[i].js);
			}
			return args;
		};
	};

	/* Require Package
	 -------------------------------------------------------------------- */

	this.require = function(jxa, path, sourceOnly)
	{
		if(typeof jxa !== 'function' && typeof jxa !== 'object')
			return null; // Not possible.

		path = String(path ? path : '');
		if(path.indexOf('source:') === 0)
			path = path.replace(/^source\:/, ''),
				sourceOnly = true;

		if(!path) // The path is empty now?
			return null; // Not possible.

		var homeDir = $('~').stringByExpandingTildeInPath.js,
			dir = homeDir + '/library/script libraries/websharks-osa/libraries',
			absPath = path.indexOf('/') === 0 ? path : dir + '/' + path + '.js',
			fileContents = $.NSFileManager.defaultManager.contentsAtPath(absPath),
			source = $.NSString.alloc.initWithDataEncoding(fileContents, $.NSUTF8StringEncoding).js,
			module = {jxa: jxa, parent: this, exports: {}};

		if(sourceOnly) // Return source only?
			return source; // Source code.

		eval(source); // Eval source code.

		return module.exports;
	};
})();