// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.

// This is a specialised implementation of a System module loader.

// @ts-nocheck
/* eslint-disable */
let System, __instantiateAsync, __instantiate;

(() => {
  const r = new Map();

  System = {
    register(id, d, f) {
      r.set(id, { d, f, exp: {} });
    },
  };

  async function dI(mid, src) {
    let id = mid.replace(/\.\w+$/i, "");
    if (id.includes("./")) {
      const [o, ...ia] = id.split("/").reverse(),
        [, ...sa] = src.split("/").reverse(),
        oa = [o];
      let s = 0,
        i;
      while ((i = ia.shift())) {
        if (i === "..") s++;
        else if (i === ".") break;
        else oa.push(i);
      }
      if (s < sa.length) oa.push(...sa.slice(s));
      id = oa.reverse().join("/");
    }
    return r.has(id) ? gExpA(id) : import(mid);
  }

  function gC(id, main) {
    return {
      id,
      import: (m) => dI(m, id),
      meta: { url: id, main },
    };
  }

  function gE(exp) {
    return (id, v) => {
      v = typeof id === "string" ? { [id]: v } : id;
      for (const [id, value] of Object.entries(v)) {
        Object.defineProperty(exp, id, {
          value,
          writable: true,
          enumerable: true,
        });
      }
    };
  }

  function rF(main) {
    for (const [id, m] of r.entries()) {
      const { f, exp } = m;
      const { execute: e, setters: s } = f(gE(exp), gC(id, id === main));
      delete m.f;
      m.e = e;
      m.s = s;
    }
  }

  async function gExpA(id) {
    if (!r.has(id)) return;
    const m = r.get(id);
    if (m.s) {
      const { d, e, s } = m;
      delete m.s;
      delete m.e;
      for (let i = 0; i < s.length; i++) s[i](await gExpA(d[i]));
      const r = e();
      if (r) await r;
    }
    return m.exp;
  }

  function gExp(id) {
    if (!r.has(id)) return;
    const m = r.get(id);
    if (m.s) {
      const { d, e, s } = m;
      delete m.s;
      delete m.e;
      for (let i = 0; i < s.length; i++) s[i](gExp(d[i]));
      e();
    }
    return m.exp;
  }

  __instantiateAsync = async (m) => {
    System = __instantiateAsync = __instantiate = undefined;
    rF(m);
    return gExpA(m);
  };

  __instantiate = (m) => {
    System = __instantiateAsync = __instantiate = undefined;
    rF(m);
    return gExp(m);
  };
})();

