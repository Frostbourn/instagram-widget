const container = document.querySelector(".instagram__widget");
const instagramRegExp = new RegExp(
  /<script type="text\/javascript">window\._sharedData = (.*);<\/script>/
);

const settings = {
  id: container.dataset.user,
  color: container.dataset.color,
  showHeader: container.dataset.header,
  width: container.dataset.width,
};

(async () => {
  try {
    fetch(
      "https://instagram40.p.rapidapi.com/proxy?url=https%3A%2F%2Fwww.instagram.com%2Fgraphql%2Fquery%2F%3Fquery_hash%3De769aa130647d2354c40ea6a439bfc08%26variables%3D%257B%2522id%2522%253A%25221226157729%2522%252C%2522first%2522%253A%25221%2522%252C%2522after%2522%253A%2522%2522%257D",
      {
        method: "GET",
        headers: {
          "x-rapidapi-key": "rapid-key-here",
          "x-rapidapi-host": "instagram40.p.rapidapi.com",
        },
      }
    ).then((response) => {
      const data = response.data;
      container.style.maxWidth = settings.width;

      if (settings.showHeader) {
        const header = document.createElement("div");
        header.classList.add("widget__header");
        header.style.backgroundColor = settings.color;
        header.innerHTML = `
                          <img src="${data.profile_pic_url}" class="header__avatar">
                          <span class="header__username">${data.full_name}</span>
                          <span class="header__logo"><svg viewBox="0 0 24 24" width="24" height="24"><path d="M17.1,1H6.9C3.7,1,1,3.7,1,6.9v10.1C1,20.3,3.7,23,6.9,23h10.1c3.3,0,5.9-2.7,5.9-5.9V6.9C23,3.7,20.3,1,17.1,1zM21.5,17.1c0,2.4-2,4.4-4.4,4.4H6.9c-2.4,0-4.4-2-4.4-4.4V6.9c0-2.4,2-4.4,4.4-4.4h10.3c2.4,0,4.4,2,4.4,4.4V17.1z"></path><path d="M16.9,11.2c-0.2-1.1-0.6-2-1.4-2.8c-0.8-0.8-1.7-1.2-2.8-1.4c-0.5-0.1-1-0.1-1.4,0C10,7.3,8.9,8,8.1,9S7,11.4,7.2,12.7C7.4,14,8,15.1,9.1,15.9c0.9,0.6,1.9,1,2.9,1c0.2,0,0.5,0,0.7-0.1c1.3-0.2,2.5-0.9,3.2-1.9C16.8,13.8,17.1,12.5,16.9,11.2zM12.6,15.4c-0.9,0.1-1.8-0.1-2.6-0.6c-0.7-0.6-1.2-1.4-1.4-2.3c-0.1-0.9,0.1-1.8,0.6-2.6c0.6-0.7,1.4-1.2,2.3-1.4c0.2,0,0.3,0,0.5,0s0.3,0,0.5,0c1.5,0.2,2.7,1.4,2.9,2.9C15.8,13.3,14.5,15.1,12.6,15.4z"></path><path d="M18.4,5.6c-0.2-0.2-0.4-0.3-0.6-0.3s-0.5,0.1-0.6,0.3c-0.2,0.2-0.3,0.4-0.3,0.6s0.1,0.5,0.3,0.6c0.2,0.2,0.4,0.3,0.6,0.3s0.5-0.1,0.6-0.3c0.2-0.2,0.3-0.4,0.3-0.6C18.7,5.9,18.6,5.7,18.4,5.6z"></path></svg></span>
                        `;
        container.appendChild(header);

        const statsPanel = document.createElement("div");
        statsPanel.classList.add("widget__panel");
        statsPanel.innerHTML = `
                              <p class=panel__stats>${nFormat(
                                data.edge_owner_to_timeline_media.count
                              )} <br /><span>posts</span>
                              <p class=panel__stats>${nFormat(
                                data.edge_followed_by.count
                              )}<br /> <span>followers</span>
                              <p class=panel__stats>${nFormat(
                                data.edge_follow.count
                              )}<br /> <span>following</span>
                            `;
        container.appendChild(statsPanel);
      } else {
        container.style.border = "none";
        container.style.boxShadow = "none";
      }

      const gallery = document.createElement("div");
      gallery.classList.add("widget__gallery");
      container.appendChild(gallery);
      const edges = data.edge_owner_to_timeline_media.edges.splice(0, 12);
      const photos = edges.map(({ node }) => {
        return {
          url: `https://www.instagram.com/p/${node.shortcode}/`,
          thumbnailUrl: node.thumbnail_src,
          displayUrl: node.display_url,
          caption: node.edge_media_to_caption.edges[0],
          likesCount: node.edge_liked_by.count,
          commentCount: node.edge_media_to_comment.count,
        };
      });
      photos.forEach((photo) => {
        const picture = document.createElement("p");
        picture.classList.add("photo");
        photo.caption = photo.caption ? photo.caption.node.text : "";
        photo.likesCount =
          photo.likesCount > 0
            ? "<span>&#x2764;</span> " + nFormat(photo.likesCount)
            : "";
        photo.commentCount =
          photo.commentCount > 0
            ? "<span>&#x1F4AC;</span> " + nFormat(photo.commentCount)
            : "";
        picture.innerHTML = `
                    <a href="${photo.url}" target="_blank" rel="noopener noreferrer" class="photo__link">
                        <img src="${photo.thumbnailUrl}" alt="${photo.caption}" class="photo__image">
                        <div class="photo__caption">
                            <p>${photo.caption}</br>
                               ${photo.likesCount} ${photo.commentCount}</br>
                            </p>
                        </div>
                    </a>
                    `;
        gallery.appendChild(picture);
      });

      const footer = document.createElement("div");
      footer.classList.add("widget__footer");
      footer.innerHTML = `<a href="https://instagram.com/${settings.id}" class="footer__button" target="_blank" style="background-color:${settings.color}">View on Instagram</a> `;
      container.appendChild(footer);
    });
  } catch (err) {
    console.log("Unable to retrieve photos. Reason: " + err);
  }
})();

const nFormat = (num) => {
  return Math.abs(num) > 999999999
    ? Math.sign(num) * (Math.abs(num) / 1000000000).toFixed(1) + "B"
    : Math.abs(num) > 999999
    ? Math.sign(num) * (Math.abs(num) / 1000000).toFixed(1) + "M"
    : Math.abs(num) > 999
    ? Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + "k"
    : Math.sign(num) * Math.abs(num);
};
