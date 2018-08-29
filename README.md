This example shows how to implement [Algolia Click Analytics](https://www.algolia.com/doc/tutorials/getting-started/how-to-implement-analytics/?language=rails#adding-the-queryid-and-hitposition-in-every-hit-object) with `react-instantsearch`.

## Start the example

```sh
npm install
npm run start
```

Read more about `react-instantsearch` [in our documentation](https://community.algolia.com/react-instantsearch/).

## Usage

The idea is we wrap the search results component in the `src/withClickAnalytics.js` higher order component(HOC).

This HOC:

- adds the analytics library to the document
- passes the queryID to each hit event
- adds event listener to all search results that posts to analytics API on click

There is an example of how to compose the search using the HOC in `src/App.js`
