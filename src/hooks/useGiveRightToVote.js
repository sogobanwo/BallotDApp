import { useCallback } from "react";
import { isSupportedChain } from "../utils";
import { isAddress } from "ethers";
import { getProvider } from "../constants/providers";
import { getProposalsContract } from "../constants/contracts";
import {
    useWeb3ModalAccount,
    useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import toast from "react-hot-toast";

const useGiveRightToVote = (address) => {
    const { chainId } = useWeb3ModalAccount();
    const { walletProvider } = useWeb3ModalProvider();

    return useCallback(async () => {
        if (!isSupportedChain(chainId)) return console.error("Wrong network");
        if (!isAddress(address)) return console.error("Invalid address");
        const readWriteProvider = getProvider(walletProvider);
        const signer = await readWriteProvider.getSigner();

        const contract = getProposalsContract(signer);
        const loadingToast= toast.loading('Giving vote right...');

        try {
            const estimatedGas = await contract.giveRightToVote.estimateGas(
                address
            );
            // console.log("estimatedGas: ", estimatedGas);

            // const feeData = await readWriteProvider.getFeeData();

            // console.log("feeData: ", feeData);

            // const gasFee = estimatedGas * feeData.gasPrice;

            // console.log("estimated: ", gasFee);

            const transaction = await contract.giveRightToVote(address, {
                gasLimit: estimatedGas,
            });
            console.log("transaction: ", transaction);
            const receipt = await transaction.wait();

            console.log("receipt: ", receipt);

            if (receipt.status) {
                toast.remove(loadingToast)

                console.log("giveRightToVote successfull!");

                return toast.success("Voting right successfully given")
            }

            console.log("Failed to give voting right");
        } catch (error) {
            toast.remove(loadingToast)
            return toast.error(error.reason);
        }
    }, [address, chainId, walletProvider]);
};

export default useGiveRightToVote;
