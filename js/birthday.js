document.addEventListener('DOMContentLoaded', () => {
    fetch('json/characterDesignGallery.json')
      .then(response => response.json())
      .then(data => {
          const today = new Date();
          const todayMonth = (today.getMonth() + 1).toString().padStart(2, '0');
          const todayDay = today.getDate().toString().padStart(2, '0');
          data.characters.forEach(character => {
              const dob = character.pageDetails.characterInfo.dateOfBirth;
              const parts = dob.split('-');
              if (parts.length >= 3) {
                  const month = parts[1];
                  const day = parts[2];
                  if (month === todayMonth && day === todayDay) {
                      // Create main birthday container
                      const container = document.createElement('div');
                      container.className = 'birthday-container';
                      
                      // Banner box to cycle through characterBanners
                      const banner = document.createElement('div');
                      banner.className = 'birthday-banner';
                      const img = document.createElement('img');
                      img.src = character.pageDetails.characterBanners[0].image;
                      img.alt = character.name + ' Birthday Banner';
                      banner.appendChild(img);
                      container.appendChild(banner);
                      
                      // Happy Birthday text
                      const text = document.createElement('p');
                      text.textContent = 'It\'s ' + character.name + '\'s Birthday!';
                      container.appendChild(text);
                      
                      // New: Display the character's birthdate
                      const birthdate = document.createElement('h3');
                      birthdate.textContent = 'Born on: ' + dob;
                      container.appendChild(birthdate);
                      
                      // Direct link box to character page
                      const linkBox = document.createElement('div');
                      linkBox.className = 'birthday-link-box';
                      const link = document.createElement('a');
                      link.href = 'CDCpost.html?id=' + character.characterId;
                      link.textContent = 'Visit ' + character.name + '\'s Profile';
                      linkBox.appendChild(link);
                      container.appendChild(linkBox);
                      
                      // Append the birthday container inside the homepage-container element
                      const homepageContainer = document.querySelector('.homepage-container');
                      homepageContainer.appendChild(container);
                      
                      // Cycle banner images every 5 seconds
                      let bannerIndex = 0;
                      setInterval(() => {
                          bannerIndex = (bannerIndex + 1) % character.pageDetails.characterBanners.length;
                          img.src = character.pageDetails.characterBanners[bannerIndex].image;
                      }, 5000);
                  }
              }
          });
      })
      .catch(err => console.error('Error fetching birthday data:', err));
});