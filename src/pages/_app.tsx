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
				chainId: chain.polygon.id,
				rpc: { 137 : "https://polygon-mainnet.g.alchemy.com/v2/c9KQd2oIeB0PrvlAuvo2yqP7yOOrpxRy" }
			},
		}),
		// new MetaMaskConnector({
		//   chains: [chain.rinkeby],
		//   options: {
		//     shimDisconnect: false
		//   }
		// }),
		new InjectedConnector({
			chains: [chain.polygon]
		})
	]
}

const wagmiClient = createClient({
	autoConnect: true,
	provider(config) {
		return new providers.AlchemyProvider(config.chainId, 'c9KQd2oIeB0PrvlAuvo2yqP7yOOrpxRy');
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
