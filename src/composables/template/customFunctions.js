export const clickMenuIcon = () => {
  var sidebarSize = document.body.getAttribute("data-sidebar-size");

  if (window.innerWidth >= 993) {
    if (sidebarSize === "condensed") {
      document.body.setAttribute("data-sidebar-size", "default");
    } else {
      document.body.setAttribute("data-sidebar-size", "condensed");
    }
  } else {
    document.body.setAttribute("data-sidebar-size", "default");
    if (!document.body.classList.contains("sidebar-enable")) {
      document.body.classList.add("sidebar-enable");
    } else {
      document.body.classList.remove("sidebar-enable");
    }
  }
};

export const enableFullScreenMode = () => {
  $("body").toggleClass("fullscreen-enable");
  if (
    !document.fullscreenElement &&
    /* alternative standard method */ !document.mozFullScreenElement &&
    !document.webkitFullscreenElement
  ) {
    // current working methods
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen(
        Element.ALLOW_KEYBOARD_INPUT
      );
    }
  } else {
    if (document.cancelFullScreen) {
      document.cancelFullScreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen();
    }
  }
  document.addEventListener("fullscreenchange", exitHandler);
  document.addEventListener("webkitfullscreenchange", exitHandler);
  document.addEventListener("mozfullscreenchange", exitHandler);
  function exitHandler() {
    if (
      !document.webkitIsFullScreen &&
      !document.mozFullScreen &&
      !document.msFullscreenElement
    ) {
      $("body").removeClass("fullscreen-enable");
    }
  }
};
