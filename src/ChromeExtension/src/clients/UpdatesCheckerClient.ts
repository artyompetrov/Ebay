import * as Utils from "../infrastructure/Utils"; 

export async function  checkForUpdates(): Promise<boolean> {
    const currentVersion = chrome.runtime.getManifest().version;
    const updateUrl = chrome.runtime.getManifest().update_url;

    if (!updateUrl) {
        throw new Error("Update URL not defined in manifest.");
    }
    const response = await Utils.fetchResource(updateUrl, {});
    if (!response.ok) {
        throw new Error("Failed to fetch update manifest: " + response.statusText);
    }

    const xmlText = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "application/xml");

    const updateCheckNode = xmlDoc.querySelector("updatecheck");
    const remoteVersion = updateCheckNode?.getAttribute("version");

    if (!remoteVersion) {
        throw new Error("Version not found in the update manifest.");
    }

    const isNewerVersion = (current: string, remote: string): boolean => {
        const currentParts = current.split('.').map(Number);
        const remoteParts = remote.split('.').map(Number);

        for (let i = 0; i < Math.max(currentParts.length, remoteParts.length); i++) {
            const currentPart = currentParts[i] || 0;
            const remotePart = remoteParts[i] || 0;

            if (remotePart > currentPart) {
                return true;
            } else if (remotePart < currentPart) {
                return false;
            }
        }

        return false;
    };

    if (isNewerVersion(currentVersion, remoteVersion)) {
        let alertMessage = `Ebay Helper extension New version available: ${remoteVersion}`
        if (currentVersion === "0") {
            // Локальный дебаг
            console.log("Alerting " + alertMessage)
        } else {
            alert(alertMessage);
            
            return false;
        }
        return true;
    }

    console.log("No updates available. Current version is up-to-date.");
}
