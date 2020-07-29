const container = document.querySelector('.instagram-widget');

const widgetSetting = {
    id: container.dataset.user,
    color: container.dataset.color,
    showHeader: container.dataset.header,
    width: container.dataset.width
};

container.style.maxWidth = widgetSetting.width;

let header = document.createElement('div');
let statsPanel = document.createElement('div');
let gallery = document.createElement('div');
let footer = document.createElement('div');

const nFormat = (num) => {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'm';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return num;
};

(async () => {
    try {
        const url = await axios.get(`https://www.instagram.com/${widgetSetting.id}`)
            .then(fetchData => {
                let instagramRegExp = new RegExp(/<script type="text\/javascript">window\._sharedData = (.*);<\/script>/);
                let values = fetchData.data.match(instagramRegExp)[1];
                let parsedResponse = JSON.parse(values);
                let userData = parsedResponse.entry_data.ProfilePage[0].graphql.user;
                return userData;
            })
            .then(userData => {
                if ((widgetSetting.showHeader) == 'yes') {
                    header.classList.add('widget-header');
                    header.style.backgroundColor = widgetSetting.color;
                    header.innerHTML = `
                            <img src="${userData.profile_pic_url}" class="widget-header__avatar">
                            <span class="widget-header__username">${userData.full_name}</span>
                            <span class="widget-header__logo"><svg viewBox="0 0 24 24" width="24" height="24"><path d="M17.1,1H6.9C3.7,1,1,3.7,1,6.9v10.1C1,20.3,3.7,23,6.9,23h10.1c3.3,0,5.9-2.7,5.9-5.9V6.9C23,3.7,20.3,1,17.1,1zM21.5,17.1c0,2.4-2,4.4-4.4,4.4H6.9c-2.4,0-4.4-2-4.4-4.4V6.9c0-2.4,2-4.4,4.4-4.4h10.3c2.4,0,4.4,2,4.4,4.4V17.1z"></path><path d="M16.9,11.2c-0.2-1.1-0.6-2-1.4-2.8c-0.8-0.8-1.7-1.2-2.8-1.4c-0.5-0.1-1-0.1-1.4,0C10,7.3,8.9,8,8.1,9S7,11.4,7.2,12.7C7.4,14,8,15.1,9.1,15.9c0.9,0.6,1.9,1,2.9,1c0.2,0,0.5,0,0.7-0.1c1.3-0.2,2.5-0.9,3.2-1.9C16.8,13.8,17.1,12.5,16.9,11.2zM12.6,15.4c-0.9,0.1-1.8-0.1-2.6-0.6c-0.7-0.6-1.2-1.4-1.4-2.3c-0.1-0.9,0.1-1.8,0.6-2.6c0.6-0.7,1.4-1.2,2.3-1.4c0.2,0,0.3,0,0.5,0s0.3,0,0.5,0c1.5,0.2,2.7,1.4,2.9,2.9C15.8,13.3,14.5,15.1,12.6,15.4z"></path><path d="M18.4,5.6c-0.2-0.2-0.4-0.3-0.6-0.3s-0.5,0.1-0.6,0.3c-0.2,0.2-0.3,0.4-0.3,0.6s0.1,0.5,0.3,0.6c0.2,0.2,0.4,0.3,0.6,0.3s0.5-0.1,0.6-0.3c0.2-0.2,0.3-0.4,0.3-0.6C18.7,5.9,18.6,5.7,18.4,5.6z"></path></svg></span>
                        `;
                    container.appendChild(header);

                    statsPanel.classList.add("widget-panel");
                    statsPanel.innerHTML =
                        `<p class=widget-panel__stats>${nFormat(userData.edge_owner_to_timeline_media.count)}<br /> <span>posts</span>
                         <p class=widget-panel__stats>${nFormat(userData.edge_followed_by.count)}<br /> <span>followers</span>
                         <p class=widget-panel__stats>${nFormat(userData.edge_follow.count)}<br /> <span>following</span>`;
                    container.appendChild(statsPanel);
                } else if ((widgetSetting.showHeader) == 'no') {
                    container.style.border = 'none';
                    container.style.boxShadow = 'none';
                }

                gallery.classList.add('widget-gallery');
                container.appendChild(gallery);
                let edges = userData.edge_owner_to_timeline_media.edges.splice(0, 12);
                console.log(edges);
                let photos = edges.map(({
                    node
                }) => {
                    return {
                        url: `https://www.instagram.com/p/${node.shortcode}/`,
                        thumbnailUrl: node.thumbnail_src,
                        displayUrl: node.display_url,
                        caption: node.edge_media_to_caption.edges[0],
                        likesCount: node.edge_liked_by.count,
                        commentCount: node.edge_media_to_comment.count
                    }
                });
                return photos;
            })
            .then(photos => {
                photos.forEach(photo => {
                    if (photo.caption) {
                        photo.caption = photo.caption.node.text;
                    } else {
                        photo.caption = " ";
                    }
                    if (photo.likesCount > 0) {
                        photo.likesCount = '<span>&#x2764;</span> ' + nFormat(photo.likesCount)
                    } else {
                        photo.likesCount = " ";
                    }
                    if (photo.commentCount > 0) {
                        photo.commentCount = '<span>&#x1F4AC;</span> ' + nFormat(photo.commentCount)
                    } else {
                        photo.commentCount = " ";
                    }

                    let picture = document.createElement('p');
                    picture.innerHTML = `
                    <a href="${photo.url}" target="_blank" rel="noopener noreferrer" class="widget-gallery__link">
                        <img src="${photo.thumbnailUrl}" alt="${photo.caption}" class="widget-gallery__image">
                        <div class="widget-gallery__caption">
                            <p>${photo.caption}</br>
                               ${photo.likesCount} ${photo.commentCount}</br>
                            </p>
                        </div>
                    </a>
                    `
                    gallery.appendChild(picture);
                });

                footer.classList.add('widget-footer');
                footer.innerHTML = `<a href="https://instagram.com/${widgetSetting.id}" class="widget-button" target="_blank" style="${widgetSetting.color}">View on Instagram</a> `;
                container.appendChild(footer);
            });
    } catch (e) {
        throw ('Unable to retrieve photos. Reason: ' + e);
    }
})();