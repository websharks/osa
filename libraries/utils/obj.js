(function()
{
	module.exports = // Package.
	{
		extend: function()
		{
			var args = Array.prototype.slice.call(arguments),
				target = args.shift(), i, prop;

			if(typeof target !== 'object' && typeof target !== 'function')
				return null; // Not possible.

			for(i = 0; i < args.length; i++)
				for(prop in args[i])
				{
					if(!args[i].hasOwnProperty(prop))
						continue; // Not applicable.

					if(typeof args[i] !== 'object')
						continue; // Not applicable.

					if(typeof args[i][prop] === 'undefined')
						continue; // Not applicable.

					if(args[i][prop] === undefined)
						continue; // Not applicable.

					if(target[prop] === args[i][prop])
						continue; // The same.

					target[prop] = args[i][prop];
				}
			return target;
		}
	};
})();