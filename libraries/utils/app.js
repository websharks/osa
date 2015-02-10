(function()
{
	ObjC.import('stdlib'),
		ObjC.import('AppKit');

	module.exports = function(bundleIdentifier, args)
	{
		var app; // Initialize.

		if(bundleIdentifier === undefined)
		{
			app = Application.currentApplication(),
				app.includeStandardAdditions = true;
			return app; // App reference.
		}
		if(!(bundleIdentifier = String(bundleIdentifier ? bundleIdentifier : '')))
			return null; // Not possible; no bundle identifier.

		args = typeof args === 'object' ? args : {};

		if(args.launch === undefined)
			args.launch = false;

		if(args.launchArgs === undefined)
			args.launchArgs = $.NSWorkspaceLaunchDefault;

		if(args.launchDescriptor === undefined)
			args.launchDescriptor = $.NSAppleEventDescriptor.nullDescriptor;

		for(var i = 0, runningApps = $.NSWorkspace.sharedWorkspace.runningApplications.js; i < runningApps.length; i++)
			if(typeof runningApps[i].bundleIdentifier === 'function') // Just to be sure.
				if(runningApps[i].bundleIdentifier.js === bundleIdentifier)
				{
					app = Application(bundleIdentifier),
						app.includeStandardAdditions = true;
					return app; // App reference.
				}
		if(args.launch) // If not running, should it be launched?
		{
			$.NSWorkspace.sharedWorkspace.launchAppWithBundleIdentifierOptionsAdditionalEventParamDescriptorLaunchIdentifier(
				bundleIdentifier, args.launchArgs, args.launchDescriptor, null
			);
			args.launch = false; // Don't make another attempt to launch.

			return this.get(bundleIdentifier, args);
		}
		return null; // Not running.
	};
})();