# Your Angular Application 

The main component in your Angular application is in the `/src/app/` directory. There are two files there we want to look at. One is `app.html` and the other is `app.ts`. (there are other files, including `app.css` - we'll look at those later) 

This is the component that the `/src/main.ts` file open to "bootstrap" (start up) you Angular app.  
 
## Edit the App Component 
 
We will consider those two files (`app.ts` and `app.html`) as one thing called the *App Component*. I like to open then side-by-side in my editor. If you first click on `app.ts` and then hold down the `ALT` key and click on the `app.html` you can see them side-by-side.  
 
Remove all the content in the `app.html` (in that file, `Ctrl+A` and then hitting the delete or backspace key should do it.) If you switch over to your browser where your app is running you'll see *nothing*. A blank page. 
 
### What just happened? 

A bunch of handy things just happened. When you switched to your browser, your `app.html` automatically saved and caused the Angular compiler (NGC) to automatically recompile your app. If you go back to VS Code you should notice there is an error. 
 
In `app.ts` there is an error (red squiggly) in the *component metadata* for the `imports`. This is giving us an error because we are no longer using the Angular component described by `RouterOutlet`. This is kind of a weird error. (If you look down in the terminal, it will also be reported there.) 

"But if there is an error, how is my app still working?" I can almost hear you ask. This isn't really an "error error", it is a error from the Angular Language Service, not the TypeScript compiler. You can fix it by removing the `RouterOutlet` from inside the `imports` array. Once you do that, though, the error will jump up to the `import` line at the top. Again, not a "real" error. If you hover your mouse over the error (where the squiggly lines are) you will see a description that attributes this error to `@typscript-eslint/no-unused-vars`. This is the ES Lint tool telling us that we should remove this because it wasted, and no need to import it. Frankly this wouldn't be a big issue, leaving an import in like this. (in the component metadata it would be a small problem). On compilation, that import would be just discarded. Except it looks bad, is confusing, etc. Kind of not-picky. Like someone picking a piece of lint off your sweater before taking a photo. Thus "linting". 
 
You can remove that import line. A *great* keyboard shortcut I learned from a student once (thanks, Kim!) is `Alt+Shift+O` (oh, not zero). This removes all unused imports in a file.  
 
While we are at it, let's also remove that signal declaration inside of the component class `title`. We don't need it. 

You'll notice you get an error on the import again for the unused signal import. See if you can get that `Alt+Shift+O` shortcut in your muscle memory.
 
Your final `app.ts` should look like this: 
 
```ts 
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
``` 

## Work in the template 
 
Let's add some content in the `app.html`.  
 
Enter the following: 

```html 
<h1 class="text-3xl text-red-800 font-bold ">
  Hello world!
</h1>
```  
 
If you switch over to your browser you should see the output. Gorgeous! 
 
> Note: the classes added to that H1 are from [Tailwind](https://tailwindcss.com/). You can read about it, or just sort of ignore it for this class if your concept count is getting too high. 
 
### Cool *l33t haxx0r* trick: Emmet 
 
VS Code supports, out of the box, a tool called [Emmet](https://emmet.io). It's super useful for creating HTML content.  
 
Enter this below the `H1` you created: 
```
div>h2.bg-yellow-500.text-xl.font-bold.text-center 
``` 

If you typed that, and hit "tab" at the end of the line, it should expand. If you copy/pasted, you might have to select that text you pasted, and hit `Ctrl+Shift+P` to search for a command. Look for "Emmet: Expand Abbreviation" and hit enter. You should get the following: 
 
```html 
<div>
  <h2 class="bg-yellow-500 text-xl font-bold text-center"></h2>
</div>
``` 

You may have some red squigglies from the Angular Language Service complaining about the empty `H2` element. Your cursor is probably between the open and closing tags, so enter some text. Your name maybe?  
 
The keen eyed among you (and those that did the pre-work!) might notice that the syntax for Emmet is based on CSS selectors. If you know those, you can create lots of stuff easily.  
 
## Install DaisyUI 
 
While you might argue after seeing the wonderful styling we added to our `app.html`, I am *no designer*. You and your team will probably have your own style libraries and design systems. For this class, we will use a combination of Tailwind and [DaisyUI](https://daisyui.com/). I find this to be a great combination in helping my applications look like maybe I have some design abilities. 
 
### Install DaisyUI 

Find an available terminal window (not running your dev server) in VS Code and enter the following: 
 
```bash 
npm i -D daisyui@latest 
``` 

(the -D option says install this as a "development" dependency. Not worth going into too much detail on for an Angular app, but server-side node applications treat this as a bigger deal). 
 
Open the file `/src/styles.css` These are the *global* styles for your application. We'll talk about more "local" styles for components and features later. Add the following after the `@import "tailwindcss";`:
 
```css 
@plugin "daisyui";
``` 
If you switch to the browser, you'll notice things change pretty dramatically. 
 
> Note: sometimes changing global things like styles evades the change detection. If you don't notice any change, quit your dev server and restart it. 
 
DaisyUI supports themes. There are a bunch available, and you can explore the docs (or create your own). For browsers that support it (most do) it will also allow you to switch between dark and light mode themes based on the user's preferences. I'm going to set mine to use a theme called "dim" if the user prefers dark mode, and "nord" otherwise. The final `styles.css` will look like this: 
 
```css 
@import 'tailwindcss';
@plugin 'daisyui' {
  themes:
    nord --default,
    dracula --prefersdark;
}
``` 
 
> Note: you can change your color preferences from dark to light, etc. either on your operating system or in your browser. 

## Update `app.html` 

Let's make our app look a little better. In `app.html`, replace the content you have there with the following: 
 
```html 
<main class="container mx-auto my-auto">
  <h1 class="text-3xl">Angular Training</h1>
  <p class="text-xl text-accent">Beginning Level</p>
</main>
``` 
`main` is an HTML landmark element that identifies the main part of the content of your page. The classes "container", "mx-auto", and "my-auto" are from Tailwind and/or DaisyUI telling the library to style this like a container for other stuff, and automatically add an appropriate margin for both the X and Y axis. Notice I also got rid of me deciding colors. Colors are defined for "accent", "secondary", etc. and they will adjust nicely for both dark and light modes.  
 
For the remainder of the course I'll just give you the classes, styling, etc. If you are interested or know more already, feel free to tweak what I give you (or do something totally different). If you want to ignore it, it can mostly be safely ignored as it doesn't pertain directly to Angular in most cases. 
