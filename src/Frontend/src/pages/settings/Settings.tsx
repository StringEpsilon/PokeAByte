import { Advanced } from "../../components/Advanced";
import { Panel } from "../mappers/Panel";
import { AppSettings } from "./panels/AppSettings";
import { GithubSettingsPage } from "./panels/GithubSettings";
import { UISettings } from "./panels/UISettings";

export function Settings() {
	return (
		<article class="margin-top">
			<Advanced>
				<Panel id="_settings_gh" title="GitHub API settings" defaultOpen>
					<GithubSettingsPage />
				</Panel>
			</Advanced>
			<Panel id="_settings_general" title="Poke-A-Byte settings">
				<AppSettings />
			</Panel>
			<UISettings/>
		</article>
	);
}
