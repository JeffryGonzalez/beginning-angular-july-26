import { httpResource } from '@angular/common/http';
import { Component, computed, signal } from '@angular/core';
import { Band, BandsResponseSchema } from './types';

@Component({
  selector: 'app-music',
  imports: [],
  template: `
    <h1>List of my favorite bands</h1>
    @if (validatedMusicList().hasError) {
      <div class="alert alert-error">
        Sorry - the API seems to have gone loco. We are looking into it.
      </div>
    }

    @if (musicResource.isLoading() && validatedMusicList().hasError !== true) {
      <p>Chill out - getting your music...</p>
    } @else {
      @for (band of validatedMusicList().bands; track band.id) {
        <div class="card card-md shadow">
          <div class="card-body">
            <h2 class="card-title">{{ band.name }}</h2>
            <ul>
              @for (album of band.albums; track $index) {
                <li>{{ album }}</li>
              }
            </ul>
          </div>
        </div>
      } @empty {
        <div class="alert alert-info">Sorry, no bands!</div>
      }
    }
  `,
  styles: ``,
})
export class Music {
  musicResource = httpResource<Band[]>(() => 'https://api.fake-music-thing.com/bands');
  hasParseError = signal(false);
  validatedMusicList = computed(() => {
    const bands = this.musicResource.value() || [];

    const result = BandsResponseSchema.safeParse(bands);

    if (result.error) {
      console.log(result.error);
      return { hasError: true, bands: [] };
    } else {
      return { hasError: false, bands: result.data };
    }
  });
}
