(function()
{
	module.exports = // Package.
	{
		trim                : function(str)
		{
			str = String(str ? str : '');

			return str.replace(/(?:^\s+|\s+$)/g, '');
		},
		escSq               : function(str)
		{
			str = String(str ? str : '');

			return str.replace(/'/g, "\\'");
		},
		escShellArg         : function(str)
		{
			str = String(str ? str : '');

			str = str.replace(/\\?'/g, '\'"$&"\'');

			if(str.indexOf("'") !== 0)
				str = "'" + str;

			if(str.substr(-1) !== "'" || str.length === 1)
				str += "'";

			return str;
		},
		isHTML              : function(str)
		{
			str = String(str ? str : '');

			return str.indexOf('<') !== -1 && /\<[^<>]+\>/.test(str);
		},
		toText              : function(str)
		{
			str = String(str ? str : '');

			var blockTags = [
				'address',
				'article',
				'aside',
				'audio',
				'blockquote',
				'canvas',
				'dd',
				'div',
				'dl',
				'fieldset',
				'figcaption',
				'figure',
				'footer',
				'form',
				'h1',
				'h2',
				'h3',
				'h4',
				'h5',
				'h6',
				'header',
				'hgroup',
				'hr',
				'noscript',
				'ol',
				'output',
				'p',
				'pre',
				'section',
				'table',
				'tfoot',
				'ul',
				'video'
			];
			if(this.isHTML(str))
				str = str.replace(/(\<[^<>]+\>)\s+(\<[^<>]+\>)/g, '$1 $2').
					replace(new RegExp('\\</(?:br|' + blockTags.join('|') + ')\\>', 'gi'), '\n$&\n').
					replace(new RegExp('\\<(?:br|' + blockTags.join('|') + ')(?:/\\s*\\>|\\s[^/>]*/\\s*\\>)', 'gi'), '\n$&\n').
					replace(/\<[^<>]+\>/g, ''); // And now we strip all tags.

			str = this.htmlEntityDecode(str);
			str = str.replace(/(?:\r\n|\r)/g, '\n').
				// See: <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp>
				replace(/[ \f\r\t\v​\u00a0\u1680​\u180e\u2000​\u2001\u2002​\u2003\u2004\u2005\u2006​\u2007\u2008​\u2009\u200a​\u2028\u2029​\u202f\u205f​\u3000]*(\n+)[ \f\r\t\v​\u00a0\u1680​\u180e\u2000​\u2001\u2002​\u2003\u2004\u2005\u2006​\u2007\u2008​\u2009\u200a​\u2028\u2029​\u202f\u205f​\u3000]*/, '$1').
				replace(/\n{2,}/, '\n\n');

			return this.trim(str);
		},
		htmlEntityDecode    : function(str, quoteStyle)
		{
			str = String(str ? str : ''), // Force strings.
				quoteStyle = quoteStyle ? String(quoteStyle) : 'ENT_QUOTES';

			var hashMap = this.htmlTranslationTable('HTML_ENTITIES', quoteStyle),
				symbol = '', entity = ''; // Initialize.

			for(symbol in hashMap) // Named entities.
			{
				if(!hashMap.hasOwnProperty(symbol))
					continue; // Bypass.

				entity = hashMap[symbol];
				str = str.split(entity).join(symbol);
			}
			str = str.split('&#039;').join("'");

			return str.replace(/&#\d+;/gm, function(entity)
			{
				return String.fromCharCode(entity.match(/\d+/gm)[0]);
			});
		},
		htmlTranslationTable: function(table, quoteStyle)
		{
			var entities = {}, hashMap = {}, decimal;

			table = table ? String(table).toUpperCase() : 'HTML_SPECIALCHARS',
				quoteStyle = String(quoteStyle) ? quoteStyle.toUpperCase() : 'ENT_COMPAT';

			if(table !== 'HTML_SPECIALCHARS' && table !== 'HTML_ENTITIES')
				throw 'Table: ' + table + ' not supported!';

			if(quoteStyle !== 'ENT_QUOTES' && quoteStyle !== 'ENT_NOQUOTES' && quoteStyle !== 'ENT_COMPAT')
				throw 'Quote style: ' + quoteStyle + ' not supported!';

			entities['38'] = '&amp;', // Enabled always.
				entities['60'] = '&lt;',
				entities['62'] = '&gt;';

			if(quoteStyle === 'ENT_QUOTES')
				entities['39'] = '&#39;';

			if(quoteStyle !== 'ENT_NOQUOTES')
				entities['34'] = '&quot;';

			if(table === 'HTML_ENTITIES')
			{
				entities['160'] = '&nbsp;';
				entities['161'] = '&iexcl;';
				entities['162'] = '&cent;';
				entities['163'] = '&pound;';
				entities['164'] = '&curren;';
				entities['165'] = '&yen;';
				entities['166'] = '&brvbar;';
				entities['167'] = '&sect;';
				entities['168'] = '&uml;';
				entities['169'] = '&copy;';
				entities['170'] = '&ordf;';
				entities['171'] = '&laquo;';
				entities['172'] = '&not;';
				entities['173'] = '&shy;';
				entities['174'] = '&reg;';
				entities['175'] = '&macr;';
				entities['176'] = '&deg;';
				entities['177'] = '&plusmn;';
				entities['178'] = '&sup2;';
				entities['179'] = '&sup3;';
				entities['180'] = '&acute;';
				entities['181'] = '&micro;';
				entities['182'] = '&para;';
				entities['183'] = '&middot;';
				entities['184'] = '&cedil;';
				entities['185'] = '&sup1;';
				entities['186'] = '&ordm;';
				entities['187'] = '&raquo;';
				entities['188'] = '&frac14;';
				entities['189'] = '&frac12;';
				entities['190'] = '&frac34;';
				entities['191'] = '&iquest;';
				entities['192'] = '&Agrave;';
				entities['193'] = '&Aacute;';
				entities['194'] = '&Acirc;';
				entities['195'] = '&Atilde;';
				entities['196'] = '&Auml;';
				entities['197'] = '&Aring;';
				entities['198'] = '&AElig;';
				entities['199'] = '&Ccedil;';
				entities['200'] = '&Egrave;';
				entities['201'] = '&Eacute;';
				entities['202'] = '&Ecirc;';
				entities['203'] = '&Euml;';
				entities['204'] = '&Igrave;';
				entities['205'] = '&Iacute;';
				entities['206'] = '&Icirc;';
				entities['207'] = '&Iuml;';
				entities['208'] = '&ETH;';
				entities['209'] = '&Ntilde;';
				entities['210'] = '&Ograve;';
				entities['211'] = '&Oacute;';
				entities['212'] = '&Ocirc;';
				entities['213'] = '&Otilde;';
				entities['214'] = '&Ouml;';
				entities['215'] = '&times;';
				entities['216'] = '&Oslash;';
				entities['217'] = '&Ugrave;';
				entities['218'] = '&Uacute;';
				entities['219'] = '&Ucirc;';
				entities['220'] = '&Uuml;';
				entities['221'] = '&Yacute;';
				entities['222'] = '&THORN;';
				entities['223'] = '&szlig;';
				entities['224'] = '&agrave;';
				entities['225'] = '&aacute;';
				entities['226'] = '&acirc;';
				entities['227'] = '&atilde;';
				entities['228'] = '&auml;';
				entities['229'] = '&aring;';
				entities['230'] = '&aelig;';
				entities['231'] = '&ccedil;';
				entities['232'] = '&egrave;';
				entities['233'] = '&eacute;';
				entities['234'] = '&ecirc;';
				entities['235'] = '&euml;';
				entities['236'] = '&igrave;';
				entities['237'] = '&iacute;';
				entities['238'] = '&icirc;';
				entities['239'] = '&iuml;';
				entities['240'] = '&eth;';
				entities['241'] = '&ntilde;';
				entities['242'] = '&ograve;';
				entities['243'] = '&oacute;';
				entities['244'] = '&ocirc;';
				entities['245'] = '&otilde;';
				entities['246'] = '&ouml;';
				entities['247'] = '&divide;';
				entities['248'] = '&oslash;';
				entities['249'] = '&ugrave;';
				entities['250'] = '&uacute;';
				entities['251'] = '&ucirc;';
				entities['252'] = '&uuml;';
				entities['253'] = '&yacute;';
				entities['254'] = '&thorn;';
				entities['255'] = '&yuml;';
			}
			for(decimal in entities)
				if(entities.hasOwnProperty(decimal))
					hashMap[String.fromCharCode(decimal)] = entities[decimal];
			return hashMap;
		}
	};
})();