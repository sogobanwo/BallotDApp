import { Box, Container, Flex, Text } from "@radix-ui/themes";
import { configureWeb3Modal } from "./connection";
import "@radix-ui/themes/styles.css";
import Header from "./component/Header";
import Proposal from "./component/Proposal";
import DelegateVote from "./component/DelegateVote";
import useProposals from "./hooks/useProposals";
import { Toaster } from "react-hot-toast";
// import {
//     useWeb3ModalAccount,
//     useWeb3ModalProvider,
// } from "@web3modal/ethers/react";
// import { isSupportedChain } from "./utils";
// import { getProvider } from "./constants/providers";
// import { getProposalsContract } from "./constants/contracts";

configureWeb3Modal();

function App() {
    const { loading, data: proposals } = useProposals();

    return (
        <>
            <Container>
                <Header />
                <main className="mt-6">
                    <Box mb="4">
                        <DelegateVote />
                    </Box>

                    <Flex wrap={"wrap"} gap={"6"}>
                        {loading ? (
                            <Text>Loading...</Text>
                        ) : proposals.length !== 0 ? (
                            proposals.map((item, index) => (
                                <Proposal
                                    key={index}
                                    name={item.name}
                                    id={index}
                                    voteCount={Number(item.voteCount)}
                                />
                            ))
                        ) : (
                            <Text>Could not get proposals!!</Text>
                        )}
                    </Flex>
                </main>
            </Container>
            <Toaster />
        </>
    );
}

export default App;
