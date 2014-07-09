bitifySettings = {
	regval: [],
	motorola_mode: false,
	basehex: true,
	num_bits: 32, 
};

function getSettings() {
	console.log(bitifySettings);
	return bitifySettings;
}

function saveSettings(settings) {
	bitifySettings = settings;
}




Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
}

Storage.prototype.getObject = function(key) {
    var value = this.getItem(key);
    return value && JSON.parse(value);
}

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    switch (request.command) {
        case 'setItem':
            localStorage.setObject(request.name, request.data);
            return;
        case 'getItem':
            sendResponse(localStorage.getObject(request.name));
            return;
    }
});