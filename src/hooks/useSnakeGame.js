import { useCallback, useEffect, useState } from 'react';
import {
    defaultInterval,
    defaultDifficulty,
    initialPosition,
    initialValues,
    Delta,
    Difficulty,
    Direction,
    DirectionKeyCodeMap,
    GameStatus,
    OppositeDirection,
} from '../constants';
import {
    initFields,
    isCollision,
    isEatingMyself,
    getFoodPosition,
} from '../utils';

let timer = null;

// 登録を解除　タイマーで進むようにする
const unsubscribe = () => {
    if (!timer) {
    return
    }
  clearInterval(timer) //タイマーを削除
};

const useSnakeGame = () => {
    // フック関数はReactの関数のトップレベルで宣言をする必要がある。
    const [fields, setFields] = useState(initialValues); //フィールドの状態
    const [body, setBody] = useState([]) //スネーク位置の状態(スネークが伸びるようにしていく)
    const [status, setStatus] = useState(GameStatus.init); //ゲームの状態
    const [direction, setDirection] = useState(Direction.up); //スネークの方向
    const [difficulty ,setDifficulty] = useState(defaultDifficulty) //難易度
    const [tick, setTick] = useState(0); //時計の針のようなステート(一定間隔でレンダリングがトリガーされる)

// useEffectに渡された関数はレンダーの結果が画面に反映された後に動作する
// useStateにはオブジェクトを初期値として渡すことができないので、代わりにuseEffectで初期化する
useEffect(() => {
    setBody([initialPosition]) //位置が初回レンダリングのみ初回位置へ初期化される

    // setBody(
    //   new Array(15).fill('').map((_item, index) => ({ x:17, y:17 + index })),
    // )
    // 自分自身を食べてゲームオーバーになるかのテスト用スネーク（スネークの長さを15にする）


    // ゲームの中の時間を管理する
    const interval = Difficulty[difficulty -1]; //★
    timer = setInterval(() => { 
        setTick(tick => tick +1 ) //定時間ごとにインクリメント(1増加)させる
    }, interval) //defaultIntervalが100msなので100ms毎にレンダリングされる
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
    const start = () => setStatus(GameStatus.playing);

    // 一時停止
    const stop = () => setStatus(GameStatus.suspended)

    // リセット(それぞれの値を初期値に戻す)
    const reload = () => {
        timer = setInterval(() => {
        setTick(tick => tick +1)
        }, defaultInterval)
        setStatus(GameStatus.init)
        setBody([initialPosition])
        setDirection(Direction.up)
        setFields(initFields(fields.length, initialPosition))
    };


    // 操作パネルで方向を変えられるようにする
    const updateDirection = useCallback((newDirection) => { //useCallback => レンダリングの度に関数が再生成されるのを防ぐ 
        if (status !== GameStatus.playing) {
        return;
        }
        if (OppositeDirection[direction] === newDirection) { //反対方向
        return;
        }
        setDirection(newDirection)
    }, [direction, status]); // [direction, status]を渡したため、配列(status)の状態が変わらない限り、関数が再生成されない


    // 難易度の設定
    const updateDifficulty = useCallback((difficulty) => {
        if (status !== GameStatus.init) { //ステータスが初期値initの時のみ難易度の設定ができるようにする
        return;
        }
        if (difficulty < 1 || difficulty > Difficulty.length) {
        return;
        }
        setDifficulty(difficulty)
    }, [status])
    // 操作パネルで方向を変える時同様にレンダリングの度に関数が再生成されるのを防ぐためにuseCallbackを使用する
    // console.log(difficulty)


    // キーボード操作
    useEffect(() => {
        const handleKeyDown = (e) => {
        const newDirection = DirectionKeyCodeMap[e.keyCode];
        if (!newDirection) {
            return;
        }
        updateDirection(newDirection);
        };
        document.addEventListener('keydown', handleKeyDown); //キーボードを検知するイベント
        return () => document.removeEventListener('keydown', handleKeyDown) //イベントリスナーのクリーン
    }, [updateDirection]); //操作パネルに依存、そのためonChangeDirectionの子要素である[direction, status]が変更されると実行される


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
    return { //文頭で使用するフックをステートで定義したものを、returんで関数やステートを返す。
        body,
        difficulty,
        fields,
        status,
        start,
        stop,
        reload,
        updateDirection,
        updateDifficulty,
    };
};

export default useSnakeGame;