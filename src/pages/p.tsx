import VotedScreen from "../component/Screens/VotedScreen";
import WinnerScreen from "../component/Screens/WinnerScreen";

const P = () => {

    const data = {
		"img_link": "https://www.miamifc.com/wp-content/uploads/sites/4/2021/10/Perez-WEB.png?w=1024",
		"id": 7,
		"first_name": "Joshua",
		"last_name": "Pérez",
		"team": 1,
		"position": "Forwards",
		"team_name": "Miami FC",
		"voteItemId": 8
	}

    return (
        // <VotedScreen data={data} />
        <WinnerScreen data={data} />
    );
}

export default P;