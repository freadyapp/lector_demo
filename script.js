class Line {
  constructor(div) {
    this.height = 0
    this.words = []
  }
}

class Word {
  constructor(wt) {
    this.content = ''
    this.time = 0
  }
}

class Instance {}

var lines = []
var pointer = document.createElement('div')

function setUpDoc() {
  word_divs = document.getElementsByTagName("wt")
  line_divs = document.getElementsByTagName("line")
  setUpPointer()
  setUpLines(line_divs, lines)
}

function setUpPointer() {
  pointer = document.createElement('div')
  $(pointer).css({ 'position': 'absolute', 'outline': 'solid 1px red', 'background-color': 'transparent', 'width': '10vw', 'height': '20px', 'z-index': '0', 'opacity': '100%' });
  $('#reader').append(pointer) // TODO fix pointer's initial placement
}

function setUpLines(lines_div, lines_array) {
  looper(lines_div, (line) => {
    lines_array.push(new Line(line))
  })
}

setUpDoc();


var interval = 550; // ms
var expected = Date.now() + interval;
setTimeout(step, interval);
function step() {
  var dt = Date.now() - expected; // the drift (positive for overshooting)
  if (dt > interval) {
    // something really bad happened. Maybe the browser (tab) was inactive?
    // possibly special handling to avoid futile "catch up" run
    // TODO refresh the page or reset the dt
  }
  tiktok();
  expected += interval;
  setTimeout(step, Math.max(0, interval - dt)); // take into account drift
}

var line = 0
var word = 0

function tiktok() {
  current_line = lines[line]
  current_word = word_divs[word]
  var destination = $(current_word).offset();
  $(pointer).css({ top: destination.top - 5, left: destination.left });
  // line += 1
  word += 1
  if ($(current_word).is(':space')) {
    // this shit is whitespace so skiiiip
    tiktok();
  }
}


// var d = document.getElementById('yourDivId');
// d.style.position = "absolute";
// d.style.left = x_pos + 'px';
// d.style.top = y_pos + 'px';

// function placeDiv(x_pos, y_pos) {
//   var d = document.getElementById('yourDivId');
//   d.style.position = "absolute";
//   d.style.left = x_pos + 'px';
//   d.style.top = y_pos + 'px';
// }


// utility functions

function print(val) {
  console.log(val)
}

function looper(elements, func) {
  for (var i = 0; i < elements.length; i++) {
    func(elements[i])
  }
}

function get_kids(element) {
  return element.childNodes
}

jQuery.expr[':'].space = function (elem) {
  var $elem = jQuery(elem);
  return !$elem.children().length && !$elem.text().match(/\S/);
}
