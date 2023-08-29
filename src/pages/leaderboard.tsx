import {
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

export default function Leaderboard() {
  const ranking = useGetLeaderboard();
  const [sortOption, setSortOption] = useState(["ranking", true]);

  return (
    <Flex flexDir="column" alignItems="center">
      <Heading>Trading Competition Leaderboard</Heading>
      <Heading size="sm">1st 600OP</Heading>
      <Heading size="sm">2nd 300OP</Heading>
      <Heading size="sm">3rd 150OP</Heading>
      <Heading size="sm">50OP each</Heading>
      <Table maxW="1200px">
        <TableCaption>
          Last time updated:{" "}
          {ranking?.lastUpdated
            ? new Date(ranking?.lastUpdated * 1000).toLocaleDateString()
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
          {ranking?.leaderboard
            .sort((a, b) => {
              if (sortOption[0] === "ranking") {
                return (a.rank > b.rank ? 1 : -1) * (sortOption[1] ? 1 : -1);
              } else if (sortOption[0] === "account") {
                return (
                  a.address.localeCompare(b.address) * (sortOption[1] ? 1 : -1)
                );
              } else {
                return (
                  (a.pnl_pct > b.pnl_pct ? 1 : -1) * (sortOption[1] ? 1 : -1)
                );
              }
            })
            .map((user) => (
              <Tr>
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
    </Flex>
  );
}
