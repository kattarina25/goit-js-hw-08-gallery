import galleryItems from './gallery-items.js';

const refs = {
  gallery: document.querySelector('.js-gallery'),
  lightbox: document.querySelector('.js-lightbox'),
  overlay: document.querySelector('.lightbox__content'),
  closeLightbox: document.querySelector('button[data-action="close-lightbox"]'),
  imageLightbox: document.querySelector('.lightbox__image'),
};

const createItemList = {
  index: 0,
  createList() {
    return galleryItems.map(item => this.createItem(item));
  },
  createItem(item) {
    this.list = this.createElement('li', 'gallery__item');
    this.href = this.createElement('a', 'gallery__link');
    this.image = this.createElement('img', 'gallery__image');
    this.addAttribute(item);
    this.href.appendChild(this.image);
    this.list.appendChild(this.href);
    return this.list;
  },
  createElement(elementName, className) {
    const element = document.createElement(elementName);
    element.classList.add(className);
    return element;
  },
  addAttribute(item) {
    this.href.setAttribute('href', item.original);
    this.image.setAttribute('src', item.preview);
    this.image.setAttribute('data-source', item.original);
    this.image.setAttribute('data-index', (this.index += 1));
    this.image.setAttribute('alt', item.description);
  },
};

refs.gallery.append(...createItemList.createList());

refs.gallery.addEventListener('click', onOpenModal);
refs.closeLightbox.addEventListener('click', onCloseModal);
refs.overlay.addEventListener('click', onOverlayClick);

let indexImageOnClick;

function onOpenModal(event) {
  event.preventDefault();

  const imageRef = event.target;
  if (imageRef.nodeName !== 'IMG') {
    return;
  }
  refs.lightbox.classList.add('is-open');
  indexImageOnClick = Number(imageRef.dataset.index - 1);
  window.addEventListener('keydown', onKeyboard);
  replacementAttribute(imageRef.dataset.source, imageRef.alt);
}

function onCloseModal() {
  refs.lightbox.classList.remove('is-open');
  replacementAttribute('', '');
  window.removeEventListener('keydown', onKeyboard);
}

function onOverlayClick(event) {
  if (event.target === event.currentTarget) {
    onCloseModal();
  }
}

function onKeyboard(event) {
  if (event.code === 'Escape') {
    onCloseModal();
  }
  if (event.code === 'ArrowRight' || 'ArrowLeft') {
    onArrow(event.code);
  }
}

function onArrow(action) {
  action === 'ArrowRight' ? (indexImageOnClick += 1) : (indexImageOnClick -= 1);
  if (action === 'ArrowRight' && galleryItems.length === indexImageOnClick)
    indexImageOnClick = 0;
  if (action === 'ArrowLeft' && indexImageOnClick < 0)
    indexImageOnClick = galleryItems.length - 1;
  replacementAttribute(
    galleryItems[indexImageOnClick].original,
    galleryItems[indexImageOnClick].description,
  );
}

function replacementAttribute(url, description) {
  refs.imageLightbox.src = url;
  refs.imageLightbox.alt = description;
}
