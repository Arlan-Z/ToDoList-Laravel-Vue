<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class TaskFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'title' => $this->faker->sentence,
            'description' => $this->faker->paragraph,
            'status' => $this->faker->randomElement(['To Do', 'In Progress', 'Done']),
            'priority' => $this->faker->randomElement(['Low', 'Medium', 'High']),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
