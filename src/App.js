import React from 'react';
import Navigation from './components/Navigation';
import Field from './components/Field';
import Button from './components/Button';
import ManipulationPanel from './components/ManipulationPanel';

import useSnakeGame from './hooks/useSnakeGame'

function App() {
  const {
    body,
    difficulty,
    fields,
    start,
    stop,
    reload,
    status,
    updateDirection,
    updateDifficulty,
  } = useSnakeGame()

  return (
    <div className='App'>

      <header className='header'>
        <div className='title-container'>
          <h1 className='title'>Snake Game</h1>
        </div>
        <Navigation
        length={body.length}
        difficulty={difficulty}
        onChangeDifficulty={updateDifficulty}
        />
      </header>

      <main className='main'>
        <Field fields={fields} />
      </main>

      <footer className="footer">
        <Button
        status={status}
        onStop={stop}
        onStart={start}
        onRestart={reload}
        />
        <ManipulationPanel onChange={updateDirection} />
      </footer>

    </div>
  );
};

export default App;


// 原因不明の時の確認方法「関数と組み合わせた方法」

// import React from 'react';

// const ManipulationPanel = ({ onChange }) => {
//   const onUp = () => onChange('up')
//   const onRight = () => onChange('right')
//   const onLeft = () => onChange('left')
//   const onDown = () => onChange('down')

//   const click = () => {
//     console.log('クリックされたよ')
//   }
//   return (
//     <div className="manipulation-panel">
//       <button onClick={() => {
//         onLeft()
//         click()
//       }}>←</button>
//       <button onClick={onUp}>↑</button>
//       <button onClick={onDown}>↓</button>
//       <button onClick={onRight}>→</button>
//     </div>
//   );
// };

// export default ManipulationPanel;