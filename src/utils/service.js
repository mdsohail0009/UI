export function bytesToSize(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}
export function newGUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
export function numberWithCommas(x) {
    return x ? x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0;
}
export function getDocObj(customerId, path, docName, size, id, detailId) {
    return {
        "id": id || newGUID(),
        "transactionId": null,
        "adminId": "00000000-0000-0000-0000-000000000000",
        "date": null,
        "type": null,
        "customerId": customerId,
        "caseTitle": null,
        "caseState": null,
        "remarks": null,
        "status": null,
        "state": null,
        "details": [
            {
                "documentId": "00000000-0000-0000-0000-000000000000",
                "documentName": docName,
                "id": detailId || newGUID(),
                "isChecked": true,
                "remarks": size,
                "state": null,
                "status": false,
                "Path": path
            }
        ]
    }
}

export function checkCustomerState(config) {
    const hasProp = config.hasOwnProperty("customerState");
    if ((hasProp && config.customerState === "Approved") || !hasProp) {
        return true;
    } else {
        return false;
    }
}