var interval = 25; // ms
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


// TODO add consts

//setting up the pointer
var pointer = document.createElement('div')
$(pointer).css({ 'position': 'absolute', 'background-color': '#FFE600', 'width': '100vw', 'height': '20px', 'z-index': '69', 'opacity': '70%' });
$('#reader').append(pointer) // TODO fix pointer's initial placement


var pages_nodes = document.getElementById('page-container').childNodes
page_one = pages_nodes[0]
page_one_nodes = get_kids(page_one)
page_one_content_nodes = get_kids(page_one_nodes[0])
page_one_main_text = page_one_content_nodes[page_one_content_nodes.length - 1]
// page_one_main_text.append(page_one_content_nodes[page_one_content_nodes.length - 1])

main_text_divs = get_kids(page_one_main_text)

var line = 0

function tiktok() {

  current_line = main_text_divs[line]
  current_line.style.zIndex = 150
  var destination = $(current_line).offset();
  $(pointer).css({ top: destination.top - 5 });
  line += 1

  if ($(current_line).is(':space')) {
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
