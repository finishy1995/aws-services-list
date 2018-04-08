export function getRootPath() {
  return window.location.protocol + "//" + window.location.host;
}

export function loadData(fileName, caller, callback) {
    if (window.XMLHttpRequest) {
        var obj = new XMLHttpRequest();
    }
    obj.open("GET", getRootPath() + "/data/" + fileName + ".json", true);
    
    obj.onreadystatechange = function() {
        if (obj.readyState === 4 && (obj.status === 200 || obj.status === 304 || obj.status === 201)) {
            var data = JSON.parse(obj.responseText);
            callback(data, caller);
        }
    };
    obj.send(null);
}
