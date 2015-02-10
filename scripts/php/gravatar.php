#!/usr/bin/env php
<?php
namespace websharks_osa
{
	require_once dirname(__FILE__).'/abs-base.php';

	class command_line_response extends abs_base
	{
		public function __construct()
		{
			parent::__construct();

			exit(call_user_func_array(array($this, '_link'), $this->args));
		}

		protected function _link($email, $size = 512)
		{
			$email = trim(strtolower((string)$email));
			$size  = max(16, (integer)$size); // 16-pixel minimum.

			return 'https://www.gravatar.com/avatar/'.urlencode(md5($email)).'.jpg?s='.urlencode($size);
		}
	}

	new command_line_response();
}