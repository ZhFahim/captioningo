// Display text copy message
var clipboard = new ClipboardJS(".copy-btn");
var num;
var msgDisplay = document.querySelector(".msg");

clipboard.on("success", function(e) {
  msgDisplay.classList.add("show");
  clearTimeout(num);
  num = setTimeout(function() {
    msgDisplay.classList.remove("show");
  }, 3000);
  console.log(e);
});

clipboard.on("error", function(e) {
  msgDisplay.innerHTML = "Unable to copy! please copy manually.";
  msgDisplay.classList.add("show");
  clearTimeout(num);
  num = setTimeout(function() {
    msgDisplay.classList.remove("show");
  }, 3000);
  console.log(e);
});
