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

const ErrorMessages = {
  HashtagErrorTooMany: 'Нельзя указать больше пяти хэш-тегов',
  HashtagErrorOnlyHash: 'Хэштег не может состоять только из одной решетки',
  HashtagErrorInvalid: `Хэштег должен начинаться с символа "#". 
  Хэштег должен содержать только буквы и цифры. 
  Хэштег должен быть длиной от 1 до 19 символов. 
  Один и тот же хэштег не может быть использован дважды. 
  Нельзя указать больше пяти хэштегов. 
  Хэштег не может содержать символ "#" внутри. 
  Например, "#пример1", "#пример2", "#пример3". 
  Пожалуйста, проверьте ваши хэштеги и попробуйте снова.`,
  HashtagErrorDuplicate: 'Один и тот же хэш-тег не может быть использован дважды',
  HashtagErrorMissingHash: 'Хэштег должен начинаться с символа #'
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
  if (evt.target === imageEditForm){
    onbigPictureCancelClick()
  }
}

commentCount.classList.add("visually-hidden");
commentsLoader.classList.add("visually-hidden");


const imageUploadForm = document.querySelector(".img-upload__form");
const uploadFile = imageUploadForm.querySelector("#upload-file");
const imageEditForm = imageUploadForm.querySelector(".img-upload__overlay");

const uploadCancel = imageEditForm.querySelector(".img-upload__cancel");
const overlay = document.querySelector('.overlay');

uploadFile.addEventListener("change", function () {
  imageEditForm.classList.remove("hidden");
  
  uploadCancel.addEventListener("click", onCancelClick);
  document.addEventListener("keydown", onEscClick);
  imageEditForm.addEventListener('click', onOverlayImageEditFormClick)
});

function hideImageEditForm() {
  imageEditForm.classList.add("hidden");
  uploadFile.value = "";

  uploadCancel.removeEventListener("click", onCancelClick);
  document.removeEventListener("keydown", onEscClick);
  submitButton.removeEventListener('click', onSubmitClick);
  imageEditForm.removeEventListener('click', onOverlayImageEditFormClick);
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


function checkStartsWithHash(inputStrings) {
  const allStartsWithHash = inputStrings.every(str => str.startsWith('#'));

  if (!allStartsWithHash) {
    return ErrorMessages.HashtagErrorMissingHash;
  }

  return '';
}

function onSubmitClick() {
  if (hashtagInput.value !== ''){
    const inputStrings = getHashtags(hashtagInput);
    
    const hashError = checkStartsWithHash(inputStrings);
    if (hashError) {
      return hashtagInput.setCustomValidity(hashError);
    }

    const errorMessage = validateHashtags(inputStrings);

    hashtagInput.setCustomValidity(errorMessage);
  }
}

submitButton.addEventListener('click', onSubmitClick);

function getHashtags(input) {
  return input.value.toLowerCase().trim().split(' ').filter(Boolean);
}

function validateHashtags(hashtags) {
  hashtagInput.setCustomValidity(''); 
  
  if (hashtags.length > MAX_HASHTAG_COUNT) {
    return ErrorMessages.HashtagErrorTooMany;
  }

  for (let i = 0; i < hashtags.length; i++) {
    if (hashtags[i] === '#') {
      return ErrorMessages.HashtagErrorOnlyHash;
    }

    if (!isValidHashtag(hashtags[i])) {
      return ErrorMessages.HashtagErrorInvalid;
    }

    if (isDuplicateHashtag(hashtags, i)) {
      return ErrorMessages.HashtagErrorDuplicate;
    }
  }

  return '';
  
}

function isValidHashtag(hashtag) {
  return new RegExp(`^#[a-zA-Zа-яА-Я0-9]{${MIN_HASHTAG_LENGTH},${MAX_HASHTAG_LENGTH}}$`).test(hashtag);
}

function isDuplicateHashtag(hashtags, index) {
  return hashtags.indexOf(hashtags[index]) !== index;
}

function onHashtagInput() {
  onSubmitClick();
}

hashtagInput.addEventListener('input', onHashtagInput);
