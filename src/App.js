import './App.css';
import axios from 'axios'
import { useEffect, useState } from 'react';
import shuffle from './shuffle.gif'
import cardBack from './back.png'

function App() {

  const [decks, setDecks] = useState([])
  const [currentCards, setCurrentCards] = useState([])
  const [score, setScore] = useState(null)
  const [replaceDecks, setReplaceDecks] = useState(true)

  useEffect(() => {
    if (replaceDecks) {
      axios.get("https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6")
        .then(async res => {
          setTimeout(() => {
            axios.get(`https://www.deckofcardsapi.com/api/deck/${res.data["deck_id"]}/draw/?count=312`)
              .then(decks => { 
                setDecks([...decks.data.cards]) 
                setReplaceDecks(false)
              })
          }, 3000)
        })
    }
  }, [replaceDecks])

  const dealCards = () => {
    setCurrentCards([])
    setTimeout(() => {
      const newObj = Array.from(decks)
      const currentHand = newObj.splice(0, 2);
      setCurrentCards(currentHand);
      setDecks(newObj)
      getScore(currentHand)
    }, 500)
  }

  const newDecks = () => {
    setDecks([])
    setCurrentCards([])
    setReplaceDecks(true)
  };

  const getScore = (currentHand) => {
    let calculatedScore = currentHand.reduce((curr, next) => {
      if (!!parseInt(next.value)) {
        return curr += parseInt(next.value)
      } else
        if (next.value.toLowerCase() === 'ace') {
          return curr += 11
        } else {
          return curr += 10
        }
    }, 0)
    setScore(calculatedScore === 22 ? 12 : calculatedScore)
  };

  if (!decks.length) {
    return (
        <img id='shuffle' alt='card shuffle gif' style={{ margin: 'auto' }} src={shuffle} />
    )
  } else
    return (
      <div className="App">
        {
          currentCards.length === 2 &&
          <p style={{ position: "fixed", top: "-25%", fontSize: '5rem', fontWeight: '800' }}>
            {score && `YOUR SCORE IS ${score}`}
          </p>}
        <p>
          {currentCards.length === 2 ?
            currentCards.map(card => {
              return (
                <img alt="playing-card" loading={"eager"} className='cards' src={card.image} />
              )
            }) :
            <>
              <img alt="playing-card" loading={"eager"} className='cards' src={cardBack} />
              <img alt="playing-card" loading={"eager"} className='cards' src={cardBack} />
            </>
          }
        </p>
        <span style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
          <button class="deal-button" onClick={dealCards}>DEAL</button>
          <button class="deal-button" onClick={newDecks}>NEW DECKS</button>
        </span>
      </div>
    );
}

export default App;
