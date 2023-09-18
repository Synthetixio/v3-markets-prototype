import { BigNumberish } from "ethers";

export function toBigInt(value: BigNumberish): bigint {
  switch (typeof value) {
    case "bigint":
      return value;
    case "number":
      return BigInt(value);
    case "string":
      try {
        if (value === "") {
          throw new Error("empty string");
        }
        if (value[0] === "-" && value[1] !== "-") {
          return -BigInt(value.substring(1));
        }
        return BigInt(value);
      } catch (e: any) {}
  }
}
