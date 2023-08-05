import { ReactElement, useState } from "react";
import "../../styles.css";
import { Button } from "./components/index.js";
import { View_pageOne, View_pageTwo, View_pageThree } from "./components/visualizer/index.js";
import { GiBroadsword, AiFillEye, MdMoreHoriz } from "./Icons.js";

interface Pages {
	page_one: boolean;
	page_two: boolean;
	page_three: boolean;
}

export default function Authenticated() {
	const [page, setPage] = useState<Pages>({"page_one": true, "page_two": false, "page_three": false,});

	function view(): ReactElement {  /* render in screen the page beteween 0-2 by user */
		if (page.page_one) {
			return <View_pageOne />;
		} else if (page.page_two) {
			return <View_pageTwo/>;
		}
		return <View_pageThree/>;
	}

	return (
		<div className="select-none h-screen overflow-hidden">
			<h1 className="text-3xl bg-transparent h-0 absolute">Anna</h1>
			<div className="flex items-center justify-between h-[100%]">
				<div className="flex flex-col justify-center h-[100%] gap-1 bg-zinc-900 w-32">
					<Button icon={<GiBroadsword/>} func={() => setPage({page_one: true, page_two: false, page_three: false})} isChoosed={page.page_one}/>
					<Button icon={<AiFillEye/>} func={() => setPage({page_one: false, page_two: true, page_three: false})} isChoosed={page.page_two}/>
					<Button icon={<MdMoreHoriz/>} func={() => setPage({page_one: false, page_two: false, page_three: true})} isChoosed={page.page_three}/>
				</div>
				{view()}
			</div>
		</div>
	);
}