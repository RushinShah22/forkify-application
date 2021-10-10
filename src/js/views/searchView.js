import View from './views.js';

class searchView extends View {
	_parentEl = document.querySelector('.search');
	_query = '';

	_getQuery() {
		const query = this._parentEl
			.querySelector('.search__field')
			.value.toLowerCase();

		this._query = query;
		this._clearInput();
		return query;
	}
	_clearInput() {
		this._parentEl.querySelector('.search__field').value = '';
	}

	addHandlerSearch(handler) {
		this._parentEl.addEventListener(
			'submit',
			function (e) {
				e.preventDefault();

				handler(this._getQuery());
			}.bind(this)
		);
	}
}

export default new searchView();
