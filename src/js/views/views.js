import icons from 'url:../../img/icons.svg';

export default class View {
	_data;

	renderSpinner() {
		const markup = `
            <div class="spinner">
            <svg>
            <use href="${icons}#icon-loader"></use>
            </svg>
        </div> 
        `;
		this._clear();
		this._parentEl.insertAdjacentHTML('afterbegin', markup);
	}
	renderError(message = this._errorMsg) {
		const markup = `
        <div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}
        </p>
      </div>        
        `;
		this._clear();
		this._parentEl.insertAdjacentHTML('afterbegin', markup);
	}
	renderMsg(message) {
		const markup = `
        <div class="message">
            <div>
                <svg>
                    <use href="${icons}#icon-smile"></use>
                </svg>
            </div>
            <p>
               ${message}
            </p>
        </div>
        
        `;
		this._clear();
		this._parentEl.insertAdjacentHTML('afterbegin', markup);
	}

	update(data) {
		this._data = data;
		const markup = this._generateMarkup();
		const currEls = this._parentEl.querySelectorAll('*');
		const newDOM = document.createRange().createContextualFragment(markup);
		const newEls = newDOM.querySelectorAll('*');
		newEls.forEach((el, i) => {
			if (
				!el.isEqualNode(currEls[i]) &&
				el.firstChild?.nodeValue.trim() !== ''
			) {
				currEls[i].firstChild.nodeValue = el.firstChild.nodeValue;
			}

			if (!el.isEqualNode(currEls[i])) {
				[...el.attributes].forEach(attr =>
					currEls[i].setAttribute(attr.name, attr.nodeValue)
				);
			}
		});
	}

	render(data) {
		this._data = data;
		this._clear();
		this._parentEl.insertAdjacentHTML('afterbegin', this._generateMarkup());
	}
	_clear() {
		this._parentEl.innerHTML = '';
	}
}
