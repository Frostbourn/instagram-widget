## Instagram widget for pages

#### Version: 1.0.0

[Demo](https://jakubskowronski.com/instagram-widget)


### How to use:
It requires [axios](https://github.com/axios/axios#installing) to work! 

Add Instagram widget files just in your site header as like as bellow:

```html
<link href="/src/instagram-widget.min.css" rel="stylesheet">
<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
<script src="/src/instagram-widget.min.js"></script>
```

Now its time to add Instagram Widget in your site.

```html
<div data-username="instagram"
     data-header="yes"
     data-width="80vw"
     data-columns="4"
     data-color="#3897f0">
</div>
```