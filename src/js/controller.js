import * as model from './model.js';
import bookmark from './views/bookmarks.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import searchResultsView from './views/searchResultsView.js';
import addRecipeView from './views/addRecipeView.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { DIS_REM_SEC } from './config.js';
import pagination from './views/pagination.js';
import { async } from 'regenerator-runtime';
import bookmarks from './views/bookmarks.js';

// https://forkify-api.herokuapp.com/v2

const controlRecipe = async function () {
	try {
		const id = window.location.hash.slice(1);
		if (!id) return;

		recipeView.renderSpinner();

		await model.loadRecipe(id);

		const { recipe } = model.state;

		if (!recipe) return;
		if (model.state.bookmarks.ids.includes(id)) {
			model.state.recipe.isBookmarked = true;
		}

		searchResultsView.update(model.loadRecipesPerPage());
		if (model.state.bookmarks.data.length !== 0)
			bookmarks.update(model.state.bookmarks.data);

		recipeView.render(recipe);
	} catch (err) {
		recipeView.renderError();
	}
};

const controlSearchRecipe = async function (query) {
	try {
		if (!query) throw new Error();
		searchResultsView.renderSpinner();
		await model.loadSearchResults(query);

		searchResultsView.render(model.loadRecipesPerPage());

		pagination.render(model.state.search);
	} catch (err) {
		searchResultsView.renderError();
	}
};

const controlPagination = function (goTo) {
	model.state.search.pageNum = goTo;
	searchResultsView.render(model.loadRecipesPerPage(goTo));
	pagination.render(model.state.search);
};

const controlRecipeServings = function (newServings) {
	model.servingsUpdate(newServings);
	recipeView.update(model.state.recipe);
};

const controlBookmarkBtn = async function (id) {
	try {
		bookmark.renderSpinner();
		model.updateBookmark(id);
		bookmark.render(model.state.bookmarks.data);
	} catch (err) {
		bookmark.renderError();
	}
};

const bookmarkInit = async function () {
	try {
		const locallyStoredBookmarks = JSON.parse(
			localStorage.getItem('bookmarks')
		);
		if (!locallyStoredBookmarks || locallyStoredBookmarks.length === 0) return;
		model.state.bookmarks.ids = [...locallyStoredBookmarks];
		bookmark.renderSpinner();
		await model.loadBookmarkDataInit();
		bookmark.render(model.state.bookmarks.data);
	} catch (err) {
		bookmark.renderError();
	}
};

const controlAddRecipe = async function (data) {
	try {
		const ingredientsArr = data
			.filter(info => info[0].startsWith('ingredient') && info[1])
			.map(ing => ing[1].split(','));
		const ingredients = [];
		ingredientsArr.forEach(ing => {
			ingredients.push({
				quantity: +ing[0] || null,
				unit: ing[1],
				description: ing[2],
			});
		});

		const recipe = Object.fromEntries(
			data.filter(info => !info[0].startsWith('ingredient'))
		);
		recipe.ingredients = ingredients;
		await model.addRecipe(recipe);
		recipeView.render(model.state.recipe);
		window.history.pushState(null, '', `#${model.state.recipe.id}`);
		bookmark.render(model.state.bookmarks.data);
		addRecipeView.renderMsg('Recipe added successfully :)');
		setTimeout(
			() => addRecipeView.addRecipeWindowDisplay(),
			DIS_REM_SEC * 1000
		);
	} catch (err) {
		addRecipeView.renderError();
	}
};

const init = function () {
	console.log('hacked');
	bookmarkInit();
	recipeView.addHandlerRecipe(controlRecipe);
	recipeView.addServingsHandler(controlRecipeServings);
	recipeView.addBookmarkHandler(controlBookmarkBtn);
	searchView.addHandlerSearch(controlSearchRecipe);
	addRecipeView.addRecipeHandler(controlAddRecipe);
	pagination.addBtnHandler(controlPagination);
};

init();
///////////////////////////////////////
