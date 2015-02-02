#!/usr/bin/env bash
#-- parameter: ~/path/to/script.scpt,arg2,arg3,...

trim(){
	local string="$*";
	echo "$string" | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//';
};
tokenize_escaped_commas(){
	local string="$*";
	echo "$string" | sed -e 's/\\,/%%comma%%/';
};
restore_escaped_commas(){
	local string="$*";
	echo "$string" | sed -e 's/%%comma%%/,/';
};

script=''; scriptArgs=(); i=0;

while IFS=',' read -ra args; do
	for arg in "${args[@]}"; do
		i=$((i+1));
		if [ $i == 1 ]; then
			script="$(restore_escaped_commas "$(trim "$arg")")";
		elif [ $i -ge 2 ]; then
			scriptArgs[i-1]="$(restore_escaped_commas "$(trim "$arg")")";
		fi;
	done;
done <<< "$(tokenize_escaped_commas "$1")";

if [ "$script" != '' ]; then
	scriptsDir=$(eval echo ~/library/script\ libraries/websharks/scripts);
	if [ "${#scriptArgs[@]}" -ge 2 ]; then
		echo -n "$(/usr/bin/env osascript -l JavaScript "$scriptsDir"/"$script" "${scriptArgs[@]:1}" 2>/dev/null)";
	else
		echo -n "$(/usr/bin/env osascript -l JavaScript "$scriptsDir"/"$script" 2>/dev/null)";
	fi;
fi;
