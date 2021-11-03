# profile-saver

Profile-saver is an application that let you backup and restore current user profil. If you face a corrupted profil and need to remove it and recreated it directly behind, it's always
useful to be able to create a backup of the current profil and restore it when the fresh profil has been created.

Profil-saver will by default search a local drive with the M:\ path, If this location is not found, it will user document folder. Once the save location is determined, there is two features, save or restore the profile from an existing backup.

When you save the profile that needs to be recreated, the application will create a folder called "Profile-Saver" in the location specified before. The process will generate a specific tree structure to store the backup.

When you restore the profile, the application will lookup in the location folder and check if it corresponds to the tree structure that it knows.

This application is for now only supported under Windows 10.

# Configuration
If you need to change default save location, there is for now no simple way. I tried to use dotenv but it didn't work as expected so I decided to put my configuration variable directly in the configuration service. If you need to change something there, you gonna have to repack the application.

profile-saver > app > services > config-service.js

    export const Default = {
        DIRECTORY_PATH: "m:\\",                 # Change this value if M:\ don't fit you needs
        DIRECTORY_NAME: "Profile-Saver",
    };

## Features

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
 - save taskbar
 - save network printers
 - save desktop content
 - save Outlook signature

#### Restore from save
 - restore desktop, 
 - restore 

## Development

To run the application in development mode :  
``$ npm start``

## Production

To build a portable executable :  
``$ npm run electron:build``


## Technologies
I wanted to challenge myself and use something that I'm not confortable with. **Electron** is the server side technology, that's my first try with the framework. As I'm pretty comfortable with angular, I used that technology in the render side.

## Sources
 Thank's to the clean project angular-electron build by .. for this great job ! If I would had to code a pack between Angular and Electron, this aplication would have take much more time to be coded.