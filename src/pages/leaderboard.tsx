import {
  Box,
  Flex,
  Heading,
  Table,
  TableCaption,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useGetLeaderboard } from "../hooks/useGetLeaderboard";
import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { Header } from "../components";
import { useAccount } from "wagmi";

export default function Leaderboard() {
  const { data, loading } = useGetLeaderboard();
  const [sortOption, setSortOption] = useState(["ranking", true]);
  const { address } = useAccount();
  const userPerformance = data?.leaderboard.filter(
    (user) => user.address.toLowerCase() === address?.toLowerCase(),
  );

  return (
    <>
      <Header />
      <Flex flexDir="column" alignItems="center" p="10">
        <Heading textAlign="start" w="100%" mt="12">
          Trading Competition
        </Heading>
        {!!address && !!userPerformance?.length && (
          <Box
            border="1px solid"
            borderColor="gray.900"
            borderRadius="md"
            w="100%"
            bg="navy.700"
            mt="4"
          >
            <Heading m="4" fontSize="lg">
              My Performance
            </Heading>
            <Table bg="navy.700" borderRadius="md">
              <Thead>
                <Tr>
                  <Th cursor="pointer" userSelect="none">
                    Rank
                  </Th>
                  <Th cursor="pointer" userSelect="none">
                    User
                  </Th>
                  <Th cursor="pointer" userSelect="none">
                    PnL
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {userPerformance?.map((user) => (
                  <Tr key={user.address}>
                    <Td>{user.rank}</Td>
                    <Td>{user.address}</Td>
                    <Td
                      color={user.pnl_pct >= 0 ? "green.500" : "red.500"}
                      fontWeight={700}
                    >
                      {user.pnl_pct * 100}%
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        )}
        <Box
          border="1px solid"
          borderColor="gray.900"
          borderRadius="md"
          w="100%"
          bg="navy.700"
          mt="4"
        >
          <Heading m="4" fontSize="lg">
            Top Traders
          </Heading>
          <Table bg="navy.700" borderRadius="md">
            <Thead>
              <Tr>
                <Th cursor="pointer" userSelect="none">
                  Rank
                </Th>
                <Th cursor="pointer" userSelect="none">
                  User
                </Th>
                <Th cursor="pointer" userSelect="none">
                  PnL
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {data?.leaderboard
                .filter((_, index) => index < 10)
                .map((user) => (
                  <Tr key={user.address}>
                    <Td>{user.rank}</Td>
                    <Td>{user.address}</Td>
                    <Td
                      color={user.pnl_pct >= 0 ? "green.500" : "red.500"}
                      fontWeight={700}
                    >
                      {user.pnl_pct * 100}%
                    </Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        </Box>
        <Box
          border="1px solid"
          borderColor="gray.900"
          borderRadius="md"
          w="100%"
          bg="navy.700"
          mt="4"
        >
          <Heading m="4" fontSize="lg">
            All Traders
          </Heading>
          <Table bg="navy.700" borderRadius="md">
            <TableCaption>
              Last time updated:{" "}
              {data?.lastUpdated
                ? new Date(data?.lastUpdated * 1000).toLocaleDateString()
                : "not found"}
            </TableCaption>
            <Thead>
              <Tr>
                <Th
                  cursor="pointer"
                  userSelect="none"
                  onClick={() => {
                    if (sortOption[0] === "ranking") {
                      setSortOption(["ranking", !sortOption[1]]);
                    } else {
                      setSortOption(["ranking", true]);
                    }
                  }}
                >
                  Rank{" "}
                  {sortOption[0] === "ranking" &&
                    (sortOption[1] ? <ChevronUpIcon /> : <ChevronDownIcon />)}
                </Th>
                <Th
                  cursor="pointer"
                  userSelect="none"
                  onClick={() => {
                    if (sortOption[0] === "account") {
                      setSortOption(["account", !sortOption[1]]);
                    } else {
                      setSortOption(["account", true]);
                    }
                  }}
                >
                  User
                  {sortOption[0] === "account" &&
                    (sortOption[1] ? <ChevronUpIcon /> : <ChevronDownIcon />)}
                </Th>
                <Th
                  cursor="pointer"
                  userSelect="none"
                  onClick={() => {
                    if (sortOption[0] === "pnl") {
                      setSortOption(["pnl", !sortOption[1]]);
                    } else {
                      setSortOption(["pnl", true]);
                    }
                  }}
                >
                  PnL{" "}
                  {sortOption[0] === "pnl" &&
                    (sortOption[1] ? <ChevronUpIcon /> : <ChevronDownIcon />)}
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {data?.leaderboard
                .sort((a, b) => {
                  if (sortOption[0] === "ranking") {
                    return (
                      (a.rank > b.rank ? 1 : -1) * (sortOption[1] ? 1 : -1)
                    );
                  } else if (sortOption[0] === "account") {
                    return (
                      a.address.localeCompare(b.address) *
                      (sortOption[1] ? 1 : -1)
                    );
                  } else {
                    return (
                      (a.pnl_pct < b.pnl_pct ? 1 : -1) *
                      (sortOption[1] ? 1 : -1)
                    );
                  }
                })
                .filter((_, index) => index < 10)
                .map((user) => (
                  <Tr key={user.address}>
                    <Td>{user.rank}</Td>
                    <Td>{user.address}</Td>
                    <Td
                      color={user.pnl_pct >= 0 ? "green.500" : "red.500"}
                      fontWeight={700}
                    >
                      {user.pnl_pct * 100}%
                    </Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        </Box>
      </Flex>
    </>
  );
}
