# Beginning Components 

That content we currently have in `app.html` is pretty "wrong", according to good semantic HTML. What we have in the `main` section is obviously a header or heading, and we'll most likely want some navigation stuff later, too. 

None of that belongs in `app.html`. The App component provides the "shell" for your application.  

In this lab we will begin thinking about components, and mostly deal with structural components. Later we will work with component composition and communication. 

## Using the Angular CLI to generate components 
 
We will use the CLI to generate new component called `page-header`. Let's put this in a directory called `headings`. 

```bash 
ng generate component headings/page-header 
```  

You'll notice that the CLI created a new directory for both the headings, and a subdirectory called "page-header" inside `/src/app`. It also created three files. `page-header.css`, `page-header.html`, and `page-header.ts` 

If you open the `page-header.ts` component file, you'll see the selector is `app-page-header`. I think that is fine for now. If we *invoke* this component by adding it to our `app.html` at the top like this: 

```html 
<app-page-header />
<main class="container mx-auto my-auto mt-4">
  <h1 class="text-3xl">Angular Training</h1>
  <p class="text-xl text-accent">Beginning Level</p>
</main>
```

You will get some red-squigglies and your app won't compile. If you put your cursor on the error in the HTML and hit `Ctrl+.` (period), select the option to import the component. If you look in your `app.ts` you should see it added:  


```ts 
import { Component } from '@angular/core';
import { PageHeader } from './headings/page-header/page-header';

@Component({
  selector: 'app-root',
  imports: [PageHeader],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
``` 

If you look in the browser, it isn't very exciting. Let's go to the `page-header.html` and add some content. You can just copy and paste this monstrosity for now. 

```html 
<header class="navbar bg-base-100 shadow-sm">
  <div class="flex-1">
    <a href="/" class="btn btn-ghost text-xl dark:text-green-400 text-green-700">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
        viewBox="0 0 15 15"><!-- Icon from Pinhead Map Icons by Quincy Morgan - https://creativecommons.org/publicdomain/zero/1.0/ -->
        <path fill="currentColor"
          d="M14.01 1c-.7-.68-1.78 1.05-2.92.87c-1.13-.17.36-1.94-1.07-1.56c-1.43.36-.46 2.15-2.18 2.61c-1.31.35-.15-1.4-2.05-.88c-1.65.43-.35 3.87-1.33 4.14s-.26-1.57-1.98-1.1c-1.88.49.32 3.6.32 5.08c0 .93-.86 2.28-1.35 3.01c-.03.01-.07.01-.1.02l-.56.15c-.23.06-.46.3-.52.54l-.15.54c-.07.23.07.37.31.31l.54-.15c.23-.07.47-.3.54-.52l.15-.56c.01-.04.01-.07.01-.1c.67-.44 1.91-1.12 3.24-1.12c1.48 0 4.86 1.41 4.86.09c0-1.79-1.56-.9-1.25-2.08c.32-1.19 3.91.59 4.36-1.16c.52-1.9-1.05-.97-.78-1.95c.47-1.73 2.37-.61 2.75-2.04c.38-1.44-1.48-.03-1.65-1.17c-.17-1.12 1.49-2.27.81-2.97m-1.24 1.19l-1.91 2.02l-.7.75c1.39.26 2.36.04 3.75.36c-1.48.03-2.53-.04-3.93-.18L7.91 7.33c1.79.67 2.98.88 4.3 1.55c-1.39-.44-2.9-.46-4.51-1.33l-.99 1.04l-1.69 1.67c1.66.67 2.66 1.12 3.94 1.78c-1.01-.17-2.45-.8-4.14-1.58l-.17.16c-.07.07-.73.52-.84.41c-.13-.14.29-.71.35-.77l.21-.2C3.59 8.38 2.96 6.94 2.8 5.92C3.46 7.2 3.91 8.2 4.57 9.86L6.3 8.19l1.03-1c-.47-.81-.9-1.7-1.06-2.42c-.17-.74.03-1.27-.18-1.95c.36.72.19 1.19.43 1.95c.19.6.66 1.39 1.04 2.2l2.18-2.09c-.2-1.47.01-2.16.2-3.58c.12 1.32-.22 2.06 0 3.39l.85-.8Z" />
      </svg>
      Trail Log</a>
  </div>
  <nav class="flex-none">
    <ul class="menu menu-horizontal px-1">
      <li>
        <a href="https://angular.dev" target="_blank">Angular Docs <svg xmlns="http://www.w3.org/2000/svg" width="24"
            height="24"
            viewBox="0 0 24 24"><!-- Icon from Lucide by Lucide Contributors - https://github.com/lucide-icons/lucide/blob/main/LICENSE -->
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M15 3h6v6m-11 5L21 3m-3 10v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          </svg></a>
      </li>
      <li>
        <a href="https://class.hypertheory-labs.com" target="_blank">Hypertheory Labs
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
            viewBox="0 0 24 24"><!-- Icon from Lucide by Lucide Contributors - https://github.com/lucide-icons/lucide/blob/main/LICENSE -->
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M15 3h6v6m-11 5L21 3m-3 10v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          </svg>
        </a>
      </li>
    </ul>
  </nav>
</header>
``` 

