# nano-cms

programmer's idea of what a CMS should be

## how it works

nano-cms is a web application that generates JSON files that you then host on a web server and construct on the client or build in advance using SSG.

this generated JSON file includes:
- the version of nano-cms used to build the article
- metadata about the article, such as its title, description, tags, authors, and publish date
- content of the article

example for an **article** by **Sakamoto** titled **Nichijou**:
```json
{
{
  "nano-cms": {
    "version": 3
  },
  "metadata": {
    "title": "Nichijou",
    "description": "Surreal humor manga",
    "authors": "Sakamoto",
    "tags": [
      "manga",
      "comedy",
      "nichijou"
    ],
    "date": "2026-01-14",
    "type": "article"
  },
  "content": [
    "\n        Nichijou is a surreal comedy manga series by Arawi Keiichi that follows the story of the residents of Tokisadame.",
    {
      "type": "richtext",
      "data": "# Examples"
    },
    {
      "type": "img",
      "data": {
        "src": "http://localhost:8000/img/placeholder.png",
        "alt": "emu otori from project sekai cheering with the text \"Placeholder\" above her"
      }
    }
  ]
}
}
```

the `metadata.type` element is important because it describes to a client how content should be rendered. nano-cms includes a reference implementation for article types right now, but may include more in the future.

every element in the content dict is called a "widget". these widgets are rendered by the client into content.

plaintext widgets are simply represented as string objects.

other widgets are represented as objects mostly in the format `{type: string, data: object | string}`.

the type describes what kind of widget it is and how to interpret the widget's data. for example, markdown widgets simply include the markdown text in the data. widgets that contain more data like an image widget with a link to an image and alt text will represent their additonal data as an object.

these widgets are relatively simple to build into a cohesive and readable article, provided you either do not use markdown or use a library for it.

## who is this for?

me. Lmfao
i host my website statically on github pages and i avoid client js unless absolutely neccesary, and astro's MDX extension made me spend more time looking up how to use it rather than writing blog posts.

so i decided to replace it with this format that appeared in a daydream and then render all the pages using astro's frontmatter. Winning

## demo

the builder can be demoed here:
[https://thememesniper.github.io/nano-cms/builder/](https://thememesniper.github.io/nano-cms/builder/)
