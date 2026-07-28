# Day 1 Review

Welcome back! Please go to https://class.hypertheory-labs.com and sign in and connect to your VM.

**Let me know if you have any problems getting into your VM**

First things:
- Review how to get caught up with my code (classroom sync)
- Purpose of the labs
- Leading up to Thursday afternoon lab
    - less prescriptive
    - Can you do it?


Review:

## What is Angular?
- A framework for building applications that run inside of a web browser
- We differentiated apps from web sites. Web sites are content driven, apps are data and behavior driven (they do things)
    - web sites and web applications do things *remotely* (at the server)
    - an app does stuff locally
- Frameworks provide abstractions. In the case of Angular, it is an abstraction over the common stuff in browser based apps.
    - leverages HTML as a programming language, allowing HTML to have variables, decisions, loops.
    - The biggest abstraction is over *change detection*, the topic of this morning.
    - Abstractions are never free. They cost you something. In the case of frontend frameworks like Angular:
        - there is a learning curve
        - you are trusting someone else's opinions
        - the complexity they hide sometimes emerges as a problem that is hard to track down and fix (leaky abstractions)
    - The benefit of the abstractions is velocity and conserving brain-space for the domain (the problem at hand)

## Angular CLI
- The Angular CLI (`ng`) is a tool that you can install globally using NPM that allows you to create, run, build, test, lint, etc. Angular applications.
- Uses [schematics](https://angular.dev/tools/cli/schematics-authoring) to generate code, modify configuration, install dependencies, etc.
- The Angular CLI is installed globally which means you can only have one instance of it installed at a time (per version of node. Can use tools like NVM, Volta, nub, etc.) 
- Each application created with the Angular CLI embeds a copy of the Angular CLI within the project. You can access *that* version using the provided NPM scripts.


## Creating an App
- Using the Angular CLI to create an app presents a series of choices
- Inline templates and styles as the default?
- How to handle style sheets?
- SSR/SSG?
- Include tests? (this is vitest - not playwright)
- Angular uses [Vite](https://vite.dev/) though the tooling from Angular doesn't allow you to directly configure Vite like you would in other uses. Configuration of an Angular app is done through the `angular.json`.
    - Note: the [Analog Angular Vite Plugin](https://www.npmjs.com/package/@analogjs/vite-plugin-angular?activeTab=readme) is commonly used to allow more advanced configuration. Don't need to know this know, but should be aware of it.

## Beginning Components
- Components are the *heart* of Angular.
- Responsible for a portion of the UI - and Angular is for UI.
- Created using `@Component({...})` metadata, a template, and class.
- Instances of a component are created by using that components *selector* within another component.
    - Note: Also using routing, which we'll cover later.
- Components can be nested inside other components. Each component can have state (data) and behavior (methods, properties, etc.) but that state is *local* to that component.
- There are limited mechanisms for components to share state with other components, and for components to invoke code on other components. We will cover this this morning.
- Component Templates
    - Appear to HTML, but actually a language.
    - Can have *binding expressions* which use the `{{ 2 + 2}}` syntax. They contain a programmatic expression that produces a value.
    - Contains HTML elements
    - Contains other components, however those components must be imported into the component for them to be recognized.
    - Has control-flow syntax, including `@if(), @for(), @switch(), @let`. We'll cover all of these.

# Today

- State management 
    - State management in components with signals
        - `signal, effect, computed, linkedSignal`
    - How state management works
    - Signal inputs
    - Component outputs
- Component communication and control flow - lab
- Control Flow
- Possibly intro to Services