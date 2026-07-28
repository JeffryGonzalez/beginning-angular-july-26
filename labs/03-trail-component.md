# Adding state and behavior to components

The components we've built so far are pretty simple. They are purely _presentational_ - they exist to help us "tidy up", and to start giving some names to things that are part of our application. You don't really need a framework like Angular for that, though. I've been using tools like _server-side includes_ since the 90's to accomplish much the same thing.

One thing I think would be helpful to consider is the fact that the components we've created so far, even though they are simple, are really created for two reasons.

1. A "cognitive crutch". What I mean by this is something like _who cares_ if that `page-header.html` had a _ton_ of content in it? Why do we as programmers prefer small focused things instead of big complex things? We'll discuss this after the lab, so think about it a bit.
2. Reuse. As application developers we are always under the gun. We have code to ship! Designing for reuse is usually the furthest from my mind. I want to solve the problem at hand. With the `page-header`, remember, we started with this SVG icons just pasted _inline_. One of them was duplicated (the indicator for an external link); once for each external link. Maybe the designers don't like the icon I chose, or maybe I'll want to use it other places as well (spoiler. we will ). The best advice I can give is: If you are building an application, don't worry about designing for reuse until you are sure what you have is "good". In the previous lab I'll admit we extracted those icons a little prematurely for my tastes. We even created a couple that we don't have a use for yet. I'll admit, that was a little classroom weirdness. You have to learn how to create components. The next class (Applied Angular) will be more about this kind of thinking and why it is so important, especially in user interface. But it's good to start thinking about it now.

So, those are the two main reason we create components, but components themselves have three main jobs. Each component does one or more of each of the following:

1. Presentational. Display stuff for the user. Handle an area of screen "real estate".
2. Accurately present the current state of the application to the user.
3. Provide affordances through which the user can interact with the application.

For the presentational stuff, we use templates. For the _state_ (I define state as "the value of some variables at a point in time") we use (primarily) Signals. We have an entire section coming up about signals, so don't worry about the details yet. The nice thing about signals is they are mostly "what you see is what you get". For the behaviors, we use events.

## Introducing state and template control flow.

Let's go back to the `page-header` component. Let's look at some of the remaining duplication. If you look at the two links we are displaying, each `li` is a copy paste job, with the `href` and the link text altered. I don't think we need to create a custom component for the links (yet), but we can be good programmers and use some data and a loop.

In `page-header.ts` let's create an array (as a Signal) of our external links. Put this code in the body of the `PageHeader` class:

```ts diff
protected readonly links = signal([
+    {
+      href: 'https://angular.dev',
+      linkText: 'Angular Docs'
+    },
-    {
-      href: 'https://class.hypertheory-labs.com',
-      linkText: 'Hypertheory Labs'
-    }
  ])
```

> Note: You will have to import 'signal' from '@angular/core'.

In the template of `page-header.html`, we will use an Angular control flow mechanism to loop through these links. This is a _refactoring_. When we are done the component should work exactly as it did before.

Here is the updated template:

```html
<header class="navbar bg-base-100 shadow-sm">
  <div class="flex-1">
    <a
      href="/"
      class="btn btn-ghost text-xl dark:text-green-400 text-green-700"
    >
      <app-tree-icon />
      Trail Log</a
    >
  </div>
  <nav class="flex-none">
    <ul class="menu menu-horizontal px-1">
      @for(link of links(); track link.href) {
      <li>
        <a [href]="link.href" target="_blank"
          >{{link.linkText}} <app-external-link
        /></a>
      </li>
      }
    </ul>
  </nav>
</header>
```

## Creating components and binding data

This app is going to be (surprise) a way to log trails the user has hiked. Let's create a new component that will display information about an individual trail.

