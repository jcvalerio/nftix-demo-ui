import { Button, Flex, Heading, Text, useToast } from "@chakra-ui/react";
import { useState } from "react";

function Admin({ isOwner, connectedContract }) {
  const toast = useToast();
  const [openSaleTxnPending, setOpenSaleTxnPending] = useState(false);
  const [closeSaleTxnPending, setCloseSaleTxnPending] = useState(false);

  const openSale = async () => {
    if (!connectedContract) return;

    try {
      setOpenSaleTxnPending(true);
      let openSaleTxn = await connectedContract.openSale();

      await openSaleTxn.wait();

      toast({
        status: "success",
        title: "Sale is open!",
        variant: "subtle",
        description: (
          <a
            href={`https://rinkeby.etherscan.io/tx/${openSaleTxn.hash}`}
            target="_blank"
            rel="nofollow noreferrer"
          >
            Checkout the transaction on Etherscan
          </a>
        ),
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Failure",
        description: error,
        status: "error",
        variant: "subtle",
      });
    }
    setOpenSaleTxnPending(false);
  };

  const closeSale = async () => {
    try {
      if (!connectedContract) return;

      setCloseSaleTxnPending(true);
      let closeSaleTxn = await connectedContract.closeSale();

      await closeSaleTxn.wait();

      toast({
        status: "success",
        title: "Sale is closed!",
        variant: "subtle",
        description: (
          <a
            href={`https://rinkeby.etherscan.io/tx/${closeSaleTxn.hash}`}
            target="_blank"
            rel="nofollow noreferrer"
          >
            Checkout the transaction on Etherscan
          </a>
        ),
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Failure",
        description: error,
        status: "error",
        variant: "subtle",
      });
    }
    setCloseSaleTxnPending(false);
  };

  return (
    <>
      <Heading mb={4}>Admin panel</Heading>
      <Text fontSize="xl" mb={8}>
        Enable and disable sales on the smart contract.
      </Text>
      <Flex width="100%" justifyContent="center">
        <Button
          isLoading={openSaleTxnPending}
          onClick={openSale}
          isDisabled={!isOwner || closeSaleTxnPending}
          size="lg"
          colorScheme="teal"
        >
          Open Sale
        </Button>
        <Button
          onClick={closeSale}
          isLoading={closeSaleTxnPending}
          isDisabled={!isOwner || openSaleTxnPending}
          size="lg"
          colorScheme="red"
          variant="solid"
          marginLeft="24px"
        >
          Close Sale
        </Button>
      </Flex>
    </>
  );
}

export default Admin;
