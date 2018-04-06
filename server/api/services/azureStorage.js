let azure = require('azure-storage');
//Productio Keys
let accountName;
let accountKey;
let isProduction=false;

if(isProduction){
	accountName = "neoradiag858";
	accountKey = "KG6SL974672DQS1lMS5OXVD3uPE77RlOo3rBYEhsnKBo0xIJ0shtD9yv9RG/u2zsvtNofo9cpCRq8KPwR+zkKA==";
}
else{
	accountName = "qaneoradiag858";
	accountKey = "qs5pV/vuA1v4L7MYdJ01pEqEfW/RHwuNwW7A7XWtDomjxoc3XA7rdVqaBiFqyKZFhQFCWp1aFN09x648yP9imQ==";
	
}
let blobSvc = azure.createBlobService(accountName, accountKey);
let azureLink = "https://" + accountName + ".blob.core.windows.net/";


let azureStorage = {};

azureStorage.getBlobService = () => {
	return blobSvc;
}


azureStorage.azureStorageLink = () => {
	return azureLink;
}

azureStorage.createContainer = (labID) => {
	return new Promise((resolve, reject) => {
		let container = 'lab' + labID;
		blobSvc.createContainerIfNotExists(container, { publicAccessLevel: 'blob' }, (error, result, response) => {
			if (!error) {
				resolve('created');
			} else {
				reject(error);
			}
		});
	});
}

module.exports = azureStorage;