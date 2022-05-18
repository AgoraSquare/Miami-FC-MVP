import '../styles/globals.css'
import type { AppProps } from 'next/app'

import { providers } from 'ethers'
import { chain, createClient, Provider } from 'wagmi';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { InjectedConnector } from '@wagmi/core';
import { alchemyRpcUrls } from 'wagmi';

import { Provider as RProvider } from 'react-redux';
import store from '../store';
import { persistor } from '../store';
import { PersistGate } from 'redux-persist/lib/integration/react';
import SEO from '../component/SEO';

const connectors = () => {
	return [
		new WalletConnectConnector({
			options: {
				chainId: chain.polygonMumbai.id,
				rpc: { 80001 : "https://polygon-mumbai.g.alchemy.com/v2/IdqlTHjOhYElQ5wGT3B1DLmlOeQCwhcq" }
			},
		}),
		// new MetaMaskConnector({
		//   chains: [chain.rinkeby],
		//   options: {
		//     shimDisconnect: false
		//   }
		// }),
		new InjectedConnector({
			chains: [chain.polygonMumbai]
		})
	]
}

const wagmiClient = createClient({
	autoConnect: true,
	provider(config) {
		return new providers.AlchemyProvider(config.chainId, 'ksqleRX25aRSLQ9uawfAwVTlQ8gKLULj');
	},
	connectors
})

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<RProvider store={store}>
			<PersistGate persistor={persistor} loading={null}>
				{() => (
					<Provider client={wagmiClient}>
						<SEO />
						<Component {...pageProps} />
					</Provider>
				)}
			</PersistGate>
		</RProvider>
	)
}

export default MyApp
