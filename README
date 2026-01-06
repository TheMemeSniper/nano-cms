# nano-cms

Programmer's idea of what a CMS should be

## How it works

nano-cms is a web application that generates JSON files that you then host on a web server and construct on the client or build in advance using SSR.

this generated JSON file includes:
- title and description of the content
- type of the content (important!)
- authors, tags, yadda yadda metadata
- the content as an array assembled from top to bottom

example for an **article** by **Sakamoto** titled **Nichijou**:
```json
{
    "nano-cms": {
        "builder-version": "v0.0.1"
    },
    "metadata": {
        "type": "article",
        "authors": ["Sakamoto"],
        "tags": ["nichijou", "example"],
        "title": "Nichijou",
        "description": "Surreal comedy by Keiichi Arawi"
    },
    "content": [
        "Nichijou is a surreal comedy manga created by Keiichi Arawi.",
        {"type": "image", "data": {"src": "/blog/nichijou.png"}}
    ]
}
```

the `metadata.type` element is important because it describes to a client how content should be rendered. nano-cms includes a reference implementation for article types right now, but may include more in the future.

every element in the content dict is called a "widget". these widgets are rendered by the client into content.

you'll notice on line 14 of this JSON an object that describes an image. this is a widget that describes special content containers to clients, like embedded images or videos.
