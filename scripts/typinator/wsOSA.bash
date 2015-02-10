#!/usr/bin/env bash
#-- parameter: ~/path/to/script.scpt,arg2,arg3,...

trim(){
	local string="$*";
	echo "$string" | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//';
};
tokenize_special_chars(){
	local string="$*";

	if [ "$argSeparator" == ',' ]; then
		echo "$string" | sed -e 's/\\,/%%comma%%/';
	else echo "$string"; fi;
};
restore_special_chars(){
	local string="$*";

	if [ "$argSeparator" == ',' ]; then
		echo "$string" | sed -e 's/%%comma%%/,/';
	else echo "$string"; fi;
};

script=''; scriptArgs=();

if [[ "$1" == *'|:|'* ]];
	then argSeparator='|:|';
else argSeparator=','; fi;

_i=0; _arg=''; # Temp vars.
_args="$(tokenize_special_chars "$1")";

while [ "$_args" != '' ]; do
	_i=$((_i+1)); # Counter.
	_arg="${_args%%"$argSeparator"*}";

	if [ "$_arg" == "$_args" ];
		then _args=''; # The last argument.
	else _args="${_args#*"$argSeparator"}"; fi;

	if [ $_i == 1 ]; then
		script="$(restore_special_chars "$(trim "$_arg")")";
	elif [ $_i -ge 2 ]; then
		scriptArgs[_i-1]="$(restore_special_chars "$(trim "$_arg")")";
	fi;
done; # End arguments iteration.

if [ "$script" != '' ]; then
	scriptsDir=$(eval echo ~/library/script\ libraries/websharks-osa/scripts);
	if [ "${#scriptArgs[@]}" -ge 1 ]; then
		echo -n "$(/usr/bin/env osascript -l JavaScript "$scriptsDir"/"$script".js.applescript "${scriptArgs[@]}" 2>/dev/null)";
	else
		echo -n "$(/usr/bin/env osascript -l JavaScript "$scriptsDir"/"$script".js.applescript 2>/dev/null)";
	fi;
fi;
