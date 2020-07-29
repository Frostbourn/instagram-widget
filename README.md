# InstagramFeed - Instagram profiles photos without API
You can fetch your last 12 Instagram photos without the usage of Instagram API, which requires a user to authenticate.

[Demo](https://jakubskowronski.com/instagram-widget)

## Requirements:
- [Axios](https://github.com/axios/axios#installing)

## How to use:
Add required files in your site header as like as bellow:

```html
<link href="/src/css/instagram-widget.min.css" rel="stylesheet">
<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
<script src="/src/js/instagram-widget.min.js"></script>
```

Embed the code below wherever you want the widget to be displayed:

```html
<div class="instagram-widget"
     data-username="instagram"
     data-header="yes"
     data-width="80vw"
     data-color="#3897f0">
</div>
```