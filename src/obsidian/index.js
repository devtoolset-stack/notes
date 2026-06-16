let path = require('path');
let crypto = require('crypto');
let fs = require('fs');
let EventEmitter = require('events');
let electron = require('electron');
electron.remote = require('@electron/remote/main');
let {app, protocol, remote} = electron;

protocol.registerSchemesAsPrivileged([
	{scheme: 'app', privileges: {standard: true, secure: true, supportFetchAPI: true, stream: true, codeCache: true}},
]);

// Mock updater
// Help with update testing
let updateEvents = new EventEmitter();
updateEvents.on('check', () => {
	updateEvents.emit('check-start');
	setTimeout(() => {
		updateEvents.emit('update-downloaded');
		updateEvents.emit('check-end');
	}, 2000);
});

remote.initialize();

require('./main.js')(app.getAppPath(), updateEvents, true);
