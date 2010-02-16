<?
if($_POST['engine']){
	doSearch($_POST['engine'],$_POST['query']);
}

function doSearch($engine,$query){
	$urls = array(
		"google"=>"http://ajax.googleapis.com/ajax/services/search/web?v=1.0&q=",
		"bing"=>" http://api.bing.net/json.aspx?AppId=7DFBA4A59410F8F34F6C715A09489D43C0A54684&Version=2.2&Market=en-US&Sources=web+spell&Web.Count=1&JsonType=raw&Query="
	);
	
	$url = $urls[$engine];
	
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, $url.$query);
	curl_setopt($ch, CURLOPT_HEADER, 0);
	curl_exec($ch);
	curl_close($ch);
}
?>