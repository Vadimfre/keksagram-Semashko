"use strict";

const MINIMUM_LIKES_COUNT = 15;
const MAXIMUM_LIKES_COUNT = 200;
const TOTAL_NUMBER_OF_PHOTOS = 25;
const MAXIMUM_COMMENTS_COUNT = 5;
const MAXIMUM_AVATAR_INDEX = 6;
const AVATAR_IMAGE_WIDTH = 35;
const AVATAR_IMAGE_HEIGHT = 35;
const MIN_HASHTAG_LENGTH = 1;
const MAX_HASHTAG_LENGTH = 19;
const MAX_HASHTAG_COUNT = 5;

const errorMessage = {
  hashtagErrorTooMany: 'Нельзя указать больше пяти хэш-тегов',
  hashtagErrorOnlyHash: 'Хэштег не может состоять только из одной решетки',
  hashtagErrorInvalid: 'Максимальная длина хеш-тага 20 символом, включая решетку',
  hashtagErrorDuplicate: 'Один и тот же хэш-тег не может быть использован дважды',
  hashtagErrorMissingHash: 'Хэштег должен начинаться с символа #',
  hashtagErrorSpace: 'Хэштеги должны разделяться пробелами'
};

const errorsState = {
  hashtagErrorTooMany: false,
  hashtagErrorOnlyHash: false,
  hashtagErrorInvalid: false,
  hashtagErrorDuplicate: false,
  hashtagErrorMissingHash: false,
  hashtagErrorSpace: false
};

const COMMENTS = [
  `Всё отлично!`,
  `В целом всё неплохо. Но не всё.`,
  `Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.`,
  `Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.`,
  `Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.`,
  `Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!`,
];

const NAMES = [`Артем`, `Иван`, `Мария`, `София`, `Антон`, `Екатерина`];

const DESCRIPTIONS = [
  `Тестим новую камеру!`,
  `Затусили с друзьями на море`,
  `Как же круто тут кормят`,
  `Отдыхаем...`,
  `Цените каждое мгновенье. Цените тех, кто рядом с вами`,
  `и отгоняйте все сомненья. Не обижайте всех словами......`,
  `Вот это тачка!`,
];

const photosData = [];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomArrayElement(elements) {
  return elements[getRandomInt(0, elements.length - 1)];
}

createPhotosData();
uploadPhotos();

function createPhotosData() {
  for (let i = 1; i <= TOTAL_NUMBER_OF_PHOTOS; i++) {
    const photoData = {
      url: `photos/${i}.jpg`,
      likes: getRandomInt(MINIMUM_LIKES_COUNT, MAXIMUM_LIKES_COUNT),
      comments: [],
      description: getRandomArrayElement(DESCRIPTIONS),
    };
    photoData.comments = createComments();

    photosData.push(photoData);
  }
}

function createComments() {
  const commentsCount = getRandomInt(1, MAXIMUM_COMMENTS_COUNT);
  const commentsData = [];

  for (let j = 1; j <= commentsCount; j++) {
    const commentData = {
      avatar: `img/avatar-${getRandomInt(1, MAXIMUM_AVATAR_INDEX)}.svg`,
      message: getRandomArrayElement(COMMENTS),
      name: getRandomArrayElement(NAMES),
    };
    commentsData.push(commentData);
  }
  return commentsData;
}


function onPictureClick(e) {
  const index = e.currentTarget.dataset.index;
  const photoData = photosData[index];

  bigPictureCancel.addEventListener('click', onbigPictureCancelClick);
  document.addEventListener("keydown", onEscBigPictureClick);
  overlay.addEventListener('click', onOverlayClick);

  presentFullSizePicture(photoData);
}

function uploadPhotos() {
  const pictureTemplate = document.querySelector("#picture").content.querySelector(".picture");
  const fragment = document.createDocumentFragment();

  photosData.forEach((photoData, i) => {
    const pictureElement = pictureTemplate.cloneNode(true);

    pictureElement.querySelector(".picture__img").src = photoData.url;
    pictureElement.querySelector(".picture__comments").textContent = photoData.comments.length;
    pictureElement.querySelector(".picture__likes").textContent = photoData.likes;
  
    pictureElement.dataset.index = i;
    
    pictureElement.addEventListener('click', onPictureClick);
    
    fragment.appendChild(pictureElement);
  });

  document.querySelector(".pictures").appendChild(fragment);
}

const bigPicture = document.querySelector(".big-picture");

function presentFullSizePicture(photoData) {
  bigPicture.querySelector(".big-picture__img img").src = photoData.url;
  bigPicture.querySelector(".likes-count").textContent = photoData.likes;
  bigPicture.querySelector(".comments-count").textContent = photoData.comments.length;
  bigPicture.querySelector(".social__caption").textContent = photoData.description;

  const commentsContainer = bigPicture.querySelector(".social__comments");
  commentsContainer.innerHTML = '';

  const commentsFragment = createFullSizePictureComment(photoData.comments);
  commentsContainer.appendChild(commentsFragment);

  bigPicture.classList.remove("hidden");
}


// presentFullSizePicture(photosData[0]);

function getCommentImg(commentData) {
  const commentPhoto = document.createElement("img");

  commentPhoto.classList.add("social__picture");
  commentPhoto.src = commentData.avatar;
  commentPhoto.alt = `Аватар комментатора фотографии`;
  commentPhoto.width = AVATAR_IMAGE_WIDTH;
  commentPhoto.height = AVATAR_IMAGE_HEIGHT;
  return commentPhoto;
}

