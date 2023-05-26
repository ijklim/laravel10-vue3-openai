# Laravel 10, Vite 4

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
# Check php version
php -v
# Note: If php version < 8, the composer command below might create Laravel 8 instead of 10

# Create Laravel 10 project in folder laravel10-vue3-openai
composer create-project laravel/laravel laravel10-vue3-openai
# Note: Vite 4 is preinstalled in package.json

# Install frontend scaffolding, starting point for integrating Vue.js
composer require laravel/ui

# Generate the basic scaffolding for Vue.js
php artisan ui vue

# Install Javascript modules
yarn install
```

## References

* Laravel 10 Application with Vue 3 https://medium.com/@laraveltuts/laravel-10-application-with-vue-3-complete-guide-to-crud-operations-3705f9a7cb22