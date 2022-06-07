import { fireEvent, render } from "@testing-library/react";
import { MemoryRouter, Route } from "react-router";
import { GitHubApiProvider } from "../../context/GitHubApiProvider";
import { REPO_REGEX } from "../../lib/constants";
import SearchAppBarItem from "./SearchAppBarItem";

describe("SearchAppBarItem", () => {
  beforeEach(async () => {
    fetch.resetMocks();
    localStorage.clear();
  });

  it("displays song1 and song2 in the options", async () => {
    fetch.mockResponse(
      JSON.stringify({ tree: [{ path: "song1.md" }, { path: "song2.md" }] })
    );

    const { findAllByText, getByLabelText, queryByText } = render(
      <GitHubApiProvider>
        <MemoryRouter initialEntries={["/repos/o/r/viewer/b"]}>
          <Route
            path={`${REPO_REGEX}/:mode/:branch/:path*`}
            component={SearchAppBarItem}
          />
        </MemoryRouter>
      </GitHubApiProvider>
    );

    await findAllByText("Jump to…");
    fireEvent.change(getByLabelText("Jump to…"), {
      target: { value: "song" },
    });

    expect(queryByText("song1.md")).toBeInTheDocument();
    expect(queryByText("song2.md")).toBeInTheDocument();
  });
});