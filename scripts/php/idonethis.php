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

			if(!$this->config->username || !$this->config->idonethis_api_key)
				exit('Please install the WebSharks Commander and run `ws-install`.');

			exit(call_user_func_array(array($this, '_entry'), $this->args));
		}

		// @TODO Use the WS Commander once it catches up.

		protected function _entry($entry, $type = 'done')
		{
			if(!($entry = trim((string)$entry)))
				return ''; // Not possible.

			$type = $type === 'todo' ? 'todo' : 'done';

			$entry = $type === 'todo' ? '[ ] '.$entry : $entry;
			if($type === 'todo' && stripos($entry, '#'.$this->config->username) === FALSE)
				$entry .= ' #'.$this->config->username; // Force user tag.

			$headers   = array(
				'Authorization: Token '.$this->config->idonethis_api_key,
				'Content-Type: application/json',
				'Accept: application/json',
			);
			$post_vars = array(
				'raw_text'  => $entry,
				'team'      => $this->config->idonethis_api_team,
				'meta_data' => json_encode(array(
					                           'via' => str_replace('_', '-', __NAMESPACE__)
				                           ))
			);
			$endpoint  = $this->config->idonethis_api_endpoint.'/dones/';

			if(!is_object($http_response = json_decode($this->curl('POST::'.$endpoint, json_encode($post_vars), compact('headers'))))
			   || empty($http_response->ok) || $http_response->ok !== TRUE || empty($http_response->result->permalink)
			) throw new \exception('Unable to create '.strtoupper($type).' item. Got: '.print_r($http_response, TRUE));

			return $http_response->result->permalink;
		}
	}

	new command_line_response();
}