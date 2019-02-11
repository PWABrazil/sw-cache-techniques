const isLocalhost = Boolean(
    window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.1/8 is considered localhost for IPv4.
    window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
);

if(true || !isLocalhost && 'serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
        if(registrations.length > 0) return registrations;
        navigator.serviceWorker.register('/sw.js');
    });

    navigator.serviceWorker.onmessage = function (evt) {
        switch(evt.data) {
            case 'INSTALLED':
                alert("The application was installed with success!");
                break;
        }
    };
}
