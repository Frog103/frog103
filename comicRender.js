function renderComicDetails(comic) {
  document.querySelector("#bannerContainer img").src = comic.bannerImage;
  document.getElementById("productHeader").innerHTML = `<h2>${comic.productHeaderText}</h2>`;
  document.getElementById("titleContainer").innerHTML = `
    <h1>${comic.comicTitle}</h1>
    <h2>Tags: ${comic.tags.join(", ")}</h2>
    <h2>${comic.comicDescription}</h2>
    <div class="credits">
      <p>Writers:<div class="tag">${comic.credits.writer}</div></p>
      <p>Main Artists:<div class="tag">${comic.credits.artist}</div></p>
      <p>Extra: <div class="tag">${comic.credits.extra}</div></p>
    </div>
  `;
}

function renderVolumes(comic) {
  if (comic.volumes && comic.volumes.length) {
    document.getElementById("volumeContainer").innerHTML = comic.volumes.map((volume, index) => 
      `<button class="volume-button" data-index="${index}">${volume.volumeTitle}</button>`
    ).join('');
  } else {
    document.getElementById("volumeContainer").innerHTML = "<p>No volumes available.</p>";
  }
}

function attachVolumeListeners(comic) {
  document.querySelectorAll(".volume-button").forEach(btn => {
    btn.addEventListener("click", function () {
      const idx = this.getAttribute("data-index");
      renderChapters(comic.volumes[idx]);
    });
  });
}

function loadComic() {
  fetch('cradle.json')
    .then(res => res.json())
    .then(data => {
      if (!data.comics || !data.comics.length) {
        console.error("No comics available in data.");
        document.getElementById("titleContainer").innerHTML = "<p>No comic data available.</p>";
        return;
      }

      const comic = data.comics[0];
      renderComicDetails(comic);
      renderVolumes(comic);

      if (comic.volumes && comic.volumes.length) {
        renderChapters(comic.volumes[0]);
      } else {
        document.getElementById("chapterContainer").innerHTML = "<p>No chapters available.</p>";
      }

      attachVolumeListeners(comic);
    })
    .catch(err => {
      console.error("Error loading comic:", err);
      document.getElementById("titleContainer").innerHTML = "<p>Error loading comic data.</p>";
    });
}