**What a mess!** but it looks alright. I often *start* with a mess like this, then tidy up as I go. 

One thing that is taking up a lot of space (both screen space in your editor, and brain-space as you read it) are those SVG icons. Let's make each of them their own component. I don't think each of these deserves it's own file, and separate HTML and CSS files, so I'll pass a couple of options to use inline-styles (`-s`) and inline-templates (`-t`). I'll also tell it I don't want a folder when it generates those things, so I'll use the `--flat` option. And let's put these in a folder called `widgets/icons/`. Oh, and you can abbreviate that whole "generate component" thing to just "g c":<D-s>

``` 
ng g c -t -s --flat widgets/icons/tree-icon 
``` 

I'll cut the SVG from the page-header of the tree and put it inside the backticks of the `template` property of the component metadata for this component. 

```ts 
import { Component } from '@angular/core';

@Component({
  selector: 'app-tree-icon',
  imports: [],
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 15 15">
      <!-- Icon from Pinhead Map Icons by Quincy Morgan - https://creativecommons.org/publicdomain/zero/1.0/ -->
      <path
        fill="currentColor"
        d="M14.01 1c-.7-.68-1.78 1.05-2.92.87c-1.13-.17.36-1.94-1.07-1.56c-1.43.36-.46 2.15-2.18 2.61c-1.31.35-.15-1.4-2.05-.88c-1.65.43-.35 3.87-1.33 4.14s-.26-1.57-1.98-1.1c-1.88.49.32 3.6.32 5.08c0 .93-.86 2.28-1.35 3.01c-.03.01-.07.01-.1.02l-.56.15c-.23.06-.46.3-.52.54l-.15.54c-.07.23.07.37.31.31l.54-.15c.23-.07.47-.3.54-.52l.15-.56c.01-.04.01-.07.01-.1c.67-.44 1.91-1.12 3.24-1.12c1.48 0 4.86 1.41 4.86.09c0-1.79-1.56-.9-1.25-2.08c.32-1.19 3.91.59 4.36-1.16c.52-1.9-1.05-.97-.78-1.95c.47-1.73 2.37-.61 2.75-2.04c.38-1.44-1.48-.03-1.65-1.17c-.17-1.12 1.49-2.27.81-2.97m-1.24 1.19l-1.91 2.02l-.7.75c1.39.26 2.36.04 3.75.36c-1.48.03-2.53-.04-3.93-.18L7.91 7.33c1.79.67 2.98.88 4.3 1.55c-1.39-.44-2.9-.46-4.51-1.33l-.99 1.04l-1.69 1.67c1.66.67 2.66 1.12 3.94 1.78c-1.01-.17-2.45-.8-4.14-1.58l-.17.16c-.07.07-.73.52-.84.41c-.13-.14.29-.71.35-.77l.21-.2C3.59 8.38 2.96 6.94 2.8 5.92C3.46 7.2 3.91 8.2 4.57 9.86L6.3 8.19l1.03-1c-.47-.81-.9-1.7-1.06-2.42c-.17-.74.03-1.27-.18-1.95c.36.72.19 1.19.43 1.95c.19.6.66 1.39 1.04 2.2l2.18-2.09c-.2-1.47.01-2.16.2-3.58c.12 1.32-.22 2.06 0 3.39l.85-.8Z"
      />
    </svg>
  `,
  styles: ``,
})
export class TreeIcon {}
```
 
And let's do another icon for the external link icon: 

```
ng g c -t -s --flat widgets/icons/external-link 
``` 

Copy that SVG icon from the page-header and put it in the `template` property of this component. 

```ts 
import { Component } from '@angular/core';

