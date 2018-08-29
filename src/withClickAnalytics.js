import React, { Component } from "react";
import { connectStateResults } from "react-instantsearch/connectors";

const withClickAnalytics = SearchHitsComponent =>
  class extends Component {
    constructor(props) {
      super(props);
      this.onClick = this.onClick.bind(this);
    }

    componentDidMount() {
      // Add click analytics library to document
      // https://www.algolia.com/doc/tutorials/getting-started/how-to-implement-analytics/?language=rails#adding-the-queryid-and-hitposition-in-every-hit-object
      const script = document.createElement("script");
      script.innerHTML =
        '!function(e,a,t,n,s,i,c){e.AlgoliaAnalyticsObject=s,e.aa=e.aa||function(){(e.aa.queue=e.aa.queue||[]).push(arguments)},i=a.createElement(t),c=a.getElementsByTagName(t)[0],i.async=1,i.src="https://cdn.jsdelivr.net/npm/search-insights@0.0.14",c.parentNode.insertBefore(i,c)}(window,document,"script",0,"aa")';
      // $FlowFixMe
      document.body.appendChild(script);

      // Initialize the click analytics library
      window.aa("init", {
        applicationID: this.props.appId,
        apiKey: this.props.apiKey
      });

      // add listener for any clicks in the DOM
      window.document.addEventListener("click", this.onClick);
    }

    componentWillUnmount() {
      // remove the click listener from the DOM
      window.document.removeEventListener("click", this.onClick);
    }

    // Find the closest element in the event chain with data-algolia-queryid
    findLinkElementAncestor(element) {
      if (element.matches("[data-algolia-queryid]")) return element;
      if (!element.parentElement) return null;
      return this.findLinkElementAncestor(element.parentElement);
    }

    onClick = event => {
      // get the element in the event chain with the algolia data attributes
      const clickedElement = this.findLinkElementAncestor(event.target);

      // return if no element is found
      if (!clickedElement) return;

      const objectID = clickedElement.getAttribute("data-algolia-objectid");
      const position = parseInt(
        clickedElement.getAttribute("data-algolia-position"),
        10
      );
      const queryID = clickedElement.getAttribute("data-algolia-queryid");

      // post the data to algolia
      window.aa("click", { objectID, position, queryID });
    };

    render() {
      const SearchHitsWithAnalytics = connectStateResults(
        ({ searchResults }) => (
          <SearchHitsComponent
            queryID={searchResults && searchResults.queryID}
            {...this.props}
          />
        )
      );
      return <SearchHitsWithAnalytics />;
    }
  };

export default withClickAnalytics;
