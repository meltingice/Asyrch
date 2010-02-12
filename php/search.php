<?
if($_POST['engine']){
	doSearch($_POST['engine'],$_POST['query']);
}

function doSearch($engine,$query){
	$urls = array(
		"google"=>"http://ajax.googleapis.com/ajax/services/search/web?v=1.0&q="
	);
	
	$url = $urls[$engine];
	
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, $url.$query);
	curl_setopt($ch, CURLOPT_HEADER, 0);
	curl_exec($ch);
	curl_close($ch);
}
?>