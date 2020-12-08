window.setInterval(refreshPage, 1000);

var pageDom = ""
chrome.runtime.onMessage.addListener(function(request, sender) {
  if (request.action == "getSource") {
    // https://futurestud.io/tutorials/remove-all-whitespace-from-a-string-in-javascript
    var dom = request.source.replace(/\s+/g, ' ');

    if (pageDom == "") {
      pageDom = dom;
    }
    else if (pageDom != dom) {
      pageDom = dom;
      document.getElementById("refreshSwitch").checked = false;
    }
  }
});

function refreshPage() {
  var switchOn = document.getElementById("refreshSwitch").checked;

  if (switchOn) {
    // refresh page
    // https://stackoverflow.com/questions/8342756/chrome-extension-api-for-refreshing-the-page
    chrome.tabs.query({active: true, currentWindow: true}, function (arrayOfTabs) {
      var code = 'window.location.reload();';
      chrome.tabs.executeScript(arrayOfTabs[0].id, {code: code});
    });

    chrome.tabs.executeScript(null, {
      file: "getPagesSource.js"
      }, function() {
        // If you try and inject into an extensions page or the webstore/NTP you'll get an error
        if (chrome.runtime.lastError) {
          message.innerText = 'There was an error injecting script : \n' + chrome.runtime.lastError.message;
        }
      });
  }
}
