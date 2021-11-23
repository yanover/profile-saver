<table align="center"><tr><td align="center" width="9999">
<img src="https://i.postimg.cc/8k95M69T/favicon-256x256.png" align="center" width="150" alt="Project icon">

# Profil Saver

<a href="https://angular.io/" target="_blank"><img src="https://img.shields.io/badge/angular-v12.1.2-red" alt="Angular" /></a>
<a href="https://www.electronjs.org/" target="_blank"><img src="https://img.shields.io/badge/electron-v13.1.7-blue" alt="Electron" /></a>
<a href="https://fr.wikipedia.org/wiki/Licence_MIT" target="_blank"><img src="https://img.shields.io/badge/license-MIT-green" alt="Licence" /></a>

</td></tr></table>

# Description

Profil-saver is an application that let you backup and restore current user profil. If you face a corrupted profil and need to remove it and recreated it directly behind, it's always
useful to be able to create a backup of the current profil and restore it when the fresh profil has been created.

Profil-saver will by default search a local drive with the M:\ path, If this location is not found, it will user document folder. Once the save location is determined, there is two features, save or restore the profile from an existing backup.

When you save the profile that needs to be recreated, the application will create a folder called "Profile-Saver" in the location specified before. The process will generate a specific tree structure to store the backup.

When you restore the profile, the application will lookup in the location folder and check if it corresponds to the tree structure that it knows.

Currently runs with:

- Angular v12.1.2
- Electron v13.1.7
- Electron Builder v22.11.9
- This application is for now only supported under Windows 10.

# Configuration

If you need to change default save location, there is for now no simple way. I tried to use dotenv but it didn't work as expected so I decided to put my configuration variable directly in the configuration service. If you need to change something there, you gonna have to repack the application.

profile-saver > app > services > config-service.js

    export const Default = {
        DIRECTORY_PATH: "m:\\",                 # Change this value if M:\ don't fit you needs
        DIRECTORY_NAME: "Profile-Saver",
        PRINT_SERVER: "print-server",           # Change this value according to your printer-server hostname
    };

# Screenshot
<img src="https://i.postimg.cc/d31CWZKJ/screen01.jpg" width="720"/>

# Features

#### Display system informations

- Download folder
- Document folder
- Desktop folder
- Total profil space
- OS type
- OS Version
- Architecture
- Current user
- RAM

#### Save current profile

- save desktop content
- save network printers
- save taskbar
- save Outlook signature
- save Edge's bookmarks (Chromium only)

#### Restore from save

- restore desktop,
- restore network printers
- restore taskbar
- restore Outlook signature
- restore Edge's bookmarks

## Development

To run the application in development mode :  
`$ npm start`

## Production

To build a portable executable :  
`$ npm run electron:build`

## Testing

Test are implemented using MOCHA. Test files are located under /e2e/.

To run test :  
`$ npm run e2e`

## Technologies

I wanted to challenge myself and use something that I'm not confortable with. **Electron** is the server side technology, that's my first try with the framework. As I already know **Angular**, I used that technology in the render side. I know it's not obviously the best choice, angular is a big part and a raw html/css file could have done the job too. However, I like the way Angular make things modular and I thought it cool be cool to pack it with Electron.

## Sources

Thank's to the clean project [angular-electron](https://github.com/maximegris/angular-electron) build by [Adam Pritchard](https://github.com/adam-p) for this great job ! If I would had to code a pack between Angular and Electron, this aplication would have take much more time to be coded.
