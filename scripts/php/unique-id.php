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

			exit($this->unique_id());
		}
	}

	new command_line_response();
}