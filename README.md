# Imoji

![NPM Version](https://img.shields.io/npm/v/imoji.svg)
<img src="https://travis-ci.org/jonhue/imoji.js.svg?branch=master" />

A sleek & responsive emoji input.

**[Demo](https://jonhue.github.io/imoji.js)**

![screenshot](https://user-images.githubusercontent.com/13420273/35448108-b7339f2a-02b9-11e8-9e67-aaecb1a5d84f.png)
![screenshot](https://user-images.githubusercontent.com/13420273/35448236-09fbdbe6-02ba-11e8-8236-4c82054b5a64.png)

---

## Table of Contents

* [Information](#information)
* [Usage](#usage)
    * [Functions](#functions)
    * [Input](#input)
    * [Events](#events)
    * [Emojis](#emojis)
    * [Styles](#styles)
* [To Do](#to-do)
* [Contributing](#contributing)
    * [Contributors](#contributors)
    * [Semantic Versioning](#semantic-versioning)
* [License](#license)

---

## Information

**Size:** Imoji takes < 1kb gzipped.

**Dependencies:** [jQuery](https://github.com/jquery/jquery)

---

## Usage

To add Imoji put the following code in your `<body>` tag:

```html
<div class="imoji-picker">
    <div class="imoji-picker--search">
        <input class="imoji-picker--search-input" type="text" placeholder="Search" />
        <div class="imoji-picker--search-delete imoji-icon">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="14px" height="14px" viewBox="0 0 16 16"><g transform="translate(0, 0)"><path fill="#2b2b2b" d="M14.7,1.3c-0.4-0.4-1-0.4-1.4,0L8,6.6L2.7,1.3c-0.4-0.4-1-0.4-1.4,0s-0.4,1,0,1.4L6.6,8l-5.3,5.3
c-0.4,0.4-0.4,1,0,1.4C1.5,14.9,1.7,15,2,15s0.5-0.1,0.7-0.3L8,9.4l5.3,5.3c0.2,0.2,0.5,0.3,0.7,0.3s0.5-0.1,0.7-0.3
c0.4-0.4,0.4-1,0-1.4L9.4,8l5.3-5.3C15.1,2.3,15.1,1.7,14.7,1.3z"></path></g></svg>
        </div>
    </div>
    <div class="imoji-picker--emojis">
    </div>
    <div class="imoji-picker--footer">
        <div class="imoji-picker--search-trigger imoji-icon">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="16px" height="16px" viewBox="0 0 16 16"><g transform="translate(0, 0)"><path fill="#2b2b2b" d="M12.7,11.3c0.9-1.2,1.4-2.6,1.4-4.2C14.1,3.2,11,0,7.1,0S0,3.2,0,7.1c0,3.9,3.2,7.1,7.1,7.1
c1.6,0,3.1-0.5,4.2-1.4l3,3c0.2,0.2,0.5,0.3,0.7,0.3s0.5-0.1,0.7-0.3c0.4-0.4,0.4-1,0-1.4L12.7,11.3z M7.1,12.1
C4.3,12.1,2,9.9,2,7.1S4.3,2,7.1,2s5.1,2.3,5.1,5.1S9.9,12.1,7.1,12.1z"></path></g></svg>
        </div>
        <div class="imoji-picker--categories">
        </div>
        <div class="imoji-picker--delete imoji-icon">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="16px" height="16px" viewBox="0 0 16 16"><g transform="translate(0, 0)"><path fill="#2b2b2b" d="M15,2H5C4.696,2,4.409,2.138,4.219,2.375l-4,5c-0.292,0.365-0.292,0.884,0,1.249l4,5
C4.409,13.862,4.696,14,5,14h10c0.553,0,1-0.448,1-1V3C16,2.448,15.553,2,15,2z M14,12H5.48l-3.2-4l3.2-4H14V12z"></path></g></svg>
        </div>
    </div>
</div>
```

Now initialize Imoji:

```js
Imoji.init();
```

### Functions

```js
// Open the Imoji picker
Imoji.open();

// Close the Imoji picker
Imoji.close();

// Search for emojis (aliases/tags)
Imoji.search('smile');

// Select an emoji (alias)
Imoji.select('smile');

// Render a hash of emoji categories including emoji objects in an array
Imoji.render(emojis);

// Scrolls to an emoji category
Imoji.scrollToCategory('People');

// Shows the search input
Imoji.showSearch();

// Hides and resets the search input
Imoji.hideSearch();
```

### Inputs

To use Imoji with an `<input>` element, first associate it with `Imoji`. There are two ways to do so:

1) Attach the input to Imoji on initialization:

```js
Imoji.init({ input: $('input#imoji') })
```

2) Open the Imoji picker from the form:

```html
<input type="text" data-imoji></input>
```

You can also trigger the Imoji picker from another element, Imoji will take the closest `<input>` tag:

```html
<input type="text"></input>
<div class="trigger-imoji" data-imoji></div>
```

### Events

Imoji emits events that allow you to track the emoji selection. Imoji fires events on the `$(document)` object.

* `imoji:open` fires before the Imoji picker opens.

* `imoji:close` fires before the Imoji picker closes.

* `imoji:select` fires when an emoji has been selected. Access the emoji object with the second callback parameter.

### Emojis

Imoji uses the [`emoji.json`](https://github.com/github/gemoji/blob/master/db/emoji.json) data from the [gemoji](https://github.com/github/gemoji) project of GitHub. You can also use your own JSON file. It's structure should be similar to the default data however.

```js
Imoji.init({ emojis: '/emojis.json' })
```

### Styles

If you want to customize the styling of Imoji, override the CSS values specified in the styling section of [imoji.sass](https://github.com/jonhue/imoji.js/blob/master/imoji.sass#L94).

---

## To Do

[Here](https://github.com/jonhue/imoji.js/projects/1) is the full list of current projects.

To propose your ideas, initiate the discussion by adding a [new issue](https://github.com/jonhue/imoji.js/issues/new).

---

## Contributing

We hope that you will consider contributing to Imoji.js. Please read this short overview for some information about how to get started:

[Learn more about contributing to this repository](CONTRIBUTING.md), [Code of Conduct](CODE_OF_CONDUCT.md)

### Contributors

Give the people some :heart: who are working on this project. See them all at:

https://github.com/jonhue/imoji.js/graphs/contributors

### Semantic Versioning

Imoji.js follows Semantic Versioning 2.0 as defined at http://semver.org.

## License

MIT License

Copyright (c) 2018 Jonas Hübotter

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
