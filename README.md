# Dione App
Explore, Install, Innovate — in 1 Click.


### Getting Started
To get a local copy up and running, follow these simple example steps.

#### Prerequisites
- [Node.js](https://nodejs.org/en/download/)
- [pnpm](https://pnpm.io/installation)
- [NPM](https://www.npmjs.com/get-npm)
- [Git](https://git-scm.com/downloads)
- [Visual Studio 2022](https://visualstudio.microsoft.com/downloads/) 

#### Installation
1. Clone the repo
   ```sh
   git clone https://github.com/dione-app/dioneapp.git
   ```
2. Navigate to the project directory
   ```sh
   cd dioneapp
   ```
3. Install dependencies
   ```sh
   pnpm install
   ```

#### Usage
To start the development server, run the following command:
   ```sh
   pnpm dev
   ```

#### Build
To build the project, execute the following command (requires admin privileges):
   ```sh
   pnpm build
   ```

#### Documentation
For more information on Dione, please refer to the [Dione Documentation](https://docs.dione.app/).

##### Create an script
Create a script named `dione.json` in the root directory of your project.
You can use the following template:
```json
{
    "dependencies": {
      "git": {
         "version": "latest"
      },
      "node": {
         "version": "latest"
      }
    },
    "installation": [
        {
            "name": "Cloning repository",
            "commands": [
                "git clone https://github.com/dione-app/dioneapp.git"
            ]
        }
        {
            "name": "Installing dependencies",
            "commands": [
                "cd dioneapp",
                "npm install"
            ]
        }
    ],
    "start": [
         {
            "name": "Starting Dione",
            "catch": "5123",
            "commands": [
                "cd dioneapp",
                "npm run dev",
            ]
        }
    ]
}
```

##### Publish your script
You can publish your script to the Dione Scripts repository by following these steps:
1.
2.
3.