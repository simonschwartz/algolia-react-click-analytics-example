import React from "react";
import { InstantSearch, SearchBox, Configure } from "react-instantsearch/dom";
import { connectHits } from "react-instantsearch/connectors";
import withClickAnalytics from "./withClickAnalytics";

const appId = "latency";
const apiKey = "6be0576ff61c053d5f9a3225e2a90f76";

// we use connect hits so we can use .map() index to determine data-algolia-position
const SearchHits = connectHits(({ hits, queryID }) =>
  hits.map((hit, index) => (
    <article key={index}>
      <a
        data-algolia-position={index + 1}
        data-algolia-objectid={hit.objectID}
        data-algolia-queryid={queryID}
        href={hit.url}
      >
        {hit.name}
      </a>
    </article>
  ))
);

// withClickAnalytics Higher Order Component passes QueryID to SearchHits component
// It also adds listeners that post analytics events for click events on search results
const HitsWithAnalytics = withClickAnalytics(SearchHits);

// queryID will only be accessible if we enable clickAnalytics with <Configure> component
// we must also pass appId and apiKey to <HitWithAnalytics> as it is required for posting analytics events
const App = () => (
  <InstantSearch appId={appId} apiKey={apiKey} indexName="bestbuy">
    <Configure clickAnalytics />
    <SearchBox />
    <HitsWithAnalytics appId={appId} apiKey={apiKey} />
  </InstantSearch>
);

export default App;
