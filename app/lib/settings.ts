import { BrowserWindow } from "electron";
import { Repertories, setDirectoryPath } from "../services/config-service";
import { directoryPicker, userInfo } from "../services/utils-service";

/**
 * Open folder picker function and set the new location choose as default for backup
 * @param win main windows, used to pushed folder picker
 * @returns Promise<void>
 */
export async function changeDefaultLocation(win: BrowserWindow): Promise<void> {
  try {
    // Invoke folder picker
    let folder = await directoryPicker(win);
    // Folder cannot be desktop
    if (folder.includes(`${userInfo().homedir}\\${Repertories.desktop}`)) {
      throw new Error("Desktop is not allowed as a backup location");
    }
    // Set new location
    setDirectoryPath(folder);
  } catch (err) {
    throw err;
  }
}