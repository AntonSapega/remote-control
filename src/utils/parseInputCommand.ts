function parseInputCommand(line: any) {
  const [command, value, length] = line.toString().split(' ');
  return {
    command,
    value: Number(value),
    length: Number(length),
  };
}

export { parseInputCommand };
