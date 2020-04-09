// constants

const pointer_css_dictionary = {
  'position': 'absolute',
  'outline': 'solid 0px red',
  'background-color': '#FFDC00',
  'width': '10vw',
  'height': '20px',
  'z-index': '10',
  'opacity': '100%',
  'mix-blend-mode': 'darken'
}

// const pointer_css_dictionary = {
//   'position': 'absolute',
//   'outline': 'solid 0px red',
//   'background-color': '#FF4136',
//   'width': '10vw',
//   'height': '20px',
//   'z-index': '0',
//   'opacity': '100%',
//   'mix-blend-mode': 'darken'
// }

// const pointer_css_dictionary = {
//   'position': 'absolute',
//   'outline': 'solid 0px red',
//   'background-color': '#FF851B',
//   'width': '10vw',
//   'height': '20px',
//   'z-index': '0',
//   'opacity': '100%',
//   'mix-blend-mode': 'darken'
// }


const toolbar_div_class_name = 'not_the_toolbar_you_deserve_but_the_toolbar_you_need'
const colors = ['#7FDBFF', '#01FF70', '#F012BE', '#DDDDDD', '#FF851B', '#FF4136', '#FFDC00']

let initial_wpm = 420
let initial_wchunk = 1

let frame_interval_ms = wpm2ms(initial_wpm)


// classes

class Toolbar {
  constructor(div, wpm_div) {
    this.dom = div
    this.wpm_div = wpm_div
    this.wpm_val = initial_wpm
    this.wpm = this.wpm_val
    this.wchunk = initial_wchunk
    this.color_index = 0
    this.auto = false
  }

  set wpm(n) {
    this.wpm_val = n
    $(this.wpm_div).text(this.wpm_val)
    frame_interval_ms = wpm2ms(this.wpm)
  }

  get wpm() {
    return this.wpm_val
  }

}

class Marker {

