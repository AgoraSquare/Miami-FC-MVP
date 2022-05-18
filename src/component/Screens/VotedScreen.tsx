import Head from "next/head";
import Layout from "../../component/Layout";
import Image from "next/image";
import { useEffect, useState } from "react";
import { VoteIconM } from "../utils/Icons";

const VotedScreen = ({ data }: { data: any}) => {

	const [dateString, setDateString] = useState("");

	useEffect(() => {

		setInterval(() => {
			// TODO: add the match end date here
			const date = new Date(1652922900000);
			const newD = new Date();
			const diff = date.getTime() - newD.getTime();
			const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
			const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
			const seconds = Math.floor((diff % (1000 * 60)) / 1000);
			const s = (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds) ;
			setDateString(s);
		}, 1000);

	},[])

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
					<div suppressHydrationWarning={true} className='flex grow flex-col px-4 w-full pt-10 pb-2 z-10'>
						<div className="w-full h-14">

						</div>

						<div className={`w-[250px] relative self-center ${data.team === 1 ? 'bg-m' : 'bg-dc'} rounded-3xl aspect-[1/1] flex`}>
							<img className="w-full h-full rounded-3xl object-cover" src={data.img_link} alt="" />
							<div className="bg-m w-16 h-16 rounded-full absolute bottom-0 right-0 translate-x-1 translate-y-1">
								<Image src={data.team === 1 ? '/m_fc.png' : '/dc_fc.png'} width={64} height={64} alt="" />
							</div>
						</div>

						{true && <div className='flex flex-col w-full items-center mt-10 gap-3'>
							<p className='text-xs text-white/60'>you voted for</p>
							<p className='text-base text-white'>{data.first_name} {data.last_name} <span className='text-sm text-white/60'>• {data.team === 1 ? "Miami FC" : "DC FC"}</span></p>
							<p className='text-xs text-white/60 font-light text-center max-w-xs w-full'>results would be announced 15 mins after the match</p>

							<div className="flex flex-col bg-[#202020]/20 p-4 w-max rounded-lg">
								<h3 className="text-white text-4xl tracking-widest">{dateString}</h3>
							</div>
						</div>}

					</div>
				</div>
			</Layout>

		</div>
	);
}

export default VotedScreen;