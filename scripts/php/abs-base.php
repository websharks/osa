<?php
namespace websharks_osa
{
	require_once dirname(__FILE__).'/config.php';
	require_once dirname(dirname(dirname(__FILE__))).'/submodules/http-build-url/src/http_build_url.php';

	abstract class abs_base
	{
		/*
		 * Properties.
		 */

		protected $config;
		protected $args;

		/*
		 * Constructor.
		 */

		public function __construct()
		{
			global $argv; // CLI args.

			$this->config = new config();
			$this->args   = array_slice($argv, 1);

			date_default_timezone_set('UTC');
		}

		/*
		 * Remote connection utilities.
		 */

		protected function curl($url, $body = '', array $args = array())
		{
			$default_args = array(
				'connection_timeout' => 20,
				'stream_timeout'     => 20,
				'headers'            => array(),
				'cookie_file'        => '',
				'fail_on_error'      => TRUE,
				'return_array'       => FALSE,
			);
			$args         = array_merge($default_args, $args);
			$args         = array_intersect_key($args, $default_args);

			$custom_request_method = ''; // Initialize.
			$url                   = trim((string)$url);
			$body                  = is_array($body) ? http_build_query($body, '', '&') : trim((string)$body);

			$connection_timeout = (integer)$args['connection_timeout'];
			$stream_timeout     = (integer)$args['stream_timeout'];
			$headers            = (array)$args['headers'];
			$cookie_file        = trim((string)$args['cookie_file']);
			$fail_on_error      = (boolean)$args['fail_on_error'];
			$return_array       = (boolean)$args['return_array'];

			$custom_request_regex = // e.g.`PUT::http://www.example.com/`
				'/^(?P<custom_request_method>(?:GET|POST|PUT|DELETE))\:{2}(?P<url>.+)/i';
			if(preg_match($custom_request_regex, $url, $_url_parts))
			{
				$url                   = $_url_parts['url']; // URL after `::`.
				$custom_request_method = strtoupper($_url_parts['custom_request_method']);
			}
			unset($_url_parts); // Housekeeping.

			if(!$url) return ''; // Nothing to do here.

			$can_follow = !filter_var(ini_get('safe_mode'), FILTER_VALIDATE_BOOLEAN) && !ini_get('open_basedir');

			foreach($headers as $_header)
				if(stripos($_header, 'User-Agent:') === 0)
					$has_user_agent = TRUE;
			unset($_header);

			if(empty($has_user_agent))
				$headers[] = 'User-Agent: '.__METHOD__;

			$curl_opts = array(
				CURLOPT_URL            => $url,
				CURLOPT_HTTPHEADER     => $headers,
				CURLOPT_CONNECTTIMEOUT => $connection_timeout,
				CURLOPT_TIMEOUT        => $stream_timeout,

				CURLOPT_RETURNTRANSFER => TRUE,
				CURLOPT_HEADER         => FALSE,

				CURLOPT_FOLLOWLOCATION => $can_follow,
				CURLOPT_MAXREDIRS      => $can_follow ? 5 : 0,

				CURLOPT_ENCODING       => '',
				CURLOPT_VERBOSE        => FALSE,
				CURLOPT_FAILONERROR    => $fail_on_error,
				CURLOPT_SSL_VERIFYPEER => FALSE,
			);
			if($body) // Has a request body that we need to send?
			{
				if($custom_request_method) // A custom request method is given?
					$curl_opts += array(CURLOPT_CUSTOMREQUEST => $custom_request_method, CURLOPT_POSTFIELDS => $body);
				else $curl_opts += array(CURLOPT_POST => TRUE, CURLOPT_POSTFIELDS => $body);
			}
			else if($custom_request_method) $curl_opts += array(CURLOPT_CUSTOMREQUEST => $custom_request_method);

			if($cookie_file) // Support cookies? e.g. we have a cookie jar available?
				$curl_opts += array(CURLOPT_COOKIEJAR => $cookie_file, CURLOPT_COOKIEFILE => $cookie_file);

			$curl = curl_init();
			curl_setopt_array($curl, $curl_opts);
			$output    = trim((string)curl_exec($curl));
			$http_code = curl_getinfo($curl, CURLINFO_HTTP_CODE);
			curl_close($curl);

			if($fail_on_error && $http_code >= 400)
				$output = ''; // Empty this.

			return $return_array ? array('code' => $http_code, 'body' => $output) : $output;
		}

