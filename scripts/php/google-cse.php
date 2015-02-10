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

			exit(call_user_func_array(array($this, '_results'), $this->args));
		}

		protected function _results($q, $num = 10)
		{
			if(!($q = trim((string)$q)))
				return ''; // Not possible.

			if(($num = (integer)$num) < 1)
				return ''; // Not possible.

			$query_vars = array(
				'cx'     => $this->config->google_cse_id,
				'key'    => $this->config->google_cse_api_key,
				'fields' => 'items',
				'num'    => 10,
				'q'      => $q,
			);
			$headers    = array(
				'Accept-Encoding: gzip',
				'User-Agent: '.__METHOD__.' (gzip)',
			);
			$endpoint   = $this->config->google_cse_api_endpoint;
			$endpoint   = $this->add_query_args($query_vars, $endpoint);

			$cache_file = $this->get_tmp_dir().'/google-cse-'.sha1(serialize($query_vars));

			if(is_file($cache_file) && filemtime($cache_file) > strtotime('-24 hours'))
				return json_encode(array_slice(json_decode(file_get_contents($cache_file)), 0, $num));

			if(!is_object($response = json_decode($this->curl('GET::'.$endpoint, '', compact('headers')))))
				goto cache_results; // Not possible.

			if(empty($response->items) || !is_array($response->items))
				goto cache_results; // Not possible.

			cache_results: // Target point; finale.

			if(empty($response) || !is_object($response)
			   || empty($response->items) || !is_array($response->items)
			) $response = (object)array('items' => array());

			$results      = $response->items;
			$json_results = json_encode($results);

			if(!empty($cache_file)) // Cache results?
				file_put_contents($cache_file, $json_results);

			return json_encode(array_slice($results, 0, $num));
		}
	}

	new command_line_response();
}