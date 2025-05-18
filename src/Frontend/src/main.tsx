import "material-icons/iconfont/filled.css";
import "@fontsource/roboto";
import "@fontsource/roboto-mono"; 
import "./css/app.css"
import { createRoot } from "react-dom/client"
import { Router } from "wouter"
import { Header } from "./layout/Header.tsx"
import { Footer } from "./layout/Footer.tsx"
import { MainView } from "./layout/MainView.tsx"
import { Notifications } from "./notifications/Notifications"

createRoot(document.getElementById("root")!).render(
	<Router base="/ui">
		<Header />
		<MainView />
		<Footer />
		<Notifications />
	</Router>
)
