import View from './views';
import icons from 'url:../../img/icons.svg';

class Bookmark extends View {
	_parentEl = document.querySelector('.bookmarks__list');
	_errorMsg = 'Trouble loading bookmarks. Please try again.';
	_generateMarkupPreview(recipe) {
		const id = window.location.hash;
		return `
        <li class="preview">
        <a class="preview__link ${
					id.slice(1) === recipe.id ? 'preview__link--active' : ''
				} "href="#${recipe.id}">
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
		if (this._data.length === 0) {
			return this._generateNoBookmarkMarkup();
		}
		return this._data.map(rec => this._generateMarkupPreview(rec)).join('');
	}
	_generateNoBookmarkMarkup() {
		return `
        <div class="message">
            <div>
                <svg>
                    <use href="${icons}#icon-smile"></use>
                </svg>
            </div>
            <p>
            No bookmarks yet. Find a nice recipe and bookmark it :)
            </p>
        </div>
        
        `;
	}
}

export default new Bookmark();