function getCommentParagraph(commentData) {
  const textElement = document.createElement("p");

  textElement.classList.add("social__text");
  textElement.textContent = commentData.message;
  return textElement;
}

function createFullSizePictureComment(comments) {
  const commentsFragment = document.createDocumentFragment();

  for (const commentData of comments) {
    const commentElement = document.createElement("li");

    commentElement.classList.add("social__comment");

    const imgComment = getCommentImg(commentData);
    const paragraphComment = getCommentParagraph(commentData);

    commentElement.appendChild(imgComment);
    commentElement.appendChild(paragraphComment);
    commentsFragment.appendChild(commentElement);
  }

  return commentsFragment;
}

const commentCount = document.querySelector(".social__comment-count");
const commentsLoader = document.querySelector(".comments-loader");

const bigPictureCancel = bigPicture.querySelector('#picture-cancel')

function onbigPictureCancelClick(){
  bigPicture.classList.add("hidden");

  uploadCancel.removeEventListener("click", onbigPictureCancelClick);
  document.removeEventListener("keydown", onEscBigPictureClick);
  overlay.removeEventListener('click', onOverlayClick);
  
}

function onEscBigPictureClick(evt){
  if (evt.key === "Escape"){
    onbigPictureCancelClick()
  }
  if (evt.key === `Enter` && document.activeElement === bigPictureCancel ){

  }
}

function onOverlayClick(evt){
  if (evt.target === overlay){
    onbigPictureCancelClick()
  }
}

function onOverlayImageEditFormClick(evt){
  if (evt.target === imageEditFormOverlay){
    hideImageEditForm()
  }
}

commentCount.classList.add("visually-hidden");
commentsLoader.classList.add("visually-hidden");


const imageUploadForm = document.querySelector(".img-upload__form");
const uploadFile = imageUploadForm.querySelector("#upload-file");
const imageEditFormOverlay = imageUploadForm.querySelector(".img-upload__overlay");
const imageEditForm = imageEditFormOverlay.querySelector(".img-upload__wrapper");


const uploadCancel = imageEditForm.querySelector(".img-upload__cancel");
const overlay = document.querySelector('.overlay');

uploadFile.addEventListener("change", function () {
  imageEditFormOverlay.classList.remove("hidden");
  
  uploadCancel.addEventListener("click", onCancelClick);
  document.addEventListener("keydown", onEscClick);
  imageEditFormOverlay.addEventListener('click', onOverlayImageEditFormClick)
});

function hideImageEditForm() {
  imageEditFormOverlay.classList.add("hidden");
  uploadFile.value = "";
  resetErrorState();

  uploadCancel.removeEventListener("click", onCancelClick);
  document.removeEventListener("keydown", onEscClick);
  submitButton.removeEventListener('click', onSubmitClick);
  imageEditFormOverlay.removeEventListener('click', onOverlayImageEditFormClick);
  hashtagInput.removeEventListener('input', onHashtagInput);
}

function onCancelClick() {
  hideImageEditForm();
}

function onEscClick(evt) {
  if (evt.key === "Escape" && document.activeElement !== hashtagInput) {
    hideImageEditForm();
  }
}

const submitButton = imageEditForm.querySelector('#upload-submit');
const hashtagInput = imageUploadForm.querySelector('.text__hashtags');


function onSubmitClick() {
  if (hashtagInput.value !== ''){
    const inputStrings = getHashtags(hashtagInput);
    

    const errorMessage = validateHashtags(inputStrings);

    hashtagInput.setCustomValidity(errorMessage);
  }
}

submitButton.addEventListener('click', onSubmitClick);

function getHashtags(input) {
  return input.value.toLowerCase().trim().split(' ').filter(Boolean);
}

function validateHashtags(hashtags) {


  const allStartsWithHash = hashtags.every((str) => str.startsWith('#'));

  if (!allStartsWithHash) {
    errorsState.hashtagErrorMissingHash = true;
  }
  
  if (hashtags.length > MAX_HASHTAG_COUNT) {
    errorsState.hashtagErrorTooMany = true;
  }

  for (let i = 0; i < hashtags.length; i++) {
    if (hashtags[i] === '#') {
      errorsState.hashtagErrorOnlyHash = true;
    }

    if (!isValidHashtag(hashtags[i])) {
      errorsState.hashtagErrorInvalid = true;
    }

    if (isDuplicateHashtag(hashtags, i)) {
      errorsState.hashtagErrorDuplicate = true;
    }
  }

  return generateErrorMessage();
  
}

function isValidHashtag(hashtag) {
  const isHashtagLengthValid = hashtag.length <= MAX_HASHTAG_LENGTH && hashtag.length >= MIN_HASHTAG_LENGTH;
  return isHashtagLengthValid;
}

function isDuplicateHashtag(hashtags, index) {
  return hashtags.indexOf(hashtags[index]) !== index;
}

function resetErrorState() {
  for (const error in errorsState) {
    errorsState[error] = false;
  }
}

function onHashtagInput() {
  resetErrorState();
  onSubmitClick();
}

function generateErrorMessage() {
  let message = '';
  for (const error in errorsState) {
    if (errorsState[error]) {
      message += errorMessage[error] + '\n';
    }
  }
  return message.trim();
}

hashtagInput.addEventListener('input', onHashtagInput);
