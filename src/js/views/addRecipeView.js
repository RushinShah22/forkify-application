import View from './views.js';

class AddRecipeView extends View {
	_parentEl = document.querySelector('.upload');
	_overlay = document.querySelector('.overlay');
	_window = document.querySelector('.add-recipe-window');
	_btnOpen = document.querySelector('.nav__btn--add-recipe');
	_btnClose = document.querySelector('.btn--close-modal');

	constructor() {
		super();
		this._addBtnOpenHandler();
		this._addBtnCloseHandler();
	}

	addRecipeWindowDisplay() {
		this._overlay.classList.toggle('hidden');
		this._window.classList.toggle('hidden');
	}
	_addBtnOpenHandler() {
		this._btnOpen.addEventListener(
			'click',
			this.addRecipeWindowDisplay.bind(this)
		);
	}

	_addBtnCloseHandler() {
		this._btnClose.addEventListener(
			'click',
			this.addRecipeWindowDisplay.bind(this)
		);
		this._overlay.addEventListener(
			'click',
			this.addRecipeWindowDisplay.bind(this)
		);
	}
	addRecipeHandler(handler) {
		this._parentEl.addEventListener('submit', function (e) {
			e.preventDefault();
			const dataArr = [...new FormData(this)];
			handler(dataArr);
		});
	}
}

export default new AddRecipeView();
