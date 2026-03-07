window.onload = function() {
    var loadTime = window.performance.timing.domContentLoadedEventEnd-window.performance.timing.navigationStart;
    var newText = document.createTextNode("Page load time is " + loadTime.toString() + " seconds");
	document.getElementsByTagName("footer")[0].appendChild(newText);

    
    let links = Array.from(document.getElementsByClassName("nav_element"));
    links.forEach(link => {
        if(link.href == window.location.href){
            link.classList.add("nav__element-active")
        }
    })
}