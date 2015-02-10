<?php
namespace websharks_osa
{
	class config
	{
		/*
		 * Properties.
		 */

		public $home_dir = '';
		public $username = '';

		public $idonethis_api_key = '';
		public $idonethis_api_team = 'websharks';
		public $idonethis_api_endpoint = 'https://idonethis.com/api/v0.1';

		/*
		 * Constructor.
		 */

		public function __construct()
		{
			$this->home_dir = $this->n_dir_seps($_SERVER['HOME']);

			if(is_file($_ws = $this->home_dir.'/.ws.json') || is_file($_ws = $this->home_dir.'/.cmdr.json'))
				if(is_object($_ws = json_decode(file_get_contents($_ws))))
				{
					foreach($_ws as $_prop => $_value) switch($_prop)
					{
						case 'username':
						case 'user_name':
							$this->username = $_value;
							break; // Break switch handler.

						case 'idonethis_api_key':
							$this->idonethis_api_key = $_value;
							break; // Break switch handler.
					}
				}
			unset($_ws, $_prop, $_value); // Housekeeping.
		}

		/*
		 * Filesystem utilities.
		 */

		protected function n_dir_seps($dir_file, $allow_trailing_slash = FALSE)
		{
			$dir_file = (string)$dir_file; // Force string value.
			if(!isset($dir_file[0])) return ''; // Catch empty string.

			if(strpos($dir_file, '://' !== FALSE))  // A possible stream wrapper?
			{
				if(preg_match('/^(?P<stream_wrapper>[a-zA-Z0-9]+)\:\/\//', $dir_file, $stream_wrapper))
					$dir_file = preg_replace('/^(?P<stream_wrapper>[a-zA-Z0-9]+)\:\/\//', '', $dir_file);
			}
			if(strpos($dir_file, ':' !== FALSE))  // Might have a Windows® drive letter?
			{
				if(preg_match('/^(?P<drive_letter>[a-zA-Z])\:[\/\\\\]/', $dir_file)) // It has a Windows® drive letter?
					$dir_file = preg_replace_callback('/^(?P<drive_letter>[a-zA-Z])\:[\/\\\\]/', create_function('$m', 'return strtoupper($m[0]);'), $dir_file);
			}
			$dir_file = preg_replace('/\/+/', '/', str_replace(array(DIRECTORY_SEPARATOR, '\\', '/'), '/', $dir_file));
			$dir_file = ($allow_trailing_slash) ? $dir_file : rtrim($dir_file, '/'); // Strip trailing slashes.

			if(!empty($stream_wrapper[0])) // Stream wrapper (force lowercase).
				$dir_file = strtolower($stream_wrapper[0]).$dir_file;

			return $dir_file; // Normalized now.
		}
	}
}