System.register(
  "file:///home/ilgaz/Projects/deno-grep/src/reader",
  [],
  function (exports_1, context_1) {
    "use strict";
    var readFromFile, decode;
    var __moduleName = context_1 && context_1.id;
    return {
      setters: [],
      execute: function () {
        exports_1(
          "readFromFile",
          readFromFile = async (filename) => {
            const file = await Deno.open(filename, { read: true });
            const dataInFile = await Deno.readAll(file);
            Deno.close(file.rid);
            return decode(dataInFile).trim();
          },
        );
        decode = (buffer) => {
          const decoder = new TextDecoder();
          return decoder.decode(buffer);
        };
      },
    };
  },
);
System.register(
  "https://deno.land/std/fmt/colors",
  [],
  function (exports_2, context_2) {
    "use strict";
    var noColor, enabled, ANSI_PATTERN;
    var __moduleName = context_2 && context_2.id;
    function setColorEnabled(value) {
      if (noColor) {
        return;
      }
      enabled = value;
    }
    exports_2("setColorEnabled", setColorEnabled);
    function getColorEnabled() {
      return enabled;
    }
    exports_2("getColorEnabled", getColorEnabled);
    function code(open, close) {
      return {
        open: `\x1b[${open.join(";")}m`,
        close: `\x1b[${close}m`,
        regexp: new RegExp(`\\x1b\\[${close}m`, "g"),
      };
    }
    function run(str, code) {
      return enabled
        ? `${code.open}${str.replace(code.regexp, code.open)}${code.close}`
        : str;
    }
    function reset(str) {
      return run(str, code([0], 0));
    }
    exports_2("reset", reset);
    function bold(str) {
      return run(str, code([1], 22));
    }
    exports_2("bold", bold);
    function dim(str) {
      return run(str, code([2], 22));
    }
    exports_2("dim", dim);
    function italic(str) {
      return run(str, code([3], 23));
    }
    exports_2("italic", italic);
    function underline(str) {
      return run(str, code([4], 24));
    }
    exports_2("underline", underline);
    function inverse(str) {
      return run(str, code([7], 27));
    }
    exports_2("inverse", inverse);
    function hidden(str) {
      return run(str, code([8], 28));
    }
    exports_2("hidden", hidden);
    function strikethrough(str) {
      return run(str, code([9], 29));
    }
    exports_2("strikethrough", strikethrough);
    function black(str) {
      return run(str, code([30], 39));
    }
    exports_2("black", black);
    function red(str) {
      return run(str, code([31], 39));
    }
    exports_2("red", red);
    function green(str) {
      return run(str, code([32], 39));
    }
    exports_2("green", green);
    function yellow(str) {
      return run(str, code([33], 39));
    }
    exports_2("yellow", yellow);
    function blue(str) {
      return run(str, code([34], 39));
    }
    exports_2("blue", blue);
    function magenta(str) {
      return run(str, code([35], 39));
    }
    exports_2("magenta", magenta);
    function cyan(str) {
      return run(str, code([36], 39));
    }
    exports_2("cyan", cyan);
    function white(str) {
      return run(str, code([37], 39));
    }
    exports_2("white", white);
    function gray(str) {
      return run(str, code([90], 39));
    }
    exports_2("gray", gray);
    function bgBlack(str) {
      return run(str, code([40], 49));
    }
    exports_2("bgBlack", bgBlack);
    function bgRed(str) {
      return run(str, code([41], 49));
    }
    exports_2("bgRed", bgRed);
    function bgGreen(str) {
      return run(str, code([42], 49));
    }
    exports_2("bgGreen", bgGreen);
    function bgYellow(str) {
      return run(str, code([43], 49));
    }
    exports_2("bgYellow", bgYellow);
    function bgBlue(str) {
      return run(str, code([44], 49));
    }
    exports_2("bgBlue", bgBlue);
    function bgMagenta(str) {
      return run(str, code([45], 49));
    }
    exports_2("bgMagenta", bgMagenta);
    function bgCyan(str) {
      return run(str, code([46], 49));
    }
    exports_2("bgCyan", bgCyan);
    function bgWhite(str) {
      return run(str, code([47], 49));
    }
    exports_2("bgWhite", bgWhite);
    /* Special Color Sequences */
    function clampAndTruncate(n, max = 255, min = 0) {
      return Math.trunc(Math.max(Math.min(n, max), min));
    }
    /** Set text color using paletted 8bit colors.
     * https://en.wikipedia.org/wiki/ANSI_escape_code#8-bit */
    function rgb8(str, color) {
      return run(str, code([38, 5, clampAndTruncate(color)], 39));
    }
    exports_2("rgb8", rgb8);
    /** Set background color using paletted 8bit colors.
     * https://en.wikipedia.org/wiki/ANSI_escape_code#8-bit */
    function bgRgb8(str, color) {
      return run(str, code([48, 5, clampAndTruncate(color)], 49));
    }
    exports_2("bgRgb8", bgRgb8);
    /** Set text color using 24bit rgb.
     * `color` can be a number in range `0x000000` to `0xffffff` or
     * an `Rgb`.
     *
     * To produce the color magenta:
     *
     *      rgba24("foo", 0xff00ff);
     *      rgba24("foo", {r: 255, g: 0, b: 255});
     */
    function rgb24(str, color) {
      if (typeof color === "number") {
        return run(
          str,
          code(
            [38, 2, (color >> 16) & 0xff, (color >> 8) & 0xff, color & 0xff],
            39,
          ),
        );
      }
      return run(
        str,
        code([
          38,
          2,
          clampAndTruncate(color.r),
          clampAndTruncate(color.g),
          clampAndTruncate(color.b),
        ], 39),
      );
    }
    exports_2("rgb24", rgb24);
    /** Set background color using 24bit rgb.
     * `color` can be a number in range `0x000000` to `0xffffff` or
     * an `Rgb`.
     *
     * To produce the color magenta:
     *
     *      bgRgba24("foo", 0xff00ff);
     *      bgRgba24("foo", {r: 255, g: 0, b: 255});
     */
    function bgRgb24(str, color) {
      if (typeof color === "number") {
        return run(
          str,
          code(
            [48, 2, (color >> 16) & 0xff, (color >> 8) & 0xff, color & 0xff],
            49,
          ),
        );
      }
      return run(
        str,
        code([
          48,
          2,
          clampAndTruncate(color.r),
          clampAndTruncate(color.g),
          clampAndTruncate(color.b),
        ], 49),
      );
    }
    exports_2("bgRgb24", bgRgb24);
    function stripColor(string) {
      return string.replace(ANSI_PATTERN, "");
    }
    exports_2("stripColor", stripColor);
    return {
      setters: [],
      execute: function () {
        // Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
        /**
             * A module to print ANSI terminal colors. Inspired by chalk, kleur, and colors
             * on npm.
             *
             * ```
             * import { bgBlue, red, bold } from "https://deno.land/std/fmt/colors.ts";
             * console.log(bgBlue(red(bold("Hello world!"))));
             * ```
             *
             * This module supports `NO_COLOR` environmental variable disabling any coloring
             * if `NO_COLOR` is set.
             */
        noColor = Deno.noColor;
        enabled = !noColor;
        // https://github.com/chalk/ansi-regex/blob/2b56fb0c7a07108e5b54241e8faec160d393aedb/index.js
        ANSI_PATTERN = new RegExp(
          [
            "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)",
            "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))",
          ].join("|"),
          "g",
        );
      },
    };
  },
);
System.register(
  "file:///home/ilgaz/Projects/deno-grep/src/regexHelpers",
  [],
  function (exports_3, context_3) {
    "use strict";
    var generateRegex, isRegexString, isFilename;
    var __moduleName = context_3 && context_3.id;
    return {
      setters: [],
      execute: function () {
        generateRegex = (regexString, flags) =>
          new RegExp(regexString, flags.join(""));
        exports_3(
          "isRegexString",
          isRegexString = (str) => generateRegex(/\/.+\/\w*/, ["g"]).test(str),
        );
        exports_3(
          "isFilename",
          isFilename = (name) =>
            generateRegex(/[A-z]+\.[A-z]+\.?[A-z]+/, ["g"]).test(name),
        );
      },
    };
  },
);
System.register(
  "file:///home/ilgaz/Projects/deno-grep/src/argumentParser",
  ["file:///home/ilgaz/Projects/deno-grep/src/reader"],
  function (exports_4, context_4) {
    "use strict";
    var reader_ts_1;
    var __moduleName = context_4 && context_4.id;
    return {
      setters: [
        function (reader_ts_1_1) {
          reader_ts_1 = reader_ts_1_1;
        },
      ],
      execute: function () {
        exports_4("default", async (argList) => {
          const staticArgs = argList._;
          let searchTerm, filename;
          if (staticArgs.length == 0) {
            console.error(
              "You did not specify enough arguments for this program to run, exiting",
            );
            Deno.exit();
          }
          if (staticArgs.length == 1 && !argList.hasOwnProperty("f")) {
            console.error(
              "You did not specify the pattern to look for, exiting",
            );
            Deno.exit();
          }
          if (argList.hasOwnProperty("f")) {
            searchTerm = await reader_ts_1.readFromFile(argList.f)
              .catch((err) => {
                console.log("Could not read from file ", argList.f);
                Deno.exit();
              });
          }
          if (!searchTerm) {
            searchTerm = staticArgs[0];
          }
          filename = staticArgs[staticArgs.length - 1];
          return { searchTerm, filename, flags: argList.flags };
        });
      },
    };
  },
);
System.register(
  "file:///home/ilgaz/Projects/deno-grep/src/finder",
  [
    "https://deno.land/std/fmt/colors",
    "file:///home/ilgaz/Projects/deno-grep/src/regexHelpers",
  ],
  function (exports_5, context_5) {
    "use strict";
    var colors_ts_1,
      regexHelpers_ts_1,
      findByKeyword,
      handleContextFlag,
      findMatchInsideLine;
    var __moduleName = context_5 && context_5.id;
    return {
      setters: [
        function (colors_ts_1_1) {
          colors_ts_1 = colors_ts_1_1;
        },
        function (regexHelpers_ts_1_1) {
          regexHelpers_ts_1 = regexHelpers_ts_1_1;
        },
      ],
      execute: function () {
        exports_5(
          "findByKeyword",
          findByKeyword = (lines, keyword, flags) => {
            if (regexHelpers_ts_1.isRegexString(keyword)) {
              console.log(
                "Well, direct regex grepping is not supported just yet!",
              );
              Deno.exit();
            }
            if (flags.hasOwnProperty("C")) {
              return handleContextFlag(lines, flags, String(keyword));
            }
            return lines
              .map((line) => findMatchInsideLine(line, keyword, flags, null))
              .filter((a) => a)
              .join("\n");
          },
        );
        handleContextFlag = (lines, flags, keyword) => {
          const { C: contextValue, i: insensitive } = flags;
          const lineArray = [];
          lines
            .map((line, index) => {
              if (!insensitive && !line.includes(keyword)) {
                return;
              }
              if (line.toLowerCase().includes(keyword.toLowerCase())) {
                const linesBefore = Math.max(index - Number(contextValue), 0);
                const linesAfter = index + Number(contextValue) + 1;
                const slice = lines.slice(linesBefore, linesAfter);
                lineArray.push(...slice);
              }
            });
          return lineArray
            .filter((line, i) => {
              if (!line.length) {
                return true;
              }
              return lineArray.indexOf(line) == i;
            })
            .map((line) => findMatchInsideLine(line, keyword, flags, line))
            .join("\n");
        };
        findMatchInsideLine = (line, keyword, flags, emptyLineValue) => {
          const { i: insensitive } = flags;
          let lineToCheck;
          let keywordToCheck;
          let regex;
          if (insensitive) {
            lineToCheck = line.toLowerCase();
            keywordToCheck = keyword.toLowerCase();
            regex = new RegExp(keyword, "ig");
          } else {
            lineToCheck = line;
            keywordToCheck = keyword;
            regex = new RegExp(keyword, "g");
          }
          if (lineToCheck.includes(keywordToCheck)) {
            if (insensitive) {
              const [match] = line.match(regex) || "";
              return line.replace(
                regex,
                colors_ts_1.red(colors_ts_1.bold(match)),
              );
            }
            return line.replace(
              regex,
              colors_ts_1.red(colors_ts_1.bold(keyword)),
            );
          }
          return emptyLineValue;
        };
      },
    };
  },
);
System.register(
  "https://deno.land/std/testing/diff",
  [],
  function (exports_6, context_6) {
    "use strict";
    var DiffType, REMOVED, COMMON, ADDED;
    var __moduleName = context_6 && context_6.id;
    function createCommon(A, B, reverse) {
      const common = [];
      if (A.length === 0 || B.length === 0) {
        return [];
      }
      for (let i = 0; i < Math.min(A.length, B.length); i += 1) {
        if (
          A[reverse ? A.length - i - 1 : i] ===
            B[reverse ? B.length - i - 1 : i]
        ) {
          common.push(A[reverse ? A.length - i - 1 : i]);
        } else {
          return common;
        }
      }
      return common;
    }
    function diff(A, B) {
      const prefixCommon = createCommon(A, B);
      const suffixCommon = createCommon(
        A.slice(prefixCommon.length),
        B.slice(prefixCommon.length),
        true,
      ).reverse();
      A = suffixCommon.length
        ? A.slice(prefixCommon.length, -suffixCommon.length)
        : A.slice(prefixCommon.length);
      B = suffixCommon.length
        ? B.slice(prefixCommon.length, -suffixCommon.length)
        : B.slice(prefixCommon.length);
      const swapped = B.length > A.length;
      [A, B] = swapped ? [B, A] : [A, B];
      const M = A.length;
      const N = B.length;
      if (!M && !N && !suffixCommon.length && !prefixCommon.length) {
        return [];
      }
      if (!N) {
        return [
          ...prefixCommon.map((c) => ({ type: DiffType.common, value: c })),
          ...A.map((a) => ({
            type: swapped ? DiffType.added : DiffType.removed,
            value: a,
          })),
          ...suffixCommon.map((c) => ({ type: DiffType.common, value: c })),
        ];
      }
      const offset = N;
      const delta = M - N;
      const size = M + N + 1;
      const fp = new Array(size).fill({ y: -1 });
      /**
         * INFO:
         * This buffer is used to save memory and improve performance.
         * The first half is used to save route and last half is used to save diff
         * type.
         * This is because, when I kept new uint8array area to save type,performance
         * worsened.
         */
      const routes = new Uint32Array((M * N + size + 1) * 2);
      const diffTypesPtrOffset = routes.length / 2;
      let ptr = 0;
      let p = -1;
      function backTrace(A, B, current, swapped) {
        const M = A.length;
        const N = B.length;
        const result = [];
        let a = M - 1;
        let b = N - 1;
        let j = routes[current.id];
        let type = routes[current.id + diffTypesPtrOffset];
        while (true) {
          if (!j && !type) {
            break;
          }
          const prev = j;
          if (type === REMOVED) {
            result.unshift({
              type: swapped ? DiffType.removed : DiffType.added,
              value: B[b],
            });
            b -= 1;
          } else if (type === ADDED) {
            result.unshift({
              type: swapped ? DiffType.added : DiffType.removed,
              value: A[a],
            });
            a -= 1;
          } else {
            result.unshift({ type: DiffType.common, value: A[a] });
            a -= 1;
            b -= 1;
          }
          j = routes[prev];
          type = routes[prev + diffTypesPtrOffset];
        }
        return result;
      }
      function createFP(slide, down, k, M) {
        if (slide && slide.y === -1 && down && down.y === -1) {
          return { y: 0, id: 0 };
        }
        if (
          (down && down.y === -1) ||
          k === M ||
          (slide && slide.y) > (down && down.y) + 1
        ) {
          const prev = slide.id;
          ptr++;
          routes[ptr] = prev;
          routes[ptr + diffTypesPtrOffset] = ADDED;
          return { y: slide.y, id: ptr };
        } else {
          const prev = down.id;
          ptr++;
          routes[ptr] = prev;
          routes[ptr + diffTypesPtrOffset] = REMOVED;
          return { y: down.y + 1, id: ptr };
        }
      }
      function snake(k, slide, down, _offset, A, B) {
        const M = A.length;
        const N = B.length;
        if (k < -N || M < k) {
          return { y: -1, id: -1 };
        }
        const fp = createFP(slide, down, k, M);
        while (fp.y + k < M && fp.y < N && A[fp.y + k] === B[fp.y]) {
          const prev = fp.id;
          ptr++;
          fp.id = ptr;
          fp.y += 1;
          routes[ptr] = prev;
          routes[ptr + diffTypesPtrOffset] = COMMON;
        }
        return fp;
      }
      while (fp[delta + offset].y < N) {
        p = p + 1;
        for (let k = -p; k < delta; ++k) {
          fp[k + offset] = snake(
            k,
            fp[k - 1 + offset],
            fp[k + 1 + offset],
            offset,
            A,
            B,
          );
        }
        for (let k = delta + p; k > delta; --k) {
          fp[k + offset] = snake(
            k,
            fp[k - 1 + offset],
            fp[k + 1 + offset],
            offset,
            A,
            B,
          );
        }
        fp[delta + offset] = snake(
          delta,
          fp[delta - 1 + offset],
          fp[delta + 1 + offset],
          offset,
          A,
          B,
        );
      }
      return [
        ...prefixCommon.map((c) => ({ type: DiffType.common, value: c })),
        ...backTrace(A, B, fp[delta + offset], swapped),
        ...suffixCommon.map((c) => ({ type: DiffType.common, value: c })),
      ];
    }
    exports_6("default", diff);
    return {
      setters: [],
      execute: function () {
        (function (DiffType) {
          DiffType["removed"] = "removed";
          DiffType["common"] = "common";
          DiffType["added"] = "added";
        })(DiffType || (DiffType = {}));
        exports_6("DiffType", DiffType);
        REMOVED = 1;
        COMMON = 2;
        ADDED = 3;
      },
    };
  },
);
System.register(
  "https://deno.land/std/testing/asserts",
  ["https://deno.land/std/fmt/colors", "https://deno.land/std/testing/diff"],
  function (exports_7, context_7) {
    "use strict";
    var colors_ts_2, diff_ts_1, CAN_NOT_DISPLAY, AssertionError;
    var __moduleName = context_7 && context_7.id;
    function format(v) {
      let string = Deno.inspect(v);
      if (typeof v == "string") {
        string = `"${string.replace(/(?=["\\])/g, "\\")}"`;
      }
      return string;
    }
    function createColor(diffType) {
      switch (diffType) {
        case diff_ts_1.DiffType.added:
          return (s) => colors_ts_2.green(colors_ts_2.bold(s));
        case diff_ts_1.DiffType.removed:
          return (s) => colors_ts_2.red(colors_ts_2.bold(s));
        default:
          return colors_ts_2.white;
      }
    }
    function createSign(diffType) {
      switch (diffType) {
        case diff_ts_1.DiffType.added:
          return "+   ";
        case diff_ts_1.DiffType.removed:
          return "-   ";
        default:
          return "    ";
      }
    }
    function buildMessage(diffResult) {
      const messages = [];
      messages.push("");
      messages.push("");
      messages.push(
        `    ${colors_ts_2.gray(colors_ts_2.bold("[Diff]"))} ${
          colors_ts_2.red(colors_ts_2.bold("Actual"))
        } / ${colors_ts_2.green(colors_ts_2.bold("Expected"))}`,
      );
      messages.push("");
      messages.push("");
      diffResult.forEach((result) => {
        const c = createColor(result.type);
        messages.push(c(`${createSign(result.type)}${result.value}`));
      });
      messages.push("");
      return messages;
    }
    function isKeyedCollection(x) {
      return [Symbol.iterator, "size"].every((k) => k in x);
    }
    function equal(c, d) {
      const seen = new Map();
      return (function compare(a, b) {
        // Have to render RegExp & Date for string comparison
        // unless it's mistreated as object
        if (
          a &&
          b &&
          ((a instanceof RegExp && b instanceof RegExp) ||
            (a instanceof Date && b instanceof Date))
        ) {
          return String(a) === String(b);
        }
        if (Object.is(a, b)) {
          return true;
        }
        if (a && typeof a === "object" && b && typeof b === "object") {
          if (seen.get(a) === b) {
            return true;
          }
          if (Object.keys(a || {}).length !== Object.keys(b || {}).length) {
            return false;
          }
          if (isKeyedCollection(a) && isKeyedCollection(b)) {
            if (a.size !== b.size) {
              return false;
            }
            let unmatchedEntries = a.size;
            for (const [aKey, aValue] of a.entries()) {
              for (const [bKey, bValue] of b.entries()) {
                /* Given that Map keys can be references, we need
                             * to ensure that they are also deeply equal */
                if (
                  (aKey === aValue && bKey === bValue && compare(aKey, bKey)) ||
                  (compare(aKey, bKey) && compare(aValue, bValue))
                ) {
                  unmatchedEntries--;
                }
              }
            }
            return unmatchedEntries === 0;
          }
          const merged = { ...a, ...b };
          for (const key in merged) {
            if (!compare(a && a[key], b && b[key])) {
              return false;
            }
          }
          seen.set(a, b);
          return true;
        }
        return false;
      })(c, d);
    }
    exports_7("equal", equal);
    /** Make an assertion, if not `true`, then throw. */
    function assert(expr, msg = "") {
      if (!expr) {
        throw new AssertionError(msg);
      }
    }
    exports_7("assert", assert);
    /**
     * Make an assertion that `actual` and `expected` are equal, deeply. If not
     * deeply equal, then throw.
     */
    function assertEquals(actual, expected, msg) {
      if (equal(actual, expected)) {
        return;
      }
      let message = "";
      const actualString = format(actual);
      const expectedString = format(expected);
      try {
        const diffResult = diff_ts_1.default(
          actualString.split("\n"),
          expectedString.split("\n"),
        );
        const diffMsg = buildMessage(diffResult).join("\n");
        message = `Values are not equal:\n${diffMsg}`;
      } catch (e) {
        message = `\n${colors_ts_2.red(CAN_NOT_DISPLAY)} + \n\n`;
      }
      if (msg) {
        message = msg;
      }
      throw new AssertionError(message);
    }
    exports_7("assertEquals", assertEquals);
    /**
     * Make an assertion that `actual` and `expected` are not equal, deeply.
     * If not then throw.
     */
    function assertNotEquals(actual, expected, msg) {
      if (!equal(actual, expected)) {
        return;
      }
      let actualString;
      let expectedString;
      try {
        actualString = String(actual);
      } catch (e) {
        actualString = "[Cannot display]";
      }
      try {
        expectedString = String(expected);
      } catch (e) {
        expectedString = "[Cannot display]";
      }
      if (!msg) {
        msg = `actual: ${actualString} expected: ${expectedString}`;
      }
      throw new AssertionError(msg);
    }
    exports_7("assertNotEquals", assertNotEquals);
    /**
     * Make an assertion that `actual` and `expected` are strictly equal.  If
     * not then throw.
     */
    function assertStrictEq(actual, expected, msg) {
      if (actual === expected) {
        return;
      }
      let message;
      if (msg) {
        message = msg;
      } else {
        const actualString = format(actual);
        const expectedString = format(expected);
        if (actualString === expectedString) {
          const withOffset = actualString
            .split("\n")
            .map((l) => `     ${l}`)
            .join("\n");
          message =
            `Values have the same structure but are not reference-equal:\n\n${
              colors_ts_2.red(withOffset)
            }\n`;
        } else {
          try {
            const diffResult = diff_ts_1.default(
              actualString.split("\n"),
              expectedString.split("\n"),
            );
            const diffMsg = buildMessage(diffResult).join("\n");
            message = `Values are not strictly equal:\n${diffMsg}`;
          } catch (e) {
            message = `\n${colors_ts_2.red(CAN_NOT_DISPLAY)} + \n\n`;
          }
        }
      }
      throw new AssertionError(message);
    }
    exports_7("assertStrictEq", assertStrictEq);
    /**
     * Make an assertion that actual contains expected. If not
     * then thrown.
     */
    function assertStrContains(actual, expected, msg) {
      if (!actual.includes(expected)) {
        if (!msg) {
          msg = `actual: "${actual}" expected to contains: "${expected}"`;
        }
        throw new AssertionError(msg);
      }
    }
    exports_7("assertStrContains", assertStrContains);
    /**
     * Make an assertion that `actual` contains the `expected` values
     * If not then thrown.
     */
    function assertArrayContains(actual, expected, msg) {
      const missing = [];
      for (let i = 0; i < expected.length; i++) {
        let found = false;
        for (let j = 0; j < actual.length; j++) {
          if (equal(expected[i], actual[j])) {
            found = true;
            break;
          }
        }
        if (!found) {
          missing.push(expected[i]);
        }
      }
      if (missing.length === 0) {
        return;
      }
      if (!msg) {
        msg = `actual: "${actual}" expected to contains: "${expected}"`;
        msg += "\n";
        msg += `missing: ${missing}`;
      }
      throw new AssertionError(msg);
    }
    exports_7("assertArrayContains", assertArrayContains);
    /**
     * Make an assertion that `actual` match RegExp `expected`. If not
     * then thrown
     */
    function assertMatch(actual, expected, msg) {
      if (!expected.test(actual)) {
        if (!msg) {
          msg = `actual: "${actual}" expected to match: "${expected}"`;
        }
        throw new AssertionError(msg);
      }
    }
    exports_7("assertMatch", assertMatch);
    /**
     * Forcefully throws a failed assertion
     */
    function fail(msg) {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      assert(false, `Failed assertion${msg ? `: ${msg}` : "."}`);
    }
    exports_7("fail", fail);
    /** Executes a function, expecting it to throw.  If it does not, then it
     * throws.  An error class and a string that should be included in the
     * error message can also be asserted.
     */
    function assertThrows(fn, ErrorClass, msgIncludes = "", msg) {
      let doesThrow = false;
      let error = null;
      try {
        fn();
      } catch (e) {
        if (
          ErrorClass && !(Object.getPrototypeOf(e) === ErrorClass.prototype)
        ) {
          msg =
            `Expected error to be instance of "${ErrorClass.name}", but was "${e.constructor.name}"${
              msg ? `: ${msg}` : "."
            }`;
          throw new AssertionError(msg);
        }
        if (msgIncludes && !e.message.includes(msgIncludes)) {
          msg =
            `Expected error message to include "${msgIncludes}", but got "${e.message}"${
              msg ? `: ${msg}` : "."
            }`;
          throw new AssertionError(msg);
        }
        doesThrow = true;
        error = e;
      }
      if (!doesThrow) {
        msg = `Expected function to throw${msg ? `: ${msg}` : "."}`;
        throw new AssertionError(msg);
      }
      return error;
    }
    exports_7("assertThrows", assertThrows);
    async function assertThrowsAsync(fn, ErrorClass, msgIncludes = "", msg) {
      let doesThrow = false;
      let error = null;
      try {
        await fn();
      } catch (e) {
        if (
          ErrorClass && !(Object.getPrototypeOf(e) === ErrorClass.prototype)
        ) {
          msg =
            `Expected error to be instance of "${ErrorClass.name}", but got "${e.name}"${
              msg ? `: ${msg}` : "."
            }`;
          throw new AssertionError(msg);
        }
        if (msgIncludes && !e.message.includes(msgIncludes)) {
          msg =
            `Expected error message to include "${msgIncludes}", but got "${e.message}"${
              msg ? `: ${msg}` : "."
            }`;
          throw new AssertionError(msg);
        }
        doesThrow = true;
        error = e;
      }
      if (!doesThrow) {
        msg = `Expected function to throw${msg ? `: ${msg}` : "."}`;
        throw new AssertionError(msg);
      }
      return error;
    }
    exports_7("assertThrowsAsync", assertThrowsAsync);
    /** Use this to stub out methods that will throw when invoked. */
    function unimplemented(msg) {
      throw new AssertionError(msg || "unimplemented");
    }
    exports_7("unimplemented", unimplemented);
    /** Use this to assert unreachable code. */
    function unreachable() {
      throw new AssertionError("unreachable");
    }
    exports_7("unreachable", unreachable);
    return {
      setters: [
        function (colors_ts_2_1) {
          colors_ts_2 = colors_ts_2_1;
        },
        function (diff_ts_1_1) {
          diff_ts_1 = diff_ts_1_1;
        },
      ],
      execute: function () {
        CAN_NOT_DISPLAY = "[Cannot display]";
        AssertionError = class AssertionError extends Error {
          constructor(message) {
            super(message);
            this.name = "AssertionError";
          }
        };
        exports_7("AssertionError", AssertionError);
      },
    };
  },
);
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
System.register(
  "https://deno.land/std/flags/mod",
  ["https://deno.land/std/testing/asserts"],
  function (exports_8, context_8) {
    "use strict";
    var asserts_ts_1;
    var __moduleName = context_8 && context_8.id;
    function get(obj, key) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        return obj[key];
      }
    }
    function getForce(obj, key) {
      const v = get(obj, key);
      asserts_ts_1.assert(v != null);
      return v;
    }
    function isNumber(x) {
      if (typeof x === "number") {
        return true;
      }
      if (/^0x[0-9a-f]+$/i.test(String(x))) {
        return true;
      }
      return /^[-+]?(?:\d+(?:\.\d*)?|\.\d+)(e[-+]?\d+)?$/.test(String(x));
    }
    function hasKey(obj, keys) {
      let o = obj;
      keys.slice(0, -1).forEach((key) => {
        o = (get(o, key) ?? {});
      });
      const key = keys[keys.length - 1];
      return key in o;
    }
    /** Take a set of command line arguments, with an optional set of options, and
     * return an object representation of those argument.
     *
     *      const parsedArgs = parse(Deno.args);
     */
    function parse(
      args,
      {
        "--": doubleDash = false,
        alias = {},
        boolean = false,
        default: defaults = {},
        stopEarly = false,
        string = [],
        unknown = (i) => i,
      } = {},
    ) {
      const flags = {
        bools: {},
        strings: {},
        unknownFn: unknown,
        allBools: false,
      };
      if (boolean !== undefined) {
        if (typeof boolean === "boolean") {
          flags.allBools = !!boolean;
        } else {
          const booleanArgs = typeof boolean === "string" ? [boolean] : boolean;
          for (const key of booleanArgs.filter(Boolean)) {
            flags.bools[key] = true;
          }
        }
      }
      const aliases = {};
      if (alias !== undefined) {
        for (const key in alias) {
          const val = getForce(alias, key);
          if (typeof val === "string") {
            aliases[key] = [val];
          } else {
            aliases[key] = val;
          }
          for (const alias of getForce(aliases, key)) {
            aliases[alias] = [key].concat(
              aliases[key].filter((y) => alias !== y),
            );
          }
        }
      }
      if (string !== undefined) {
        const stringArgs = typeof string === "string" ? [string] : string;
        for (const key of stringArgs.filter(Boolean)) {
          flags.strings[key] = true;
          const alias = get(aliases, key);
          if (alias) {
            for (const al of alias) {
              flags.strings[al] = true;
            }
          }
        }
      }
      const argv = { _: [] };
      function argDefined(key, arg) {
        return ((flags.allBools && /^--[^=]+$/.test(arg)) ||
          get(flags.bools, key) ||
          !!get(flags.strings, key) ||
          !!get(aliases, key));
      }
      function setKey(obj, keys, value) {
        let o = obj;
        keys.slice(0, -1).forEach(function (key) {
          if (get(o, key) === undefined) {
            o[key] = {};
          }
          o = get(o, key);
        });
        const key = keys[keys.length - 1];
        if (
          get(o, key) === undefined ||
          get(flags.bools, key) ||
          typeof get(o, key) === "boolean"
        ) {
          o[key] = value;
        } else if (Array.isArray(get(o, key))) {
          o[key].push(value);
        } else {
          o[key] = [get(o, key), value];
        }
      }
      function setArg(key, val, arg = undefined) {
        if (arg && flags.unknownFn && !argDefined(key, arg)) {
          if (flags.unknownFn(arg, key, val) === false) {
            return;
          }
        }
        const value = !get(flags.strings, key) && isNumber(val) ? Number(val)
        : val;
        setKey(argv, key.split("."), value);
        const alias = get(aliases, key);
        if (alias) {
          for (const x of alias) {
            setKey(argv, x.split("."), value);
          }
        }
      }
      function aliasIsBoolean(key) {
        return getForce(aliases, key).some((x) =>
          typeof get(flags.bools, x) === "boolean"
        );
      }
      for (const key of Object.keys(flags.bools)) {
        setArg(key, defaults[key] === undefined ? false : defaults[key]);
      }
      let notFlags = [];
      // all args after "--" are not parsed
      if (args.includes("--")) {
        notFlags = args.slice(args.indexOf("--") + 1);
        args = args.slice(0, args.indexOf("--"));
      }
      for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (/^--.+=/.test(arg)) {
          const m = arg.match(/^--([^=]+)=(.*)$/s);
          asserts_ts_1.assert(m != null);
          const [, key, value] = m;
          if (flags.bools[key]) {
            const booleanValue = value !== "false";
            setArg(key, booleanValue, arg);
          } else {
            setArg(key, value, arg);
          }
        } else if (/^--no-.+/.test(arg)) {
          const m = arg.match(/^--no-(.+)/);
          asserts_ts_1.assert(m != null);
          setArg(m[1], false, arg);
        } else if (/^--.+/.test(arg)) {
          const m = arg.match(/^--(.+)/);
          asserts_ts_1.assert(m != null);
          const [, key] = m;
          const next = args[i + 1];
          if (
            next !== undefined &&
            !/^-/.test(next) &&
            !get(flags.bools, key) &&
            !flags.allBools &&
            (get(aliases, key) ? !aliasIsBoolean(key) : true)
          ) {
            setArg(key, next, arg);
            i++;
          } else if (/^(true|false)$/.test(next)) {
            setArg(key, next === "true", arg);
            i++;
          } else {
            setArg(key, get(flags.strings, key) ? "" : true, arg);
          }
        } else if (/^-[^-]+/.test(arg)) {
          const letters = arg.slice(1, -1).split("");
          let broken = false;
          for (let j = 0; j < letters.length; j++) {
            const next = arg.slice(j + 2);
            if (next === "-") {
              setArg(letters[j], next, arg);
              continue;
            }
            if (/[A-Za-z]/.test(letters[j]) && /=/.test(next)) {
              setArg(letters[j], next.split("=")[1], arg);
              broken = true;
              break;
            }
            if (
              /[A-Za-z]/.test(letters[j]) &&
              /-?\d+(\.\d*)?(e-?\d+)?$/.test(next)
            ) {
              setArg(letters[j], next, arg);
              broken = true;
              break;
            }
            if (letters[j + 1] && letters[j + 1].match(/\W/)) {
              setArg(letters[j], arg.slice(j + 2), arg);
              broken = true;
              break;
            } else {
              setArg(
                letters[j],
                get(flags.strings, letters[j]) ? "" : true,
                arg,
              );
            }
          }
          const [key] = arg.slice(-1);
          if (!broken && key !== "-") {
            if (
              args[i + 1] &&
              !/^(-|--)[^-]/.test(args[i + 1]) &&
              !get(flags.bools, key) &&
              (get(aliases, key) ? !aliasIsBoolean(key) : true)
            ) {
              setArg(key, args[i + 1], arg);
              i++;
            } else if (args[i + 1] && /^(true|false)$/.test(args[i + 1])) {
              setArg(key, args[i + 1] === "true", arg);
              i++;
            } else {
              setArg(key, get(flags.strings, key) ? "" : true, arg);
            }
          }
        } else {
          if (!flags.unknownFn || flags.unknownFn(arg) !== false) {
            argv._.push(
              flags.strings["_"] ?? !isNumber(arg) ? arg : Number(arg),
            );
          }
          if (stopEarly) {
            argv._.push(...args.slice(i + 1));
            break;
          }
        }
      }
      for (const key of Object.keys(defaults)) {
        if (!hasKey(argv, key.split("."))) {
          setKey(argv, key.split("."), defaults[key]);
          if (aliases[key]) {
            for (const x of aliases[key]) {
              setKey(argv, x.split("."), defaults[key]);
            }
          }
        }
      }
      if (doubleDash) {
        argv["--"] = [];
        for (const key of notFlags) {
          argv["--"].push(key);
        }
      } else {
        for (const key of notFlags) {
          argv._.push(key);
        }
      }
      return argv;
    }
    exports_8("parse", parse);
    return {
      setters: [
        function (asserts_ts_1_1) {
          asserts_ts_1 = asserts_ts_1_1;
        },
      ],
      execute: function () {
      },
    };
  },
);
System.register(
  "file:///home/ilgaz/Projects/deno-grep/main",
  [
    "file:///home/ilgaz/Projects/deno-grep/src/reader",
    "file:///home/ilgaz/Projects/deno-grep/src/finder",
    "https://deno.land/std/flags/mod",
    "file:///home/ilgaz/Projects/deno-grep/src/argumentParser",
  ],
  function (exports_9, context_9) {
    "use strict";
    var reader_ts_2,
      finder_ts_1,
      mod_ts_1,
      argumentParser_ts_1,
      parsedArgs,
      _a,
      searchTerm,
      filename,
      data,
      searchResult;
    var __moduleName = context_9 && context_9.id;
    return {
      setters: [
        function (reader_ts_2_1) {
          reader_ts_2 = reader_ts_2_1;
        },
        function (finder_ts_1_1) {
          finder_ts_1 = finder_ts_1_1;
        },
        function (mod_ts_1_1) {
          mod_ts_1 = mod_ts_1_1;
        },
        function (argumentParser_ts_1_1) {
          argumentParser_ts_1 = argumentParser_ts_1_1;
        },
      ],
      execute: async function () {
        //For some reason Deno bundler doesn't like it when I desctructure it like below
        //const {_: args, ...flags} = parse(Deno.args);
        parsedArgs = mod_ts_1.parse(Deno.args);
        _a = await argumentParser_ts_1.default(parsedArgs),
          searchTerm = _a.searchTerm,
          filename = _a.filename;
        data = await reader_ts_2.readFromFile(filename)
          .catch((err) => {
            console.error(err.toString());
            Deno.exit();
          });
        searchResult = finder_ts_1.findByKeyword(
          data.split("\n"),
          searchTerm,
          parsedArgs,
        );
        searchResult.length && console.log(searchResult);
      },
    };
  },
);

await __instantiateAsync("file:///home/ilgaz/Projects/deno-grep/main");
