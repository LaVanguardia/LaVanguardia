import React from 'react';
import './MemoryGame.css';
import Table from './Table';
import Header from './Header';
import construirBaraja from './utils/construirBaraja';

const initialState = () => {
  const deck = construirBaraja();
  return {
    deck,
    selectedCouple: [],
    itsComparing: false,
    tryes: 0,
    winner: false
  };
}

class MemoryGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialState()

  } 
  
  render() {
    return(
      <div className="memory-body">
        <Header
        tryes={this.state.tryes}
        resetGame={() => this.resetGame()}
        />
        <Table 
        deck={this.state.deck}
        selectedCouple={this.state.selectedCouple}
        selectCard={(card) => this.selectCard(card)}
         /> 
         {this.state.winner 
         ? <div><h1>{` Resultado: ${ Math.round(10 / this.state.tryes * 100) }/ 100 puntos !`}</h1></div>
         : null
         }
         
      </div>
    )
  }
//method to select card 
  selectCard(card){
    if (
      this.state.itsComparing ||
      this.state.selectedCouple.indexOf(card) > -1 ||
      card.wasGuessed
    ) {
      return;
    }

    const selectedCouple = [...this.state.selectedCouple, card];
    this.setState({
      selectedCouple
    });
    if (selectedCouple.length === 2) {
      this.compareCouple(selectedCouple)
    }
  }

  //method to compare the couple selected 
  compareCouple(selectedCouple) {
    this.setState({itsComparing: true});
    setTimeout(() =>{
      const [firstCard, secondCard] = selectedCouple;
      let deck = this.state.deck;

      if(firstCard.icon === secondCard.icon) {
        deck = deck.map((card) => {
          if(card.icon !== firstCard.icon) {
            return card;
          }

          return {...card, wasGuessed: true}
        })
      }
      this.verifyIfWinner(deck);
      this.setState({
        selectedCouple :[],
        deck,
        itsComparing: false,
        tryes: this.state.tryes + 1 
      })
    }, 1000)
  }

//method to verify if there is a winner 
verifyIfWinner(deck) {
  if (deck.filter((card) => !card.wasGuessed).length === 0) {
    this.setState({
      winner: true
    });
    }
}

//method to reset the game
resetGame() {
  this.setState( 
    initialState()
  );
}

}

export default MemoryGame;
