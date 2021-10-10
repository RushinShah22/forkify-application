import View from './views';
import icons from 'url:../../img/icons.svg';
class Pagination extends View {
	_parentEl = document.querySelector('.pagination');

	_generateMarkup() {
		const previousButtonMarkup = `
	    <button data-goto = "${
				this._data.pageNum - 1
			}"class="btn--inline pagination__btn--prev">
	            <svg class="search__icon">
	            <use href="${icons}#icon-arrow-left"></use>
	            </svg>
	            <span>Page ${this._data.pageNum - 1}</span>
	        </button>
	    `;
		const nextButtonMarkup = `
	    <button data-goto = "${
				this._data.pageNum + 1
			}"class="btn--inline pagination__btn--next">
	    <span>Page ${this._data.pageNum + 1}</span>
	    <svg class="search__icon">
	    <use href="${icons}#icon-arrow-right"></use>
	    </svg>
	</button>
	    `;
		const markup = `${this._data.pageNum !== 1 ? previousButtonMarkup : ''}${
			this._data.totalPages !== this._data.pageNum ? nextButtonMarkup : ''
		}`;
		return markup;
	}

	addBtnHandler(handler) {
		this._parentEl.addEventListener('click', function (e) {
			const btn = e.target.closest('.btn--inline');
			if (!btn) return;
			const goTo = +btn.dataset.goto;
			handler(goTo);
		});
	}
}
export default new Pagination();
