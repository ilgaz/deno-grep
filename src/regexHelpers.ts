const generateRegex = (regexString: RegExp, flags: string[]) => new RegExp(regexString, flags.join(''));

export const isRegexString = (str: string) => generateRegex(/\/.+\/\w*/, ['g']).test(str);
export const isFilename = (name: string) => generateRegex(/[A-z]+\.[A-z]+\.?[A-z]+/, ['g']).test(name);
