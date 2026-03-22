window.onload = function () {
    const navigationEntry = performance.getEntriesByType('navigation')[0];
    const loadTime = navigationEntry
      ? navigationEntry.domContentLoadedEventEnd
      : window.performance.timing.domContentLoadedEventEnd -
        window.performance.timing.navigationStart;
    
    const timingInfo = document.getElementById('timing-info');
    if (timingInfo) {
        const serverElapsedTime = timingInfo.dataset.serverElapsedTime;
        timingInfo.textContent = `Server time: ${serverElapsedTime || 'n/a'} ms | Client DOM ready: ${Math.round(loadTime)} ms`;
    }
    
    const links = Array.from(document.getElementsByClassName('nav_element'));
    links.forEach((link) => {
        if (link.href === window.location.href) {
        link.classList.add('nav__element-active');
        }
    });
};