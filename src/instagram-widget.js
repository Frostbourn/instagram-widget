(async () => {
    try {
        const container = document.querySelector('#instagram-widget')
        const id = container.dataset.username
        const color = container.dataset.color
        const columns = container.dataset.columns
        const showHeader = container.dataset.header
        const width = container.dataset.width
        container.style.width = width

        const header = document.createElement('div')
        const avatar = document.createElement('img')
        const username = document.createElement('span')
        const logo = document.createElement('span')
        const panel = document.createElement('div')
        const gallery = document.createElement('div')
        const button = document.createElement('a')

        const nFormat = (num) => {
            if (num >= 1000000000) {
                return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'g';
            }
            if (num >= 1000000) {
                return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'm';
            }
            if (num >= 1000) {
                return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
            }
            return num;
        }

        const url = await axios.get('https://www.instagram.com/' + id + '/')
            .then(response => {
                let instagramRegExp = new RegExp(/<script type="text\/javascript">window\._sharedData = (.*);<\/script>/)
                let value = response.data.match(instagramRegExp)[1]
                let userInfo = JSON.parse(value)
                return userInfo
            })
            .then(data => {
                let userData = data.entry_data.ProfilePage[0].graphql.user;

                // Build widget
                if ((showHeader) == 'yes') {

                    // Widget header
                    header.classList.add('instagram-header')
                    container.appendChild(header)

                    // Avatar
                    avatar.setAttribute('src', userData.profile_pic_url)
                    avatar.setAttribute('class', 'avatar')
                    header.appendChild(avatar)

                    //Username 
                    username.setAttribute('class', 'username')
                    username.textContent += userData.full_name
                    header.appendChild(username)

                    //Instagram logo
                    logo.classList.add("logo")
                    logo.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24"><path d="M17.1,1H6.9C3.7,1,1,3.7,1,6.9v10.1C1,20.3,3.7,23,6.9,23h10.1c3.3,0,5.9-2.7,5.9-5.9V6.9C23,3.7,20.3,1,17.1,1z                         M21.5,17.1c0,2.4-2,4.4-4.4,4.4H6.9c-2.4,0-4.4-2-4.4-4.4V6.9c0-2.4,2-4.4,4.4-4.4h10.3c2.4,0,4.4,2,4.4,4.4V17.1z"></path>                         <path d="M16.9,11.2c-0.2-1.1-0.6-2-1.4-2.8c-0.8-0.8-1.7-1.2-2.8-1.4c-0.5-0.1-1-0.1-1.4,0C10,7.3,8.9,8,8.1,9S7,11.4,7.2,12.7                         C7.4,14,8,15.1,9.1,15.9c0.9,0.6,1.9,1,2.9,1c0.2,0,0.5,0,0.7-0.1c1.3-0.2,2.5-0.9,3.2-1.9C16.8,13.8,17.1,12.5,16.9,11.2z                         M12.6,15.4c-0.9,0.1-1.8-0.1-2.6-0.6c-0.7-0.6-1.2-1.4-1.4-2.3c-0.1-0.9,0.1-1.8,0.6-2.6c0.6-0.7,1.4-1.2,2.3-1.4                         c0.2,0,0.3,0,0.5,0s0.3,0,0.5,0c1.5,0.2,2.7,1.4,2.9,2.9C15.8,13.3,14.5,15.1,12.6,15.4z"></path>                         <path d="M18.4,5.6c-0.2-0.2-0.4-0.3-0.6-0.3s-0.5,0.1-0.6,0.3c-0.2,0.2-0.3,0.4-0.3,0.6s0.1,0.5,0.3,0.6c0.2,0.2,0.4,0.3,0.6,0.3                         s0.5-0.1,0.6-0.3c0.2-0.2,0.3-0.4,0.3-0.6C18.7,5.9,18.6,5.7,18.4,5.6z"></path>                     </svg>'
                    header.appendChild(logo)

                    // Widget stats panel
                    panel.classList.add("instagram-panel")
                    panel.innerHTML =
                        '<p class=stats>' + nFormat(userData.edge_owner_to_timeline_media.count) + '<br /> <span>posts</span>' +
                        '<p class=stats>' + nFormat(userData.edge_followed_by.count) + '<br /> <span>followers</span>' +
                        '<p class=stats>' + nFormat(userData.edge_follow.count) + '<br /> <span>following</span>'
                    container.appendChild(panel)
                } else if ((showHeader) == 'no') {
                    container.style.border = 'none'
                    container.style.boxShadow = 'none'
                }
                // Widget Gallery
                gallery.classList.add('instagram-gallery')
                container.appendChild(gallery)

                let edges = userData.edge_owner_to_timeline_media.edges.splice(0, 12)
                let photo = edges.map(({
                    node
                }) => {
                    return {
                        url: `https://www.instagram.com/p/${node.shortcode}/`,
                        thumbnailUrl: node.thumbnail_src,
                        displayUrl: node.display_url,
                        caption: node.edge_media_to_caption.edges[0].node.text
                    }
                })

                photo.forEach(el => {
                    let a = document.createElement('a')
                    let img = document.createElement('img')
                    let div = document.createElement('div')
                    let p = document.createElement('p')

                    a.setAttribute('href', el.url)
                    a.setAttribute('class', 'd-block mb-4 h-100')
                    a.setAttribute('target', '_blank')
                    a.setAttribute('rel', 'noopener noreferrer')

                    img.setAttribute('src', el.thumbnailUrl)
                    img.setAttribute('class', 'img-fluid ')
                    img.setAttribute('alt', el.caption)

                    div.setAttribute('class', 'img-desc')

                    p.textContent += el.caption

                    a.appendChild(img)
                    a.appendChild(div)
                    div.appendChild(p)
                    gallery.appendChild(a)
                })

                //Button
                button.setAttribute('href', 'https://instagram.com/' + userData.username)
                button.setAttribute('class', 'instagram-button')
                button.setAttribute('target', '_blank')
                button.textContent += 'View on Instagram'
                container.appendChild(button)

                //Set columns count 
                gallery.style.columns = columns
                //Set background color
                header.style.backgroundColor = color
                button.style.backgroundColor = color
            });

    } catch {
        alert('[Instagram Widget] - The username does not exist')
    }
})();