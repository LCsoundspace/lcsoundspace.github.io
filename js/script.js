function openMobileMenu (close) {
  if (!document.body.classList.contains('mobile-view')) {
    return false;
  }

  if (close || document.body.classList.contains('mobile-menu-open')) {
    document.body.classList.remove('mobile-menu-open');
  } else {
    document.body.classList.add('mobile-menu-open');
    var main = document.querySelector('.mobile-hide')
    if (main) main.classList.remove('mobile-hide');
    [].forEach.call(document.querySelectorAll('.sub-menu'), function(ele) {
      ele.classList.add('mobile-hide');
    });
  }
}

function goBack () {
  document.querySelector('.mobile-hide').classList.remove('mobile-hide');

  [].forEach.call(document.querySelectorAll('.sub-menu'), function(ele) {
    ele.classList.add('mobile-hide');
  });
}

function selectMenuItem (menu, link) {
  [].forEach.call(document.querySelectorAll(`.${menu} a`), function(ele) {
    ele.classList.remove('selected');
  });
  document.querySelector(`#nav-${link}`).classList.add('selected');
}

function jumpTo (location, saveHistory) {
  var path = location.split('/');
  var subMenu = document.querySelector(`.sub-menu-${path[0]}`);

  [].forEach.call(document.querySelectorAll('.sub-menu'), function(ele) {
    [].forEach.call(ele.querySelectorAll('a'), function (link) { link.classList.remove('selected')});
    ele.classList.remove('element-show');
  });

  if (path.length > 1) {
    selectMenuItem('main-menu', path[0]);
    subMenu.classList.remove('mobile-hide');
    subMenu.classList.add('element-show');
    selectMenuItem('sub-menu', path[1]);
  } else {
    selectMenuItem('main-menu', path[0]);
  }

  if (subMenu && path.length == 1) {
    document.querySelector('.main-menu-container').classList.add('mobile-hide');
    subMenu.classList.remove('mobile-hide');
    subMenu.classList.add('element-show');
    if (!document.body.classList.contains('mobile-view')) subMenu.querySelector('a').click();
  } else {
    openMobileMenu(true);
    includeHTML(location, saveHistory);
  }

  return false;
}

function loadPage (saveHistory) {
  if (window.location.hash) {
    jumpTo(window.location.hash.replace(/#/, ''), saveHistory);
  }
}

function includeHTML (filename, saveHistory = true) {
  if (saveHistory) window.history.pushState('', '', `#${filename}`);
  var file = '/partials/' + filename + '.html'
  var element = document.getElementById('contents')
  var xhttp = new XMLHttpRequest();

  element.innerHTML = '<div class="loading"><div class="load-1"></div><div class="load-2"></div><div class="load-3"></div></div>';

  xhttp.onreadystatechange = function() {
    if (this.readyState == 4) {
      if (this.status == 200) {element.innerHTML = this.responseText;}
      if (this.status == 404) {element.innerHTML = "Page not found.";}
    }
  }
  xhttp.open("GET", file, true);
  xhttp.send();
}

function checkMobile () {
  var vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  if (vw < 800) {
    document.body.classList.add('mobile-view');
  } else {
    document.body.classList.remove('mobile-view');
    loadPage(false);
  }
}

window.onresize = function () {
  checkMobile();
}
window.onhashchange = function () {
  loadPage(false);
}

checkMobile();
loadPage();
