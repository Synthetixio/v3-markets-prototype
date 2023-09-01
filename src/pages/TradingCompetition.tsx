import { Flex, Heading, Link } from "@chakra-ui/react";

export default function TradingCompetition() {
  return (
    <Flex flexDir="column">
      <Heading>Instructions</Heading>
      <Link>Blog Post</Link>
      <Heading> Swap at Spot if you want differnt margins</Heading>
      <Heading>
        Trade at Kwenta/Polynomial * Check your position at Leaderboard
      </Heading>
    </Flex>
  );
}
