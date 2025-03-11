type ExtractedVariables = Record<string, string>;

export const extractVariablesFromPattern = (
  input: string,
  pattern: string
): ExtractedVariables | null => {
  // Convert the pattern into a regular expression
  const regexString = pattern
    .replace(/\$\{([a-zA-Z0-9_]+)\}/g, '(?<$1>[^/]+)') // Replace ${VAR} with named capturing groups
    .replace(/\//g, '\\/') // Escape slashes for regex
    .replace(/\./g, '\\.'); // Escape dots for regex

  const regex = new RegExp(`^${regexString}$`);
  const match = input.match(regex);

  if (!match || !match.groups) {
    return null; // Return null if no match is found
  }

  // Extract matched variables from the named groups
  return match.groups;
};
