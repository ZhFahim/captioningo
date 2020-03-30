// Update usedBy property using AJAX
var request = new XMLHttpRequest();
function copy(captionId) {
  request.open("GET", "/copy/" + captionId);
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

// Delete caption
function deleteCaption(captionId) {
  var request = new XMLHttpRequest();
  var confirmMsg = prompt(
    "Do you really want to delete? Type 'YES' to proceed."
  );
  if (confirmMsg === "YES") {
    request.open("DELETE", "/dashboard/" + captionId);
    request.send();
    window.location.reload();
  }
}
