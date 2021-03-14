# CRA-DB-Script
## Introduction
-------------
Node.js app to configure and pre-populate the Room database (local persistence library) of CRA-Android. CRA-Android uses methods described in this [documentation](https://developer.android.com/training/data-storage/room/prepopulate) to load data into the local repository after it has been configured by the script. 

-------------
## Usage 
Installation:
1. Have Node.js and npmjs installed locally, you can check in terminal with these commands:
```
$ node -v
$ npm -v
```
2. Clone this repo with Git CLI or your Git client of choice into a new directory ideally within the same parent directory as CRA-Android 
3. Install all the required dependencies declared in this repo's package.json by running this npm command in the directory which this repo was cloned into
```
$ npm install
```
4. That's it for installation, you now have to edit the file paths used by the script so that it knows where to get the DB schema from and where to deploy the DB

Configuration:
1. If you have the latest version of the CRA-Android/version-2 on your machine, you should only need to change one variable for the script to function as intended 
2. Open **gulpfile.ts** and locate this line of code (around line 6), and change this variable's value to the name of the directory that has the CRA-Android repo
```js
const PROJ_DIR = "CRA_ANDROID_DIRECTORY_NAME"
```

Updating phrases in CRA-Android:
1. In the #### **`\_data directory`** there are two files: #### **`crPhrases.csv`** and #### **`phrase.list.json`**
  - phrase.list.json is what the script uses to update the db but is harder to work with directly, instead edit crPhrases.csv with Excel or other effective tool
2. After updating crPhrases.csv, run the following command to have the update reflect on phrase.list.json
```
csvtojson crPhrases.csv > phrase.list.json
```
3. The script is ready to run

Running:
1. Within the directory you cloned this repo to run this terminal command:
```
npx gulp cr
```
2. Your CRA-Android project directory will now have a db file wtih updated schema located in assets/databases/cr.db
3. Commit the updated db file  
