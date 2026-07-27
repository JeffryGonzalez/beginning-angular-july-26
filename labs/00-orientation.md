
# Creating and Configuring an Angular Application

Angular comes with a command-line tool — the **CLI** — that creates projects, runs them
while you work, and builds them for production. You'll use it constantly, so let's get
comfortable with it before we write a line of application code.

## Install the latest Angular Command Line Interface (CLI)

You install the CLI once, globally, with npm:

```bash
npm install -g @angular/cli
```

> Note: This will take a while.

That gives you the `ng` command. Almost everything you do to a project — create it, run
it, add a component, build it — goes through `ng`. It's worth thinking of the CLI as part
of the framework rather than an optional extra; the Angular team ships them together and
expects you to use them together.

Run the following command to see the version of the Angular CLI:

```bash
ng version
```

To see a list of commands, type:

```bash
ng --help
```

## `ng new` Scaffolds a Working App

If you run `ng new --help` you will see a list of options you can pass.


You start a project with one command. Do this in the `~/class/src` directory.

```bash
ng new trail-log --skip-git --style tailwind --skip-tests
```

You will be asked if you want to enable server-side rendering (SSR) and static site generation (SSG) - the default is "no", so just hit enter. We will not be covering these types of applications in this course.

You will then be asked which AI tools you want to configure. This is a "TUI" (terminal user interface). If you are currently using an AI model, use your arrow keys to move to that model in the list. You can use the space bar to toggle action on and off. (these options put some basic instructions for various AI models to work with Angular).

When you are done, hit enter. 

Your Angular app is scaffolded with some reasonable starting code, and the NPM packages are installed.


## `ng serve` Runs the App While You Work

Move into the project and start the development server:

```bash
cd trail-log
ng serve
```

> Note: the first time you run things with the Angular CLI they ask you if you would be willing to submit telemetry information. Answer according to your conscience.

This compiles the app, serves it at `http://localhost:4200`, and — the important part —
**watches your files**. Save a change and the browser updates almost instantly, usually
without losing where you were. This tight save-and-see loop is the rhythm of Angular
development. Keep `ng serve` running in a terminal the entire time you're working.

