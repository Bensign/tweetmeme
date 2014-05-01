/* 
  Because we are making external calls from the page itself
  to the Twitter API, we need the callback functionality to
  exist on that page itself and not in the sandboxed Chrome
  environment for extensions.

  To combat this, we'll inject the code directly using this
  file.  These files also must exist in 
  web_accessible_resources in the manifest.json file.

  As a result of loading in jquery, load in tweetmeme
*/

var jq = document.createElement('script');
var tm = document.createElement('script');
jq.src = chrome.extension.getURL('scripts/jquery-1.7.2.min.js');
tm.src = chrome.extension.getURL('scripts/tweetmeme.js');

jq.onload = function() {
  this.parentNode.removeChild(this);
  document.head.appendChild(tm);
}

document.head.appendChild(jq);