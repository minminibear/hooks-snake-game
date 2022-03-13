// スネークや餌の位置情報を格納する場所で、フィールドの位置に対応したデータを状態として保持

// エサをランダム表示
export const getFoodPosition = (fieldSize, excludes) => { //第二引数に除外を追加
    while(true) {
        const x = Math.floor(Math.random() * ((fieldSize - 1) - 1)) + 1; //エサの出現エリアを1〜33にする
        const y = Math.floor(Math.random() * ((fieldSize - 1) - 1)) + 1;
        const conflict = excludes.some(item => item.x === x && item.y === y)// ランダムに取得した座標が除外リストの中にあるかチェック
        if (!conflict) {
            return { x, y };
        }
    }
};

// 他のファイルから読み込めるように頭にexportを宣言する
export const initFields = (fieldSize, snake) => { //初回フィールド
    const fields = []
    for (let i = 0; i < fieldSize; i++) { 
        const cols = new Array(fieldSize).fill('') //fieldの縦の長さ分だけループする
        fields.push(cols)
    }
    // fields[initialPosition.y][initialPosition.x] = 'snake' //初回の位置をスネークとする
    fields[snake.y][snake.x] = 'snake' //初回の位置をスネークとする

    const food = getFoodPosition(fieldSize, [snake])
    fields[food.y][food.x] = 'food'

    return fields; //　作成した配列を返却
};

// 上記のイメージ↓
// const field = [
//     ['', 'food', '', '', ''],
//     ['', '', '', '', ''],
//     ['', '', '', '', ''],
//     ['', '', '', '', ''],
//     ['', '', 'snake', '', ''],
// ]

// util：利用
// col:コブ(峰と峰の間)
// fill関数：全ての配列の中身を引数に与えられた値に初期化できる