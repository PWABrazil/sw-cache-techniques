const LABEL = {
    ONLINE: 'Online',
    OFFLINE: 'Offline',
};

const changeNetworkStatus = () => {
    const networkStatusElement = document.getElementById("network-status");
    if(!networkStatusElement) return false;

    networkStatusElement.innerText = navigator.onLine ? LABEL.ONLINE : LABEL.OFFLINE;
    return true;
};

window.addEventListener('online', changeNetworkStatus);
window.addEventListener('offline', changeNetworkStatus);
document.addEventListener("DOMContentLoaded", changeNetworkStatus);
