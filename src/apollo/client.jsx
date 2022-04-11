import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloLink } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import gql from "graphql-tag";

const GITHUB_TOKEN = "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";

const apolloClient = new ApolloClient({
  link: ApolloLink.from([
    new ApolloLink((operation, forward) => {
      operation.setContext({
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`
        }
      });

      return forward(operation);
    }),
    new HttpLink({ uri: "https://api.github.com/graphql" })
  ]),
  cache: new InMemoryCache({ resultCaching: false })
});

export const getProjects = async (variables) => {
  const request = gql`
    query search(
      $first: Int
      $last: Int
      $before: String
      $after: String
      $query: String!
    ) {
      search(
        query: $query
        first: $first
        last: $last
        before: $before
        after: $after
        type: REPOSITORY
      ) {
        repositoryCount
        pageInfo {
          endCursor
          hasNextPage
          hasPreviousPage
          startCursor
        }
        edges {
          cursor
          node {
            ... on Repository {
              id
              name
              url
              stargazers {
                totalCount
              }
              viewerHasStarred
            }
          }
        }
      }
    }
  `;

  const response = await apolloClient.query({
    query: request,
    variables: variables
  });

  return response.data.search;
};

export const addStar = async (id) => {
  console.log("addStar");
  const variables = {
    input: {
      starrableId: id
    }
  };

  const request = gql`
    mutation addStar($input: AddStarInput!) {
      addStar(input: $input) {
        starrable {
          id
          viewerHasStarred
        }
      }
    }
  `;

  const response = await apolloClient.mutate({
    mutation: request,
    variables: variables
  });

  return response.data.addStar;
};

export const removeStar = async (id) => {
  console.log("removeStar");
  const variables = {
    input: {
      starrableId: id
    }
  };

  const request = gql`
    mutation removeStar($input: RemoveStarInput!) {
      removeStar(input: $input) {
        starrable {
          id
          viewerHasStarred
        }
      }
    }
  `;

  const response = await apolloClient.mutate({
    mutation: request,
    variables: variables
  });

  return response.data.removeStar;
};