@Component({
  selector: 'app-external-link',
  imports: [],
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <!-- Icon from Lucide by Lucide Contributors - https://github.com/lucide-icons/lucide/blob/main/LICENSE -->
      <path
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M15 3h6v6m-11 5L21 3m-3 10v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
      />
    </svg>
  `,
  styles: ``,
})
export class ExternalLink {}
``` 
 
Your updated page-header component's HTML will look like this: 

```html 
<header class="navbar bg-base-100 shadow-sm">
  <div class="flex-1">
    <a href="/" class="btn btn-ghost text-xl dark:text-green-400 text-green-700">
      <app-tree-icon />
      Trail Log</a>
  </div>
  <nav class="flex-none">
    <ul class="menu menu-horizontal px-1">
      <li>
        <a href="https://angular.dev" target="_blank">Angular Docs <app-external-link /></a>
      </li>
      <li>
        <a href="https://class.hypertheory-labs.com" target="_blank">Hypertheory Labs <app-external-link />
        </a>
      </li>
    </ul>
  </nav>
</header>
``` 

Much better! 

> Note: make sure you import the external-link component in the page-header.ts file! 

## Inline templates and Styles - VS Code Snippets 

This is a personal or team preference thing, but I don't like all those practically empty CSS files around, and having separate HTML and TS files for each component, especially when they are pretty tiny (and components are *supposed to be* pretty tiny!). Not to mention all those extra folders.  

We'll leave the `page-header` component as is, but in the future we'll start out with flat, inline-templates, inline-styles. You get less weird file-save issues when importing, you can see everything, and I just like them that way until I need more space.
 
Even remembering all those options for the Angular CLI is a little challenging (by the way, you can make changes to the default setting in the CLI - see the docs). In the *early* days of Angular (like two years ago) when you created a component you had to do other weird things like update an `NgModule`, etc. It made more sense to have the CLI do that for you back then. Now, I just use custom VS Code snippets. 

In the `.vscode` directory, create a new file called `typescript.code-snippets` and paste the following in that file: 
 
```json 
{
  "Angular Component": {
    "scope": "typescript",
    "prefix": "ngc",
    "body": [
      "import { Component } from '@angular/core';",
      "",
      "@Component({",
      "\tselector: 'app-$1',",
      "\timports: [],",
      "\ttemplate: `",
      "\t\t$0",
      "\t`,",
      "\tstyles: ``",
      "})",
      "export class ${2:${TM_FILENAME_BASE/(?:^|-|_|\\.)(\\w)/${1:/pascalcase}/g}} {",
      "",
      "}",
    ],
    "description": "Angular Standalone Component",
  },
  "Angular Refactor Component": {
    "scope": "typescript",
    "prefix": "ngrc",
    "body": [
      "import { Component } from '@angular/core';",
      "",
      "@Component({",
      "\tselector: 'app-$1',",
      "\timports: [],",
      "\ttemplate: `",
      "\t\t$CLIPBOARD",
      "\t`,",
      "\tstyles: ``",
      "})",
      "export class ${2:${TM_FILENAME_BASE/(?:^|-|_|\\.)(\\w)/${1:/pascalcase}/g}} {",
      "$0",
      "}",
    ],
    "description": "Angular Standalone Component",
  }
  }
  ``` 

I created these myself, and edit and tweak them often. Make sure you save the file. 

To see how these work, let's create another icon component. Right-click on the `/src/app/widgets/icons` directory in the explorer in VS Code and select "New File...". Call it `check.ts`. In that new file type 'ngc' then hit the tab key. That is the "trigger" (defined in the snippet file) for creating a component. It has cursor "stops" - the first is asking you define the selector. So after `app-` type `check` and then hit tab. You could change the name of the component here if you like. I think `Check` is just fine so hit tab again. Now you are in the template portion. Past the following SVG in that spot: 

```xml 
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><!-- Icon from Lucide by Lucide Contributors - https://github.com/lucide-icons/lucide/blob/main/LICENSE --><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m9 12l2 2l4-4"/></g></svg>
```

Let's do another one. But we'll do it a little differently. Copy the following into your clipboard *first*: 
 
 ```xml 
 <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><!-- Icon from Lucide by Lucide Contributors - https://github.com/lucide-icons/lucide/blob/main/LICENSE --><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m15 9l-6 6m0-6l6 6"/></g></svg>
 ```  

Now create a new file in that icons folder called 'cancel.ts'. This time use the `ngrc` snippet. Notice it puts whatever you have in your clipboard in the template for you automatically. Slick! Make the selector `app-cancel` and leave the class name as it is. 

The final cancel icon component will look like this: 
 
```ts 
import { Component } from '@angular/core';

@Component({
  selector: 'app-cancel',
  imports: [],
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
      <!-- Icon from Lucide by Lucide Contributors - https://github.com/lucide-icons/lucide/blob/main/LICENSE -->
      <g
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="m15 9l-6 6m0-6l6 6" />
      </g>
    </svg>
  `,
  styles: ``,
})
export class Cancel {}
``` 

You can decide if you prefer to use the Angular CLI to create components, or use the snippets. Whatever works best for you. You can also decide if you want the templates and/or styles to be a separate file or inline with your components. I prefer inline stuff mostly. [Some thinking on this](https://angular.love/why-inline-templates-are-great) but you do you. Or at least stay consistent with what your team decides. 
