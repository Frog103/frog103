document.addEventListener("DOMContentLoaded", function(){
  if(document.getElementById("bannerContainer")){
    loadComic();
  } else if(document.getElementById("projectContainer")){
    loadProjects();
  } else if(document.getElementById("viewerContainer")){
    loadViewer();
  }
});

// Modularize repetitive code and improve readability
function renderError(containerId, message) {
  document.getElementById(containerId).innerHTML = `<p>${message}</p>`;
}

function renderVolumeButtons(volumes) {
  return volumes.map((volume, index) => `<button class="volume-button" data-index="${index}">${volume.volumeTitle}</button>`).join('');
}

function renderChapterCard(ch, meta) {
  const chapterIcon = (meta && meta["chapterfree?"] === "true") ? '👁️' : '🔒';
  return `
    <div class="chapter-card">
      <div class="card-text">
        <p>${ch.chapterTitle}</p>
        <p>Release: ${ch.releaseDate}</p>
      </div>
      <div class="card-button">
        <a href="viewer.html?chapterId=${ch.chapterId}" data-chapterfree="${(meta && meta["chapterfree?"] === "true") ? "true" : "false"}">
          View <span class="free-icon">${chapterIcon}</span>
        </a>
      </div>
    </div>
  `;
}

function renderChapters(volume) {
  if (!volume || !Array.isArray(volume.chapters)) {
    renderError("chapterContainer", "No chapters available.");
    return;
  }

  const chaptersHtml = volume.chapters.map(ch => {
    const meta = volume.childChaptersMeta ? volume.childChaptersMeta.find(m => m.chapterId === ch.chapterId) : null;
    return renderChapterCard(ch, meta);
  }).join('');

  document.getElementById("chapterContainer").innerHTML = chaptersHtml;

  if (volume.pdf) {
    const pdfIcon = (volume["pdffree?"] === "true") ? '👁️' : '🔒';
    document.getElementById("pdfContainer").innerHTML = `
      <div class="card-button">
        <a href="${volume.pdf}" data-pdffree="${(volume["pdffree?"] === "true") ? "true" : "false"}">
          Download Volume PDF <span class="free-icon">${pdfIcon}</span>
        </a>
      </div>
    `;
  } else {
    document.getElementById("pdfContainer").innerHTML = "";
  }

  attachAccessControl();
}

function loadComic() {
  fetch('cradle.json')
    .then(res => res.json())
    .then(data => {
      if (!data.comics || !data.comics.length) {
        console.error("No comics available in data.");
        renderError("titleContainer", "No comic data available.");
        return;
      }

      const comic = data.comics[0];
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

      document.getElementById("volumeContainer").innerHTML = renderVolumeButtons(comic.volumes);

      if (comic.volumes && comic.volumes.length) {
        renderChapters(comic.volumes[0]);
      } else {
        renderError("chapterContainer", "No volumes available.");
      }

      document.querySelectorAll(".volume-button").forEach(btn => {
        btn.addEventListener("click", function () {
          const idx = this.getAttribute("data-index");
          renderChapters(comic.volumes[idx]);
        });
      });
    })
    .catch(err => {
      console.error("Error loading comic:", err);
      renderError("titleContainer", "Error loading comic data.");
    });
}

// New function to attach access control to generated links.
function attachAccessControl() {
  document.querySelectorAll("#chapterContainer a[data-chapterfree]").forEach(anchor => {
    anchor.addEventListener("click", function(e) {
      if(this.dataset.chapterfree === "false") {
        alert("Access Denied: This chapter is not available.");
        e.preventDefault();
      }
    });
  });
  document.querySelectorAll("#pdfContainer a[data-pdffree]").forEach(anchor => {
    anchor.addEventListener("click", function(e) {
      if(this.dataset.pdffree === "false") {
        alert("Access Denied: This volume's PDF is not available.");
        e.preventDefault();
      }
    });
  });
}

function loadProjects(){
  fetch('cradle.json')
    .then(res => res.json())
    .then(data => {
      if(!data.comics || !data.comics.length) {
         document.getElementById("projectContainer").innerHTML = "<p>No projects found.</p>";
         return;
      }
      let projectsHtml = "";
      data.comics.forEach(comic => {
        projectsHtml += `
          <div class="project-card-container">
            <div class="project-card">
              <img src="${comic.coverImage}" alt="${comic.comicTitle} Cover">
              <div class="project-info">
                <h2>${comic.comicTitle}</h2>
                <p>${comic.comicDescription}</p>
                <button class="view-button" onclick="location.href='comic.html'">View Product</button>
              </div>
            </div>
          </div>
        `;
      });
      document.getElementById("projectContainer").innerHTML = projectsHtml;
    })
    .catch(err => {
      console.error("Error loading projects:", err);
      document.getElementById("projectContainer").innerHTML = "<p>Error loading projects.</p>";
    });
}

function loadViewer(){
  const params = new URLSearchParams(window.location.search);
  const chapterId = params.get("chapterId");
  fetch('cradle.json')
    .then(res => res.json())
    .then(data => {
      if(!data.comics || !data.comics.length) {
         document.getElementById("viewerContainer").innerHTML = "<p>No comic data available.</p>";
         return;
      }
      const comic = data.comics[0];
      if(!chapterId){
        // No specific chapter selected: display a list of chapters
        let listHtml = "<h1>Select a Chapter</h1>";
        comic.volumes.forEach(volume => {
          listHtml += `<h2>${volume.volumeTitle}</h2>`;
          // Ensure childChaptersMeta exists before iterating
          if(Array.isArray(volume.childChaptersMeta)) {
            volume.childChaptersMeta.forEach(chMeta => {
               listHtml += `
              <div class="chapter-list-item">
                <p>${chMeta.chapterTitle} (Released: ${chMeta.releaseDate})</p>
                <a href="carousel.html?chapterId=${chMeta.chapterId}">View Carousel</a>
              </div>
             `;
            });
          } else {
            listHtml += `<p>No chapters metadata available.</p>`;
          }
        });
        document.getElementById("viewerContainer").innerHTML = listHtml;
      } else {
        // For backward compatibility, if chapterId is passed, redirect to carousel page.
        window.location.href = "carousel.html?chapterId=" + chapterId;
      }
    })
    .catch(err => {
      console.error("Error loading viewer:", err);
      document.getElementById("viewerContainer").innerHTML = "<p>Error loading viewer data.</p>";
    });
}
