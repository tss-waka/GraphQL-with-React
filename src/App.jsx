import React, { useState } from "react";

export default function App() {
  const [searchVariables, setSearchVariables] = useState({
    query: "",
    first: 5,
    last: null,
    before: null,
    after: null
  });
  const [searchText, setSearchText] = useState("");
  const changeSearchText = (event) => setSearchText(event.target.value);
  const clickSearch = () =>
    setSearchVariables({
      ...searchVariables,
      query: searchText
    });

  return (
    <div>
      <div
        style={{ padding: "8px", margin: "4px", backgroundColor: "#ddffff" }}
      >
        <input
          value={searchText}
          onChange={changeSearchText}
          style={{ marginRight: "4px" }}
        />
        <button onClick={clickSearch}>検索</button>
      </div>
      <div
        style={{ padding: "8px", margin: "4px", backgroundColor: "#ffddff" }}
      >
        <ul></ul>
      </div>
      <div
        style={{ padding: "8px", margin: "4px", backgroundColor: "#ffffdd" }}
      >
        <button>Prev</button>
        <button>Next</button>
      </div>
    </div>
  );
}
