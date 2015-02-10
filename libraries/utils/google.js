(function()
{
	module.exports = // Package.
	{
		cse: function(q, markdown, prefix, num, prompt)
		{
			q = String(q ? q : ''),
				markdown = markdown === undefined ? true : markdown,
				prefix = this.str.trim(String(prefix === undefined ? '-' : prefix)),
				prefix += prefix ? ' ' : '', // Adding a trailing space.
				num = Number(num && num > 0 ? num : 10);

			if(!q) return ''; // Not possible.

			var results = this.php.runScript('google-cse', [q, num]);
			results = results ? JSON.parse(results) : [];

			for(var i = 0, choices = []; i < results.length; i++)
				if(markdown) // If using Markdown, format with: [title](link).
					choices.push(prefix + '[' + results[i].title + '](' + results[i].link + ')');
				else choices.push(prefix + results[i].title + ' ' + results[i].link);

			if(choices.length === 1) return choices[0]; // One choice only.

			if(prompt) choices = this.app.chooseFromList(
				choices, {
					multipleSelectionsAllowed: true,
					withTitle                : 'Search Result(s)',
					withPrompt               : 'Select one (or more) URLs:'
				});
			return choices && choices.length ? choices.join('\n') : ''; // One choice per line.
		}
	};
	module.exports.require = eval(module.jxa.pkg('require'));
	module.exports.app = module.exports.require(module.jxa, 'utils/app')();
	module.exports.str = module.exports.require(module.jxa, 'utils/str');
	module.exports.php = module.exports.require(module.jxa, 'utils/php');
})();