Create a new component in `/src/app/trails/` called `trail-card.ts` (You can use the CLI or the snippets, inline or lots of files. I'll show the examples here using inline templates, but you can adapt as you see fit.)

Let's start by identifying three pieces of data:

- `name` - The name of the trail. (a string)
- `miles` - the length of the trail in miles (a number)
- `difficulty` - a rating of the difficulty. (a literal union of 'easy', 'moderate', 'hard', 'extreme')
- `favorite` - a way to indicate that the user liked the hike. (a boolean)

We'll do these inside the body of our new component, using signals.

```ts
import { Component, signal } from "@angular/core";

@Component({
  selector: "app-trails-trail-card",
  imports: [],
  template: ``,
  styles: ``,
})
export class TrailCard {
  protected readonly name = signal("Woodpecker Way Loop");
  protected readonly miles = signal(1.8);
  protected readonly difficulty = signal<
    "easy" | "moderate" | "hard" | "extreme"
  >("easy");
  protected readonly favorite = signal(false);
}
```

You can get creative, but I recommend you use the same selector for this component that I did (`app-trails-trail-card`). It will get confusing when you refer to this later in other components if you don't.

> Note: the `protected readonly` thing is a recent Angular "best practice". I sometimes forget to do it, but it is a good idea. By default fields declared in a typescript class are `public` and mutable. We'll look later at how to provide a standardized way for other components to get access to limited state within a different component. We want to be intentional about this. The protected thing is because we may want to derive a component for this, or use some kind of test-double in testing.

> Note 2: The `difficulty` signal is a literal union. That means it can only be set to one of the values listed. Sort of like an enum in other languages.

Let's build a rough sketch of a template and take a look at the component. It'll be rough. We'll make it look better later. Here's the simplest template I could come up with:

```html
<h2>{{ name() }}</h2>
<p>Miles: {{ miles() }}</p>
<p>Difficulty: {{ difficulty() }}</p>
<p>Favorite: {{ favorite() }}</p>
```

> Note: Notice how we always use the parens when referring to the value of a signal.

I'd like to see how this looks. Let's put it in our `app.html`, getting rid of he content inside `main` there.

You will have to import it in `app.ts` and add it to the component's `imports` array as well.

Here's the updated `app.html`:

```html
<app-page-header />
<main class="container mx-auto my-auto mt-4">
  <app-trails-trail-card />
</main>
```

And here is the `app.ts`:

```ts
import { Component } from "@angular/core";
import { PageHeader } from "./headings/page-header/page-header";
import { TrailCard } from "./trails/trail-card";

@Component({
  selector: "app-root",
  imports: [PageHeader, TrailCard],
  templateUrl: "./app.html",
  styleUrl: "./app.css",
})
export class App {}
```

If you look at your browser (http://localhost:4200) you will see our trail card displayed in all of it's resplendent beauty. Needs some help, right?

Here's a template that is a little better. I'm using some help from DaisyUI (the "Card" component).

```html
<div class="card card-xl bg-base-300 w-1/3">
  <div class="card-body">
    <h2 class="card-title text-secondary">{{ name() }}</h2>
    <div class="stats stats-vertical lg:stats-horizontal shadow">
      <div class="stat">
        <div class="stat-title">Miles</div>
        <div class="stat-value">{{ miles() }}</div>
      </div>

      <div class="stat">
        <div class="stat-title">Level</div>
        <div class="stat-value">{{ difficulty() }}</div>
      </div>
    </div>
    <div class="card-actions justify-end">
      <button class="btn">{{ favorite() }}</button>
    </div>
  </div>
</div>
```

I'm not loving the way the difficulty is displayed. We could update the literal union in our signal so that each difficulty level is displayed as a string in Title Case, where the first letter is upper-case. We could also use a pipe to do the transformation for us. Pipes are just that - transformers. They are used in templates to do formatting of things like dates, numbers, and strings. Here we will use a built-in pipe called `titlecase`.

> Note: I'm pasting the whole component here so you can see the imports, and where it the `titlecase` pipe is being used on the difficulty level.

```ts
import { TitleCasePipe } from "@angular/common";
import { Component, signal } from "@angular/core";

@Component({
  selector: "app-trails-trail-card",
  imports: [TitleCasePipe],
  template: `
    <div class="card card-xl bg-base-300 w-1/3">
      <div class="card-body">
        <h2 class="card-title text-secondary">{{ name() }}</h2>
        <div class="stats stats-vertical lg:stats-horizontal shadow">
          <div class="stat">
            <div class="stat-title">Miles</div>
            <div class="stat-value">{{ miles() }}</div>
          </div>

          <div class="stat">
            <div class="stat-title">Level</div>
            <div class="stat-value">
              <span>{{ difficulty() | titlecase }}</span>
            </div>
          </div>
        </div>
        <div class="card-actions justify-end">
          <button class="btn">{{ favorite() }}</button>
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class TrailCard {
  protected readonly name = signal("Woodpecker Way Loop");
  protected readonly miles = signal(1.8);
  protected readonly difficulty = signal<
    "easy" | "moderate" | "hard" | "extreme"
  >("easy");
  protected readonly favorite = signal(false);
}
```

That's good, but maybe we could do a little bit of conditional color-coding of the levels. We can use the square brackets and extend the class attribute using an expression.

```html
<div class="stat">
  <div class="stat-title">Level</div>
  <div class="stat-value">
    <span
      [class.text-success]="difficulty() === 'easy'"
      [class.text-info]="difficulty() === 'moderate'"
      [class.text-warning]="difficulty() === 'hard'"
      [class.text-error]="difficulty() === 'extreme'"
      >{{ difficulty() | titlecase }}</span
    >
  </div>
</div>
```

These classes are defined by DaisyUI, and will be applied to the span element based on the value of the `difficulty` signal.
You can change the hardcoded values in the template to see the various colors applied to the span element.

We'll use a similiar technique to style the button for the favorite option, and also format the label for the button. And since this is a boolean selection, it's probably best to do it as a checkbox.

Here's that section of the card:

```html
<div class="card-actions justify-end">
  <label
    class="label"
    [class.text-success]="favorite()"
    [class.text-neutral]="!favorite()"
  >
    {{ favorite() ? 'Favorite!' : 'Mark as Favorite' }}
    <input
      type="checkbox"
      [checked]="favorite()"
      (change)="toggleFavorite()"
      class="toggle toggle-sm"
    />
  </label>
</div>
```

## Styling the host element

We can use the `host` selector to style the host element of the component.

We will add a custom css file called `trail-card.css` right next to the `trail-card.ts` file. In that CSS file, add the following:

```css
@import "../../styles.css";

:host {
  @apply card card-xl bg-base-300 w-1/3;
}
```

On the component metadata, add a `styleUrl` property:

```ts
@Component({
  selector: "app-trail-card",
  template: `...`,
  styleUrl: "./trail-card.css",
})
export class TrailCard {}
```

We can now remove the div wrapper around the card in the `trail-card.html` file.

```html
<div class="card-body">
  <h2 class="card-title text-secondary">{{ name() }}</h2>
  <div class="stats stats-vertical lg:stats-horizontal shadow">
    <div class="stat">
      <div class="stat-title">Miles</div>
      <div class="stat-value">{{ miles() }}</div>
    </div>

    <div class="stat">
      <div class="stat-title">Level</div>
      <div class="stat-value">
        <span
          [class.text-success]="difficulty() === 'easy'"
          [class.text-info]="difficulty() === 'moderate'"
          [class.text-warning]="difficulty() === 'hard'"
          [class.text-error]="difficulty() === 'extreme'"
          >{{ difficulty() | titlecase }}</span
        >
      </div>
    </div>
  </div>
  <div class="card-actions justify-end">
    <label
      class="label"
      [class.text-success]="favorite()"
      [class.text-neutral]="!favorite()"
    >
      {{ favorite() ? 'Favorite!' : 'Mark as Favorite' }}
      <input
        type="checkbox"
        [checked]="favorite()"
        (change)="toggleFavorite()"
        class="toggle toggle-sm"
      />
    </label>
  </div>
</div>
```

We can conditionally add styling to the host element using the `:host` selector in the component metadata.

> Note: I'm leaving the template out here for brevity:

```ts
@Component({
  selector: "app-trails-trail-card",
  imports: [TitleCasePipe],
  template: ` <!-- template omitted for brevity --> `,

  styleUrl: "./trail-card.css",
  host: {
    "[class.ring-4]": "favorite()",
    "[class.ring-success]": "favorite()",
  },
})
export class TrailCard {
  protected readonly name = signal("Woodpecker Way Loop");
  protected readonly miles = signal(1.8);
  protected readonly difficulty = signal<
    "easy" | "moderate" | "hard" | "extreme"
  >("easy");
  protected readonly favorite = signal(false);

  protected toggleFavorite() {
    this.favorite.set(!this.favorite());
  }
}
```
