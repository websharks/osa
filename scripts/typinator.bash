#!/usr/bin/env bash
#-- parameter: ~/path/to/script.scpt&&arg2&&arg3&&...

trim(){
	local string="$*";
	echo "$string" | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//';
};

osa=''; osaArgs=''; i=0;

while IFS=',' read -ra args; do
	for arg in "${args[@]}"; do
		i=$((i+1));
		if [ $i == 1 ]; then
			osa="$(trim "$arg")";
		elif [ $i -ge 2 ]; then
			if [ "$osaArgs" == '' ]; then
				osaArgs[i-1]="$(trim "$arg")";
			else osaArgs[i-1]=' '"$(trim "$arg")";
			fi;
		fi;
	done;
done <<< "$1";

if [ "$osa" != '' ]; then
	osa=$(eval echo "$osa"); # ~/
	if [ "${#osaArgs[@]}" -ge 2 ]; then
		echo -n "$(/usr/bin/env osascript -l JavaScript "$osa" "${osaArgs[@]:1}" 2>/dev/null)";
	else
		echo -n "$(/usr/bin/env osascript -l JavaScript "$osa" 2>/dev/null)";
	fi;
fi;
