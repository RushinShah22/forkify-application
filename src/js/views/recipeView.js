import icons from 'url:../../img/icons.svg';
import View from './views.js';

class RecipeView extends View {
	_parentEl = document.querySelector('.recipe');
	_errorMsg =
		'There was some issue processing your request. <br />Please try again later! <br />Status Code: 400';
	_ingredientsMarkup() {
		let ingredientHtml = '';
		this._data.ingredients.forEach(ingredient => {
			ingredientHtml += ` <li class="recipe__ingredient">
            <svg class="recipe__icon">
              <use href="${icons}#icon-check"></use>
            </svg>
            <div class="recipe__quantity">${ingredient.quantity ?? ''}</div>
            <div class="recipe__description">
              <span class="recipe__unit">${ingredient.unit}</span>
              ${ingredient.description}
            </div>
          </li>`;
		});
		return ingredientHtml;
	}
	_ifBookmarked() {
		return `
		
		`;
	}

	_generateMarkup() {
		return `
		<figure class="recipe__fig">
		<img src='${this._data.image}' alt='${
			this._data.title
		}'class="recipe__img" crossorigin/>
		<h1 class="recipe__title"><span>${this._data.title}</span>
		</h1>
	  </figure>

	  <div class="recipe__details">
		<div class="recipe__info">
		  <svg class="recipe__info-icon">
			<use href="${icons}#icon-clock"></use>
		  </svg>
		  <span class="recipe__info-data recipe__info-data--minutes">${
				this._data.cookingTime
			}</span>
		  <span class="recipe__info-text">minutes</span>
		</div>
		<div class="recipe__info">
		  <svg class="recipe__info-icon">
			<use href="${icons}#icon-users"></use>
		  </svg>
		  <span class="recipe__info-data recipe__info-data--people">${
				this._data.servings
			}</span>
		  <span class="recipe__info-text">servings</span>

		  <div class="recipe__info-buttons">
			<button class="btn--tiny btn--update-servings" data-serve-to = "${
				this._data.servings - 1
			}">
			  <svg>
				<use href="${icons}#icon-minus-circle"></use>
			  </svg>
			</button>
			<button class="btn--tiny btn--update-servings" data-serve-to = "${
				this._data.servings + 1
			}">
			  <svg>
				<use href="${icons}#icon-plus-circle"></use>
			  </svg>
			</button>
		  </div>
		</div>

		<div class="recipe__user-generated ${this._data.key ? '' : 'hidden'}">
		  <svg>
			<use href="${icons}#icon-user"></use>
		  </svg>
		</div>
		<button class="btn--round">
			<svg class="">
				<use href="${icons}#icon-bookmark${
			this._data.isBookmarked ? '-fill' : ''
		}"></use>
	  		</svg>
		</button>
	  </div>

	  <div class="recipe__ingredients">
		<h2 class="heading--2">Recipe ingredients</h2>
		<ul class="recipe__ingredient-list">
		${this._ingredientsMarkup(this._data.ingredients)}
		</ul>
	  </div>

	  <div class="recipe__directions">
		<h2 class="heading--2">How to cook it</h2>
		<p class="recipe__directions-text">
		  This recipe was carefully designed and tested by
		  <span class="recipe__publisher">${
				this._data.publisher
			}</span>. Please check out
		  directions at their website.
		</p>
		<a
		  class="btn--small recipe__btn"
		  href="${this._data.sourceUrl}"
		  target="_blank"
		>
		  <span>Directions</span>
		  <svg class="search__icon">
			<use href="${icons}#icon-arrow-right"></use>
		  </svg>
		</a>
	  </div>
		`;
	}

	updatedServingsMarkup() {
		`
		<div class="recipe__info-buttons">
		<button class="btn--tiny btn--update-servings" data-serve-to = "${
			this._data.servings - 1
		}">
		  <svg>
			<use href="${icons}#icon-minus-circle"></use>
		  </svg>
		</button>
		<button class="btn--tiny btn--update-servings" data-serve-to = "${
			this._data.servings + 1
		}">
		  <svg>
			<use href="${icons}#icon-plus-circle"></use>
		  </svg>
		</button>
	  </div>
	</div>
		
		`;
	}
	addHandlerRecipe(handler) {
		['load', 'hashchange'].forEach(ev => window.addEventListener(ev, handler));
	}

	addServingsHandler(handler) {
		this._parentEl.addEventListener('click', function (e) {
			const btn = e.target.closest('.btn--update-servings');
			if (!btn) return;
			const serveTo = +btn.dataset.serveTo;
			if (serveTo > 0) handler(serveTo);
		});
	}

	addBookmarkHandler(handler) {
		this._parentEl.addEventListener(
			'click',
			function (e) {
				const btn = e.target.closest('.btn--round');
				if (!btn) return;
				const svg = btn.querySelector('use');
				const svgHref = svg.getAttribute('href');
				const bookmarkIconHref =
					svgHref.slice(-5) === '-fill'
						? svgHref.slice(0, -5)
						: svgHref + '-fill';

				this._data.isBookmarked = !this._data.isBookmarked;

				svg.setAttribute('href', bookmarkIconHref);
				handler(this._data.id);
			}.bind(this)
		);
	}
}

export default new RecipeView();
