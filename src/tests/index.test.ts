import LetterGridBuilder from "..";

const words = ["typescript", "javascript", "python", "java", "go", "php"];

describe("Word insertion test", () => {
  test("Inserting all words into the matrix", async () => {
    const builder = new LetterGridBuilder({
      words,
      numRows: 10,
      numColumns: 10,
      params: {
        randomReverseWord: true,
      },
    });
    const data = builder.build();
    printMatrix(data.matrix.data);

    data.insertedWords.forEach((iw) => {
      let word = iw.word;
      const v = validateWordPosition(word, iw.position, data.matrix.data);
      const r = v ? word : "failed";
      expect(r).toBe(word);
    });
  });

  test("Inserting words into the matrix and omit some", async () => {
    const builder = new LetterGridBuilder({
      words,
      numRows: 5,
      numColumns: 6,
      params: {
        randomReverseWord: true,
        fillEmptyCells: "1234567890",
      },
    });
    const data = builder.build();
    printMatrix(data.matrix.data);

    data.insertedWords.forEach((iw) => {
      let word = iw.word;
      const v = validateWordPosition(word, iw.position, data.matrix.data);
      const r = v ? word : "failed";
      expect(r).toBe(word);
    });

    const realNonInsertedWords = ["typescript", "javascript"];
    data.nonInsertedWords.forEach((w) => {
      expect(w).toBe(realNonInsertedWords.find((_w) => _w === w));
    });
  });
});

interface WordPosition {
  start: { row: number; column: number };
  end: { row: number; column: number };
}

// Función para validar si una palabra está correctamente insertada en una posición de la matriz (considerando inversa)
function validateWordPosition(
  word: string,
  position: WordPosition,
  matrix: string[][]
): boolean {
  const startRow = position.start.row;
  const startCol = position.start.column;
  const endRow = position.end.row;
  const endCol = position.end.column;

  const wordLength = word.length;

  if (
    (startRow !== endRow &&
      startCol !== endCol &&
      Math.abs(startRow - endRow) + 1 !== wordLength) ||
    (startRow === endRow && endCol - startCol + 1 !== wordLength) ||
    (startCol === endCol && endRow - startRow + 1 !== wordLength)
  ) {
    // La longitud de la palabra no coincide con la posición proporcionada
    return false;
  }

  // Verificar que cada letra de la palabra coincida con la matriz en la posición indicada
  for (let i = 0; i < wordLength; i++) {
    let matrixRow = startRow;
    let matrixCol = startCol;

    if (startRow === endRow) {
      matrixCol += i;
    } else if (startCol === endCol) {
      matrixRow += i;
    } else if (startRow < endRow && startCol < endCol) {
      matrixRow += i;
      matrixCol += i;
    } else {
      matrixRow -= i;
      matrixCol += i;
    }

    if (
      matrixRow < 0 ||
      matrixRow >= matrix.length ||
      matrixCol < 0 ||
      matrixCol >= matrix[0].length ||
      (matrix[matrixRow][matrixCol] !== word[i] &&
        matrix[matrixRow][matrixCol] !== word[wordLength - 1 - i])
    ) {
      // La letra no coincide o está fuera de los límites de la matriz
      return false;
    }
  }

  // Todas las letras coinciden
  return true;
}

function printMatrix(matrix: string[][]) {
  let txt = "";
  matrix.forEach((row) => {
    txt += JSON.stringify(row.map((l) => (l ? l : " "))) + "\n";
  });
  console.log(txt);
}
