# Deno Movies API Rest

**If this project has been useful to you and you want to help me to keep contributing to the open source with projects, examples, plugins,... collaborate and buy me a coffee.**

<a href="https://www.buymeacoffee.com/h6WVj4HcD" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/yellow_img.png" alt="Buy Me A Coffee"></a>

Sample project that shows how to build a simple Movies Rest API with Deno.

This project has been developed to learn & practice my skills with Deno. This project shows you how to:

    * Create an API to manage movies catalog.
    * Provide GET, POST, PUT, and DELETE routes.
    * Save created/updated movies to a local JSON file.

## Development server (drun)

Install drun

```bash
    deno install --allow-read --allow-run --unstable https://deno.land/x/drun@v1.1.0/drun.ts
```

Edit

```bash
    vim ~/.zshrc

    OR

    vim ~/.bashrc
```

After that command, please add this line end of file and save and exit

```bash
    // LINUX
    export PATH="/home/username/.deno/bin:$PATH"

    // MAC
    export PATH="/Users/username/.deno/bin:$PATH"
```

Run `drun` for a dev server. Navigate to `http://localhost:3000/`. The app will automatically reload if you change any of the source files.

## Requirements

* [Deno](https://deno.land/)