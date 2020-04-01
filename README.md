# Fready SandBox

This is project is at its core a sandbox, for testing out ideas with JavaScript, HTML and CSS for [Fready]() focusing on the 'tool' [**pictures**]

# Breaking down the problem
[Frengine](https://github.com/robo-monk/frengine) will give us a document with roughly the following HTML structure.
  
  - `div` page
    - `line` line
      - `wt` word *with an `l` attrbute giving us the relative y of the word*


  So on a *high* level we need to do the following:
  - loop through each `page`
    - loop through each `line`
      - loop through each `word`
        - render the pointer on each word by taking the `l` attribute and converting it to ms

# Coding concept
**Note** This concept will hopefully be implemented near the Alpha release. *Current* code may differ.

## Objectvies
1.  Code should resemble real life. How a real life pointer works?
2. Code should be open for future expansions
3. Lightweight
4. It must be nice, great to look at

## Aproach

Since we're simulating real life and we have objective `1.` to fulfil, *everything* should be an object resembling real life, aka a `Class`

### Defining the base class 
**Thinking points**

1. Previous & Next of self. Every object in a book page has a well defined previous and next of self. A word has a previous and a next word, a moment in time spent reading has a previous and a next one etc.
2. How are we going to generate these objects? `Frengine` gives us a pretty much ordered `List` of `pages`, `lines`, `words`. If we want to create an `Element` for the 2nd word of the 3rd line we could do the following:
  ```JavaScript
  let createAnElementFor = lines[2].words[1]
  new Element(lines[2].words, 1)
  ```

```JavaScript
class Element {
  constructor(ary, elIndex) {
    this.pre = ary[elIndex-1]
    this.this = ary[elIndex]
    this.nex = ary[elIndex+1]
    // ++ handle null
  }

}
```

