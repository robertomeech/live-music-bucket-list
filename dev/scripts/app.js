import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
  
  
  class App extends React.Component {
    constructor() {
      super();
      this.state = {
        searchInput: '',
        APIKEY: 'hHSjLHKTmsfByvxU',
        artistResults: [],
        eventResults: [],
        artistImage: [],
        showArtists: false,
        showEvents: false,
        displayResults: false
      };


      this.handleSearchInputChange = this.handleSearchInputChange.bind(this);
      this.getArtist = this.getArtist.bind(this);
      this.getEvents = this.getEvents.bind(this);
      this.getEventInfo = this.getEventInfo.bind(this);
    }



    // Handle Search Input Function
    handleSearchInputChange(e) {
      console.log(e.target.value);
      this.setState({
        searchInput: e.target.value
      })
      
    }



    //Get Artist Function
    getArtist(e) {
      e.preventDefault();
      console.log(this.state.searchInput);

      axios.get('http://api.songkick.com/api/3.0/search/artists.json',{
        params: {
          apikey: this.state.APIKEY,
          query: this.state.searchInput
        }

      })
      .then((response) => {
        this.setState({
          artistResults: response.data.resultsPage.results.artist,
          showArtists: true,
          showEvents: false,
          displayResults: true
        });
        console.log(this.state.artistResults);  
      });
    }



    // Get Events Function
    getEvents(artistId) {
      axios.get(`http://api.songkick.com/api/3.0/artists/${artistId}/calendar.json`, {
        params: {
          apikey: this.state.APIKEY
        }
      })
    .then((response) => {
      this.setState({
        eventResults: response.data.resultsPage.results.event,
        showArtists: false,
        showEvents: true,
        searchInput:'',
      });
      console.log(this.state.eventResults);
    })
    }
    

    // Get Events Function
    getEventInfo(eventResults) {
      console.log(eventResults);
      this.setState({
        eventVenue: eventResults.venue.displayName,
        eventType: eventResults.start.type,
        eventLink: eventResults.start.uri,
        showEvents: true
    });
    }




    // RENDER STARTS
    render() {
      return (
        <div>

          {
            this.state.displayResults === false ? (

        <section className="introPage">
          <div className="titleAndSearch">
            <h1>Live Music Bucket List</h1>

            <form onSubmit={this.getArtist}>
              <input className="searchInput" placeholder="Choose Artist"  type="text" value={this.state.searchInput} onChange={this.handleSearchInputChange}/>

              <input className="submitButton" type="submit" value="Search" />
            </form>
          </div>
        </section>

            ) : null}

          {/* CONDITIONAL RENDER */}
          {
            this.state.displayResults === true ? (

          <div className-="resultsPage">
          { this.state.showEvents &&
            <ul>
              {
                this.state.eventResults.map(event => {
                  return (
                    
                    <li key={event.id} onClick={() => this.getEventInfo(event)}>{event.displayName}
                      {/* {this.state.showDetails ? } */}
                      <p>{event.type}</p>
                      <p>{event.eventVenue}</p>
                      <p>{event.location.city}</p>
                      <a href={event.uri}>Buy Tickets</a>
                    </li>

                    )
                    })
              }
            </ul>
          }
          { this.state.showArtists &&
            <ul>
              {
                this.state.artistResults.map(artist => {
                  return (
                    <li key={artist.id} onClick={() => this.getEvents(artist.id)}>{artist.displayName}</li>
                  )
                })
              }
            </ul>
          }
          </div>

           )  : null }

          </div>
      )
    }
  }
// RENDER ENDS

ReactDOM.render(<App />, document.getElementById('app'));
