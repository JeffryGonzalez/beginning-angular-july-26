import { TitleCasePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { form, FormField, FormRoot, max, min, minLength, required } from '@angular/forms/signals';
import { difficultyLevels, TrailCreate } from './types';
import { Router, RouterLink } from '@angular/router';
import { trailsStore } from './services/trails-store';

@Component({
  selector: 'app-trails-add',
  imports: [FormRoot, FormField, TitleCasePipe, RouterLink],
  template: `
    <p>Add a trail?</p>

    <form class="flex flex-col gap-4 max-w-lg" [formRoot]="form">
      <div class="flex flex-col w-full">
        <label for="name">Name</label>
        <input class="input" type="text" [formField]="form.name" />
        @let field = form.name();
        @if (field.touched() && field.invalid()) {
          @for (error of field.errorSummary(); track error.kind) {
            <span class="label text-error text-xs">{{ error.message }}</span>
          }
        }
      </div>
      <div class="flex flex-col w-full">
        <label for="miles">Miles</label>
        <input class="input" type="number" [formField]="form.miles" />
        @let fieldM = form.miles();
        @if (fieldM.touched() && fieldM.invalid()) {
          @for (error of fieldM.errorSummary(); track error.kind) {
            <span class="label text-error text-xs">{{ error.message }}</span>
          }
        }
      </div>

      <div class="flex flex-col w-full">
        <label for="difficulty">Difficulty</label>
        <select class="input" [formField]="form.difficulty">
          @for (level of levels; track level) {
            <option [value]="level">{{ level | titlecase }}</option>
          }
        </select>
      </div>
      <button type="submit" class="btn btn-secondary" [ariaDisabled]="form().invalid()">
        Add Trail
      </button>
      <a routerLink="" class="btn btn-accent">Cancel</a>
    </form>
  `,
  styles: ``,
})
export class AddTrail {
  store = inject(trailsStore);
  router = inject(Router);
  levels = difficultyLevels;
  // create a signal that holds the default values
  // for your form.
  model = signal<TrailCreate>({
    name: '',
    miles: NaN,
    difficulty: 'easy',
  });

  form = form(
    this.model,
    (schema) => {
      required(schema.name, { message: 'We need the name of the trail!' });
      minLength(schema.name, 2, { message: 'Not long enough - need a longer name' });
      required(schema.miles, { message: 'Tell us how long the trail is' });
      min(schema.miles, 0.1, { message: 'barely a trail' });
      max(schema.miles, 900, { message: "Don't be silly." });
      required(schema.difficulty, { message: 'You need to assign a difficulty' });
    },
    {
      submission: {
        action: async () => {
          console.log(this.model());

          await this.store.addTrail(this.model());
          this.router.navigateByUrl('');
        },
      },
    },
  );
}
