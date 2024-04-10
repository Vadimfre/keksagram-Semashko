"use strict";
const LIKEMIN = 15;
const LIKEMAX = 200;
const PHOTOQUANTITY = 25;
const COMMAX = 5;

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

createPhoto();

function createPhoto() {
  for (let i = 1; i <= PHOTOQUANTITY; i++) {
    let photo = {
      url: `photos/${i}.jpg`,
      likes: getRandomInt(LIKEMIN, LIKEMAX),
      comments: [],
      description: getRandomArrayElement(DESCRIPTIONS),
    };
    let comment = commentSpawn();

    photo.comments.push(comment);
    photosData.push(photo);
  }

  uploadPhoto();
}

function commentSpawn() {
  let commentsCount = getRandomInt(1, COMMAX);

  for (let j = 1; j <= commentsCount; j++) {
    let comment = {
      avatar: `img/avatar-${getRandomInt(1, 6)}.svg`,
      message: getRandomArrayElement(COMMENTS),
      name: getRandomArrayElement(NAMES),
    };
    return comment;
  }
}

function uploadPhoto() {
  for (let ph of photosData) {
    let pictureTemplate = document.querySelector("#picture").content;
    let pictureElement = pictureTemplate.cloneNode(true);

    pictureElement.querySelector(".picture__img").src = ph.url;
    pictureElement.querySelector(".picture__comments").textContent =
      ph.comments.length;
    pictureElement.querySelector(".picture__likes").textContent = ph.likes;

    fragment.appendChild(pictureElement);
  }
  document.querySelector(".pictures").appendChild(fragment);
}

let big_picture = document.querySelector(".big-picture");
let firstPhoto = photosData[0];

function bigPicture() {
  big_picture.classList.remove("hidden");
  big_picture.querySelector(".big-picture__img img").src = firstPhoto.url;
  big_picture.querySelector(".likes-count").textContent = firstPhoto.likes;
  big_picture.querySelector(".comments-count").textContent =
    firstPhoto.comments.length;
  big_picture.querySelector(".social__caption").textContent =
    firstPhoto.description;

  bigPictureComm();
}

bigPicture();

function bigPictureComm() {
  for (let elem of firstPhoto.comments) {
    let commentElement = document.createElement("li");

    commentElement.classList.add("social__comment");

    let commentPhoto = document.createElement("img");

    commentPhoto.classList.add("social__picture");
    commentPhoto.src = elem.avatar;
    commentPhoto.alt = "Аватар комментатора фотографии";
    commentPhoto.width = 35;
    commentPhoto.height = 35;

    let textElement = document.createElement("p");

    textElement.classList.add("social__text");
    textElement.textContent = elem.message;

    commentElement.appendChild(commentPhoto);
    commentElement.appendChild(textElement);

    big_picture.querySelector(".social__comments").appendChild(commentElement);
  }
}

let commentCount = document.querySelector(".social__comment-count");
let commentsLoader = document.querySelector(".comments-loader");

commentCount.classList.add("visually-hidden");
commentsLoader.classList.add("visually-hidden");
