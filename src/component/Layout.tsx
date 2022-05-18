import { useEffect, useState } from "react";
import Head from "next/head";
import { chain, useConnect, useNetwork, useProvider } from "wagmi";
import { ethers } from "ethers";
import { useDispatch } from "react-redux";
import { setWrongChain as sWC } from "../store/slices/walletSlice";


const Layout = ({ children }: { children: any }) => {

    const dispatch = useDispatch();
    const [wrongChain, setWrongChain] = useState(false);

    const provider = useProvider();
    const { activeChain, switchNetwork } = useNetwork();
    const { activeConnector } = useConnect();
    const [ switching, setSwitching ] = useState(false);

    useEffect(() => {
        if (activeChain && activeConnector?.id === "walletConnect") {
            if (activeChain!.id !== chain.polygon.id) {
                setWrongChain(true);
                dispatch(
                    sWC(true)
                )
            } else {
                setWrongChain(false);
                dispatch(
                    sWC(false)
                )
            }
        }

        if (activeChain) {
            if (activeChain!.id !== chain.polygon.id) {
                setWrongChain(true);
                dispatch(
                    sWC(true)
                )
            } else {
                setWrongChain(false);
                dispatch(
                    sWC(false)
                )
            }
        }

    }, [activeChain])

    useEffect(() => {
        let win = window as any;

        const checkChain = async () => {
            if (win.ethereum && activeConnector?.id === "injected") {
                const provider = new ethers.providers.Web3Provider(win.ethereum);
                const network = await provider.getNetwork();
                if (network.chainId !== chain.polygon.id) {
                    setWrongChain(true);
                    dispatch(
                        sWC(true)
                    )
                } else {
                    setWrongChain(false);
                    dispatch(
                        sWC(false)
                    )
                }
            } else if ( activeConnector?.id === "walletConnect") {
                if (activeChain?.id !== chain.polygon.id) {
                    setWrongChain(true);
                    dispatch(
                        sWC(true)
                    )
                } else {
                    setWrongChain(false);
                    dispatch(
                        sWC(false)
                    )
                }
                
            }
        }

        checkChain();
        if (win.ethereum && activeConnector?.id === "injected") {
            try {
                const provider = new ethers.providers.Web3Provider(win.ethereum, "any");
                provider.on("network", (newNetwork: any, oldNetwork: any) => {
                    
                    if (newNetwork.chainId !== chain.polygon.id) {
                        setWrongChain(true);
                        dispatch(
                            sWC(true)
                        )
                    } else {
                        setWrongChain(false);
                        dispatch(
                            sWC(false)
                        )
                    }
                })

            } catch (error) {
                console.log(error);
            }
        }
    }, [])

    const handleSwitch = async () => {
        setSwitching(true);
        switchNetwork?.(chain.polygon.id);
    }


    return (
        <div className="flex-col min-h-screen flex items-center relative justify-center bg-[#000000]">
            {!wrongChain && <div className="w-full max-w-4xl flex flex-col overflow-hidden bg-[#181818]">
                {children}
            </div>}
            {wrongChain &&
                <div className="w-full max-w-4xl flex flex-col overflow-hidden bg-[#181818]">
                    <div className='w-full max-w-sm bg-[#181818] h-screen self-center flex flex-col items-center justify-center'>
                        <div className=" rounded-xl border border-[#212427] w-full max-w-[200px] flex flex-col gap-2 p-4">
                        <p className='text-white font-semibold text-sm'>Wrong Chain</p>
                        <p className='text-white/60 text-xs'>Please click change to switch chain</p>
                        <button onClick={() => handleSwitch()} className="button-secondary w-max">
                            <p className='text-white/60 text-xs'>{switching ? "Switching..": "Switch Network"}</p>
                        </button>
                                
                        </div>
                    </div>
                </div>}
        </div>
    );
}

export default Layout;