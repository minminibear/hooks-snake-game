import React ,{ useCallback, useEffect, useState }from 'react';
import Navigation from './components/Navigation';
import Field from './components/Field';
import Button from './components/Button';
import ManipulationPanel from './components/ManipulationPanel';
import {
  defaultInterval,
  defaultDifficulty,
  Delta,
  Difficulty,
  Direction,
  DirectionKeyCodeMap,
  GameStatus,
  OppositeDirection,
  initialPosition,
  initialValues
} from './constants';
import { initFields, getFoodPosition } from './utils';

let timer = undefined;

// 登録を解除　タイマーで進むようにする
const unsubscribe = () => {
  if (!timer) {
    return
  }
  clearInterval(timer) //タイマーを削除
};

// ゲームオーバー(衝突)
const isCollision = (fieldSize, position) => {
  // console.log(fieldSize,position)
  if (position.y < 0 || position.x <0) { // ① 上・左の壁にぶつかったら
    return true;
  }
  if (position.y > fieldSize -1 || position.x > fieldSize -1) { // ② 右・下の壁にぶつかったら
    return true;
  }
  return false;
};
// positionは0〜数える　fieldSizeは1〜数える　②の条件に当てはまるのはpositionが34になった時なので、
// fieldSizeを−1にして34になったら条件に当てはまるようにする。

// 自分自身を食べてしまう
const isEatingMyself = (fields, position) => {
  return fields[position.y][position.x] === 'snake'
}

