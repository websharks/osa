#!/usr/bin/env php
<?php
namespace websharks_osa
{
	require_once 'abs-base.php';

	class command_line_response extends abs_base
	{
		public function __construct()
		{
			parent::__construct();

			exit(call_user_func_array(array($this, '_timezones'), $this->args));
		}

		protected function _timezones($time, $zone = '')
		{
			$timezones = ''; // Initialize.

			$time = trim((string)$time);
			if($time && strpos($time, ';') !== FALSE)
				list($time, $zone) = array_map('trim', explode(';', $time, 2));
			$zone = trim((string)$zone); // Force string.

			if(!$time || !$zone)
				return ''; // Not possible.

			$zone_abbrs = array(
				'ET'  => 'America/New_York',
				'CT'  => 'America/Chicago',
				'MT'  => 'America/Denver',
				'PT'  => 'America/Los_Angeles',
				'AT'  => 'America/Anchorage',
				'UTC' => 'UTC', // GMT.
			);
			if(isset($zone_abbrs[strtoupper($zone)]))
				$zone = $zone_abbrs[strtoupper($zone)];

			$date = new \DateTime($time, new \DateTimeZone($zone));

			foreach($zone_abbrs as $_zone_abbr => $_zone)
			{
				$date->setTimezone(new \DateTimeZone($_zone));
				$timezones .= $date->format('D M d, Y g:ia').' '.$date->format('e').
				              ' ('.($_zone_abbr === 'UTC' ? 'Coordinated Universal Time' : $_zone_abbr).')'."\n";
			}
			unset($_zone_abbr, $_zone); // Housekeeping.

			return $timezones;
		}
	}

	new command_line_response();
}