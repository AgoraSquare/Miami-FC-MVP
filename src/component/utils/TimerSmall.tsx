import { useEffect, useState } from "react";

const TimerSmall = () => {
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
        <div className="flex flex-col bg-[#202020]/20 p-2 w-max rounded-lg">
            <p className="text-xs text-[#bbbbbb] font-light">game ends in</p>
            <h3 className="text-xl text-white tracking-widest">{dateString}</h3>
        </div>
    );
}

export default TimerSmall;