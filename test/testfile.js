import React from 'react';
import ReactDOM from 'react-dom';
import { PressAndHold } from '../bin/Handee';

const STYLE = {
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
  },

  button: {
    width: 200,
    height: 200,
    border: `2px solid black`,
    backgroundColor: 'white',
    cursor: 'pointer',
    margin: 20,
  },
};

const Tester = props => (
  <div style={STYLE.container}>
    <PressAndHold
      duration={ 250 }
      onHoldComplete={t => console.log('Hold 1 complete', t)}
    >
      <div style={STYLE.button}/>
    </PressAndHold>

    <PressAndHold
      duration={ 250 }
      onHoldComplete={t => console.log('Hold 2 Complete', t)}
    >
      { perCentComplete => (
        <div style={{
          ...STYLE.button,
          backgroundColor: perCentComplete === 1
            ? 'red'
            : `rgba(43, 68, 120, ${perCentComplete})`,
          }}
        />
      )}
    </PressAndHold>
  </div>
);

(() => {
  const container = document.getElementById('container');
  ReactDOM.render(<Tester />, container);
})();
