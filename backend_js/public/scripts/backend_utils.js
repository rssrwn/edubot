function httpGet(url, callback) {
  var xmlHttp = new XMLHttpRequest();

  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
      callback(xmlHttp.responseText);
  }
  xmlHttp.open("GET", url, true); // true for asynchronous
  xmlHttp.send();
}

async function httpPost(url, params, callback) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("POST", url, true); // true for asynchronous
  xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == XMLHttpRequest.DONE) {
      callback(xmlHttp.status);
    }
  }

  var postParams = "";
  for (var key in params) {
    postParams += key + "=" + params[key] + "&";
  }
  postParams = postParams.substring(0, postParams.length - 1);
  xmlHttp.send(postParams);
}
