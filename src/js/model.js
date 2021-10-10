import { getJSON, sendJSON } from './helpers.js';
import { API_URL, REC_PER_PAGE, KEY } from './config.js';

export let state = {
	recipe: {},
	search: {
		query: '',
		pageNum: 1,
		totalPages: 0,
		result: [],
	},
	bookmarks: {
		ids: [],
		data: [],
	},
};

const recipeDataTemplate = function (recipe) {
	return {
		id: recipe.id,
		title: recipe.title,
		publisher: recipe.publisher,
		sourceUrl: recipe.source_url,
		image: recipe.image_url,
		servings: recipe.servings,
		cookingTime: recipe.cooking_time,
		ingredients: recipe.ingredients,
		key: recipe.key,
		isBookmarked: false,
	};
};

const addDataToBookmark = function (recipe) {
	state.bookmarks.data.push({
		id: recipe.id,
		title: recipe.title,
		publisher: recipe.publisher,
		image: recipe.image_url,
		key: recipe.key,
	});
};
export const loadRecipe = async function (id) {
	try {
		const data = await getJSON(`${API_URL}${id}?key=${KEY}`);
		const { recipe } = data.data;
		state.recipe = recipeDataTemplate(recipe);
	} catch (err) {
		throw err;
	}
};

export const loadSearchResults = async function (query) {
	try {
		const data = await getJSON(`${API_URL}?search=${query}&key=${KEY}`);

		if (data.results === 0) throw new Error();
		state.search.query = query;
		state.search.totalPages = Math.ceil(data.results / REC_PER_PAGE);
		state.search.pageNum = 1;
		state.search.result = data.data.recipes.map(recipe => {
			return {
				id: recipe.id,
				title: recipe.title,
				publisher: recipe.publisher,
				image: recipe.image_url,
				key: recipe.key,
			};
		});
	} catch (err) {
		throw err;
	}
};

export const loadRecipesPerPage = function (page = state.search.pageNum) {
	state.search.pageNum = page;
	const start = (page - 1) * REC_PER_PAGE;
	const end = page * REC_PER_PAGE;
	return state.search.result.slice(start, end);
};

export const servingsUpdate = function (newServings) {
	state.recipe.ingredients.forEach(ing => {
		if (ing.quantity)
			ing.quantity = (
				(ing.quantity * newServings) /
				state.recipe.servings
			).toFixed(2);
	});
	state.recipe.servings = newServings;
};

export const loadBookmarkDataInit = async function () {
	try {
		const data = await Promise.all(
			state.bookmarks.ids.map(id => getJSON(`${API_URL}${id}?key=${KEY}`))
		);
		data.forEach(data => {
			const { recipe } = data.data;
			addDataToBookmark(recipe);
		});
	} catch (err) {
		throw err;
	}
};

export const updateBookmark = function (id) {
	if (state.bookmarks.ids.length === 0) {
		state.bookmarks.ids = [id];
		addDataToBookmark(state.recipe);
		state.recipe.isBookmarked = true;
	} else if (state.bookmarks.ids.includes(id)) {
		state.bookmarks.ids = state.bookmarks.ids.filter(i => i !== id);
		state.bookmarks.data = state.bookmarks.data.filter(data => data.id !== id);
		state.recipe.isBookmarked = false;
	} else {
		state.bookmarks.ids.push(id);
		addDataToBookmark(state.recipe);
		state.recipe.isBookmarked = true;
	}

	localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks.ids));
};

export const addRecipe = async function (newRecipe) {
	const recipe = {
		title: newRecipe.title,
		publisher: newRecipe.publisher,
		source_url: newRecipe.sourceUrl,
		image_url: newRecipe.image,
		servings: newRecipe.servings,
		cooking_time: newRecipe.cookingTime,
		ingredients: newRecipe.ingredients,
	};
	const data = await sendJSON(`${API_URL}?key=${KEY}`, recipe);
	state.recipe = recipeDataTemplate(data.data.recipe);
	updateBookmark(state.recipe.id);
};
