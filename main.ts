import { readFromFile } from './src/reader.ts';
import { findByKeyword } from './src/finder.ts';
import { parse } from 'https://deno.land/std/flags/mod.ts';
import parseArguments from './src/argumentParser.ts';

//For some reason Deno bundler doesn't like it when I desctructure it like below
//const {_: args, ...flags} = parse(Deno.args);

const parsedArgs = parse(Deno.args);

const { searchTerm, filename } = await parseArguments(parsedArgs);

let data = await readFromFile(filename)
  .catch(err => {
		console.error(err.toString());
		Deno.exit();
	});

const searchResult = findByKeyword(data.split('\n'), searchTerm, parsedArgs);

searchResult.length && console.log(searchResult);
