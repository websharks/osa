(function()
{
	module.exports = // Package.
	{
		keyGen: function(limit, mixedCase, numbers, symbols, extraSymbols)
		{
			limit = Number(limit);
			if(isNaN(limit) || limit <= 0)
				limit = 15; // Default limit.

			if(mixedCase === undefined)
				mixedCase = true;

			if(numbers === undefined)
				numbers = true;

			if(symbols === undefined)
				symbols = true;

			var // Vowels get mixed by default however.
				vowels = ('aeiou' +
				          (mixedCase ? 'AEIOU' : '') +
				          (numbers ? '0123456789' : '') +
				          (symbols ? '!@#$%?&' : '') +
				          (extraSymbols ? '{}[]()<>/~+:.' : '')).split(''),

				consonants = ('bcdfghjklmnpqrstvwxyz' +
				              (mixedCase ? 'BCDFGHJKLMNPQRSTVWXYZ' : '')).split('');

			for(var password = '', i = 0; i < limit; i++)
				if(i % 2 === 0) // Even = vowels.
					password += vowels[Math.floor(Math.random() * (vowels.length - 1))];
				else password += consonants[Math.floor(Math.random() * (consonants.length - 1))];

			return password;
		}
	};
})();