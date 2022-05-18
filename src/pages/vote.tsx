import Head from "next/head";
import Layout from "../component/Layout";
import { SearchIcon, VoteIconDC, VoteIconM } from "../component/utils/Icons";
import Image from "next/image";
import { useEffect, useState } from "react";
import players from '../data/players-1.json';
import VoteDialog from "../component/Dialogs/VoteDialog";
import SEO from "../component/SEO";
import { chain, useAccount, useConnect, useContractRead, useNetwork } from "wagmi";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import LoadingSpinner from "../component/utils/LoadingSpinner";
import Poll from '../abi/Poll.json';
import { BigNumber, ethers } from "ethers";
import VotedScreen from "../component/Screens/VotedScreen";
import WinnerScreen from "../component/Screens/WinnerScreen";
import TimerSmall from "../component/utils/TimerSmall";

const VotePage = () => {

    const { activeChain } = useNetwork();
    const { activeConnector } = useConnect();
    const [filterBy, setFilterBy] = useState(0);
    const [search, setSearch] = useState("");
    const [dateString, setDateString] = useState("");
    const [openVoteD, setOpenVoteD] = useState(false);
    const [pData, setPData] = useState(players[0]);
    const [clientLoaded, setClientLoaded] = useState(false);
    const [hasVoted, setHasVoted] = useState(false);
    const [ winnerDeclared, setWinnerDeclared ] = useState(false);
    const [ pollFinished, setPollFinished ] = useState(false);

    useEffect(() => {
        setClientLoaded(true)
    }, [])

    

    const { data: uData } = useAccount();
    const route = useRouter();

    const wallet = useSelector((state: RootState) => state.wallet);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        // TODO: add time check to see if poll is over or if vote is ended
        getPollFinished.refetch();
        // TODO: get the winner and set winner Object to pData 
        // TODO: set winnerDeclared to true
        if(pollFinished){

            getPollWinner.refetch();

        }
        
        
        if (hasVoted) {
            // ToDO: get voted item id
            // TODO: add voted item as obj from players-1.json to pdata
            getUserVote.refetch();
            
        }

    }, [])

    useEffect(() => {
        if (!wallet.wrongChain) {
            checkVoted.refetch();
        }
    }, [wallet])

    
    const getPollWinner = useContractRead(
        {
            addressOrName: '0xfF5023193127DB2e12169486B0582c6741c27783',
            contractInterface: Poll.abi,
        },
        "getPollWinner",
        {
            args: [BigNumber.from('29102676481673041902632991033461445430619272659676223336789171408008386403022')],
            overrides: {
                from: uData?.address,
            },
            enabled: false,
            onSuccess: (data) => {
                console.log(data);
                // TODO: get winner id from data then get object with id from players-1.json
                // TODO: set pData using setPData(winnerObj)
                setPData(players[Number(data)]);
                // TODO: set winnerDeclared to true
                setWinnerDeclared(true);
            }
        }
    )
    
    
    const getUserVote = useContractRead(
        {
            addressOrName: '0xfF5023193127DB2e12169486B0582c6741c27783',
            contractInterface: Poll.abi,
        },
        "getUserVote",
        {
            args: [BigNumber.from('29102676481673041902632991033461445430619272659676223336789171408008386403022')],
            overrides: {
                from: uData?.address,
            },
            enabled: false,
            onSuccess: (data) => {
                console.log(data);
                // ToDO: get voted item id
            // TODO: add voted item as obj from players-1.json to pdata
                setPData(players[Number(data)]);
            }
        }
    )
    
    
    const getPollFinished = useContractRead(
        {
            addressOrName: '0xfF5023193127DB2e12169486B0582c6741c27783',
            contractInterface: Poll.abi,
        },
        "getPollFinished",
        {
            args: [BigNumber.from('29102676481673041902632991033461445430619272659676223336789171408008386403022')],
            overrides: {
                from: uData?.address,
            },
            enabled: false,
            onSuccess: (data) => {
                console.log(data);

                if(data){
                    setPollFinished(true);
                }else{
                    setPollFinished(false);
                }
                
            }
        }
    )
    


    const checkVoted = useContractRead(
        {
            addressOrName: '0xfF5023193127DB2e12169486B0582c6741c27783',
            contractInterface: Poll.abi,
        },
        'hasUserVoted',
        {
            args: [BigNumber.from('29102676481673041902632991033461445430619272659676223336789171408008386403022')],
            overrides: {
                from: uData?.address,
            },
            enabled: false,
            onSuccess: (data) => {
                console.log(data);
                
                setLoading(false);
                if(data) {
                    setHasVoted(true);
                    getUserVote.refetch();
                } else {
                    setHasVoted(false);
                }
            },
            onError: (error) => {
                console.log("error", error);
                
            }
        },
    )

    const { refetch } = checkVoted;


    const handleFilterClick = (id: number) => {
        if (id === filterBy) {
            setFilterBy(0);
        }
        else {
            setFilterBy(id);
        }
    }

    const filterPlayers = () => {
        if (filterBy === 0) {
            return players;
        }
        else {
            return players.filter(player => player.team === filterBy);
        }
    }

    useEffect(() => {
        if (!uData) {
            route.push('/');
        } else {

        }
    }, [])

    const searchPlayerByName = () => {
        if (search === "") {
            return filterPlayers();
        }
        else {
            return filterPlayers().filter(player => player.first_name?.toLowerCase().includes(search.toLowerCase()) || player.last_name?.toLowerCase().includes(search.toLowerCase()));
        }
    }

    const handleVoteClick = (data: any) => {
        setPData(data);
        setOpenVoteD((prev) => !prev);
    }

    const getName = (data: any) => {
        let name = data.first_name + " " + data.last_name;
        if (name.length > 13) {
            return name.substring(0, 11) + "...";
        } else {
            return name;
        }
    }
    const getNameF = (data: any) => {
        return data.first_name + " " + data.last_name;
    }

    if (winnerDeclared) {
        return (
            <WinnerScreen data={pData} />
        )
    }

    if (hasVoted && !pollFinished) {
        return (
            <VotedScreen data={pData} />
        )
    }

    return (
        <>
            { clientLoaded && <div className='w-full flex flex-col' >
                {
                    !wallet.hasNFT &&
                    <Layout>
                        <div className='w-full max-w-sm bg-[#181818] h-screen self-center flex flex-col'>
                            <div suppressHydrationWarning={true} className='flex grow flex-col px-4 w-full pt-10 pb-2 z-10'>

                            </div>
                        </div>
                    </Layout>
                }
                {/* TODO: add time check here too */}
                {uData && wallet.hasNFT && <Layout>
                    <div className='sm:translate-x-[25%] top-0 bg-m s-bg' />
                    <div className='sm:translate-x-[-100%] bottom-[-50px] sm:bottom-0 right-0 bg-dc s-bg' />
                    <div className='w-full max-w-sm bg-[#181818] h-screen self-center flex flex-col'>
                        <div suppressHydrationWarning={true} className='flex grow flex-col px-4 w-full pt-10 pb-2 z-10'>
                            <div className='w-full z-20 flex flex-col gap-2 '>
                                <p className='text-white font-semibold text-sm'>Homegame</p>
                                <h4 className='text-white font-semibold text-3xl'>@Miami FC 5/18/22</h4>
                                { !hasVoted && <span className='text-xs text-[#bbbbbb] w-full'>Use your game NFT to vote and help choose the MVP of todays game!</span>}
                            </div>

                            { !hasVoted && <div className="flex w-full py-2 px-4 mt-6 bg-[#202020] items-center justify-between gap-2 rounded-lg">
                                <input value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1 bg-transparent border-none outline-none text-sm text-white" type="text" placeholder="Search for your favourite player" />
                                <SearchIcon />
                            </div>}

                            <div className="flex items-center justify-between mt-4 w-full">
                                <TimerSmall />
                                { !hasVoted && <div className="flex items-center p-2 gap-2 h-max">
                                    <p className="text-xs text-[#bbbbbb] font-light">sort by team</p>
                                    <button onClick={() => handleFilterClick(1)} className={`outline-none w-6 border-none h-6 t-a active:scale-110 ${filterBy === 1 ? '' : 'grayscale'} `}>
                                        <Image src="/m_fc.png" width={24} height={24} alt="" />
                                    </button>
                                    <button onClick={() => handleFilterClick(2)} className={`outline-none border-none w-6 h-6 t-a active:scale-110 ${filterBy === 2 ? '' : 'grayscale'} `}>
                                        <Image src="/dc_fc.png" width={24} height={24} alt="" />
                                    </button>
                                </div>}
                            </div>

                            {
                                loading &&
                                <div className="w-full flex justify-center mt-10">
                                <LoadingSpinner strokeColor={'#ffffff'} />
                                </div>
                            }

                            {!loading && <div className="flex flex-col w-full flex-1 h-full relative overflow-hidden">
                                <div className="flex flex-col grow flex-1 absolute h-full overflow-y-auto overflow-x-hidden w-full no-scrollbar py-2 mt-2">
                                    <div className="flex flex-col gap-4 ">
                                        <VoteDialog refetch={refetch} open={openVoteD} setOpen={setOpenVoteD} data={pData} />
                                        {
                                            searchPlayerByName().map((d, index) => (
                                                <div key={index} className="w-full p-4 flex items-center justify-between bg-[#202020]/40 rounded-lg">
                                                    <div className="flex items-center gap-4">
                                                        {/* image div */}
                                                        <div className="w-11 h-11 bg-white rounded-xl relative">
                                                            <img className="w-full h-full rounded-xl object-cover" src={d.img_link} alt="" />
                                                            {/* pTag */}
                                                            <div className="bg-m w-6 h-6 rounded-full absolute bottom-0 right-0 translate-x-1 translate-y-1">
                                                                {
                                                                    d.team === 1 ?
                                                                        <Image src="/m_fc.png" width={24} height={24} alt="" />
                                                                        :
                                                                        <Image src="/dc_fc.png" width={24} height={24} alt="" />

                                                                }
                                                            </div>
                                                        </div>

                                                        {/* name div */}
                                                        <div className="flex flex-col">
                                                            <p className="text-white text-sm">{getName(d)}</p>
                                                            <p className="text-[#6f6f6f] text-[10px]">{d.position}</p>
                                                        </div>
                                                    </div>

                                                    {/* Vote Button */}
                                                    <div className="flex items-center pl-2 flex-1 justify-end">
                                                        <button onClick={() => handleVoteClick(d)} className="button-secondary">
                                                            {
                                                                d.team === 1 ?
                                                                    <VoteIconM />
                                                                    :
                                                                    <VoteIconDC />
                                                            }
                                                            <p className="text-white text-xs">Vote MVP</p>
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                        {
                                            searchPlayerByName().length === 0 &&
                                            <p className="w-full text-center text-xs text-[#6f6f6f]">
                                                No player found {filterBy === 0 ? '' : filterBy === 1 ? 'with "' + search + '" in Miami FC' : 'with "' + search + '" in Detroit City fC'}
                                            </p>
                                        }
                                    </div>
                                </div>
                            </div>}

                        </div>
                    </div>
                </Layout>}

            </div>}
        </>
    );
}

export default VotePage;