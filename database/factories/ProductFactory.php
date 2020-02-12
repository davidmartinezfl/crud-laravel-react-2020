<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Product;
use Faker\Generator as Faker;

$factory->define(Product::class, function (Faker $faker) {
    return [
        'name' => $faker->unique()->words($nb = 2, $asText = true),
        'description' => $faker->text($maxNbChars = 255),
        'price' => $faker->randomNumber(8),
        'quantity' => $faker->numberBetween($min = 1, $max = 255),
    ];
});
