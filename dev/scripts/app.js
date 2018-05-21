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
        savedEvents: [],
        showArtists: false,
        showEvents: false,
        displayResults: false,
        displaySaved: false
      };


      this.handleSearchInputChange = this.handleSearchInputChange.bind(this);
      this.getArtist = this.getArtist.bind(this);
      this.getEvents = this.getEvents.bind(this);
      this.saveEvent = this.saveEvent.bind(this);
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
  
    // Save Event Function
    saveEvent(event) {
      console.log(event);
      let saved = this.state.savedEvents;

      saved.push(event);
      this.setState({ 
        savedEvents: saved,
        displaySaved: true
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

          {
            this.state.displayResults === true ? (
              
          <div className-="resultsPage">
            <div className="resultsHeader">
                <form className="secondSearch" onSubmit={this.getArtist}>
                  <input className="searchInput" placeholder="Choose Artist" type="text" value={this.state.searchInput} onChange={this.handleSearchInputChange} />

                  <input className="submitButton" type="submit" value="Search" />
                </form>
            </div>
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
          { this.state.showEvents &&
              
            <div className="eventWrapper">
              <ul>
                {
                  this.state.eventResults.map(event => {
                    return (
                      
                      <li key={event.id}>
                        <h3>{event.displayName}</h3>
                        <p>{event.type}</p>
                        <p>{event.venue.displayName}</p>
                        <p>{event.location.city}</p>
                        <p>{event.start.date}</p>
                        <a href={event.uri}>Buy Tickets</a>
                        <button onClick={() => this.saveEvent(event)}>Add to Wish List</button>
                      </li>
                    )
                  })
                }
            </ul>
                  <div>
                    {this.state.savedEvents.map((myEvent, i) => {
                      return (
                        <div key={i} className="savedEvents">
                          <h3>{event.displayName}</h3>
                        </div>
                      )
                    })}
                  </div>
              <footer>
                <p>Created by Roberto Meech&copy;</p>
              </footer>
           </div>
              }
          </div>

           )  : null }

          </div>
      )
    }
  }
  // RENDER ENDS
  
ReactDOM.render(<App />, document.getElementById('app'));
