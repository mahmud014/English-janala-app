const loadLesson = () => {
  const url = "https://openapi.programming-hero.com/api/levels/all";
  fetch(url)
    .then((res) => res.json())
    .then((json) => displayLesson(json.data));
};

const loadLevelWord = (id) => {
  const url = `https://openapi.programming-hero.com/api/level/${id}`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => displayLevelWord(data.data));
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
            <button class="btn bg-[#1a91ff1a] hover:bg-[#1a91ffcc]">
              <i class="fa-solid fa-circle-info"></i>
            </button>
            <button class="btn bg-[#1a91ff1a] hover:bg-[#1a91ffcc]">
              <i class="fa-solid fa-volume-high"></i>
            </button>
          </div>
        </div>
    `;
    //4. append the container
    wordContainer.append(wordCard);
  });
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
            <button onclick="loadLevelWord(${lesson.level_no})" class=" btn btn-outline btn-primary">
            <i class="fa-solid fa-book-open"></i> Lesson -${lesson.level_no}
            </button>
    `;
    //4. append the container

    levelContainer.append(btnDiv);
  }
};

loadLesson();