function App() {
  // フック関数はReactの関数のトップレベルで宣言をする必要がある。
  const [fields, setFields] = useState(initialValues); //フィールドの状態
  const [body, setBody] = useState([]) //スネーク位置の状態(スネークが伸びるようにしていく)
  const [status, setStatus] = useState(GameStatus.init); //ゲームの状態
  const [direction, setDirection] = useState(Direction.up); //スネークの方向
  const [difficulty ,setDifficulty] = useState(defaultDifficulty) //難易度
  const [tick, setTick] = useState(0); //時計の針のようなステート(一定間隔でレンダリングがトリガーされる)
  // const [position, setPosition] = useState(); // スネーク位置の状態（スネークの長さが1だった状態）

  // useEffectに渡された関数はレンダーの結果が画面に反映された後に動作する
  // useStateにはオブジェクトを初期値として渡すことができないので、代わりにuseEffectで初期化する
  useEffect(() => {
    setBody([initialPosition]) //位置が初回レンダリングのみ初回位置へ初期化される
    // setBody(
    //   new Array(15).fill('').map((_item, index) => ({ x:17, y:17 + index })),
    // )
    // 自分自身を食べてゲームオーバーになるかのテスト用スネーク（スネークの長さを15にする）


    // ゲームの中の時間を管理する
    const interval = Difficulty[difficulty -1] //★
    timer = setInterval(() => { 
      setTick(tick => tick +1 )//定時間ごとにインクリメント(1増加)させる
    }, interval) //defaultIntervalが100msなので100ms毎にレンダリングされる
    // console.log(Difficulty)
    return unsubscribe //returnでコンポーネントが削除されるタイミングで関数を実行する
  }, [difficulty]); // 空：初回のみレンダリング　→　difficultyとなることで難易度の数字に変更があった時のみレンダリング

    //　★の理由：
    // Difficulty => [1000, 500, 100, 50, 10]
    // difficulty -1 => useStateのdifficulty　初期値は3
    // Difficultyという配列のインデックス番号を指定しているだけ。−1がないとDifficulty[3]は50になってしまう。
    // −1があるとDifficulty[3-1]で100をみることになる。

  //プレイ中ではない限りスネークが動かないようにする
  useEffect(() => {
    if (body.length === 0 || status !== GameStatus.playing) { 
      return
    }
    // handleMoving関数をスネークが移動した後にゲームオーバーの状態になればゲームオーバー
    const canContinue = handleMoving()
    if (!canContinue) {
      unsubscribe()
      setStatus(GameStatus.gameover)
    }
  }, [tick]); //ゲームの中の時間が進む度にhandleMoving関数が呼ばれる

  // スタートボタンを押したらスネークが動き出すようにする
  const onStart = () => setStatus(GameStatus.playing);

  // 一時停止
  const onStop = () => setStatus(GameStatus.suspended)

  // リセット(それぞれの値を初期値に戻す)
  const onRestart = () => {
    timer = setInterval(() => {
      setTick(tick => tick +1)
    }, defaultInterval)
    setStatus(GameStatus.init)
    setBody([initialPosition])
    setDirection(Direction.up)
    setFields(initFields(fields.length, initialPosition))
  };


  // 操作パネルで方向を変えられるようにする
  const onChangeDirection = useCallback((newDirection) => { //useCallback => レンダリングの度に関数が再生成されるのを防ぐ 
    if (status !== GameStatus.playing) {
      return direction
    }
    if (OppositeDirection[direction] === newDirection) { //反対方向
      return
    }
    setDirection(newDirection)
  }, [direction, status]); // [direction, status]を渡したため、配列(status)の状態が変わらない限り、関数が再生成されない


  // 難易度の設定
  const onChangeDifficulty = useCallback((difficulty) => {
    if (status !== GameStatus.init) { //ステータスが初期値initの時のみ難易度の設定ができるようにする
      return
    }
    if (difficulty < 1 || difficulty > Difficulty.length) {
      return
    }
    setDifficulty(difficulty)
  }, [status, difficulty])
  // 操作パネルで方向を変える時同様にレンダリングの度に関数が再生成されるのを防ぐためにuseCallbackを使用する
// console.log(difficulty)


  // キーボード操作
  useEffect(() => {
    const handleKeyDown = (e) => {
      const newDirection = DirectionKeyCodeMap[e.keyCode];
      if (!newDirection) {
        return;
      }
      onChangeDirection(newDirection);
    };
    document.addEventListener('keydown', handleKeyDown); //キーボードを検知するイベント
    return () => document.removeEventListener('keydown', handleKeyDown) //イベントリスナーのクリーン
  }, [onChangeDirection]); //操作パネルに依存、そのためonChangeDirectionの子要素である[direction, status]が変更されると実行される


  // スネークを動かす　（goUp => handleMoving にリネーム）
  const handleMoving = () => {
    const { x, y } = body[0] //座標をポジションとする
    const delta = Delta[direction]; //対象の方向の座標を示す
    const newPosition = {
      x: x + delta.x,
      y: y + delta.y,
    };
    // タイマーを解除する
    if (isCollision(fields.length, newPosition) || isEatingMyself(fields, newPosition)) { // 壁にぶつかるor自分自身を食べる
      return false;
    }
    // fields[y][x] = '' //スネークの元いた位置を空に
    const newBody = [...body] //新しく変数を定義することにより、popなどのは破壊的メソッドを使用してのレンダリングがうまくいくようにする
    if (fields[newPosition.y][newPosition.x] !== 'food') { //スネーク座標がエサと同じでない場合
      const removingTrack = newBody.pop() // pop=>末尾の配列を取り出して削除　スネークの状態を維持する
      fields[removingTrack.y][removingTrack.x] = ''
    } else { 
      const food = getFoodPosition(fields.length, [...newBody, newPosition]) //エサを新しく出現させる
      fields[food.y][food.x] = 'food'      
    }
    fields[newPosition.y][newPosition.x] = 'snake' //次にいる場所を'snake'に変更
    newBody.unshift(newPosition)//スネーク位置を更新　unshift=>配列の先頭に要素を追加　スネークを伸ばす
    setBody(newBody)
    setFields(fields) //フィールドを更新
    return true;
  }; 

  return (
    <div className='App'>

      <header className='header'>
        <div className='title-container'>
          <h1 className='title'>Snake Game</h1>
        </div>
        <Navigation
        length={body.length}
        difficulty={difficulty}
        onChangeDifficulty={onChangeDifficulty}
        />
      </header>

      <main className='main'>
        <Field fields={fields} />
      </main>

      <footer className="footer">
        <Button
        status={status}
        onStop={onStop}
        onStart={onStart}
        onRestart={onRestart}
        />
        <ManipulationPanel onChange={onChangeDirection} />
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