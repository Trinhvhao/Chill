(() => {
  document.addEventListener("contextmenu", e => e.preventDefault());

  function redirectToSafety() {
    window.location.replace("https://webkaizen.in/products");
  }

  document.addEventListener("keydown", function (e) {
    if (
      e.key === "F12" ||
      (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key.toUpperCase())) ||
      (e.ctrlKey && e.key.toUpperCase() === "U")
    ) {
      e.preventDefault();
      redirectToSafety();
    }
  });
  
  setInterval(() => {
    (function () {
      return false;
    }.constructor("debugger").call());
  }, 50);
})();