## Instagram widget for pages

#### Version: 1.0.0

[Demo](https://jakubskowronski.com/instagram-widget)

You can fetch your last 12 Instagram photos without the usage of Instagram API, which requires a user to authenticate.

### How to use:
It requires [axios](https://github.com/axios/axios#installing) to work! 

Add required files in your site header as like as bellow:

```html
<link href="/src/instagram-widget.min.css" rel="stylesheet">
<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
<script src="/src/instagram-widget.min.js"></script>
```

Embed the code below wherever you want the widget to be displayed:

```html
<div data-username="instagram"
     data-header="yes"
     data-width="80vw"
     data-columns="4"
     data-color="#3897f0">
</div>
```