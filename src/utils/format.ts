function _isObject(input: unknown): input is Record<string, unknown> {
  return typeof input === "object" && input !== null && !Array.isArray(input);
}

function _wrapInQuotes(values: unknown[]): string {
  return values.map((v) => `"${String(v)}"`).join(", ");
}

const HARDHAT_CUSTOM_PREFIX =
  "VM Exception while processing transaction: reverted with custom error ";

export function formatErrorMessage(error: unknown): string {
  if (!_isObject(error)) {
    throw new Error("Error is not an object");
  }

  // Custom error is found in the error message as
  // 'errorArgs=[{"type":"BigNumber","hex":"0x0539"}], errorName="ErrorName"'.
  if (error.errorName) {
    const formattedErrorArgs =
      error.errorArgs && Array.isArray(error.errorArgs)
        ? _wrapInQuotes(error.errorArgs)
        : "";

    return `${error.errorName}(${formattedErrorArgs})`;
  }

  // Custom errors when using network Hardhat, no need to parse them.
  if (
    error.error instanceof Error &&
    error.error.message.startsWith(HARDHAT_CUSTOM_PREFIX)
  ) {
    return error.error.message.slice(HARDHAT_CUSTOM_PREFIX.length + 1, -1);
  }

  // Custom error is found in the error message as
  // 'reverted with custom error ErrorName(1, "0xabc")' - no quotes in numeric values.
  if (
    typeof error.message === "string" &&
    error.message.includes("custom error")
  ) {
    let msg = error.message as string;

    const regex = /\((.*?)\)/; // Match stuff within quotes.
    const matches = msg.match(regex);

    if (matches) {
      const withinParentheses = matches[1]; // idx 0 includes parentheses, idx 1 does not.
      const values = withinParentheses.split(", ");

      values.forEach((v) => {
        if (!v.includes('"')) {
          msg = msg.replace(v, `"${v}"`);
        }
      });
    }

    return msg;
  }

  // No edge cases, just stringify.
  return error.toString();
}
