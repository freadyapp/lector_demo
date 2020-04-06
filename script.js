// constants

const pointer_css_dictionary = { 
  'position': 'absolute', 
  'outline': 'solid 1px red', 
  'background-color': 'transparent', 
  'width': '10vw', 
  'height': '20px', 
  'z-index': '0', 
  'opacity': '100%' 
}

let initial_wpm = 250
let frame_interval_ms = wpm2ms(initial_wpm)


// classes

class Toolbar {
  constructor(div) {
    this.dom = div
    this.wpm_val = 250
    this.auto = false
  }

  set wpm(n){
    this.wpm_val = n
    frame_interval_ms = wpm2ms(this.wpm)
  }

  get wpm(){
    return this.wpm_val
  }
  render(){

  }

}

class Marker {

  constructor(div) {
    this.dom = div
  }

  mark(that) {
    let h = (that.height) / 4
    let w = (that.width) / 4
    let destination = $(that.dom).offset();
    // destination['top'] -= 0
    $(this.dom).offset(destination);
    $(this.dom).css({
      'width': w,
      'height': h
    });
  }
}

class MapElement {
  constructor(div, p) {
    this.width = div.offsetWidth
    this.height = div.offsetHeight
    this.dom = div
    this.parent = p
  }
}

class Line extends MapElement{
  constructor(lt, p) {
    super(lt, p)
    this.words = []
    this.time = 0
    looper(lt.getElementsByTagName('wt'), (wt) => {
      let w = new Word(wt, this)
      this.words.push(w)
      all_words.push(w)
      // TODO this.time make a get mthd
      this.time += w.time
    })
  }
}

class Word extends MapElement{
  constructor(wt, p) {
    super(wt, p)
    this.content = wt.textContent
    this.time = parseInt(wt.getAttribute('l'))
  }
}


// set up

let lines = []
let all_words = []
let marker = null
let toolbar = null

function setUpDoc() {

  let line_divs = document.getElementsByTagName("line")
  setUpPointer()
  setUpToolbar()
  setUpLines(line_divs, lines)
}

function setUpPointer() {
  let pointer_div = document.createElement('div')
  $(pointer_div).css(pointer_css_dictionary);
  $('#reader').append(pointer_div) // TODO fix pointer's initial placement
  marker = new Marker(pointer_div)
}

function setUpToolbar() {
  let toolbar_div = document.createElement('div')
  // $(toolbar_div).css(pointer_css_dictionary);
  $('#reader').append(toolbar_div) // TODO fix pointer's initial placement
  toolbar = new Toolbar(toolbar_div)
}

function setUpLines(lines_div, lines_array) {
  looper(lines_div, (line) => {
    lines_array.push(new Line(line))
  })
}

setUpDoc();

// key listeners
var keys = {};
window.onkeyup = function (e) { keys[e.keyCode] = false; }
window.onkeydown = function (e) { keys[e.keyCode] = true; }

// initialising the locked loop

let expected = Date.now() + frame_interval_ms;
setTimeout(step, frame_interval_ms);
function step() {
  let dt = Date.now() - expected; // the drift (positive for overshooting)
  if (dt > frame_interval_ms) {
    // TODO refresh the page or reset the dt
    // alert('whats up')
  }
  tiktok();
  tiktokKeysHelper();
  expected += frame_interval_ms;
  setTimeout(step, Math.max(0, frame_interval_ms - dt)); // take into account drift
}


// LOCKED LOOP

let cursor = -1
let instances = 0
let instance = 0
let wstep = 1
let dir = 1

function tiktok() {
  let current_word = all_words[cursor]

  if (instance<instances)
  {
    marker.mark(current_word)
    instance += 1*toolbar.auto
  }
  else
  {
    instance = 0
    cursor += wstep*dir
    instances = all_words[cursor].time
  }
  
}


function tiktokKeysHelper(){
  
  right = keys[39]
  left = keys[37]
      
  if (right || left){
    dir = 1
    if (left) dir = -1
    toolbar.auto = true
  }else{
    toolbar.auto = false
  }
}

// utility functions

function print(val) {
  // TODO deprecate this
  console.log(val)
}

function looper(elements, func) {
  // TODO deprecate this
  for (let i = 0; i < elements.length; i++) {
    func(elements[i])
  }
}

function get_kids(element) {
  // TODO deprecate this
  return element.childNodes
}

jQuery.expr[':'].space = function (elem) {
  let $elem = jQuery(elem);
  return !$elem.children().length && !$elem.text().match(/\S/);
}

function wpm2ms(wpm){
  const average_letters_in_word = 5 // actually 4.79
  return 1000/((wpm / 60) * average_letters_in_word) // big brain meth
}
