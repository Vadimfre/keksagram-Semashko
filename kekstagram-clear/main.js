"use strict";
const LIKEMIN = 15;
const LIKEMAX = 200;
const PHOTOQUANTITY = 25;
const COMMAX = 5;
const COMMAVATARMAX = 6;
const WIDTHCOMMENT = 35;
const HEIGHTCOMMENT = 35;

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
let fragment = document.createDocumentFragment();

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomArrayElement(elements) {
  return elements[getRandomInt(0, elements.length - 1)];
}

createPhotosData();
uploadPhotos();

function createPhotosData() {
  for (let i = 1; i <= PHOTOQUANTITY; i++) {
    const photoData = {
      url: `photos/${i}.jpg`,
      likes: getRandomInt(LIKEMIN, LIKEMAX),
      comments: [],
      description: getRandomArrayElement(DESCRIPTIONS),
    };
    let comment = commentsSpawn();

    photoData.comments.push(comment);
    photosData.push(photoData);
  }
}

function commentsSpawn() {
  let commentsCount = getRandomInt(1, COMMAX);

  for (let j = 1; j <= commentsCount; j++) {
    const commentData = {
      avatar: `img/avatar-${getRandomInt(1, COMMAVATARMAX)}.svg`,
      message: getRandomArrayElement(COMMENTS),
      name: getRandomArrayElement(NAMES),
    };
    return commentData;
  }
}

function uploadPhotos() {
  let pictureTemplate = document.querySelector("#picture").content;
  for (let photo of photosData) {
    let pictureElement = pictureTemplate.cloneNode(true);

    pictureElement.querySelector(".picture__img").src = photo.url;
    pictureElement.querySelector(".picture__comments").textContent =
      photo.comments.length;
    pictureElement.querySelector(".picture__likes").textContent = photo.likes;

    fragment.appendChild(pictureElement);
  }
  document.querySelector(".pictures").appendChild(fragment);
}

let bigPicture = document.querySelector(".big-picture");
let firstPhoto = photosData[0];

function presentFullSizePicture() {
  bigPicture.classList.remove("hidden");
  bigPicture.querySelector(".big-picture__img img").src = firstPhoto.url;
  bigPicture.querySelector(".likes-count").textContent = firstPhoto.likes;
  bigPicture.querySelector(".comments-count").textContent =
    firstPhoto.comments.length;
  bigPicture.querySelector(".social__caption").textContent =
    firstPhoto.description;
}

presentFullSizePicture();
createFullSizePictureComment();

function getCommentImg(elem) {
  let commentPhoto = document.createElement("img");

  commentPhoto.classList.add("social__picture");
  commentPhoto.src = elem.avatar;
  commentPhoto.alt = `Аватар комментатора фотографии`;
  commentPhoto.width = WIDTHCOMMENT;
  commentPhoto.height = HEIGHTCOMMENT;
  return commentPhoto;
}

function getCommentParagraph(elem) {
  let textElement = document.createElement("p");

  textElement.classList.add("social__text");
  textElement.textContent = elem.message;
  return textElement;
}

function createFullSizePictureComment() {
  for (let elem of firstPhoto.comments) {
    let commentElement = document.createElement("li");

    commentElement.classList.add("social__comment");

    let imgComment = getCommentImg(elem);
    let paragraphComment = getCommentParagraph(elem);

    commentElement.appendChild(imgComment);
    commentElement.appendChild(paragraphComment);

    bigPicture.querySelector(".social__comments").appendChild(commentElement);
  }
}

let commentCount = document.querySelector(".social__comment-count");
let commentsLoader = document.querySelector(".comments-loader");

commentCount.classList.add("visually-hidden");
commentsLoader.classList.add("visually-hidden");
