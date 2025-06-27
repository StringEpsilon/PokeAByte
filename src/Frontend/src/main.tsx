import "material-icons/iconfont/filled.css";
import "@fontsource/roboto";
import "@fontsource/roboto-mono"; 
import "./css/app.css"
import { Router } from "wouter"
import { Header } from "./layout/Header.tsx"
import { Footer } from "./layout/Footer.tsx"
import { MainView } from "./layout/MainView.tsx"
import { Notifications } from "./notifications/Notifications"
import { render } from "preact";

render(
	<Router base="/ui">
		<Header />
		<MainView />
		<Footer />
		<Notifications />
	</Router>,
	document.getElementById("root")!
)
