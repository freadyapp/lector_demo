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
const frame_interval_ms = 25


// classes

class Marker {
  constructor(div) {
    this.dom = div
  }

  yeet() {
    this.dom.style.opacity = 0;
  }

  mark(that) {
    let h = (that.height)/4
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
  constructor(div) {
    this.width = div.offsetWidth
    this.height = div.offsetHeight
    this.dom = div
    // this.pre = pre
  }

}

class Line extends MapElement{
  constructor(lt) {
    super(lt)
    this.words = []
    this.time = 0
    looper(lt.getElementsByTagName('wt'), (wt) => {
      let w = new Word(wt)
      this.words.push(w)
      this.time += w.time
    })
    print(this.time)
  }
}

class Word extends MapElement{
  constructor(wt) {
    super(wt)
    this.content = wt.textContent
    this.time = parseInt(wt.getAttribute('l'))
  }
}

class Instance {
  constructor(el){
    this.time = el.time
    this.dom = el.dom
  }
}

// set up

let lines = []
let marker = null

function setUpDoc() {
  word_divs = document.getElementsByTagName("wt")
  line_divs = document.getElementsByTagName("line")
  setUpPointer()
  setUpLines(line_divs, lines)
}

function setUpPointer() {
  let pointer_div = document.createElement('div')
  $(pointer_div).css(pointer_css_dictionary);
  $('#reader').append(pointer_div) // TODO fix pointer's initial placement
  marker = new Marker(pointer_div)
}

function setUpLines(lines_div, lines_array) {
  looper(lines_div, (line) => {
    lines_array.push(new Line(line))
  })
}

setUpDoc();
test_line = lines[1]
test_word = test_line.words[1]
marker.mark(test_line)
marker.mark(test_word)

print(test_line.width)

// initialising the locked loop
let interval = frame_interval_ms; // ms
let expected = Date.now() + interval;
setTimeout(step, interval);
function step() {
  let dt = Date.now() - expected; // the drift (positive for overshooting)
  if (dt > interval) {
    // TODO refresh the page or reset the dt
    // alert('whats up')
  }
  tiktok();
  expected += interval;
  setTimeout(step, Math.max(0, interval - dt)); // take into account drift
}


// locked loop

let line = 0
let current_line = null
let word = 0
let words = 0
let instance = 0
let instances = 0

// let tiktok = 0
// let tiktoks = 0

// function tiktok2() {
//   if (tiktok<tiktoks){
//     tiktok += 1 
//   }
//   else {
//     current_instanct = new Instance
//     marker.mark(current_instanct.dom)
//   }
// }

function tiktok() {
  current_line = lines[line]
  instances = current_line.time
  marker.mark(current_line)
  if (instance<instances){
    instance += 1
  } else {
    instance = 0
    line += 1
    if ($(current_line).is(':space')) {
      // this shit is whitespace so skiiiip
      tiktok();
    }
  }
  
}

// let d = document.getElementById('yourDivId');
// d.style.position = "absolute";
// d.style.left = x_pos + 'px';
// d.style.top = y_pos + 'px';

// function placeDiv(x_pos, y_pos) {
//   let d = document.getElementById('yourDivId');
//   d.style.position = "absolute";
//   d.style.left = x_pos + 'px';
//   d.style.top = y_pos + 'px';
// }



// utility functions

function print(val) {
  console.log(val)
}

function looper(elements, func) {
  for (let i = 0; i < elements.length; i++) {
    func(elements[i])
  }
}

function get_kids(element) {
  return element.childNodes
}

jQuery.expr[':'].space = function (elem) {
  let $elem = jQuery(elem);
  return !$elem.children().length && !$elem.text().match(/\S/);
}
