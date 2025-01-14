import { useEffect, useState } from "react";
import {
  Button,
  ButtonGroup,
  Heading,
  Text,
  Flex,
  useToast,
} from "@chakra-ui/react";

function Buy({ connectedContract }) {
  const toast = useToast();
  const [totalTicketCount, setTotalTicketCount] = useState(null);

  const [availableTicketCount, setAvailableTicketCount] = useState(null);

  const [buyTxnPending, setBuyTxnPending] = useState(false);

  useEffect(() => {
    if (!connectedContract) return;

    getAvailableTicketCount();
    getTotalTicketCount();
  });

  const buyTicket = async () => {
    try {
      if (!connectedContract) return;

      setBuyTxnPending(true);
      const buyTxn = await connectedContract.mint({
        value: `${0.08 * 10 ** 18}`,
      });

      await buyTxn.wait();
      setBuyTxnPending(false);
      toast({
        title: "Success!",
        description: (
          <a
            href={`https://rinkeby.etherscan.io/tx/${buyTxn.hash}`}
            target="_blank"
            rel="nofollow noreferrer"
          >
            Checkout the transaction on Etherscan
          </a>
        ),
        status: "success",
        variant: "subtle",
      });
    } catch (err) {
      console.log(err);
      setBuyTxnPending(false);
      toast({
        title: "Failed.",
        description: err.message,
        status: "error",
        variant: "subtle",
      });
    }
  };

  const getAvailableTicketCount = async () => {
    try {
      const count = await connectedContract.availableTicketCount();
      setAvailableTicketCount(count.toNumber());
    } catch (err) {
      console.log(err);
    }
  };

  const getTotalTicketCount = async () => {
    try {
      const count = await connectedContract.totalTicketCount();
      setTotalTicketCount(count.toNumber());
    } catch (err) {
      console.log(err);
    }
  };

  const AvailableTickets = () => {
    if (!availableTicketCount || !totalTicketCount) return null;

    return (
      <Text>
        {availableTicketCount} of {totalTicketCount} minted!
      </Text>
    );
  };

  return (
    <>
      <Heading mb={4}>DevDAO Conference 2022</Heading>
      <Text fontSize="xl" mb={4}>
        Connect your wallet to mint your NFT. It'll be your ticket to get in!
      </Text>
      <Flex
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        margin="0 auto"
        maxW="140px"
      >
        <ButtonGroup mb={4}>
          <Button
            onClick={buyTicket}
            isLoading={buyTxnPending}
            loadingText="Pending"
            size="lg"
            colorScheme="teal"
          >
            Buy Ticket
          </Button>
        </ButtonGroup>
        <AvailableTickets />
      </Flex>
    </>
  );
}

export default Buy;
