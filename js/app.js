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
		this._displayNewItem(meal);
		this._render();
	}
	addWorkout(workout) {
		this._workouts.push(workout);
		this._totalCalories -= workout.calories;
		this._displayNewItem(workout);
		this._render();
	}

	removeMeal(id) {
		this._meals = this._meals.filter((meal) => meal.id !== id);
		this._totalCalories = this._calcCalories(this._meals);
		this._render();
	}

	removeWorkout(id) {
		const workout = this._workouts.find((el) => el.id === id);
		if (workout) {
			this._workouts = this._workouts.filter(
				(workout) => workout.id !== id
			);
			this._totalCalories += workout.calories;
			this._render();
		}
	}

	_calcCalories(arr) {
		return arr.reduce(
			(accumulator, currentValue) => accumulator + currentValue.calories,
			0
		);
	}

	_displayNewItem(item) {
		const type = item instanceof Meal ? 'meal' : 'workout';
		const itemsEl = document.querySelector(`#${type}-items`);
		const itemEl = document.createElement('div');
		itemEl.classList.add('card', 'my-2');
		itemEl.setAttribute('data-id', item.id);

		itemEl.innerHTML = `
            <div class="card-body">
                <div class="d-flex align-items-center justify-content-between">
                <h4 class="mx-1 card-name">${item.name}</h4>
                <div
                    class="fs-1 bg-${
						type === 'meal' ? 'primary' : 'secondary'
					} text-white text-center rounded-2 px-2 px-sm-5"
                >${item.calories}</div>
                <button class="delete btn btn-danger btn-sm mx-2">
                    <i class="fa-solid fa-xmark"></i>
                </button>
                </div>
            </div>
        `;
		itemsEl.appendChild(itemEl);
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

	_render() {
		this._displayDailyLimit();
		this._displayTotalCalories();
		this._displayBurnedCalories();
		this._displayConsumedCalories();
		this._displayRemainingCalories();
		this._displayProgress();
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

class App {
	constructor() {
		this._tracker = new CalorieTracker();

		document
			.querySelector('#meal-form')
			.addEventListener(
				'submit',
				this._newItemHandler.bind(this, 'meal')
			);
		document
			.querySelector('#workout-form')
			.addEventListener(
				'submit',
				this._newItemHandler.bind(this, 'workout')
			);
		document
			.querySelector('#meal-items')
			.addEventListener(
				'click',
				this._removeItemHandler.bind(this, 'meal')
			);
		document
			.querySelector('#workout-items')
			.addEventListener(
				'click',
				this._removeItemHandler.bind(this, 'workout')
			);

		document
			.querySelector('#filter-meals')
			.addEventListener(
				'keyup',
				this._filterItemsHandler.bind(this, 'meal')
			);
		document
			.querySelector('#filter-workouts')
			.addEventListener(
				'keyup',
				this._filterItemsHandler.bind(this, 'workout')
			);
	}

	_newItemHandler(type, e) {
		e.preventDefault();
		const nameInput = document.querySelector(`#${type}-name`);
		const caloriesInput = document.querySelector(`#${type}-calories`);

		if (type === 'meal') {
			this._tracker.addMeal(
				new Meal(nameInput.value, +caloriesInput.value)
			);
		} else {
			this._tracker.addWorkout(
				new Workout(nameInput.value, +caloriesInput.value)
			);
		}
		this._resetInputs(nameInput, caloriesInput);
	}

	_removeItemHandler(type, e) {
		if (
			e.target.classList.contains('delete') ||
			e.target.classList.contains('fa-xmark')
		) {
			const item = e.target.closest('.card');
			const id = item.getAttribute('data-id');
			if (type === 'meal') {
				this._tracker.removeMeal(id);
			} else {
				this._tracker.removeWorkout(id);
			}
			item.remove();
		}
	}

	_filterItemsHandler(type, e) {
		const text = e.target.value.toLowerCase();
		document.querySelectorAll(`#${type}-items .card`).forEach((card) => {
			const cardName = card.querySelector('.card-name').textContent;
			if (cardName.includes(text)) {
				card.style.display = 'block';
			} else {
				card.style.display = 'none';
			}
		});
	}

	_resetInputs(...inputs) {
		inputs.forEach((el) => (el.value = ''));
	}
}

const app = new App();
