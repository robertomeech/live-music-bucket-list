import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

// import firebase from 'firebase';

// FIREBASE
// const config = {
//   apiKey: "AIzaSyA2X46iQjmFvSKHaHpk9A2Vdvwm-zcJBvU",
//   authDomain: "concertwishlist-131d9.firebaseapp.com",
//   databaseURL: "https://concertwishlist-131d9.firebaseio.com",
//   projectId: "concertwishlist-131d9",
//   storageBucket: "",
//   messagingSenderId: "210949514811"
// };
// firebase.initializeApp(config);


// SONGKICK API
// axios.get('', {
//   params: {
//     queryParam: 'value'
//   }
// })
//   .then(function (res) {
//     console.log(res);
//   });


  
  
  class App extends React.Component {
    constructor() {
      super();
      this.state = {
        searchInput: '',
        APIKEY: 'hHSjLHKTmsfByvxU',
        artistResults: [],
        eventResults: [],
        showArtists: false,
        showEvents: false
        

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
          showEvents: false
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
        searchInput:''
      });
      console.log(this.state.eventResults);
      
    })
    }


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
          <form onSubmit={this.getArtist}>
            <input type="text" value={this.state.searchInput} onChange={this.handleSearchInputChange}/>
            <input type="submit" />
          </form>
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
      )
    }
}
// RENDER ENDS

ReactDOM.render(<App />, document.getElementById('app'));
