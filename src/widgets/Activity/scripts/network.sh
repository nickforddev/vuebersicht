#!/bin/bash

whereAwk=$(which awk)
whereCat=$(which cat)
whereNetstat=$(which netstat)

foundPaths="${whereCat///cat}:${whereAwk///awk}:${whereNetstat///netstat}"

function getnetwork(){
  export PATH="$foundPaths" &&
  cache=$(netstat -iw 1 | head -n3 | tail -n1 | awk '{print $3 " " $6}')

  in=$(echo "$cache" | awk '{print $1}')
  out=$(echo "$cache" | awk '{print $2}')

  echo $in $out
}

# getnetwork "$PWD"

if [ ! -e "$PWD/src/widgets/Activity/scripts/network.sh" ]; then
  getnetwork "$PWD/src/widgets/Activity/scripts"
else
  getnetwork "$PWD"
fi
