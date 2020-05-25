import { red, bold } from 'https://deno.land/std/fmt/colors.ts';
import { isRegexString } from './regexHelpers.ts';
import { Flags } from './argumentParser.ts';

export const findByKeyword = (lines: string[], keyword: string, flags: any): string => {

  if (isRegexString(keyword)) {
    console.log("Well, direct regex grepping is not supported just yet!");
    Deno.exit();
  }

  if (flags.hasOwnProperty('C'))
    return handleContextFlag(lines, flags, String(keyword));

  return lines
    .map((line) => findMatchInsideLine(line, keyword, flags, null))
    .filter(a => a)
    .join('\n');
}

const handleContextFlag = (lines: string[], flags: Flags, keyword: string): string => {

  const { C: contextValue, i: insensitive } = flags;
  const lineArray: string[] = [];

  lines
    .map((line, index) => {
      if (!insensitive && !line.includes(keyword)) return;

      if (line.toLowerCase().includes(keyword.toLowerCase())) {
        const linesBefore = Math.max(index - Number(contextValue), 0);
        const linesAfter = index + Number(contextValue) + 1;
        const slice = lines.slice(linesBefore, linesAfter);

        lineArray.push(...slice);
      }
    });

  return lineArray
    .filter((line, i) => {
      if (!line.length) return true;

      return lineArray.indexOf(line) == i
    })
    .map(line => findMatchInsideLine(line, keyword, flags, line))
    .join('\n')
};

const findMatchInsideLine = (line: string, keyword: string, flags: Flags, emptyLineValue: string | null): string | null => {

  const { i: insensitive } = flags;
  let lineToCheck;
  let keywordToCheck;
  let regex;

  if (insensitive) {
    lineToCheck = line.toLowerCase();
    keywordToCheck = keyword.toLowerCase();
    regex = new RegExp(keyword, 'ig');
  } else {
    lineToCheck = line;
    keywordToCheck = keyword;
    regex = new RegExp(keyword, 'g');
  }

  if (lineToCheck.includes(keywordToCheck)) {
    if (insensitive) {
      const [match] = line.match(regex) || '';
      return line.replace(regex, red(bold(match)))
    }

    return line.replace(regex, red(bold(keyword)))
  }

  return emptyLineValue
}
