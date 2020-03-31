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
const frame_interval_ms = 550


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
    var destination = $(that.dom).offset();
    destination['top'] -= 0
    $(this.dom).offset(destination);
    print(destination)
    $(this.dom).css({
      'width': w,
      'height': h
    });    // $(this.dom).css({ top: that.offsetTop - 5, left: that.offsetLeft });
  }
}
class MapElement {
  constructor(div) {
    this.width = div.offsetWidth
    this.height = div.offsetHeight
    this.dom = div
  }

}

class Line extends MapElement{
  constructor(lt) {
    super(lt)
    this.words = []
    looper(lt.getElementsByTagName('wt'), (word_div) => this.words.push(new Word(word_div)))
  }
}

class Word extends MapElement{
  constructor(wt) {
    super(wt)
    this.content = wt.textContent
    this.time = wt.getAttribute('l')
  }
}

class Instance {

}

// set up

var lines = []
var marker = null

function setUpDoc() {
  word_divs = document.getElementsByTagName("wt")
  line_divs = document.getElementsByTagName("line")
  setUpPointer()
  setUpLines(line_divs, lines)
}

function setUpPointer() {
  var pointer_div = document.createElement('div')
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
test_line = lines[5]
test_word = test_line.words[3]
marker.mark(test_line)
marker.mark(test_word)

print(test_line.width)

// initialising the locked loop
var interval = frame_interval_ms; // ms
var expected = Date.now() + interval;
setTimeout(step, interval);
function step() {
  var dt = Date.now() - expected; // the drift (positive for overshooting)
  if (dt > interval) {
    // something really bad happened. Maybe the browser (tab) was inactive?
    // possibly special handling to avoid futile "catch up" run
    // TODO refresh the page or reset the dt
  }
  // tiktok();
  expected += interval;
  setTimeout(step, Math.max(0, interval - dt)); // take into account drift
}


// locked loop

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
