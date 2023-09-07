import { Flex, Heading, Link } from "@chakra-ui/react";
import { Header } from "../components";

export default function TradingCompetition() {
  return (
    <>
      <Header />
      <Flex flexDir="column">
        <Heading>Instructions</Heading>
        <Link>Blog Post</Link>
        <Heading> Swap at Spot if you want differnt margins</Heading>
        <Heading>
          Trade at Kwenta/Polynomial * Check your position at Leaderboard
        </Heading>
      </Flex>
    </>
  );
}
