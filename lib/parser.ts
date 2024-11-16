import { EOL } from 'os';

/**
 *  Represents a parsed line in a robots.txt file.
 *
 *  @class RobotsLine
 */
class RobotsLine {
  /**
   * the raw line input.
   * @type {string}
   * @private
   */
  private readonly _line: string;
  
  /**
   * the zero-based line number.
   * @type {number}
   * @private
   */
  private readonly _index: number;
  
  /**
   * the declaration key.
   * @type {string}
   * @private
   */
  private _key: string;
  
  /**
   * the declaration value.
   * @type {string}
   * @private
   */
  private _value: string;
  
  /**
   * A comment on this line
   * @type {string}
   * @private
   */
  private _comment: string;
  
  /**
   * whitespace before the value
   * @type {string}
   * @private
   */
  private _before: string;
  
  /**
   * whitespace after the value
   * @type {string}
   * @private
   */
  private _after: string;
  
  
  /**
   *  Create a RobotsLine.
   *
   *  @constructor RobotsLine
   *  @param {String} line the raw line input.
   *  @param {Number} index the zero-based line number.
   *  @param {String} [key] the declaration key.
   *  @param {String} [value] the declaration value.
   */
  constructor(line: string, index: number, key: string = '', value: string = '') {
    this._line = line;
    this._index = index;
    this._key = key;
    this._value = value;
    this._comment = '';
    
    // whitespace before and after the value
    this._before = '';
    this._after = '';
  }
  
  /**
   *  The declaration key.
   *
   *  @property {String} key
   *  @member RobotsLine
   */
  get key(): string {
    return this._key;
  }
  
  set key(val: string) {
    this._key = val;
  }
  
  /**
   *  The declaration value.
   *
   *  @property {String} value
   *  @member RobotsLine
   */
  get value(): string {
    return this._value;
  }
  
  set value(val: string) {
    // always clear value to the empty string
    if (!val) {
      val = '';
    }
    this._value = val;
  }
  
  /**
   *  A comment on this line.
   *
   *  @property {String} comment
   *  @member RobotsLine
   *  @readonly
   */
  get comment(): string {
    return this._comment;
  }
  
  /**
   *  The raw input line.
   *
   *  @property {String} line
   *  @member RobotsLine
   *  @readonly
   */
  get line(): string {
    return this._line;
  }
  
  /**
   *  The line number using a one-based index.
   *
   *  @property {Number} lineno
   *  @member RobotsLine
   *  @readonly
   */
  get lineno(): number {
    return this._index + 1;
  }
  
  /**
   *  Determine if this line has a comment.
   *
   *  @function hasComment
   *  @member RobotsLine
   *
   *  @returns {boolean} a boolean indicating if this line contains a comment.
   */
  hasComment(): boolean {
    return this.comment !== undefined;
  }
  
  /**
   *  Determine if this line has a valid key/value pair.
   *
   *  @function hasKeyPair
   *  @member RobotsLine
   *
   *  @returns {boolean} a boolean indicating if this line contains a key and value.
   */
  hasKeyPair(): boolean {
    return this.key !== undefined && this.value !== undefined;
  }
  
  /**
   *  Parse the line into this instance.
   *
   *  @function parse
   *  @member RobotsLine
   *
   *  @returns {RobotsLine} this line instance.
   */
  parse(): RobotsLine {
    let line = this.line;
    const ind = line.indexOf(':');
    const isCommentLine = /^\s*#/.test(line);
    const before = /^(\s+).*/;
    const after = /(\s+)$/;
    if (isCommentLine) {
      // this line is comment
      this._comment = line.substring(line.indexOf('#'));
    }
    else if (~ind) {
      // contain key-value
      let key = line.substring(0, ind);
      let val = line.substring(ind + 1);
      let hash = val.indexOf('#');
      if (~hash) {
        this._comment = val.substring(hash);
        val = val.substring(0, hash);
      }
      
      this._before = val.replace(before, '$1');
      if (after.test(val)) {
        this._after = val.replace(after, '$1');
      }
      
      this.key = key;
      this.value = val.trim();
    }
    
    return this;
  }
  
  /**
   *  Get a serialized line from the current state.
   *
   *  @function serialize
   *  @member RobotsLine
   *
   *  @returns {string} a string line value.
   */
  serialize(): string {
    let content = '';
    if (this.hasKeyPair()) {
      content += `${ this.key }:${ this._before }${ this.value }${ this._after }`;
      if (this.hasComment()) {
        content += this.comment;
      }
    }
    else {
      content += this.line;
    }
    
    content += EOL;
    return content;
  }
}

class RobotsList extends Array<RobotsLine> {
  constructor(...items: RobotsLine[]) {
    super(...items);
    
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, RobotsList.prototype);
  }
  
  public test = ''
  
  /**
   * Add Robots key-value pairs to the list
   * @param {string} key Robots key
   * @param {string} value Robots value
   * @param {string?} line the raw line input
   */
  append(key: string, value: string, line?: string) {
    line = line || (key + ': ' + value);
    const next = new RobotsLine(line, this.length, key, value);
    next['_before'] = ' ';
    this.push(next);
  }
}

/**
 *  Parse and serialize a robots.txt file.
 *
 *  Designed so that the serialized output has a 1:1 relationship with the
 *  source document but allows inspecting and modifying the `key` and `value`
 *  properties for each line.
 *
 *  @class RobotsParser
 */
export class RobotsParser {
  
  /**
   *  Parse the robots.txt file content.
   *
   *  ```
   *  User-Agent: *
   *  Disallow: /private/ # does not block indexing, add meta noindex
   *  ```
   *
   *  Becomes:
   *
   *  ```
   *  [
   *    {
   *      key: 'User-Agent',
   *      value: '*',
   *      lineno: 1,
   *      line: 'User-Agent: *'
   *    },
   *    {
   *      key: 'Disallow',
   *      value: '/private/',
   *      lineno: 2,
   *      line: 'Disallow: /private/ # does not block indexing, add meta noindex',
   *      comment: '# does not block indexing, add meta noindex'
   *    }
   *  ]
   *  ```
   *
   *  @function parse
   *  @member RobotsParser
   *  @param {String} content the robots.txt file content.
   *
   *  @returns an array of line objects.
   */
  parse(content: string): RobotsList {
    const list = new RobotsList();
    const lines = content.split('\n');
    // remove trailing newline
    if (!lines[lines.length - 1]) {
      lines.pop();
    }
    lines.forEach((line, index) => {
      const item = new RobotsLine(line, index);
      list.push(item.parse());
    });
    return list;
  }
  
  /**
   *  Serialize the robots.txt declaration list.
   *
   *  @function serialize
   *  @member RobotsParser
   *  @param {Array} list the parsed robots.txt declaration list.
   *
   *  @returns a string of robots.txt file content.
   */
  serialize(list: RobotsList): string {
    let content = '';
    for (const line of list) {
      content += line.serialize();
    }
    return content;
  }
}
