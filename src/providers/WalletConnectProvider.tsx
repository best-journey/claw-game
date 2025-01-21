import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import * as walletAdapterWallets from '@solana/wallet-adapter-wallets';
import * as web3 from '@solana/web3.js';
import { FC, ReactNode } from 'react';

import '@solana/wallet-adapter-react-ui/styles.css';

const WalletContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const endpoint = web3.clusterApiUrl('devnet')
    const wallets = [new walletAdapterWallets.PhantomWalletAdapter()]

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets}>
                <WalletModalProvider>
                    {children}
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    )
}

export default WalletContextProvider;
