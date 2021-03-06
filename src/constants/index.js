import { initFields } from "../utils"; //utils/index.jsで作成したinitFieldsをインポート

const fieldSize = 35
export const initialPosition = { x: 17, y: 17 }; //初回位置
export const initialValues = initFields(fieldSize, initialPosition); //初回値,第二引数に初回位置
export const defaultInterval = 100; // タイマーの間隔
export const defaultDifficulty = 3; //難易度
// x=17,y=17がマスにおける中心

// 難易度の速度
export const Difficulty = [1000, 500, 100, 50, 10]

// ステータスリストをオブジェクトで管理(スペルミスを防ぐ・変更が容易)
export const GameStatus = Object.freeze({
    init: 'init',
    playing: 'playing',
    suspended: 'suspended',
    gameover: 'gameover',
});

// スネークが曲がれる方向
export const Direction = Object.freeze({ //教材で後から頭に「export」がついてるが、必要なのか？
    up: 'up',
    right: 'right',
    left: 'left',
    down: 'down'
});

// 矢印キーコード
export const DirectionKeyCodeMap = Object.freeze({
    37: Direction.left,
    38: Direction.up,
    39: Direction.right,
    40: Direction.down,
});

// 反対方向
export const OppositeDirection = Object.freeze({
    up: 'down',
    right: 'left',
    left: 'right',
    down: 'up'
});

// 方向の座標
export const Delta = Object.freeze({
    up: { x: 0, y: -1 },
    right: { x: 1, y: 0 },
    left: { x: -1, y: 0 },
    down: { x: 0, y: 1 }
});
