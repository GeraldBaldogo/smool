import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-auto';

const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: preprocess(),

  kit: {
    adapter: adapter(),
  }
};

export default config;
