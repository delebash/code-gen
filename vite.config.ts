import {sveltekit} from '@sveltejs/kit/vite';
import tailwindcss from "@tailwindcss/vite";
import Icons from 'unplugin-icons/vite'
import {defineConfig} from 'vite';

export default defineConfig({
    plugins: [sveltekit(), tailwindcss(),
        Icons({
            compiler: 'svelte',
        }),
        {
            name: "config",
            enforce: "post",
            config(config) {
                config.server.fs.allow = [process.cwd()];
            }
        }
    ]
});
