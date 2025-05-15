import "material-icons/iconfont/filled.css";
import "@fontsource/roboto";
import "@fontsource/roboto-mono"; 
import "./css/app.css"
import { useSyncExternalStore } from "react";
import { ToastContainer } from "./notifications/ToastContainer.tsx";
import { Store } from "./utility/propertyStore.ts";
import { MainView } from "./layout/MainView.tsx";
import { Header } from "./layout/Header.tsx";
import { Footer } from "./layout/Footer.tsx";

function App() {

	const mapper = useSyncExternalStore(Store.subscribeMapper, Store.getMapper);
	return (
		<>
			<Header mapper={mapper} />
			<MainView />
			<Footer />
			<ToastContainer />
		</>
	)
}

export default App
