import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

import { getImages } from "./js/pixabay-api.js";
import { createGallery } from "./js/render-functions.js";

const form = document.querySelector('.form');
const gallery = document.querySelector('.gallery');
const loader = document.querySelector('.loader');
const loadMoreBtn = document.querySelector('.load-more-btn');

let input;
let currentPage;
let maxPage;

loader.style.display = 'none';
loadMoreBtn.classList.add('hidden');
form.addEventListener('submit', onFormSubmit);
loadMoreBtn.addEventListener('click', onLoadMoreClick);
    
async function onFormSubmit(e) {
    e.preventDefault();

    gallery.innerHTML = '';
    input = e.target.elements.input.value.trim();


    if (input === '') {
        showError('Please enter a valid request!');
        return;
    }

    loader.style.display = 'block';
    currentPage = 1;

    try {
        const data = await getImages(input, currentPage);
        maxPage = Math.ceil(data.totalHits / 15);
        loadMoreBtn.classList.remove('hidden');
        if (currentPage >= maxPage) {
            loadMoreBtn.classList.add('hidden');
        } else {
            loadMoreBtn.classList.remove('hidden');
        }
        handleGalleryResponse(data);
    } catch (error) {
        console.error(error);
        showError('Unable to get images');
    } finally {
        loader.style.display = 'none';
    }
}

async function onLoadMoreClick() {
    loader.style.display = 'block';
    currentPage++;

    try {
        const data = await getImages(input, currentPage);
        handleGalleryResponse(data);
        scroll();
    } catch (error) {
        console.error(error);
        showError('Unable to get images');
    } finally {
        loader.style.display = 'none';
    }
}

function handleGalleryResponse(data) {
    if (data.hits.length === 0) {
        showError('Sorry, there are no images matching your search query. Please try again!');
        return;
    } else {
        createGallery(data);
    }

    if (currentPage >= maxPage) {
        loadMoreBtn.classList.add('hidden');
        showError('We are sorry, but you have reached the end of search results.');
    } else {
        loadMoreBtn.classList.remove('hidden');
    }
}

function showError(msg) {
    iziToast.error({
        message: msg,
        position: "topRight",        
  });
}

function scroll() {
    const height = gallery.firstElementChild.getBoundingClientRect().height;
    scrollBy({
        top: height * 2,
        behavior: 'smooth'
    });
}