import { Alert, Box, Button, Flex } from "@chakra-ui/react";
import { useChainId, useSwitchNetwork } from "wagmi";
import { Header, PerpsMarketInfo, Sidebar } from "../../components";

export function PerpsMarket() {
  const chain = useChainId();
  const { switchNetwork } = useSwitchNetwork();
  return (
    <Flex height="100vh" maxHeight="100vh" flexDirection="column">
      {chain !== 10 ? (
        <>
          <Header />
          <Flex flex="1" height="100%" minHeight={0}>
            <Box flex="5" pb="32px">
              <PerpsMarketInfo />
            </Box>
            <Box flex="2" maxHeight="100%">
              <Sidebar />
            </Box>
          </Flex>
        </>
      ) : (
        <Flex
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          flex="1"
          height="100%"
          minHeight={0}
        >
          Perps is not ready on this network <br />
          <Button mt="2" onClick={() => switchNetwork?.(420)}>
            Switch Optimism Goerli
          </Button>
        </Flex>
      )}
    </Flex>
  );
}
