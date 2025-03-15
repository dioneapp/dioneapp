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
    // There are several types of steps:
    // 1. Dependencies, to read the required dependencies.
    // 2. Installation, to execute the necessary steps when installing the app.
    // 3. Start, to execute the necessary steps to start the app.
    "dependencies": {
      "git": {
         "version": "latest" // Using `latest`, as long as the user has the dependency installed, the version will not matter. 
      },
      "node": {
         "version": "22.14.0" // By specifying a version you will force the user to install the exact version required.
      }
    },
    "installation": [
        {
            "name": "Cloning repository", // The name you enter here will be displayed as a status within the application.
            "commands": [
                "git clone https://github.com/dione-app/dioneapp.git"
            ]
        }
        {
            "name": "Installing dependencies",
            "commands": [
                // You can include more than one command, they will be executed sequentially.
                "cd dioneapp",
                "npm install"
            ]
        }
    ],
    "start": [
         {
            "name": "Starting Dione",
            "catch": "5123", // specify a port to load your application inside dione
            "commands": [
                "cd dioneapp", // Using cd {directory_name} will change directory during that step, when you go to the next step you will return to the root directory of your application.
                "npm run dev",
            ]
        }
    ]
}
```

##### Using an environment
Use the `env` property to specify the environment to use for your script.
**_NOTE:_** The `uv` dependency will be automatically added to your list of dependencies. 

```json
    "installation": [
        {
            "name": "Installing requirements",
            "env": "env", // specify a name for the environment
            "commands": [
                // commands to be executed inside the env
                "uv pip install -r ../applio/requirements.txt"
            ]
        }
    ],
```


##### Publish your script
You can publish your script to the Dione Scripts repository by following these steps:
1.
2.
3.