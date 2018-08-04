import React, { Component } from "react";
import { Table, Segment, Header, Divider, Input } from "semantic-ui-react";
import NumericLabel from "react-pretty-numbers";
import { filterList } from "./helpers";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

class Markets extends Component {
  state = { currentSearch: "", status: [], sortedBy: null, direction: 'ascending' };
  async componentDidMount() {
    const url = "https://api.ddex.io/v2/markets/status";
    fetch(url)
      .then(response => response.json())
      .then(data => {
        this.setState({ ...data.data, filteredList: data });
      });
  }
  handleOnClick = pair => {
    this.props.history.push(`/trade/${pair}`);
  };
  handleInputChange = (e, { value }) => {
    this.setState({ currentSearch: value });
  };
  compareAscending = key => {
    return function (a, b) {
      if (a[key] < b[key]) return -1;
      if (a[key] > b[key]) return 1;
      return 0;
    };
  };
  compareDescending = key => {
    return function (a, b) {
      if (a[key] > b[key]) return -1;
      if (a[key] < b[key]) return 1;
      return 0;
    };
  };

  sortBy = key => {
    this.setState({ sortedBy: key });
    let arrayCopy = [...this.state.status];
    if (key === this.state.sortedBy && this.state.direction == 'ascending') {
      arrayCopy.sort(this.compareDescending(key));
      this.setState({ direction: 'descending' })
    } else {
      arrayCopy.sort(this.compareAscending(key));
      this.setState({ direction: 'ascending' })
    }
    this.setState({ status: arrayCopy });
  };

  renderMarkets() {
    const updatedList = filterList(this.state.status, this.state.currentSearch);
    let markets;
    if (updatedList[0]) {
      markets = updatedList.map(market => {
        return (
          <Table.Row onClick={() => this.handleOnClick(market.pair)}>
            <Table.Cell>{market.pair}</Table.Cell>
            <Table.Cell textAlign="right">{market.lastPrice || "--"}</Table.Cell>
            <Table.Cell textAlign="right">
              <NumericLabel params={{ percentage: true }}>
                {market.price24h}
              </NumericLabel>
            </Table.Cell>
            <Table.Cell textAlign="right">
              <NumericLabel params={{ precision: "2" }}>
                {market.baseTokenVolume24h}
              </NumericLabel>
            </Table.Cell>
          </Table.Row>
        );
      });
    } else {
      {
        return (
          <Table.Row textAlign="center">
            <div style={{ position: "fixed", display: "inline-block", width: "280px" }}>
              No results for {this.state.currentSearch}
            </div>
          </Table.Row>
        );
      }
    }

    return markets;
  }

  render() {
    const { direction, sortedBy } = this.state;
    return (
      <Segment inverted style={{ minHeight: "190px", maxWidth: "330px" }}>
        <div className="box">
          <Header
            style={{
              display: "inline-block",
              lineHeight: "30px",
              margin: 0
            }}
            as="h4"
          >
            Markets
          <span>
              <Input
                onChange={this.handleInputChange}
                style={{
                  display: "inline-block",
                  position: "absolute",
                  right: 0
                }}
                inverted
                size="mini"
                placeholder="Search"
                icon="search"
              />
            </span>
          </Header>
        </div>
        <Divider />
        <Segment
          inverted
          style={{
            overflowY: "scroll",
            overflowX: "hidden",
            maxHeight: 135,
            padding: "0px"
          }}
        >
          <div className="box">
            <Table unstackable sortable inverted selectable >
              <Table.Header  >
                <Table.Row>
                  <Table.HeaderCell
                    onClick={() => this.sortBy("pair")}
                    textAlign="left"
                    sorted={sortedBy == 'pair' ? direction : null}
                  >
                    Pair
                </Table.HeaderCell>
                  <Table.HeaderCell
                    onClick={() => this.sortBy("lastPrice")}
                    textAlign="right"
                    sorted={sortedBy == 'lastPrice' ? direction : null}
                  >
                    Last Price
                </Table.HeaderCell>
                  <Table.HeaderCell
                    onClick={() => this.sortBy("price24h")}
                    textAlign="right"
                    sorted={sortedBy == 'price24h' ? direction : null}
                  >
                    24H Price
                </Table.HeaderCell>
                  <Table.HeaderCell
                    onClick={() => this.sortBy("baseTokenVolume24h")}
                    textAlign="right"
                    sorted={sortedBy == 'baseTokenVolume24h' ? direction : null}
                  >
                    24H Vol (Eth)
                </Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>{this.renderMarkets()}</Table.Body>
            </Table>
          </div>
        </Segment>
      </Segment>
    );
  }
}

export default withRouter(Markets);
