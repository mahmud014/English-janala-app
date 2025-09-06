const createElement = (arr) => {
  const htmlElements = arr.map((el) => `<span class="btn">${el}</span>`);
  return htmlElements.join(" ");
};

function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}
const manageSpenner = (stutus) => {
  if (stutus == true) {
    document.getElementById("spinner").classList.remove("hidden");
    document.getElementById("word-container").classList.add("hidden");
  } else {
    document.getElementById("word-container").classList.remove("hidden");
    document.getElementById("spinner").classList.add("hidden");
  }
};

const loadLesson = () => {
  const url = "https://openapi.programming-hero.com/api/levels/all";
  fetch(url)
    .then((res) => res.json())
    .then((json) => displayLesson(json.data));
};

const removeActive = () => {
  const lessonButtons = document.querySelectorAll(".lesson-btn");

  lessonButtons.forEach((btn) => btn.classList.remove("active"));
};

const loadLevelWord = (id) => {
  manageSpenner(true);
  const url = `https://openapi.programming-hero.com/api/level/${id}`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      removeActive();
      const clickBtn = document.getElementById(`lesson-btn-${id}`);
      clickBtn.classList.add("active");
      displayLevelWord(data.data);
    });
};

const loadWordDetail = async (id) => {
  const url = `https://openapi.programming-hero.com/api/word/${id}`;
  const res = await fetch(url);
  const details = await res.json();
  displayWordDetails(details.data);
};

const displayWordDetails = (word) => {
  const detailBox = document.getElementById("details-container");
  detailBox.innerHTML = `
   <div class="">
              <h2 class="text-2xl font-bold">
                ${word.word} (<i class="fa-solid fa-microphone-lines"></i>:${
    word.pronunciation
  })
              </h2>
            </div>
            <div class="">
              <h2 class="font-bold">Meaning</h2>
              <p class="bangla-font">${word.meaning}</p>
            </div>
            <div class="">
              <h2 class="font-bold">sentence</h2>
              <p>${word.sentence}</p>
            </div>
            <div class="">
              <h2 class="font-bold bangla-font">সমার্থক শব্দ গুলো</h2>
              <div class="">${createElement(word.synonyms)}</div>
            </div>
  `;

  document.getElementById("word_modal").showModal();
};

const displayLevelWord = (words) => {
  //   1. get the container and empty
  const wordContainer = document.getElementById("word-container");
  wordContainer.innerHTML = "";

  if (words.length == 0) {
    wordContainer.innerHTML = `
    <div class="col-span-full items-center text-center space-y-3 py-10">
        <img class="mx-auto" src="./assets/alert-error.png" alt="">
          <p class="text-gray-400 text-sm bangla-font">
            এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।
          </p>
          <h2 class="text-3xl bangla-font font-medium">
            নেক্সট Lesson এ যান
          </h2>
    </div>
        `;
    manageSpenner(false);
    return;
  }
  //   2. get the every lesson

  words.forEach((word) => {
    // 3. crate a element
    const wordCard = document.createElement("div");
    wordCard.innerHTML = `
    <div
          class="bg-white rounded-xl shadow-sm text-center py-10 px-5 space-y-4"
        >
          <h2 class="text-2xl font-bold">${
            word.word ? word.word : "শব্দ পাওয়া যায়নি"
          }</h2>
          <p class="font-semibold">Meaning /Pronounciation</p>
          <div class="text-2xl font-semibold">"${
            word.meaning ? word.meaning : "অর্থ পাওয়া যায়নি"
          }/${
      word.pronunciation ? word.pronunciation : "pronunciation পাওয়া যায়নি"
    }"</div>
          <div class="flex justify-between items-center">
            <button onclick="loadWordDetail(${
              word.id
            })" class="btn bg-[#1a91ff1a] hover:bg-[#1a91ffcc]">
              <i class="fa-solid fa-circle-info"></i>
            </button>
            <button onclick="pronounceWord('${
              word.word
            }')" class="btn bg-[#1a91ff1a] hover:bg-[#1a91ffcc]">
              <i class="fa-solid fa-volume-high"></i>
            </button>
          </div>
        </div>
    `;
    //4. append the container
    wordContainer.append(wordCard);
  });
  manageSpenner(false);
};

const displayLesson = (lessons) => {
  //   1. get the container and empty
  const levelContainer = document.getElementById("level-container");
  levelContainer.innerHTML = "";
  //   2. get the every lesson
  for (let lesson of lessons) {
    // 3. crate a element
    const btnDiv = document.createElement("div");
    btnDiv.innerHTML = `
            <button id="lesson-btn-${lesson.level_no}" onclick="loadLevelWord(${lesson.level_no})" 
            class=" btn btn-outline btn-primary lesson-btn">
            <i class="fa-solid fa-book-open"></i> Lesson -${lesson.level_no}
            </button>
    `;
    //4. append the container

    levelContainer.append(btnDiv);
  }
};

loadLesson();

document.getElementById("search-btn").addEventListener("click", () => {
  removeActive();
  const input = document.getElementById("search-input");
  const searchValue = input.value.trim().toLowerCase();
  input.value = "";

  const url = "https://openapi.programming-hero.com/api/words/all";

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      const allwords = data.data;

      const searchFilter = allwords.filter((word) =>
        word.word.toLowerCase().includes(searchValue)
      );
      displayLevelWord(searchFilter);
    });
});
