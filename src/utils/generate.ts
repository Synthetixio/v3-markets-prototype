export async function enableERC7412(
  client: viem.PublicClient,
  tx: TransactionRequest,
): Promise<TransactionRequest> {
  let multicallCalls: TransactionRequest[] = [tx];

  console.log("peiman enableERC7412");
  while (true) {
    try {
      if (multicallCalls.length == 1) {
        await client.call(multicallCalls[0]);
        return multicallCalls[0];
      } else if (!this.multicallFunc) {
        throw "multicallFunc is not defined";
      } else {
        const multicallTxn = this.multicallFunc(multicallCalls);
        await client.call(multicallTxn);
        return multicallTxn;
      }
    } catch (error) {
      console.log("error", error);
      const err = viem.decodeErrorResult({
        abi: IERC7412.abi,
        data: parseError(error as viem.CallExecutionError),
      });
      if (err.errorName === "OracleDataRequired") {
        const oracleQuery = err.args![1] as viem.Hex;
        const oracleAddress = err.args![0] as viem.Address;

        const oracleId = viem.hexToString(
          viem.trim(
            (await client.readContract({
              abi: IERC7412.abi,
              address: oracleAddress,
              functionName: "oracleId",
              args: [],
            })) as unknown as viem.Hex,
            { dir: "right" },
          ),
        );

        const adapter = this.adapters.get(oracleId);
        if (adapter === undefined) {
          throw new Error(
            `oracle ${oracleId} not supported (supported oracles: ${Array.from(
              this.adapters.keys(),
            ).join(",")})`,
          );
        }

        const signedRequiredData = await adapter.fetchOffchainData(
          client,
          oracleAddress,
          oracleQuery,
        );

        multicallCalls.splice(multicallCalls.length - 1, 0, {
          to: err.args![0] as viem.Address,
          data: viem.encodeFunctionData({
            abi: IERC7412.abi,
            functionName: "fulfillOracleQuery",
            args: [signedRequiredData],
          }),
        });
      } else if (err.errorName === "FeeRequired") {
        const requiredFee = err.args![0] as bigint;
        multicallCalls[multicallCalls.length - 2].value = requiredFee;
      } else {
        throw error;
      }
    }
  }
}
