# Simple GREP implementation in Deno

## Usage

The argument list is taken directly from the almighty `grep` itself,

`deno run ./dist/grep.bundle.ts --allow-read filename searchPattern ...flags`

`filename` and `searchPattern` placeholders are required, while flags are not. You can find the current available flags [in Flags section](#Flags)

`--allow-read` is required in order for Deno to be able to read the given file

## Example

```
// lorem.md
Hello
World
Lorem World
Ipsum

// Command
deno run grep.bundle.ts --allow-read World lorem.md


// Output (matching word ('World' in this case) will be highlighted in red)
World
Lorem World
```

## Available Flags

- `-C` the '--context' flag, it lets you print the provided number of lines before & after matches
- `-i` the '--ignore-case' flag, it makes the search case insensitive
- `-f` the '--file' flag, it lets you take input from another file
