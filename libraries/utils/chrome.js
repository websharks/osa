(function()
{
	module.exports = // Package.
	{
		activeTab           : function()
		{
			return this.app && this.app.windows && this.app.windows.length
				? this.app.windows[0].activeTab : null;
		},
		activeTabURL        : function()
		{
			var activeTab = this.activeTab();
			var url = activeTab ? activeTab.url() : '';

			return url === 'chrome://newtab/' ? '' : url;
		},
		activeTabTitle      : function()
		{
			var activeTab = this.activeTab();
			var title = activeTab ? activeTab.title() : '';

			return title === 'New Tab' ? '' : title;
		},
		runScript           : function(scr)
		{
			if(typeof scr === 'function')
				scr = '(' + scr.toString() + ')();';
			scr = String(scr ? scr : ''); // Force string value.

			var activeTab = this.activeTab();

			return activeTab ? activeTab.execute({javascript: scr}) : '';
		},
		loadjQuery          : function()
		{
			if(this.jQueryLoaded)
				return; // Already did this.

			var jQuery = this.require(module.jxa, 'source:jquery'),
				jQuerify = 'if(!window.jQuery){' + jQuery + '; jQuery.noConflict(); }';

			return this.runScript(jQuerify);
		},
		selection           : function(args)
		{
			this.loadjQuery();

			var getSelection = function()
			{
				var $ = jQuery,
					selection = getSelection();

				if(!selection.rangeCount)
					return ''; // None.

				var $container = $('<div></div>'); // Holds selection.
				for(var i = 0, length = selection.rangeCount; i < length; i++)
					$container.append(selection.getRangeAt(i).cloneContents());
				return $container.html();
			};
			return this.str.toText(this.runScript(getSelection));
		},
		slackSelectionBy    : function(args)
		{
			this.loadjQuery();

			var getSlackSelectionBy = function()
			{
				var $ = jQuery,
					selection = getSelection();

				if(!selection.rangeCount)
					return ''; // None.

				var $winSelectionParent = $(selection.getRangeAt(0).endContainer),
					$winSelectionMessage = $winSelectionParent.closest('.message'),

					$winSelectionMessageShowUser = // The `.show_user` message.
						$winSelectionMessage.is('.show_user:not(.hidden)') ? $winSelectionMessage
							: $winSelectionMessage.prevAll('.message.show_user:not(.hidden)').first(),

					_memberService, teamMember, serviceName;

				if((_memberService = $winSelectionMessageShowUser.find('> a[data-member-id][href^="/team/"]').first().attr('href')))
					teamMember = _memberService.replace(/^\/team\//ig, '');

				else if((_memberService = $winSelectionMessageShowUser.find('> span.message_sender > a[href^="/services/"]').not(':has(img)').first().text())
				        || (_memberService = $winSelectionMessageShowUser.find('> span.message_sender').first().text()))
					serviceName = _memberService.replace(/\s+via\s.*$/ig, '');

				if(teamMember) // A team member?
					return '@' + teamMember; // Username.

				if(serviceName) // No `@` callout in this case.
					switch(serviceName) // Possible full name.
					{
						case 'Jason Caldwell':
							return '@jaswsinc';

						case 'Raam Dev':
							return '@raamdev';

						case 'Bruce Caldwell':
							return '@brucewsinc';

						case 'Elizabeth Caldwell':
							return '@elizwsinc';

						case 'Cristián Lávaque':
							return '@clavaque';

						case 'Eduán Lávaque':
							return '@greduan';

						case 'Israel Barrigan':
							return '@reedyseth';

						default: // e.g. `GitHub`.
							return serviceName;
					}
				return ''; // Default behavior.
			};
			return this.str.toText(this.runScript(getSlackSelectionBy));
		},
		setGitHubIssueLabels: function()
		{
			this.loadjQuery();

			var doSetGitHubIssueLabels = function()
			{
				var afterTimeout = function()
				{
					var $body = $('textarea#issue_body'),
						$labels = $('.sidebar-labels'),

						categoriesRegex = /^categories\:\s+(.+?)$/im,
						tagsRegex = /^tags\:\s+(.+?)$/im,

						categories, tags; // Initialize.

					if((categories = $body.val().match(categoriesRegex)))
						categories = categories[1].toLowerCase().split(/[\s,]+/);

					if((tags = $body.val().match(tagsRegex)))
						tags = tags[1].toLowerCase().split(/[\s,]+/);

					$labels.find('.js-menu-target').trigger('click'); // Open.

					var afterTimeout1 = function() // Event in sequence.
					{
						$labels.find('.color-label[data-name]').closest('.select-menu-item.selected')
							.trigger('click'); // Deselect any labels that exist already.

						setTimeout(afterTimeout2, 10); // Next in sequence.
					};
					var afterTimeout2 = function() // Event in sequence.
					{
						$labels.find('.color-label[data-name="draft"]').closest('.select-menu-item')
							.trigger('click'); // A `draft` label applies always.

						if(categories) $.each(categories, function(_, category)
						{
							if(!(category = $.trim(category)))
								return; // Not possible.

							var $item = $labels.find('.color-label[data-name="' + category + '"]').closest('.select-menu-item');
							if(!$item.length) $item = $labels.find('.color-label[data-name="' + category.replace(/\-+/g, ' ') + '"]').closest('.select-menu-item');
							if($item.length) $item.trigger('click');
						});
						setTimeout(afterTimeout3, 10); // Next in sequence.
					};
					var afterTimeout3 = function() // Event in sequence.
					{
						$labels.find('.js-menu-target').trigger('click'), // Close.
							$body.focus(); // Move focus back to body.
					};
					setTimeout(afterTimeout1, 500); // Begin event sequence.
				};
				setTimeout(afterTimeout, 1000); // Begin event sequence.
			};
			this.runScript(doSetGitHubIssueLabels);
		}
	};
	module.exports.require = eval(module.jxa.pkg('require'));
	module.exports.str = module.exports.require(module.jxa, 'utils/str');
	if(!(module.exports.app = module.exports.require(module.jxa, 'utils/app')('com.google.Chrome')))
		module.exports.app = module.exports.require(module.jxa, 'utils/app')('com.google.Chrome.canary');
	module.exports.jQueryLoaded = false; // Initialize.
})();