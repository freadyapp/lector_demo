# The Lector project

The *Lector* project aims to enhance your reading and studying potential from an electronic screen. Found out more in [Lector's about page](https://fready.herokuapp.com) on our website.

This `README` will focus on how to install and play with the software yourself and contribute your own ideas to the Fready community.

# Installation

## Prerequisites:
* Python 3
* Some sort of local server (*I recommend checking out [Live Server VS extension]( https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)*)
* That's it!

## Guidelines on how to develop:

A sample *environment-sandbox* is already in place. But if you want to customize it here's the recommended procedure.

The way this development environment is setup, requires a `.frd` file reader's output. An `frd` reader just converts the JSON to HTML. 

`.frd` file example (*Just a fancy JSON*)
```JSON
{"page_container":"<html><body><div id=\"page-container\">\n<div class=\"pf w0 h0\" data-page-no=\"1\" id=\"pf1\"><div class=\"pc pc1 w0 h0\"><img alt=\"\" class=\"bi x0 y0 w1 h1\" src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAATkAAAHCCAIAAAAb1il8AAAACXBIWXMAAAsSAAALEgHS3X78AAAEeUlEQVR42u3cPU4CQRi.....
```

To this:
```HTML 
<div id="reader">    
  <style "text="" css"="">
  #page-container {top: 0;left: 0;  margin: 0;  padding: 0;  bottom: 0;  right: 0;  width: auto;  height: auto;  overflow: visible;  background-color: transparent  }  @media print {  body { ...... 
```

The simplest way to obtain that HTML is to 
* headover to [Fready](https://fready.herokuapp.com/)
* upload a PDF and go to its reading page
* click `Inspect element` 
* copy the `<div id="reader">` including its contents and its closing tag. 
* paste that in the `view_files/reader.txt`
* `$ python compile_sandbox.py`

## Contact

[Email me](mailto:rrobomonk@gmail.com) or visit [Fready](https://fready.herokuapp.com) to find out more