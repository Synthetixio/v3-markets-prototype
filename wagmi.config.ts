import { defineConfig } from "@wagmi/cli";
import fs from "fs";
import path from "path";

const network = process.env.REACT_APP_NETWORK || "cannon";

// Call the function and log the result
const contracts = _readDeployments(`deployments/${network}`);

export default defineConfig({
  out: "src/generated.ts",
  contracts,
  plugins: [],
});

// Recursively read all files in the directory and its subdirectories
function _readDeployments(directoryPath, baseDirectoryPath = directoryPath) {
  const files = fs.readdirSync(directoryPath);
  const result: { abi: any; address: any; name: string }[] = [];

  for (const file of files) {
    const filePath = path.join(directoryPath, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      // Recurse into subdirectories
      result.push(..._readDeployments(filePath, baseDirectoryPath));
    } else if (stats.isFile()) {
      // Read contents of file
      const fileContents = fs.readFileSync(filePath).toString();
      const json = JSON.parse(fileContents);

      let name = filePath
        .replace(`${baseDirectoryPath}/`, "") // remove base directory path
        .replace(/\.json$/, ""); // Remove .json extension

      // Add to result array
      result.push({
        abi: json.abi,
        address: json.address,
        name,
      });
    }
  }

  return result;
}
