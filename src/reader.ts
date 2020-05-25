export const readFromFile =  async (filename: string): Promise<string>  => {
	const file = await Deno.open(filename, {read: true});
	const  dataInFile = await Deno.readAll(file);

	Deno.close(file.rid);

	return decode(dataInFile).trim();
}


const decode = (buffer: Uint8Array): string => {
	const decoder = new TextDecoder();
	return decoder.decode(buffer);
}
