import { Button, Box, Flex } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

function Connect({ address, onConnect, onDisconnect }) {
  const navigate = useNavigate();
  const connectWallet = async () => {
    const { ethereum } = window;
    if (!ethereum) return;

    try {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      if (onConnect) {
        onConnect(accounts[0]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const disconnectWallet = async () => {
    if (onDisconnect) {
      onDisconnect();
    }
    navigate("/");
  };

  return (
    <Flex
      fontWeight="bold"
      position="absolute"
      top="8px"
      right="8px"
      zIndex="10"
    >
      <DisconnectButton address={address} onClick={disconnectWallet} />
      <Box
        bg="white"
        minW="120px"
        p="8px 16px"
        borderRadius="16px"
        textAlign="center"
      >
        <ConnectButton address={address} onClick={connectWallet} />
        <WalletAddress address={address} />
      </Box>
    </Flex>
  );
}

function ConnectButton({ address, onClick }) {
  if (address) return null;

  return (
    <Button onClick={onClick} size="sm" variant="link" color="purple">
      Connect
    </Button>
  );
}

function DisconnectButton({ address, onClick }) {
  if (!address) return null;

  return (
    <Box
      bg="white"
      minW="120px"
      p="8px 16px"
      borderRadius="16px"
      textAlign="center"
      marginRight="16px"
    >
      <Button onClick={onClick} size="sm" variant="link" color="purple">
        Disconnect
      </Button>
    </Box>
  );
}

function WalletAddress({ address }) {
  if (!address) return null;

  return (
    <span>
      💳 {address.slice(0, 6)}
      ...{address.slice(-4)}
    </span>
  );
}

export default Connect;
