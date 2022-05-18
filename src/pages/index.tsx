import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Layout from '../component/Layout'
import { MetamaskIcon, NullWallet, PoweredByAgoraIcon, WalletConnectIcon } from '../component/utils/Icons'
import { Connector, useConnect, useAccount, useNetwork, chain } from 'wagmi'
import { useContext, useEffect, useState } from 'react'
import WalletCheckDialog from '../component/Dialogs/WalletCheckDialog'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { setAddress } from '../store/slices/walletSlice'
import SEO from '../component/SEO'

const Home: NextPage = () => {

	const route = useRouter();

	const dispatch = useDispatch()
	const { connectors, error, connectAsync, reset, activeConnector } = useConnect();
	const { status, data } = useAccount();
	const { activeChain, isLoading, switchNetwork } = useNetwork();
	const [openD, setOpenD] = useState(false);
	const [ loggedIn, setLoggedIn ] = useState(false);
	const [ clientLoaded, setClientLoaded ] = useState(false);

	useEffect(() => {
		setClientLoaded(true)
	}, [])

	useEffect(() => {
		if (data) {
			setLoggedIn(true);
			dispatch(
				setAddress(data.address? data.address :"")
			)
			// route.push('/vote');
			setOpenD(true);
		} else {
			setLoggedIn(false);
		}
	},[data])

	const { isReady } = useRouter();

	const onConnect = async (x: Connector) => {
		await connectAsync(x).then(({ account }) => {
			console.log(account);
		}).catch((e) => {
			console.log(e);
		})
	}


	const getAddr = (str: string) => {
		return str.substring(0, 6) + '...' + str.substring(str.length - 4, str.length);
	}

	const getIconById = (id: string) => {
		switch (id) {
			case 'MetaMask':
				return <MetamaskIcon />;
			case 'WalletConnect':
				return <WalletConnectIcon />;
			default:
				return <NullWallet />;
		}
	}

	const ConnectButton = ({ x }: { x: Connector }) => {
		if (!x.ready) {
			return (
				<button className={` btn-div-pd  w-full`}>{getIconById(x.name)}<h3 className='text-white text-xs'>{x.name}</h3></button>
			)
		}
		return (
			<button onClick={() => onConnect(x)} className={`btn-div-p w-full`}>{getIconById(x.name)}<h3 className='text-white text-xs'>{x.name}</h3></button>
		)
	}

	const onNetworkSwitch = (x: number) => {
		if (!isLoading) {
			switchNetwork?.(x);
		}
	}

	if (!isReady) {
		<div></div>
	}

	return (
		<div className='w-full flex flex-col' >
			
			<Layout>
				<div className='w-full max-w-sm bg-[#181818] h-screen self-center flex flex-col'>
					<div suppressHydrationWarning={true} className='flex grow flex-col justify-between w-full py-20'>
						<div className='w-full z-20 flex flex-col gap-2 px-10'>
							<p className='text-white font-semibold text-sm'>Homegame</p>
							<h4 className='text-white font-semibold text-3xl'>@Miami FC 5/18/22</h4>
							<span className='text-xs text-[#bbbbbb] w-full'>Use your game NFT to vote and help choose the MVP of todays game!</span>
						</div>

						<div className='flex items-center w-full flex-1 justify-between'>
							<div className='flex relative flex-1 h-full items-center pr-4 justify-end'>
								<div className='translate-x-[25%] bg-m s-bg' />
								<Image className='z-10' src='/m_fc.png' width='100px' height='100px' alt='' />
							</div>
							<div className='flex relative flex-1 h-full items-center pl-4'>
								<div className='translate-x-[-25%] bg-dc s-bg opacity-80' />
								<Image className='z-10' src='/dc_fc.png' width='100px' height='100px' alt='' />
							</div>
						</div>
						{ !loggedIn && clientLoaded && <div className='flex flex-col z-20 items-center w-full max-w-[50%] self-center gap-4 p-2' >
							<p className='text-white text-xs mb-2'>Continue with</p>
							{connectors.map((connector, index) => (<ConnectButton key={index} x={connector} />))}
							{error && <p className='text-red-500 text-xs w-full max-w-[20ch]'>{error.message}</p>}
						</div>}
						{
							clientLoaded && data && activeChain?.id === 80001 && <WalletCheckDialog open={openD} setOpen={setOpenD} />
						}
						{
							activeChain?.id !== 80001 && data &&
							<button onClick={() => onNetworkSwitch(chain.polygonMumbai.id)} className='btn-div-p max-w-[50%] self-center'>
								<p className='text-white text-xs'>{isLoading ? 'Switching..' : 'Switch to Mumbai'}</p>
							</button>
						}
					</div>

					<div className='flex items-center justify-center self-center py-4 max-w-sm'>
						<PoweredByAgoraIcon />
					</div>
				</div>
			</Layout>

		</div>
	)
}



export default Home
