// スネークや餌の位置情報を格納する場所で、フィールドの位置に対応したデータを状態として保持

// 他のファイルから読み込めるように頭にexportを宣言する
export const initFields = (fieldSize,initialPosition) => { //初回フィールド
    const fields = []
    for (let i = 0; i < fieldSize; i++) { 
        const cols = new Array(fieldSize).fill('') //fieldの縦の長さ分だけループする
        fields.push(cols)
    }
    fields[initialPosition.y][initialPosition.x] = 'snake' //初回の位置をスネークとする
    return fields;
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