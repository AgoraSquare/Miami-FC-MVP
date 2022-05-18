import { Dialog } from '@headlessui/react';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { useAccount, useContractRead, useDisconnect } from 'wagmi';
import { ErrorMarkIcon, SuccessMarkIcon } from '../utils/Icons';
import LoadingSpinner from '../utils/LoadingSpinner';
import { BigNumber } from 'ethers';
import Poll from '../../abi/Poll.json';
import { useDispatch } from 'react-redux';
import { setHasNFT } from '../../store/slices/walletSlice';
import { useRouter } from 'next/router';

const WalletCheckDialog = ({ open, setOpen }: { open: boolean, setOpen: Dispatch<SetStateAction<boolean>> }) => {
    let buttonRef = useRef(null);

    const route = useRouter();
    const dispatch = useDispatch();
    const {data: uData} = useAccount();
    const [loading, setLoading] = useState(false);
    const { disconnectAsync, reset } = useDisconnect();
    const {data: rData, isError: rError, error:e, isLoading: rLoading} = useContractRead({
        addressOrName: '0xfF5023193127DB2e12169486B0582c6741c27783',
        contractInterface: Poll.abi,
        },
        'hasNFT',
        {
            args: [BigNumber.from('29102676481673041902632991033461445430619272659676223336789171408008386403022')],
            overrides: {
                from: uData?.address,
            },
            onSuccess: (data) => {
                dispatch(
                    setHasNFT(data? true : false)
                )
                if (data) {
                    handleNext();
                }
            }
        },
    );

    const handleDisconnect = async () => {
        setLoading(true);
        await disconnectAsync().then(() => {
            setLoading(false);
            reset();
            handleClose();
        }).catch((e) => {
            console.log(e);
        })
    }

    const handleNext = () => {
        setTimeout(() => {
            handleClose();
            route.push('/vote');
        }, 3000);
    }

    const dConnect = async () => {
        await disconnectAsync().then(() => {
        }).catch((e) => {
            console.log(e);
        })
    }

    const handleClose = () => {
        setOpen(false);
    }
    return (
        <Dialog as='div' open={open} onClose={handleClose}
            initialFocus={buttonRef}
            className='fixed z-20 inset-0 w-screen h-screen overflow-hidden'>
            <div className="flex items-center justify-center h-screen backdrop-blur-sm overflow-hidden">
                <Dialog.Overlay className="fixed inset-0 bg-black opacity-0 w-screen h-screen overflow-hidden" />

                <div className="relative bg-[#202020] border border-[#212427]  rounded-2xl max-w-sm w-full mx-auto py-4 sm:py-6 gap-4 overflow-hidden">
                    {/* Mint Post View */}
                    {<>
                        <Dialog.Description as='div' className="flex flex-col h-full w-full text-center justify-between py-2 flex-1 gap-6 px-6 overflow-y-auto  ">
                            <div className='w-[300px] self-center rounded-lg border-dashed aspect-[1/1] flex overflow-hidden'>
                                <img className='w-full h-full object-cover' src="/NFT.jpg" alt="" />
                            </div>

                            {rLoading && <div className='flex flex-col w-full items-center gap-2'>
                                <LoadingSpinner strokeColor={'#ffffff'} />
                                <p className='text-xs text-white/60'>verifying NFT..</p>
                            </div>}
                            {rData && !rLoading && <div className='flex flex-col w-full items-center'>
                                <SuccessMarkIcon />
                                <p className='text-xs text-white mt-2'>Wohoo!</p>
                                <p className='text-xs text-white'>NFT verified🎉</p>
                                <p className='text-[10px] text-white/60 mt-2'>Redirecting...</p>
                            </div>}
                            {!rData && !rLoading && <div className='flex flex-col w-full items-center gap-2'>
                                <ErrorMarkIcon />
                                <p className='text-xs text-white'>Sorry!<br />We couldn&apos;t detect the NFT in your wallet</p>
                                <button onClick={() => handleDisconnect()} className='btn-div-p'>
                                    <p className='text-xs text-white'>{loading ? 'disconnecting...': 'SignIn with another Wallet'}</p>
                                </button>
                                {/* <a href='#' className='text-xs text-[#519DFF]'>Get the NFT ↗</a> */}
                            </div>}

                            <button ref={buttonRef} className='hidden absolute button-s font-semibold tracking-wide px-6 py-3  text-xs bg-[#212427] rounded-lg outline-none'>Connect Wallet</button>

                        </Dialog.Description>
                    </>
                    }
                </div>
            </div>
        </Dialog>
    );
}

export default WalletCheckDialog;