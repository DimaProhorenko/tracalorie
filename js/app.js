class CalorieTracker {
	constructor() {
		this._calorieLimit = 2000;
		this._totalCalories = 0;
		this._meals = [];
		this._workouts = [];
		this._render();
	}

	addMeal(meal) {
		this._meals.push(meal);
		this._totalCalories += meal.calories;
		this._render();
	}
	addWorkout(workout) {
		this._workouts.push(workout);
		this._totalCalories -= workout.calories;
		this._render();
	}

	_render() {
		this._displayDailyLimit();
		this._displayTotalCalories();
		this._displayBurnedCalories();
		this._displayConsumedCalories();
		this._displayRemainingCalories();
		this._displayProgress();
	}

	_displayDailyLimit() {
		document.querySelector('#calories-limit').textContent =
			this._calorieLimit;
	}

	_displayTotalCalories() {
		document.querySelector('#calories-total').textContent =
			this._totalCalories;
	}

	_displayBurnedCalories() {
		document.querySelector('#calories-burned').textContent =
			this._calcCalories(this._workouts);
	}

	_displayConsumedCalories() {
		document.querySelector('#calories-consumed').textContent =
			this._calcCalories(this._meals);
	}

	_displayRemainingCalories() {
		const el = document.querySelector('#calories-remaining');
		const parent = el.parentElement.parentElement;
		const calories = this._calorieLimit - this._totalCalories;
		el.textContent = calories;
		if (calories <= 0) {
			parent.classList.remove('bg-light');
			parent.classList.add('bg-danger');
		} else {
			parent.classList.remove('bg-danger');
			parent.classList.add('bg-light');
		}
	}

	_displayProgress() {
		const progress = document.querySelector('#calorie-progress');
		const percentage = (this._totalCalories / this._calorieLimit) * 100;
		const width = Math.min(percentage, 100);
		progress.style.width = `${width}%`;

		if (this._calorieLimit - this._totalCalories <= 0) {
			progress.classList.add('bg-danger');
		} else {
			progress.classList.remove('bg-danger');
		}
	}

	_calcCalories(arr) {
		return arr.reduce(
			(accumulator, currentValue) => accumulator + currentValue.calories,
			0
		);
	}
}

class Meal {
	constructor(name, calories) {
		this.id = Math.random().toString(16).slice(2);
		this.name = name;
		this.calories = calories;
	}
}

class Workout {
	constructor(name, calories) {
		this.id = Math.random().toString(16).slice(2);
		this.name = name;
		this.calories = calories;
	}
}

const tracker = new CalorieTracker();

const breakfast = new Meal('Breakfast', 400);
tracker.addMeal(breakfast);

const run = new Workout('Morning run', 300);
tracker.addWorkout(run);

const lunch = new Meal('Lunch', 800);
tracker.addMeal(lunch);

const dinner = new Meal('Dinner', 1600);
tracker.addMeal(new Meal('Fuck', 1200));
// tracker.addMeal(dinner);

console.log(tracker._meals);
console.log(tracker._workouts);
console.log(tracker._totalCalories);
