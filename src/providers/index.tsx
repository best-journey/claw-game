import { ChakraProvider } from "@chakra-ui/react";
import { FC, ReactNode } from "react";
import WalletConnectProvider from "./WalletConnectProvider";

const Provider: FC<{
    children: ReactNode;
}> = ({ children }) => {
    return (
        <ChakraProvider>
            <WalletConnectProvider>
                {children}
            </WalletConnectProvider>
        </ChakraProvider>
    )
}

export default Provider;
;