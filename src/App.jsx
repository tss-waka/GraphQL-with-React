import React, { useState } from "react";
import { getProjects, addStar, removeStar } from "./apollo/client";

export default function App() {
  const [searchVariables, setSearchVariables] = useState({
    query: "",
    first: null,
    last: null,
    before: null,
    after: null
  });
  const [searchText, setSearchText] = useState("");
  const [repositoryCount, setRepositoryCount] = useState(0);
  const [edges, setEdges] = useState([]);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  const changeSearchText = (event) => setSearchText(event.target.value);

  const search = async (variables) => {
    const response = await getProjects(variables);
    setRepositoryCount(response.repositoryCount);
    setEdges([...response.edges]);
    variables.before = response.pageInfo.beforeCursor;
    variables.after = response.pageInfo.endCursor;
    variables.first = null;
    variables.last = null;
    setSearchVariables(variables);
    setHasNext(response.pageInfo.hasNextPage);
    setHasPrev(response.pageInfo.hasPreviousPage);
  };

  const clickSearch = async () => {
    if (!searchText) return;
    const data = {
      ...searchVariables,
      query: searchText,
      first: 5,
      last: null,
      before: null,
      after: null
    };
    await search(data);
  };

  const clickNext = async () => {
    const data = {
      ...searchVariables,
      first: 5,
      before: null
    };
    await search(data);
  };

  const clickPrev = async () => {
    const data = {
      ...searchVariables,
      last: 5,
      after: null
    };
    await search(data);
  };

  const setStarStatus = (response) => {
    const edge_list = [...edges];
    edge_list.map((edge) => {
      if (edge.node.id === response.starrable.id) {
        if (
          edge.node.viewerHasStarred !== response.starrable.viewerHasStarred
        ) {
          edge.node.stargazers.totalCount += response.starrable.viewerHasStarred
            ? 1
            : -1;
        }
        edge.node.viewerHasStarred = response.starrable.viewerHasStarred;
      }
      return edge;
    });
    setEdges(edge_list);
  };

  const clickAddStar = async (id) => {
    const response = await addStar(id);
    setStarStatus(response);
  };

  const clickRemoveStar = async (id) => {
    const response = await removeStar(id);
    setStarStatus(response);
  };

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
        <div>
          "{searchVariables.query}" is Searched. Found {repositoryCount}{" "}
          {repositoryCount === 1 ? "Repository" : "Repositories"}
        </div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Star</th>
            </tr>
          </thead>
          <tbody>
            {edges.map((edge) => {
              return (
                <tr key={edge.node.id}>
                  <td>
                    <a href={edge.node.url} style={{ margin: "0px 4px" }}>
                      {edge.node.name}
                    </a>
                  </td>
                  <td>
                    <button
                      onClick={() => {
                        return edge.node.viewerHasStarred
                          ? clickRemoveStar(edge.node.id)
                          : clickAddStar(edge.node.id);
                      }}
                    >
                      {edge.node.stargazers.totalCount} Stars |{" "}
                      {edge.node.viewerHasStarred ? "★" : "-"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div
        style={{ padding: "8px", margin: "4px", backgroundColor: "#ffffdd" }}
      >
        {hasPrev && <button onClick={clickPrev}>Prev</button>}
        {hasNext && (
          <button onClick={clickNext} style={{ margin: "0px 4px" }}>
            Next
          </button>
        )}
      </div>
    </div>
  );
}
