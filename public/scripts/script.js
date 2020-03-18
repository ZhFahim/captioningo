// Update usedBy property using AJAX
var request = new XMLHttpRequest();
function copy(captionId) {
  var url =
    window.location.protocol +
    "//" +
    window.location.host +
    "/copy/" +
    captionId;
  request.open("GET", url);
  request.send();
}

// Copy text to clipboard and display message
var clipboard = new ClipboardJS(".copy-btn");
var num;
var msgDisplay = document.querySelector(".msg");

clipboard.on("success", function(e) {
  msgDisplay.classList.add("show");
  clearTimeout(num);
  num = setTimeout(function() {
    msgDisplay.classList.remove("show");
  }, 3000);
});

clipboard.on("error", function(e) {
  msgDisplay.innerHTML = "Unable to copy! please copy manually.";
  msgDisplay.classList.add("show");
  clearTimeout(num);
  num = setTimeout(function() {
    msgDisplay.classList.remove("show");
  }, 3000);
});
