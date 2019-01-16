function attacheKeyboardNavigation() {
  var closure = this;
  this.state = {
    leftPressed: 0,
    rightPressed: 0,
    upPressed: 0,
    downPressed: 0,
    activeTitle: 0,
    titleCoords: [],
    titles: [],
    thisIsPost: !!~window.location.href.indexOf('post')

  };

  var titlesOrComments = document.querySelectorAll('.post__title_link').length
    ? document.querySelectorAll('.post__title_link')
    : document.querySelectorAll('h1, h2[id], h3[id], h4[id], span[data-parent_id="0"]');
  for (link of titlesOrComments){
    this.state.titles.push(link);
    this.state.titleCoords.push(getElementTop(link) - 42);
  }

  function clearState(){
    closure.state.leftPressed
      = closure.state.rightPressed
      = closure.state.downPressed
      = closure.state.upPressed
      = 0;
  }

  function getElementTop(element){
    var offset = document.body.getBoundingClientRect().top,
    relative = element.getBoundingClientRect().top,
    absolute = relative - offset;
    return absolute;
  }

  function safeClick(selector){
    var element = selector.click ? selector : document.querySelector(selector);
    if (element && element.click){
      element.click();
    }
  }

  function goToFirst(){
    safeClick('.toggle-menu__item.toggle-menu__item_pagination:first-child a');
  }

  function goHere(){
    safeClick('.arrows-pagination__item-link_prev');
  }

  function goThere(){
    safeClick('.arrows-pagination__item-link_next');
  }

  function goToLast(){
    safeClick('.toggle-menu__item.toggle-menu__item_pagination:last-child a');
  }

  function setActiveTitle(number){
    var offset = Math.abs(document.body.getBoundingClientRect().top),
      diff = offset,
      closest = 0;
    closure.state.titleCoords.map((top, index) => {
        if (Math.abs(offset - top) < diff){
          diff = Math.abs(offset - top);
          closest = index;
        }
      }
    );
    closure.state.activeTitle = number || closest;
  }

  function goToNextTitle(){
    if (closure.state.activeTitle < this.state.titleCoords.length-1 ){
      closure.state.activeTitle += 1;
      scroll(0, closure.state.titleCoords[closure.state.activeTitle]);
    }
    else {
      goToBottom();
    }
  }

  function goToPreviousTitle(){
    if (closure.state.activeTitle > 0){
      closure.state.activeTitle -= 1;
      scroll(0, closure.state.titleCoords[closure.state.activeTitle]);
    }
  }

  function goToTop(){
    scroll(0, 0);
    this.state.activeTitle = 0;
  }

  function goToBottom(){
    var bottomElement = document.querySelector('.page__footer')
      || document.querySelector('.comment-form');
    scroll(0, getElementTop(bottomElement) - 100);
    this.state.activeTitle = this.state.titleCoords.length-1;
  }

  function clickActiveTitle(){
    safeClick(closure.state.titles[closure.state.activeTitle]);
    if(closure.state.thisIsPost){
      document.querySelector('textarea').focus();
    }

  }



  function navigateByArrows(e){
    setActiveTitle();
    if(e.key == "ArrowRight"){
      if (e.ctrlKey){
        clickActiveTitle();
      }
      else if (closure.state.rightPressed == 1){
        goThere();
      }
      else if (closure.state.rightPressed == 2){
        goToLast();
      }
      closure.state.rightPressed += 1;
    }

    if(e.key == "ArrowLeft"){
      if (e.ctrlKey){
        if(document.querySelector('textarea:focus')){
          document.querySelector('textarea').blur();
        }
        else {
          window.history.back();
        }

      }
      else if (closure.state.leftPressed == 1){
        goHere();
      }
      else if (closure.state.leftPressed == 2){
        goToFirst();
      }
      closure.state.leftPressed += 1;
    }

    if(e.key == "ArrowDown"){
      if (e.ctrlKey){
        document.querySelector('.js-post-vote [data-action=minus]').click();
      }
      if (closure.state.downPressed == 1){
        goToNextTitle();
      }
      else if (closure.state.downPressed == 2){
        goToBottom();
      }
      closure.state.downPressed += 1;
    }

    if(e.key == "ArrowUp"){
      if (e.ctrlKey){
        document.querySelector('.js-post-vote [data-action=plus]').click();
      }
      if (closure.state.upPressed == 1){
        goToPreviousTitle();
      }
      else if (closure.state.upPressed == 2){
        goToTop();
      }
      closure.state.upPressed += 1;
    }

    setTimeout(clearState, 750);
  }
  document.addEventListener('keyup', navigateByArrows);
  console.log("Keyboard navigation attached!");
}


setTimeout(attacheKeyboardNavigation, 500);
