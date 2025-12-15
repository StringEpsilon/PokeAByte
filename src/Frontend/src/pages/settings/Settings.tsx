import { Panel } from "../mappers/Panel";
import { GeneralSettings } from "./GeneralSettings";
import { GithubSettingsPage } from "./GithubSettings";

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
		</article>
	);
}
