import View from './views.js';
import icons from 'url:../../img/icons.svg';

class searchResultsView extends View {
	_parentEl = document.querySelector('.results');
	_errorMsg = "Currently we don't have the recipe for your search.";

	_generateMarkupPreview(recipe) {
		const id = window.location.hash;
		return `
        <li class="preview">
        <a class="preview__link ${
					id.slice(1) === recipe.id ? 'preview__link--active' : ''
				}" href="#${recipe.id}">
        <figure class="preview__fig">
            <img src="${recipe.image}" alt="${recipe.title}" crossorigin/>
        </figure>
        <div class="preview__data">
            <h4 class="preview__title">${recipe.title}</h4>
            <p class="preview__publisher">${recipe.publisher}</p>
            <div class="preview__user-generated ${recipe.key ? '' : 'hidden'}">
		        <svg>
			        <use href="${icons}#icon-user"></use>
		        </svg>
		    </div>

        </div>
        </a>
    </li>
    `;
	}
	_generateMarkup() {
		return this._data.map(this._generateMarkupPreview).join('');
	}
}

export default new searchResultsView();
