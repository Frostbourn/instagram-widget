# InstagramFeed - Instagram profiles photos & stats
Fetch last 12 Instagram photos & profile stats.
## How to use:
1. Create RapidAPI access token at here: [https://rapidapi.com](https://rapidapi.com/restyler/api/instagram40/endpoints)
2. Add newly created key into ```instagram-widget.js``` file.
3. Add required files in your site header as like as bellow:

```html
<link href="/src/css/instagram-widget.css" rel="stylesheet">
<script src="/src/js/instagram-widget.js"></script>
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