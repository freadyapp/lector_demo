# Fready Tool
This is a sandbox plain HTML, CSS and JavaScript project, created to host our attempts at creating an effective reader.

## Breaking down the problem
---
[Frengine](https://github.com/robo-monk/frengine) will give us a document with roughly the following HTML structure.
  
  - `div` page
    - `line` line
      - `wt` word *with an `l` attrbute giving us the relative y of the word*
  
---
  So on a *high* level we need to do the following:
  - loop through each `page`
    - loop through each `line`
      - loop through each `word`
        - render the pointer on each word by taking the `l` attribute and converting it to ms
