import Head from "next/head";
import Layout from "../../component/Layout";
import Image from "next/image";
import { useEffect, useState } from "react";
import { PoweredByAgoraIcon } from "../utils/Icons";
const WinnerScreen = ({ data }: { data: any }) => {
    return (
        <div className='w-full flex flex-col' >
            <Head>
                <title>Miami FC</title>
                <meta name="description" content="Miami FC 5/18/22" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Layout>
                <div className={` sm:translate-x-[50%] top-0 ${data.team === 1 ? "bg-m" : "bg-dc"} s-bg`} />
                <div className='w-full max-w-sm bg-[#181818] h-screen self-center flex flex-col'>
                    <div suppressHydrationWarning={true} className=' flex grow flex-col px-4 w-full pt-10 pb-2 z-10'>
                        <div className="w-full h-14">

                        </div>

                        <div className="flex flex-col relative w-full rounded-xl overflow-hidden">
                            <div className="absolute w-full h-full ">
                                <img className="w-full h-full object-cover" src={data.team === 1 ? "/w-card-m.png": "/w-card-dc.png"} alt="" />
                            </div>
                            <div className={`w-[70%] mt-10 relative self-center ${data.team === 1 ? 'bg-m' : 'bg-dc'} rounded-3xl aspect-[1/1] flex`}>
                                <img className="w-full h-full rounded-3xl object-cover" src={data.img_link} alt="" />
                            </div>

                            {true && <div className='z-10 flex mb-10 flex-col w-full items-center mt-20 '>
                                <p className='text-sm text-white/60'>winner is</p>
                                <p className='text-xl text-white'>{data.first_name} {data.last_name}</p>
                            </div>}
                        </div>

                    </div>
                    <div className='flex items-center justify-center self-center py-4 max-w-sm'>
                        <PoweredByAgoraIcon />
                    </div>
                </div>
            </Layout>

        </div>
    );
}

export default WinnerScreen;