import { Advanced } from "../../components/Advanced";
import { Panel } from "../mappers/Panel";
import { AppSettings } from "./AppSettings";
import { GithubSettingsPage } from "./GithubSettings";
import { UISettings } from "./UISettings";

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