If you hold down your control key and click the link in the terminal (http://localhost:4200) you will see you "starter" Angular app.

Back in the terminal, stop your Angular app. You'll notice that your terminal won't take input - it's busy being a a development web server. However, if you hit `h+enter`, a menu will be displayed.
Select the "q" option to quit.

If you go back to your browser where `http://localhost:4200` is open and refresh, you'll see you get an error. There is no server running.

## Know What's in the Project

As a **strong** recommendation, whenever you are working with Angular in VS Code, *always* have an instance of VSCode open in the root directory of the project (in our case `~/class/trail-log/`).

Your terminal should already be open in that directory. To open a new instance of VS Code in this directory you can enter `code .` (the period means "this directory")
 
> Note: You might get prompted to install the recommended extension, Angular Language Service. If you do, great. Accept it, if not, we'll do it manually in the next section. 

> Note: if you use `code -r .` code will reuse/replace whatever instance of VS Code you have running with an instance open in this directory.

In VS Code you should see your file explorer on the left, and below that some options, like "TIMELINE", "OUTLINE", etc. Expand the option called "NPM SCRIPTS". This is a list of the scripts defined in `package.json`. You'll see a script labeled "start", and notice that this script runs "ng serve" for you. 

### Editing scripts in `package.json`

In the EXPLORER window, locate `package.json` and open it. (you can also use the keyboard shortcut `Ctrl+P` and just type the name of the file and hit enter). Find, in the "scripts" section the script called "start". Edit the value of that script from `ng serve` to `ng serve -o` (that's an "oh", not a "zero"). This option says that you'd like the Angular CLI to just open your default browser for you automatically when you run the server. Save your changes to the file (`Ctrl+s`) and in the `NPM SCRIPTS` section, hover your mouse pointer over the "start" script and hit the "play" arrow ("|>"). 

You'll notice a terminal open in VS Code, and it will start your Angular app and then open your browser.

### Take a quick tour of some of the files in VS Code.

You don't need to memorize every file, but a few are worth knowing on sight:

- **`src/main.ts`** — the entry point. This is the first code that runs; it starts the
  app. We'll look at it closely on the next page.
- **`src/app/`** — where your application lives. Components, services, and routes all go
  here. Trail Log's trail list, hike form, and favorites view will all be files under
  `app/`.
- **`src/index.html`** — the single HTML page the whole app runs inside. You'll rarely
  touch it.
- **`angular.json`** — the CLI's configuration for building and serving. You'll edit it
  occasionally, not daily.
- **`package.json`** — your npm dependencies and scripts, exactly as you saw in the
  pre-work.

The shape is deliberately boring across every Angular project. Once you've seen one Angular project, they all sort of look the same. This is good news.


## Configure VS Code for Angular development

### Extensions 

Click the "Extensions" icon on the left side of VS Code (the one with four little blocks, one caddy-whampus). Search for and install each of the following extensions (or if they are already installed, just verify). When you select an extension, there are buttons at the top to install that extension. Also notice the little gear icon. Click that and also select "Add to Workspace Recommendations".


- angular.ng-template
  - The Angular Language Service. Absolutely necessary. 
- dbaeumer.vscode-eslint 
  - An extension that surfaces ESLint errors, warnings, and fixes in VS Code. We'll use this later.
- esbenp.prettier-vscode 
  - An extension to apply formatting using the Prettier rules supplied by the Angular team in `.prettierrc` 
- bradlc.vscode-tailwindcss 
  - Since we are using Tailwind for CSS, this extension will, when configured, override VS Code's default CSS support with a version compatible with Tailwind. 
    
If you added each of these to the workspace recommendations, they should all be listed in the `.vscode/extension.json` file, which will look like this: 
```json
{
  "recommendations": [
    "angular.ng-template",
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss"
  ]
}
```

### Settings 
 
In your `.vscode/settings.json` file (create it if it does not exist) - add the following:

```json
{
  "files.associations": {
    "*.css": "tailwindcss"
  },
  "editor.defaultFormatter": "esbenp.prettier-vscode",

  "editor.codeActionsOnSave": {
      "source.fixAll.eslint": "always",
      "source.format": "always"
    },

  "files.autoSave": "onFocusChange",
  "editor.formatOnSave": true,
  "eslint.codeActionsOnSave.mode": "all",

  "js/ts.inlayHints.parameterNames.enabled": "literals",
  "js/ts.inlayHints.variableTypes.enabled": true,
  "js/ts.inlayHints.propertyDeclarationTypes.enabled": true,
  "js/ts.inlayHints.parameterTypes.enabled": true,
  "js/ts.inlayHints.functionLikeReturnTypes.enabled": true,
  "js/ts.inlayHints.enumMemberValues.enabled": true,
  "editor.inlayHints.enabled": "offUnlessPressed",

  "workbench.tree.indent": 19,
  "explorer.compactFolders": false,

}

```
 
These are listed roughly in order of my sense of importance. 
 
- `files.associations`: The file associations for CSS are set to use the Tailwind extension we installed.
- `editor.defaultFormatter`: The default formatter is set to Prettier, which is the formatter we will use for this course.
- `editor.codeActionsOnSave`: This setting tells VS Code to run ESLint and Prettier each time you save a file.
- `files.autoSave`: You go back and forth between your browser and VS Code - this will automatically save your open files when you switch to another window. 

 
These rest of the settings are more *my preferences*. The `js/ts` stuff is so you can see the implicit types in the editor. I'll demonstrate that for you later. The workbench and explorer settings are just handy to keep the editor more readable. 
 
## Add ESLint Support 

[EsLint](https://eslint.org/) is a very popular tool for helping find, fix, and prevent coding errors in JavaScript (ECMA Script, i.e. "ES"). The Angular CLI has a tool called "schematics" that some packages use that allow you to conveniently install packages and configure Angular and add new content with one command. We will use the schematic from [Angular EsLint Monorepo](https://github.com/angular-eslint/angular-eslint). 
 
In VS Code, either split the open terminal or use the "Add Terminal" button and run the following command: 
 
 ```bash 
 ng add angular-eslint 
 ```  

After you confirm, you'll notice a new file is created `eslint.config.js` that will set up some recommended rules for your Angular and TypeScript code. 

