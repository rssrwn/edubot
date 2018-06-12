// Utils

function createArray(length) {
  var arr = new Array(length || 0),
      i = length;

  if (arguments.length > 1) {
      var args = Array.prototype.slice.call(arguments, 1);
      while(i--) arr[length-1 - i] = createArray.apply(this, args);
  }

  return arr;
}

// Generates a random whole number between 0 (inclusive) and max (exclusive).
function randomInt(max) {
  return Math.floor(Math.random() * max);
}

// Restricts the value of a to lie in the range of r1 to r2 (inclusive) where r1 <= r2.
function clamp(a, r1, r2) {
  a = Math.max(a, r1);
  a = Math.min(a, r2);
  return a;
}

function sleep(timeMillis, processTimeoutId) {
  return new Promise(resolve => {
    let id = setTimeout(resolve, timeMillis)

    if (arguments.length == 2) {
      processTimeoutId(id);
    }
  });
}

function httpPost(url, params, callback) {
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

function httpGet(url, callback) {
  var xmlHttp = new XMLHttpRequest();

  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
      console.log('response text: ', xmlHttp.responseText);
      callback(xmlHttp.responseText);
    }
  }
  xmlHttp.open("GET", url, true); // true for asynchronous
  xmlHttp.send();
}
