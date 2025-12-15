import { ArchivedMapper, MapperVersion } from "pokeaclient";

export async function postWithoutResult<T>(
	requestUrl: string,
	body: null | T = null
) {
	try {
		const response = await fetch(
			requestUrl,
			{
				method: "POST",
				body: JSON.stringify(body),
				headers: { "Content-Type": "application/json" }
			}
		);
		return response.ok;
	} catch {
		return false
	}
}

export async function changeMapper(mapperId: string | null) {
	try {
		const response = await fetch(
			"http://localhost:8085/mapper-service/change-mapper",
			{
				method: "PUT",
				body: JSON.stringify(mapperId),
				headers: { "Content-Type": "application/json" }
			}
		);
		return response.ok || response.json();
	} catch {
		return false;
	}
}

export async function archiveMappers(mappers: MapperVersion[]) {
	return await postWithoutResult("http://localhost:8085/files/mapper/archive_mappers", mappers);
}

export async function backupMappers(mappers: MapperVersion[]) {
	return await postWithoutResult("http://localhost:8085/files/mapper/backup_mappers", mappers);
}

export async function deleteMappers(mappers: ArchivedMapper[]) {
	return await postWithoutResult("http://localhost:8085/files/mapper/delete_mappers", mappers);
}

export type AppSettingsModel = {
	RETROARCH_LISTEN_IP_ADDRESS: string,
	RETROARCH_LISTEN_PORT: number,
	RETROARCH_READ_PACKET_TIMEOUT_MS: number,
	DELAY_MS_BETWEEN_READS: number,
	PROTOCOL_FRAMESKIP: number,
}

export async function getAppSettings<AppSettings>() {
	try {
		const response = await fetch(
			"http://localhost:8085/settings/appsettings",
			{
				headers: { "Content-Type": "application/json" }
			}
		);
		return <AppSettings>response.json();
	} catch {
		throw new Error("Unable to retrieve app settings.");
	}
}

export async function saveAppSettings(settings: Partial<AppSettingsModel>) {
	return await postWithoutResult("http://localhost:8085/settings/save_appsettings", settings);
}