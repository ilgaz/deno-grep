import { readFromFile } from './reader.ts';

type Arguments = {
  searchTerm: string;
  filename: string;
  flags: Flags
}

export interface Flags {
  f?: string,
  C?: string,
  i?: string
}

export default async (argList: any): Promise<Arguments> => {
  const staticArgs = argList._;
  let searchTerm, filename;

  if (staticArgs.length == 0) {
    console.error('You did not specify enough arguments for this program to run, exiting');
    Deno.exit();
  }

  if (staticArgs.length == 1 && !argList.hasOwnProperty('f')) {
    console.error('You did not specify the pattern to look for, exiting');
    Deno.exit();
  }

  if (argList.hasOwnProperty('f')) {
    searchTerm = await readFromFile(argList.f)
      .catch(err => {
        console.log("Could not read from file ", argList.f);
        Deno.exit();
      });
  }

  if (!searchTerm)
    searchTerm = staticArgs[0];

  filename = staticArgs[staticArgs.length - 1];

  return {searchTerm, filename, flags: argList.flags};
};
