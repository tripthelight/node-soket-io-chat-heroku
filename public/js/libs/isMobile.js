function isMobile(){
	let UserAgent = navigator.userAgent;

	if (UserAgent.match(/iPhone|iPod|Android|Windows CE|BlackBerry|Symbian|Windows Phone|webOS|Opera Mini|Opera Mobi|POLARIS|IEMobile|lgtelecom|nokia|SonyEricsson/i) != null || UserAgent.match(/LG|SAMSUNG|Samsung/) != null) {
		return true;
	}else{
		return false;
	}
}

if(isMobile()){
	document.querySelector('body').classList.add('mobile');
}else{
	document.querySelector('body').classList.add('pc');
}
