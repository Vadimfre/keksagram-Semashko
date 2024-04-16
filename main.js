"use strict";

const MINIMUM_LIKES_COUNT = 15;
const MAXIMUM_LIKES_COUNT = 200;
const TOTAL_NUMBER_OF_PHOTOS = 25;
const MAXIMUM_COMMENTS_COUNT = 5;
const MAXIMUM_AVATAR_INDEX = 6;
const AVATAR_IMAGE_WIDTH = 35;
const AVATAR_IMAGE_HEIGHT = 35;

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

function uploadPhotos() {
  const pictureTemplate = document
    .querySelector("#picture")
    .content.querySelector(".picture");

  const fragment = document.createDocumentFragment();

  for (const photoData of photosData) {
    const pictureElement = pictureTemplate.cloneNode(true);

    pictureElement.querySelector(".picture__img").src = photoData.url;
    pictureElement.querySelector(".picture__comments").textContent =
      photoData.comments.length;
    pictureElement.querySelector(".picture__likes").textContent =
      photoData.likes;

    pictureElement.addEventListener("click", function () {
      presentFullSizePicture(photoData);
    });

    fragment.appendChild(pictureElement);
  }

  document.querySelector(".pictures").appendChild(fragment);
}

const bigPicture = document.querySelector(".big-picture");

function presentFullSizePicture(photoData) {
  bigPicture.querySelector(".big-picture__img img").src = photoData.url;
  bigPicture.querySelector(".likes-count").textContent = photoData.likes;
  bigPicture.querySelector(".comments-count").textContent =
    photoData.comments.length;
  bigPicture.querySelector(".social__caption").textContent =
    photoData.description;

  const commentsFragment = createFullSizePictureComment(photoData.comments);
  bigPicture.querySelector(".social__comments").appendChild(commentsFragment);

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

commentCount.classList.add("visually-hidden");
commentsLoader.classList.add("visually-hidden");

const uploadFile = document.querySelector("#upload-file");
const imageEditForm = document.querySelector(".img-upload__overlay");
const uploadCancel = document.querySelector(".img-upload__cancel");

uploadFile.addEventListener("change", function () {
  imageEditForm.classList.remove("hidden");
});

uploadCancel.addEventListener("click", function () {
  imageEditForm.classList.add("hidden");
  uploadFile.value = "";
});

document.addEventListener("keydown", function (evt) {
  if (evt.key === "Escape") {
    imageEditForm.classList.add("hidden");
    uploadFile.value = "";
  }
});