		protected function add_query_args(array $args, $url)
		{
			$url   = trim((string)$url);
			$parts = array('query' => http_build_query($args, '', '&'));

			return http_build_url($url, $parts, HTTP_URL_JOIN_QUERY);
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

		protected function dir_regex_iteration($dir, $regex)
		{
			if(!($dir = (string)$dir) || !($regex = (string)$regex))
				throw new \exception('Missing required `$dir` and/or `$regex` parameters.');

			$dir_iterator      = new \RecursiveDirectoryIterator($dir, \FilesystemIterator::KEY_AS_PATHNAME | \FilesystemIterator::CURRENT_AS_SELF | \FilesystemIterator::SKIP_DOTS | \FilesystemIterator::UNIX_PATHS);
			$iterator_iterator = new \RecursiveIteratorIterator($dir_iterator, \RecursiveIteratorIterator::CHILD_FIRST);
			$regex_iterator    = new \RegexIterator($iterator_iterator, $regex, \RegexIterator::MATCH, \RegexIterator::USE_KEY);

			return $regex_iterator;
		}

		protected function get_tmp_dir()
		{
			if(!($temp_dir = $this->n_dir_seps(sys_get_temp_dir())))
				throw new \exception('Unable to locate a writable tmp directory.');

			if(!is_readable($temp_dir) || !is_writable($temp_dir))
				throw new \exception('Unable to locate a readable/writable tmp directory.');

			if(!is_dir($temp_dir .= '/'.str_replace('_', '-', __NAMESPACE__)) && !mkdir($temp_dir))
				throw new \exception('Unable to create tmp directory.');

			return $temp_dir;
		}

		/*
		 * Array utilities.
		 */

		protected function ksort_deep(array $array, $flags = SORT_REGULAR)
		{
			ksort($array, $flags);

			foreach($array as &$value)
				if(is_array($value) /* Recursion. */)
					$value = $this->ksort_deep($value, $flags);

			return $array;
		}

		/*
		 * String utilities.
		 */

		protected function mid_clip($string, $max_length = 60)
		{
			if(!($string = (string)$string))
				return $string; // Empty.

			$max_length = ($max_length < 5) ? 5 : $max_length;

			$string = trim(preg_replace('/\s+/', ' ', $string));

			if(strlen($string) <= $max_length)
				goto finale; // Nothing to do.

			$full_string     = $string;
			$half_max_length = floor($max_length / 2);

			$first_clip = $half_max_length - 5;
			$string     = ($first_clip >= 1) // Something?
				? substr($full_string, 0, $first_clip).' ... '
				: ' ... '; // Ellipsis only.

			$second_clip = strlen($full_string) - ($max_length - strlen($string));
			$string .= ($second_clip >= 0 && $second_clip >= $first_clip)
				? substr($full_string, $second_clip) : ''; // Nothing more.

			finale: // Target point; all done.

			return $string;
		}

		protected function keygen($limit = 15, $mixed_case = TRUE, $numbers = TRUE, $symbols = TRUE, $extra_symbols = FALSE)
		{
			if(($limit = (integer)$limit) < 1)
				$limit = 15; // Default value.

			$vowels           = str_split(
				'aeiou'.
				($mixed_case ? 'AEIOU' : '').
				($numbers ? '0123456789' : '').
				($symbols ? '!@#$%?&' : '').
				($extra_symbols ? '{}[]()<>/~+:.' : '')
			);
			$consonants       = str_split(
				'bcdfghjklmnpqrstvwxyz'.
				($mixed_case ? 'BCDFGHJKLMNPQRSTVWXYZ' : '')
			);
			$total_vowels     = count($vowels); // Totals.
			$total_consonants = count($consonants);

			for($key = '', $_i = 0; $_i < $limit; $_i++)
			{
				if($_i % 2 === 0) // Even = vowels.
					$key .= $vowels[mt_rand(0, $total_vowels - 1)];
				else $key .= $consonants[mt_rand(0, $total_consonants - 1)];
			}
			unset($_i); // Housekeeping.

			return $key;
		}

		protected function unique_id()
		{
			$microtime_19_max = number_format(microtime(TRUE), 9, '.', '');
			// e.g. `9999999999`.`999999999` (max decimals: `9`, max overall precision: `19`).
			// Assuming timestamp is never > 10 digits; i.e. before `Sat, 20 Nov 2286 17:46:39 GMT`.

			list($seconds_10_max, $microseconds_9_max) = explode('.', $microtime_19_max, 2);
			// e.g. `array(`9999999999`, `999999999`)`. Max total digits combined: `19`.

			$seconds_base36      = base_convert($seconds_10_max, '10', '36'); // e.g. max `9999999999`, to base 36.
			$microseconds_base36 = base_convert($microseconds_9_max, '10', '36'); // e.g. max `999999999`, to base 36.
			$mt_rand_base36      = base_convert(mt_rand(1, 999999999), '10', '36'); // e.g. max `999999999`, to base 36.
			$key                 = 'k'.$mt_rand_base36.$seconds_base36.$microseconds_base36; // e.g. `kgjdgxr4ldqpdrgjdgxr`.

			return $key; // Max possible value: `kgjdgxr4ldqpdrgjdgxr` (20 chars).
		}

		protected function encrypt($string, $key = '', $w_md5_cs = TRUE)
		{
			$string = (string)$string;

			if(!($key = trim((string)$key)))
				$key = ''; //

			if(!isset($string[0])) // Nothing to encrypt?
				return ($base64 = ''); // Nothing to do.

			$string = '~r2|'.$string; // A short `rijndael-256` identifier.
			$key    = (string)substr($key, 0, mcrypt_get_key_size(MCRYPT_RIJNDAEL_256, MCRYPT_MODE_CBC));
			$iv     = $this->keygen(mcrypt_get_iv_size(MCRYPT_RIJNDAEL_256, MCRYPT_MODE_CBC), TRUE, TRUE, FALSE, FALSE);

			if(!is_string($e = mcrypt_encrypt(MCRYPT_RIJNDAEL_256, $key, $string, MCRYPT_MODE_CBC, $iv)) || !isset($e[0]))
				throw new \exception('String encryption failed; `$e` is NOT string; or it has no length.');

			$e = '~r2:'.$iv.($w_md5_cs ? ':'.md5($e) : '').'|'.$e; // Pack components.

			return ($base64 = $this->base64_url_safe_encode($e));
		}

		protected function decrypt($base64, $key = '')
		{
			$base64 = (string)$base64;

			if(!($key = trim((string)$key)))
				$key = $_SERVER['SHAX_SIG_KEY'];

			if(!isset($base64[0])) // Nothing to decrypt?
				return ($string = ''); // Nothing to do.

			if(!strlen($e = $this->base64_url_safe_decode($base64))
			   || !preg_match('/^~r2\:(?P<iv>[a-zA-Z0-9]+)(?:\:(?P<md5>[a-zA-Z0-9]+))?\|(?P<e>.*)$/s', $e, $iv_md5_e)
			) return ($string = ''); // Not possible; unable to decrypt in this case.

			if(!isset($iv_md5_e['iv'][0], $iv_md5_e['e'][0]))
				return ($string = ''); // Components missing.

			if(isset($iv_md5_e['md5'][0]) && $iv_md5_e['md5'] !== md5($iv_md5_e['e']))
				return ($string = ''); // Invalid checksum; automatic failure.

			$key = (string)substr($key, 0, mcrypt_get_key_size(MCRYPT_RIJNDAEL_256, MCRYPT_MODE_CBC));

			if(!is_string($string = mcrypt_decrypt(MCRYPT_RIJNDAEL_256, $key, $iv_md5_e['e'], MCRYPT_MODE_CBC, $iv_md5_e['iv'])) || !isset($string[0]))
				throw new \exception('String decryption failed; `$string` is NOT a string, or it has no length.');

			if(!strlen($string = preg_replace('/^~r2\|/', '', $string, 1, $r2)) || !$r2)
				return ($string = ''); // Missing packed components.

			return ($string = rtrim($string, "\0\4")); // See: <http://www.asciitable.com/>.
		}

		protected function base64_url_safe_encode($string, array $url_unsafe_chars = array('+', '/'), array $url_safe_chars = array('-', '_'), $trim_padding_chars = '=')
		{
			$string             = (string)$string;
			$trim_padding_chars = (string)$trim_padding_chars;

			if(!is_string($base64_url_safe = base64_encode($string)))
				throw new \exception('Base64 encoding failed (`$base64_url_safe` is NOT a string).');

			$base64_url_safe = str_replace($url_unsafe_chars, $url_safe_chars, $base64_url_safe);
			$base64_url_safe = isset($trim_padding_chars[0]) ? rtrim($base64_url_safe, $trim_padding_chars) : $base64_url_safe;

			return $base64_url_safe;
		}

		protected function base64_url_safe_decode($base64_url_safe, array $url_unsafe_chars = array('+', '/'), array $url_safe_chars = array('-', '_'), $trim_padding_chars = '=')
		{
			$base64_url_safe    = (string)$base64_url_safe;
			$trim_padding_chars = (string)$trim_padding_chars;

			$string = isset($trim_padding_chars[0]) ? rtrim($base64_url_safe, $trim_padding_chars) : $base64_url_safe;
			$string = isset($trim_padding_chars[0]) ? str_pad($string, strlen($string) % 4, '=', STR_PAD_RIGHT) : $string;
			$string = str_replace($url_safe_chars, $url_unsafe_chars, $string);

			if(!is_string($string = base64_decode($string, TRUE)))
				throw new \exception('Base64 decoding failed (`$string` is NOT a string).');

			return $string;
		}
	}
}