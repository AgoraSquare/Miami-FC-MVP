import { Dialog } from '@headlessui/react';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { ErrorMarkIcon, SuccessMarkIcon, VoteIconM } from '../utils/Icons';
import LoadingSpinner from '../utils/LoadingSpinner';
import Image from 'next/image';
import { useContractWrite, useContractRead, useAccount, useContract, useWaitForTransaction } from 'wagmi'
import Poll from '../../abi/Poll.json'
import { BigNumber } from 'ethers';

const VoteDialog = ({ open, setOpen, data, refetch }: { open: boolean, setOpen: Dispatch<SetStateAction<boolean>>, data: any, refetch: () => void }) => {
    let buttonRef = useRef(null);

    const [loading, setLoading] = useState(false);
    const [hasVoted, setHasVoted] = useState(false);

    const { data: uData } = useAccount();


    const handleClose = () => {
        setOpen(false);
    }

    const { isError, isLoading, writeAsync, data: wData } = useContractWrite(
        {
            addressOrName: '0x8B91B197B9cAc9B0A52A2a8941dcbB493e466B47',
            contractInterface: Poll.abi,
        },
        'votePoll',
        {
            args: ['80084422859880547211683076133703299733277748156566366325829078699459944778998', data.voteItemId],
            onError: (e) => {
                setLoading(false);
            },
        },
    )

    const { data: tData, isLoading: tloading } = useWaitForTransaction({
        hash: wData?.hash,
        onError: (e) => {
            setLoading(false);
        }
    })

    const handleVote = () => {
        if (!loading) {
            setLoading(true);
            writeAsync().then(() => {
                setLoading(true);
            }).catch((e) => {
                console.log(e);
            });
        }
    }

    useEffect(() => {
        if (tData) {
            setLoading(false);
            setHasVoted(true);
            refetch();
            handleClose();
        }
    }, [tData])

    useEffect(() => {
        setLoading(tloading);
    }, [tloading])

    // console.log(rData);
    // console.log(rError);
    // console.log(e);




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
                            <div className={`w-[250px] relative self-center ${data.team === 1 ? 'bg-m' : 'bg-dc'} rounded-3xl aspect-[1/1] flex`}>
                                <img className="w-full h-full rounded-3xl object-cover" src={data.img_link} alt="" />
                                <div className="bg-m w-16 h-16 rounded-full absolute bottom-0 right-0 translate-x-1 translate-y-1">
                                    <Image src={data.team === 1 ? '/m_fc.png' : '/dc_fc.png'} width={64} height={64} alt="" />
                                </div>
                            </div>

                            {true && <div className='flex flex-col w-full items-center'>
                                <p className='text-xs text-white/60'>vote wisely, you can not change your vote</p>
                                <p className='text-base text-white'>{data.first_name} {data.last_name} <span className='text-sm text-white/60'>• {data.team === 1 ? "Miami FC" : "DC FC"}</span></p>
                                <button onClick={() => handleVote()} className='button-primary flex items-center mt-4'>
                                    <VoteIconM />
                                    <p className="text-black text-xs font-bold">{!loading ? 'Confirm vote' : 'Waiting..'}</p>
                                </button>
                                <button onClick={handleClose} className='button-text mt-4'>
                                    <p className='text-sm'>← go back</p>
                                </button>
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

export default VoteDialog;