  constructor(div) {
    this.dom = div
    this.color_code = 0
    this.color_hex = ''
    this.color = 0
  }
  set color(code) {
    this.color_code = code % colors.length
    this.color_hex = colors[this.color_code]
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

  mark2(these) {
    let h = 0
    let w = 0
    let count = 0

    these.forEach(that => {
      count += 1
      h += (that.height) / 4
      w += (that.width) / 4
    })

    let des = {
      'top': $(these[0].dom).offset().top,
      'left': $(these[0].dom).offset().left
    }

    $(this.dom).offset(des);
    $(this.dom).css({
      'width': w,
      'height': h / count,
      'background-color': this.color_hex
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

class Line extends MapElement {
  constructor(lt, p) {
    super(lt, p)
    this.words = []
    this.time = 0
    let word_divs = lt.getElementsByTagName('wt')
    for (var i = 0; i < word_divs.length; i++) {
      let w = new Word(word_divs[i], this, i)
      this.words.push(w)
      all_words.push(w)
      // TODO this.time make a get mthd
      this.time += w.time
    }
  }
}

class Word extends MapElement {
  constructor(wt, p, i) {
    super(wt, p)
    this.content = wt.textContent
    this.time = parseInt(wt.getAttribute('l'))
    this.index = i
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
  /*
  <div class="not_the_toolbar_you_deserve_but_the_toolbar_you_need">
  <div class="reading_sped">reading speed</div><br>
  <div id='wpm_plus' class="button_ghost_dark">*</div><br>
  <div id='wpm' class="button_ghost_dark">4</div><br>
  <div id='wpm_minus' class="button_ghost_dark">*</div><br>
  </div>
  */

  let toolbar_div = document.getElementsByClassName(toolbar_div_class_name)
  let wpm_div = document.getElementById('wpm')
  let wpm_plus = document.getElementById('wpm_plus')
  let wpm_minus = document.getElementById('wpm_minus')

  toolbar = new Toolbar(toolbar_div, wpm_div)
}

function setUpLines(lines_div, lines_array) {
  looper(lines_div, (line) => {
    lines_array.push(new Line(line))
  })
}

setUpDoc();

// key listeners
var keys = {};
window.onkeyup = function (e) { keys[e.keyCode] = false; keyRelease(e.keyCode) }
window.onkeydown = function (e) { if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) e.preventDefault(); keys[e.keyCode] = true; keyPress(e.keyCode) }

// initialising the locked loop

let expected = Date.now() + frame_interval_ms;
setTimeout(step, frame_interval_ms);
function step() {
  let dt = Date.now() - expected; // the drift (positive for overshooting)
  if (dt > frame_interval_ms) {
    expected = Date.now() + frame_interval_ms;
    setTimeout(step, frame_interval_ms);
  }
  tiktok();
  tiktokKeysHelper();
  expected += frame_interval_ms;
  setTimeout(step, Math.max(0, frame_interval_ms - dt)); // take into account drift
}


// LOCKED LOOP

let cursor = 0
let instances = 0
let instance = 0
let wstep = 1
let dir = 1
let moving = false
let current_word = null
let current_line = null

let color_cursor = 0
//TODO make this a classs

function tiktok() {
  current_word = all_words[cursor]
  current_line = current_word.parent
  let run = toolbar.auto || moving

  if (instance < instances) {
    markedWords = slice_around(current_line.words, current_word.index, toolbar.wchunk)
    marker.mark2(markedWords)
    instance += 1 * run
  }
  else {
    instance = 0
    cursor += wstep * dir
    instances = all_words[cursor].time
  }

}


function tiktokKeysHelper() {

  right = keys[39]
  left = keys[37]

  if (right || left) {
    dir = 1
    if (left) dir = -1
    moving = true
  } else {
    moving = false
    dir = 1
  }
}

function keyPress(key) {

  switch (key) {
    case 37:
      //left
      if (!moving) cursor--
      break;
    case 39:
      //right
      if (!moving) cursor++
      break;
    case 38:
      //up
      lines2words(false)
      break;
    case 40:
      //down
      lines2words(true)
      break;
    case 67:
      //c
      color_cursor += 1
      marker.color = color_cursor
      break;
    case 187:
      //= (intepret it as +)
      toolbar.wpm = setCapped(toolbar.wpm, +10, 50, 990)
      break;
    case 189:
      //- 
      toolbar.wpm = setCapped(toolbar.wpm, -10, 50, 990)
      break;
    case 190:
      //= (intepret it as +)
      toolbar.wchunk = setCapped(toolbar.wchunk, +1, 1, 5)
      break;
    case 188:
      //- 
      toolbar.wchunk = setCapped(toolbar.wchunk, -1, 1, 5)
      break;
    default:
    // code block
  }
}


function keyRelease(key) {

  switch (key) {
    case 37:
      //left
      moving = false
      break;
    case 39:
      //right
      moving = false
      break;
    case 65:
      //a
      toolbar.auto = !toolbar.auto
      break;
    default:
    // code block
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

function wpm2ms(wpm) {
  const average_letters_in_word = 5 // actually 4.79
  return 1000 / ((wpm / 60) * average_letters_in_word) // big brain meth
}

function slice_around(ary, i, l) {
  let start = i - Math.round((l - 1) / 2)
  let end = i + Math.round((l - 1) / 2)
  return ary.slice(cap(start, 0, ary.length - 1), cap(end, 0, ary.length - 1) + 1)
}

function isEven(n) {
  return n % 2 == 0;
}

function cap(num, min, max) {
  return num <= min ? min : num >= max ? max : num;
}

function lines2words(down = true) {
  cursor = setCapped(cursor, down ? (current_line.words.length - current_word.index) : -current_word.index - 1, 0, Infinity)
  if (!down) cursor = setCapped(cursor, -all_words[cursor].parent.words.length + 1, 0, Infinity)
}

function setCapped(vari, val, final_min, final_max) {
  target_val = vari + val
  return cap(target_val, final_min, final_max)
}

