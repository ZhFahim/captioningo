var num;
function copyText(text) {
  navigator.clipboard.writeText(text);
  var msgDisplay = document.querySelector(".msg");
  msgDisplay.classList.add("show");
  clearTimeout(num);
  num = setTimeout(function() {
    msgDisplay.classList.remove("show");
  }, 3000);
}
