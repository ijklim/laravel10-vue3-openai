# Laravel 10, Vite 4, OpenAI 3, Vuetify 3

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

- [Simple, fast routing engine](https://laravel.com/docs/routing).
- [Powerful dependency injection container](https://laravel.com/docs/container).
- Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
- Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
- Database agnostic [schema migrations](https://laravel.com/docs/migrations).
- [Robust background job processing](https://laravel.com/docs/queues).
- [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Setup

```sh
# === Check php version
php -v
# Note: If php version < 8, the composer command below might create Laravel 8 instead of 10

# === Create Laravel 10 project in folder laravel10-vue3-openai
composer create-project laravel/laravel laravel10-vue3-openai
# Note: Vite 4 is preinstalled in package.json

# === Install frontend scaffolding, starting point for integrating Vue.js
composer require laravel/ui

# === Generate the basic scaffolding for Vue.js
php artisan ui vue

# === Install Javascript modules
yarn install

# === Install or upgrade libraries
# Vue is the frontend framework, Axios here for upgrade purpose, already included in Laravel
yarn add -D vue vue-router axios
# OpenAI, the AI powered API server that answers questions
yarn add openai
# Vuetify is the styling library
yarn add vuetify

# === Start server
php artisan serve
yarn dev
```

* `.env::OPENAI_API_KEY` must be updated with a valid key from https://platform.openai.com, a free account can be created to generate a secret key

## (Optional) Splitting the ads component into another repo and use it as submodule

```sh
# Create a new branch `vue-ads` based on the component folder to be extracted
git subtree split --prefix=resources/js/components/ads -b vue-ads

# Create a new directory as a remote server (this is like github) to place the new component and initialize git
# e.g. ~/Documents/web/github/remote-vue-ads
cd ~/Documents/web/github/remote-vue-ads
git init --bare

# Return to the original repo and push branch to new remote repo
cd ~/Documents/web/laravel/laravel10-vue3-openai
git push ~/Documents/web/github/remote-vue-ads vue-ads:master

# Create repo from remote folder
cd ~/Documents/web/github
git clone ./remote-vue-ads vue-ads
# Note: Now vue-ads contains the component files

# Remove extracted files from original repo
cd ~/Documents/web/laravel/laravel10-vue3-openai
git rm -r resources/js/components/ads/
git commit -m 'Delete extracted component'

# Creat a github repo from the new component, then add it as a submodule in the current repo
git submodule add https://github.com/ijklim/vue-ads.git resources/js/components/VueAds
# Note: To remove submodule, use `git submodule deinit -f <submodule-path>`
```


## Deployment on shared hosting
* Copy all files from the `public` folder into `public_html__chatgpt` on the host
* Copy all folders except `public`, `node_modules`, and `tests` into a new folder at the same level as `public_html__chatgpt`, e.g. `server__chatgpt`
  * Copy file `public/build/manifest.json` to `server__chatgpt/public/build/`
  * Copy file `.env` to `server__chatgpt`
* Change `public_html__chatgpt\index.php::13` to point to the location above
  * e.g. `define('DIR_SERVER', __DIR__ . '/../server__chatgpt');`
* Modify the settings in `server__chatgpt/.env` to reflect production environment
  * APP_ENV=production
  * APP_DEBUG=false
  * APP_URL
  * DB_CONNECTION
  * DB_HOST
  * DB_PORT
  * DB_DATABASE
  * DB_USERNAME
  * DB_PASSWORD
* Ensure PHP version is set to 8.1 or above

## Important Files and Folders

* Laravel Entry Point: `resources/views/welcome.blade.php`
* Vue Entry Point: `resources/js/app.js`
* Vue components: `resources/js/components/`
* Vue routes: `resources/js/router/`

## References

* Laravel 10 Application with Vue 3 https://medium.com/@laraveltuts/laravel-10-application-with-vue-3-complete-guide-to-crud-operations-3705f9a7cb22

* OpenAI API: https://platform.openai.com/docs/api-reference

* Vuetify components: https://vuetifyjs.com/en/components/all/

* Material Design Icons: https://pictogrammers.com/library/mdi/