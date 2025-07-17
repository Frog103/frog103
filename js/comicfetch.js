document.addEventListener("DOMContentLoaded", function(){
  // Dispatch functions based on detected container.
  // Dependent on comic.html if 'bannerContainer' exists.
  if(document.getElementById("bannerContainer")){
    loadComic();
  // Dependent on Projects.html if 'projectContainer' exists.
  } else if(document.getElementById("projectContainer")){
    loadProjects();
  // Dependent on viewer.html if 'viewerContainer' exists.
  } else if(document.getElementById("viewerContainer")){
    loadViewer();
  }
});

// ====================
// Search state for Projects page
// ====================
let allProjects = [];
let projectSearchText = '';

// ====================
// Section: comic.html dependent functions
// ====================

// Renders an error message into a given container.
function renderError(containerId, message) {
  document.getElementById(containerId).innerHTML = `<p>${message}</p>`;
}

// Generates HTML buttons for each volume.
function renderVolumeButtons(volumes) {
  return volumes.map((volume, index) => `<button class="volume-button" data-index="${index}">${volume.volumeTitle}</button>`).join('');
}

// Determines the appropriate icon for chapter accessibility.
function getChapterIcon(meta) {
  return (meta && meta["chapterfree?"] === "true")
    ? '<i class="fa-solid fa-eye" style="color:#000000;"></i>'
    : '<i class="fa-solid fa-lock" style="color:#000000;"></i>';
}

// Creates HTML layout for an individual chapter card.
// Indicates if the chapter is freely accessible (fa-eye) or locked (fa-lock).
function renderChapterCard(ch, meta) {
  const chapterIcon = getChapterIcon(meta);
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

// Renders all chapters for a given volume and attaches access control.
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
    const pdfIcon = (volume["pdffree?"] === "true")
      ? '<i class="fa-solid fa-eye"></i>'
      : '<i class="fa-solid fa-lock"></i>';
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

// Loads comic data and populates the comic page.
// Dependent on comic.html.
function loadComic() {
  fetch('json/cradle.json')
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
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

// Attaches event listeners to links for access control checking.
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

// ====================
// Section: Projects.html dependent function
// ====================

// Loads project data and populates the project page.
// Dependent on Projects.html.
function loadProjects(){
  fetch('json/cradle.json')
    .then(res => res.json())
    .then(data => {
      if(!data.comics || !data.comics.length) {
         document.getElementById("projectContainer").innerHTML = "<p>No projects found.</p>";
         return;
      }
      allProjects = data.comics;
      renderProjects(filterProjects());

      const searchInput = document.getElementById('search-input');
      if(searchInput){
        searchInput.addEventListener('input', e => {
          projectSearchText = e.target.value;
          renderProjects(filterProjects());
        });
      }
    })
    .catch(err => {
      console.error("Error loading projects:", err);
      document.getElementById("projectContainer").innerHTML = "<p>Error loading projects.</p>";
    });
}

function filterProjects(){
  if(!projectSearchText) return allProjects;
  return allProjects.filter(c => c.comicTitle.toLowerCase().includes(projectSearchText.toLowerCase()));
}

function renderProjects(projects){
  let projectsHtml = "";
  projects.forEach(comic => {
    const totalVolumes = comic.volumes.length;
    const totalChapters = comic.volumes.reduce((acc, volume) =>
      acc + (Array.isArray(volume.chapters) ? volume.chapters.length : 0), 0);
    let latestDate = null;
    comic.volumes.forEach(volume => {
      if(Array.isArray(volume.chapters)){
        volume.chapters.forEach(chapter => {
          let chapterDate = new Date(chapter.releaseDate);
          if(!latestDate || chapterDate > latestDate){
            latestDate = chapterDate;
          }
        });
      }
    });
    const latestUpload = latestDate ? latestDate.toLocaleDateString() : "N/A";
    const tags = comic.tags.join(", ");

    projectsHtml += `
      <div class="project-card-container">
        <div class="project-card">
          <img src="${comic.coverImage}" alt="${comic.comicTitle} Cover">
          <div class="project-info">
            <h2>${comic.comicTitle}</h2>
            <p>${comic.comicExcerpt}</p>
            <p><strong>Volumes:</strong> ${totalVolumes} | <strong>Chapters:</strong> ${totalChapters}</p>
            <p><strong>Last Update:</strong> ${latestUpload}</p>
            <p><strong>Tags:</strong> ${tags}</p>
            <button class="view-button" onclick="location.href='comic.html'">View Product</button>
          </div>
        </div>
      </div>
    `;
  });
  document.getElementById("projectContainer").innerHTML = projectsHtml;
}

// ====================
// Section: viewer.html dependent function
// ====================

// Loads viewer data and populates the chapter viewer page.
// Dependent on viewer.html.
function loadViewer(){
  const params = new URLSearchParams(window.location.search);
  const chapterId = params.get("chapterId");
  fetch('json/cradle.json')
    .then(res => res.json())
    .then(data => {
      if (!data.comics || !data.comics.length) {
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
          if (Array.isArray(volume.childChaptersMeta)) {
            volume.childChaptersMeta.forEach(chMeta => {
              listHtml += `
              <div class="chapter-list-item">
                <p>${chMeta.chapterTitle} (Released: ${chMeta.releaseDate})</p>
                <a href="carousel.html?chapterId=${chMeta.chapterId}">View Carousel</a>
              </div>
              `;
            });
          } else if (volume.childChaptersMeta) {
            listHtml += `<p>Invalid chapters metadata format.</p>`;
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
