import { defineConfig } from "@wagmi/cli";
import fs from "fs";
import path from "path";

const directoryPath = "./deployments/synthetix-sandbox/local";

// Recursively read all files in the directory and its subdirectories
function readDeployments(directoryPath) {
  const files = fs.readdirSync(directoryPath);
  let result: { abi: any; address: any; name: string }[] = [];

  files.forEach((file) => {
    const filePath = path.join(directoryPath, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      // Recurse into subdirectories
      result.push(...readDeployments(filePath));
    } else if (stats.isFile()) {
      // Read contents of file
      const fileContents = fs.readFileSync(filePath).toString();
      const json = JSON.parse(fileContents);

      let name = filePath;
      if (name.startsWith("deployments")) {
        name = name.replace("deployments", "");
      }
      if (name.endsWith("json")) {
        name = name.split("json")[0];
      }

      // Add to result array
      result.push({
        abi: json.abi,
        address: json.address,
        name,
      });
    }
  });

  return result;
}

// Call the function and log the result
const contracts = readDeployments(directoryPath);

export default defineConfig({
  out: "src/generated.ts",
  contracts,
  plugins: [],
});
