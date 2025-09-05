import {sveltekit} from '@sveltejs/kit/vite';
import tailwindcss from "@tailwindcss/vite";
import Icons from 'unplugin-icons/vite'
import {defineConfig} from 'vite';
import {kitRoutes} from "vite-plugin-kit-routes";
import {stripper} from 'vite-plugin-stripper'


export default defineConfig({
    plugins: [sveltekit(), tailwindcss(), kitRoutes(),
        Icons({compiler: 'svelte'}),
        stripper({ strip: ['BackendMethod'] }),
    ],

    //Exclude node modules from remult client side
    // build: {
    //     rollupOptions: {
    //         external: ['fs', 'path','nodemailer', 'node-fetch'],
    //     },
    // },
    // optimizeDeps: {
    //     exclude: ['fs', 'path', 'nodemailer', 'node-fetch'],
    // },
});
