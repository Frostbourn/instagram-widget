(async () => {
    try {
        const container = document.querySelector('.instagram-widget');

        const widgetSettings = {
            id: container.dataset.user,
            color: container.dataset.color,
            columns: container.dataset.columns,
            showHeader: container.dataset.header,
            width: container.dataset.width
        };

        const widgetElements = {
            header: document.createElement('div'),
            avatar: document.createElement('img'),
            username: document.createElement('span'),
            logo: document.createElement('span'),
            panel: document.createElement('div'),
            gallery: document.createElement('div'),
            button: document.createElement('a')
        };
        
        widgetElements.gallery.style.columns = widgetSettings.columns;
        widgetElements.header.style.backgroundColor = widgetSettings.color;
        widgetElements.button.style.backgroundColor = widgetSettings.color;
        container.style.maxWidth = widgetSettings.width;

        const nFormat = (num) => {
            if (num >= 1000000) {
                return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'm';
            }
            if (num >= 1000) {
                return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
            }
            return num;
        };

        const url = await axios.get(`https://www.instagram.com/${widgetSettings.id}`)
            .then(response => {
                let instagramRegExp = new RegExp(/<script type="text\/javascript">window\._sharedData = (.*);<\/script>/);
                let values = response.data.match(instagramRegExp)[1];
                let userData = JSON.parse(values);
                return userData;;
            })
            .then(userData => {
                userData = userData.entry_data.ProfilePage[0].graphql.user;

                if ((widgetSettings.showHeader) == 'yes') {
                    widgetElements.header.classList.add('widget-header');
                    container.appendChild(widgetElements.header);
                    widgetElements.avatar.setAttribute('src', userData.profile_pic_url);
                    widgetElements.avatar.setAttribute('class', 'widget-header__avatar');
                    widgetElements.header.appendChild(widgetElements.avatar);
                    widgetElements.username.setAttribute('class', 'widget-header__username');
                    widgetElements.username.textContent += userData.full_name;
                    widgetElements.header.appendChild(widgetElements.username);
                    widgetElements.logo.classList.add("widget-header__logo")
                    widgetElements.logo.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24"><path d="M17.1,1H6.9C3.7,1,1,3.7,1,6.9v10.1C1,20.3,3.7,23,6.9,23h10.1c3.3,0,5.9-2.7,5.9-5.9V6.9C23,3.7,20.3,1,17.1,1zM21.5,17.1c0,2.4-2,4.4-4.4,4.4H6.9c-2.4,0-4.4-2-4.4-4.4V6.9c0-2.4,2-4.4,4.4-4.4h10.3c2.4,0,4.4,2,4.4,4.4V17.1z"></path><path d="M16.9,11.2c-0.2-1.1-0.6-2-1.4-2.8c-0.8-0.8-1.7-1.2-2.8-1.4c-0.5-0.1-1-0.1-1.4,0C10,7.3,8.9,8,8.1,9S7,11.4,7.2,12.7C7.4,14,8,15.1,9.1,15.9c0.9,0.6,1.9,1,2.9,1c0.2,0,0.5,0,0.7-0.1c1.3-0.2,2.5-0.9,3.2-1.9C16.8,13.8,17.1,12.5,16.9,11.2zM12.6,15.4c-0.9,0.1-1.8-0.1-2.6-0.6c-0.7-0.6-1.2-1.4-1.4-2.3c-0.1-0.9,0.1-1.8,0.6-2.6c0.6-0.7,1.4-1.2,2.3-1.4c0.2,0,0.3,0,0.5,0s0.3,0,0.5,0c1.5,0.2,2.7,1.4,2.9,2.9C15.8,13.3,14.5,15.1,12.6,15.4z"></path><path d="M18.4,5.6c-0.2-0.2-0.4-0.3-0.6-0.3s-0.5,0.1-0.6,0.3c-0.2,0.2-0.3,0.4-0.3,0.6s0.1,0.5,0.3,0.6c0.2,0.2,0.4,0.3,0.6,0.3s0.5-0.1,0.6-0.3c0.2-0.2,0.3-0.4,0.3-0.6C18.7,5.9,18.6,5.7,18.4,5.6z"></path></svg>';
                    widgetElements.header.appendChild(widgetElements.logo);
                    widgetElements.panel.classList.add("widget-panel");
                    widgetElements.panel.innerHTML =
                        `<p class=widget-panel__stats>${nFormat(userData.edge_owner_to_timeline_media.count)}<br /> <span>posts</span>
                         <p class=widget-panel__stats>${nFormat(userData.edge_followed_by.count)}<br /> <span>followers</span>
                         <p class=widget-panel__stats>${nFormat(userData.edge_follow.count)}<br /> <span>following</span>`;
                    container.appendChild(widgetElements.panel);
                } else if ((widgetSettings.showHeader) == 'no') {
                    container.style.border = 'none';
                    container.style.boxShadow = 'none';
                }

                widgetElements.gallery.classList.add('widget-gallery');
                container.appendChild(widgetElements.gallery);
                let edges = userData.edge_owner_to_timeline_media.edges.splice(0, 12);
                
                let photos = edges.map(({
                    node
                }) => {
                    return {
                        url: `https://www.instagram.com/p/${node.shortcode}/`,
                        thumbnailUrl: node.thumbnail_src,
                        displayUrl: node.display_url,
                        caption: node.edge_media_to_caption.edges[0].node.text,
                        likesCount: node.edge_liked_by.count
                    }
                });

                widgetElements.button.setAttribute('href', `https://instagram.com/${userData.username}`);
                widgetElements.button.setAttribute('class', 'widget-button');
                widgetElements.button.setAttribute('target', '_blank');
                widgetElements.button.textContent += 'View on Instagram';
                container.appendChild(widgetElements.button);
                
                return photos;
            })
            .then(photos => {
                photos.forEach(photo => {
                    let a = document.createElement('a');
                    let img = document.createElement('img');
                    let div = document.createElement('div');
                    let p = document.createElement('p');

                    a.setAttribute('href', photo.url);
                    a.setAttribute('target', '_blank');
                    a.setAttribute('rel', 'noopener noreferrer');
                    a.setAttribute('class', 'widget-gallery__link');

                    img.setAttribute('src', photo.thumbnailUrl);
                    img.setAttribute('alt', photo.caption);
                    img.setAttribute('class', 'widget-gallery__image');

                    div.setAttribute('class', 'widget-gallery__caption');

                    p.innerHTML = photo.caption + '<br/><span>&#x2764;</span> ' + nFormat(photo.likesCount);

                    a.appendChild(img);
                    a.appendChild(div);
                    div.appendChild(p);
                    widgetElements.gallery.appendChild(a);
                });
            });
    } catch (err) {
        throw (err);
    }
})();