# Parse Robots

> Parse robots.txt files

Parses the robots.txt file and other util.

Designed so that the sitemap plugin can write the sitemap URL to the robots.txt without string manipulation.

---

- [Install](#install)
- [API](#api)
  - [RobotsLine](#robotsline)
    - [RobotsLine](#robotsline-1)
    - [.parse](#parse)
    - [.serialize](#serialize)
  - [RobotsParser](#robotsparser)
    - [.parse](#parse-1)
    - [.serialize](#serialize-1)
- [License](#license)

---

## Install

```
npm instll robots-util
yarn add robots-util
```

## API

### RobotsLine

Represents a parsed line in a robots.txt file.

#### RobotsLine

```javascript
new RobotsLine(line, index[, key][, value])
```

Create a RobotsLine.

* `line` String the raw line input.
* `index` Number the zero-based line number.
* `key` String the declaration key.
* `value` String the declaration value.

#### .parse

```javascript
RobotsLine.prototype.parse()
```

Parse the line into this instance.

Returns this line instance.

#### .serialize

```javascript
RobotsLine.prototype.serialize()
```

Get a serialized line from the current state.

Returns a string line value.

### RobotsParser

Parse and serialize a robots.txt file.

Designed so that the serialized output has a 1:1 relationship with the
source document but allows inspecting and modifying the `key` and `value`
properties for each line.

#### .parse

```javascript
RobotsParser.prototype.parse(content)
```

Parse the robots.txt file content.

```
User-Agent:
Disallow: /private/ # does not block indexing, add meta noindex
```

Becomes:

```
[
  {
    key: 'User-Agent',
    value: '*',
    lineno: 1,
    line: 'User-Agent: *'
  },
  {
    key: 'Disallow',
    value: '/private/',
    lineno: 2,
    line: 'Disallow: /private/ # does not block indexing, add meta noindex',
    comment: '# does not block indexing, add meta noindex'
  }
]
```

Returns an array of line objects.

* `content` String the robots.txt file content.

#### .serialize

```javascript
RobotsParser.prototype.serialize(list)
```

Serialize the robots.txt declaration list.

Returns a string of robots.txt file content.

* `list` Array the parsed robots.txt declaration list.

## License

MIT

---

[docs]: https://makestatic.ws/docs/ "Documentation"
[yarn]: https://yarnpkg.com "Yarn"
[webpack]: https://webpack.js.org "Webpack"
[babel]: https://babeljs.io "Babel"
[postcss]: http://postcss.org "Postcss"
[sugarss]: https://github.com/postcss/sugarss "Sugarss"
[reshape]: https://github.com/reshape/reshape "Reshape Source Code"
[reshapeml]: https://reshape.ml "Reshape"
[clean-css]: https://github.com/jakubpawlowicz/clean-css "Clean CSS"
[html-minifier]: https://github.com/kangax/html-minifier "Html Minifier"
[uglify-js]: https://github.com/mishoo/UglifyJS2 "Uglify JS"
[imagemin]: https://github.com/imagemin/imagemin "Imagemin"
[mkdoc]: https://github.com/mkdoc/mkdoc "Mkdoc"
[browsersync]: https://www.browsersync.io "Browsersync"
[validator]: https://github.com/validator/validator "HTML Validator"
[github pages]: https://pages.github.com "Github Pages"
[google sitemaps]: https://support.google.com/webmasters/answer/183668?hl=en&ref_topic=4581190 "Google Sitemaps"
[sitemaps]: https://www.sitemaps.org/ "Sitemaps"

