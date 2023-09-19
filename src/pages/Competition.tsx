import { Button, Flex, Heading, Text } from "@chakra-ui/react";
import { Header } from "../components";
import { Link } from "react-router-dom";
import { Kwenta, Polynomial } from "../components/SVGS";

export default function Competition() {
  return (
    <>
      <Header />
      <Flex flexDirection="column" p="10" gap="4">
        <Heading fontSize="60px">Legendary traders</Heading>
        <Heading fontSize="36px">
          Welcome to the Synthetix Perps <br /> v3 testnet trading competition
        </Heading>
        <Link to="https://www.google.com/" target="_blank">
          <Button colorScheme="cyan">Learn More</Button>
        </Link>
        <Heading mt="100px">General instructions</Heading>
        <Text display={"flex"} fontWeight={"bold"} fontSize="20px">
          1.&nbsp;
          <Text color="gray.500" fontWeight={"bold"} fontSize="20px">
            Traders should have received sUSD and ETH to your trading wallet
          </Text>
        </Text>
        <Text display={"flex"} fontWeight={"bold"} fontSize="20px">
          2.&nbsp;
          <Text color="gray.500" fontWeight={"bold"} fontSize="20px">
            Use Spot Tab to trade sUSD into other synths
          </Text>
        </Text>
        <Text display={"flex"} fontWeight={"bold"} fontSize="20px">
          3.&nbsp;
          <Text color="gray.500" fontWeight={"bold"} fontSize="20px">
            Head to one of the integrator front ends to trade:
          </Text>
        </Text>

        <Flex gap="2">
          <Flex
            h="270px"
            gap="5"
            bg="gray.800"
            flexDir="column"
            p="4"
            borderWidth="1px"
            borderStyle="solid"
            borderColor="gray.600"
            rounded={"base"}
          >
            <Flex justifyContent="space-between">
              <Kwenta />
              <Text
                fontSize="xs"
                bg="gray.700"
                rounded="base"
                h="fit-content"
                p="1"
              >
                Perps
              </Text>
            </Flex>
            <Heading>Kwenta</Heading>
            <Text color="gray.500">
              Trade crypto, forex, and commodities with up to 50x leverage and
              deep liquidity.
            </Text>
          </Flex>
          <Flex
            h="270px"
            gap="5"
            bg="gray.800"
            flexDir="column"
            p="4"
            borderWidth="1px"
            borderStyle="solid"
            borderColor="gray.600"
            rounded={"base"}
          >
            <Flex justifyContent="space-between">
              <Polynomial />
              <Text
                fontSize="xs"
                bg="gray.700"
                rounded="base"
                h="fit-content"
                p="1"
              >
                Perps
              </Text>
            </Flex>
            <Heading>Polynomial</Heading>
            <Text color="gray.500">
              Trade perps with Polynomial's smart wallet to access up to 50x
              leverage.
            </Text>
          </Flex>
        </Flex>

        <Flex flexDir="column" mt="16" gap="4">
          <Heading fontSize="36px">Rules</Heading>
          <Text display={"flex"} fontWeight={"bold"} fontSize="20px">
            1.&nbsp;
            <Text color="gray.500" fontWeight={"bold"} fontSize="20px">
              Competition period starts: 1.1.1970
            </Text>
          </Text>
          <Text display={"flex"} fontWeight={"bold"} fontSize="20px">
            2.&nbsp;
            <Text color="gray.500" fontWeight={"bold"} fontSize="20px">
              Competition period ends: 1.1.1970
            </Text>
          </Text>
          <Text display={"flex"} fontWeight={"bold"} fontSize="20px">
            3.&nbsp;
            <Text color="gray.500" fontWeight={"bold"} fontSize="20px">
              Report feedback to DISCORD LINK
            </Text>
          </Text>
          <Text display={"flex"} fontWeight={"bold"} fontSize="20px">
            4.&nbsp;
            <Text color="gray.500" fontWeight={"bold"} fontSize="20px">
              Traders can ONLY utilize the $100k susd and 0.25 eth they received
              at start
            </Text>
          </Text>
          <Text display={"flex"} fontWeight={"bold"} fontSize="20px">
            5.&nbsp;
            <Text color="gray.500" fontWeight={"bold"} fontSize="20px">
              Traders can use Margin from sUSD for any accepted synth, by
              swapping at Spot Swapper
            </Text>
          </Text>
          <Text display={"flex"} fontWeight={"bold"} fontSize="20px">
            6.&nbsp;
            <Text color="gray.500" fontWeight={"bold"} fontSize="20px">
              Traders cannot create or source more sUSD or other synth than the
              initial $100k
            </Text>
          </Text>
          <Text display={"flex"} fontWeight={"bold"} fontSize="20px">
            7.&nbsp;
            <Text color="gray.500" fontWeight={"bold"} fontSize="20px">
              Trading can be done through integrators, directly through
              contracts or the prototype (not recommended)
            </Text>
          </Text>
        </Flex>
        <Flex
          bg="gray.800"
          flexDir="column"
          p="4"
          borderWidth="1px"
          borderStyle="solid"
          borderColor="gray.600"
          rounded={"base"}
        >
          <Heading>Prizes</Heading>
          <Text>Prizes $15k from Grants Council</Text>
          <Text>15 $KWENTA from Kwenta</Text>
          <Text>10 specials</Text>
          <Text>
            Traders are scored based on time weighted PnL %, above a minimum
            threshold Prizes are only for genuine trading activity, and
            Synthetix has sole and final discretion, including to eliminate any
            accounts participating in the competition
          </Text>
          <Text fontWeight="bold">Bounties/Bugs/Feedback</Text>
          <Text>
            For contracts, using the Synthetix Immunify program scheme, with a
            discount of 90% For frontends, talk to respective integrator For
            keepers, no bounties
          </Text>
        </Flex>
      </Flex>
    </>
  );
}
