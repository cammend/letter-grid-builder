/**
 * Letter Grid Builder
 * Genera una matriz de letras aleatorias, insertando palabras dentro de la matriz en forma horizontal, vertical o en diagonal.
 *
 * @packageDocumentation
 */

/**
 * @module letter-grid-builder
 */

/**
 * Autor: cammend
 * Versión: 0.1.0
 * Licencia: MIT
 */

// Define an interface for the string matrix
interface StringMatrix {
  rows: number;
  columns: number;
  data: string[][];
}

interface WordPosition {
  start: { row: number; column: number };
  end: { row: number; column: number };
  weight: number;
}

interface PossiblePositionsByWeight {
  [key: number]: WordPosition[];
}

enum Direction {
  Horizontal = "horizontal",
  Vertical = "vertical",
  DiagonalTopToBottom = "diagonalTopToBottom",
  DiagonalBottomToTop = "diagonalBottomToTop",
}

// Function to initialize a string matrix with empty values
function initializeMatrixWithStrings(
  rows: number,
  columns: number
): StringMatrix {
  const data: string[][] = [];
  for (let i = 0; i < rows; i++) {
    let row: string[] = [];
    for (let j = 0; j < columns; j++) {
      row[j] = "";
    }
    data[i] = row;
  }

  return { rows, columns, data };
}

// Función para probar todas las posiciones posibles de inserción en una dirección dada
function testInsertion(
  matrix: StringMatrix,
  word: string,
  direction: Direction
): PossiblePositionsByWeight {
  const possiblePositions: PossiblePositionsByWeight = {};

  // Tamaño de la palabra
  const wordLength = word.length;

  // Iterar sobre todas las filas y columnas
  for (let row = 0; row < matrix.rows; row++) {
    for (let col = 0; col < matrix.columns; col++) {
      const currentWordPosition: WordPosition = {
        start: { row, column: col },
        end: { row: 0, column: 0 }, // Inicializar con valores, se actualizará según la dirección
        weight: 0,
      };

      // Verificar si la palabra puede ser insertada en esta posición en la dirección especificada
      let isValidPosition = true;
      for (let i = 0; i < wordLength; i++) {
        let matrixRow = row;
        let matrixCol = col;

        // Actualizar posición según la dirección
        switch (direction) {
          case Direction.Horizontal:
            matrixCol += i;
            break;
          case Direction.Vertical:
            matrixRow += i;
            break;
          case Direction.DiagonalTopToBottom:
            matrixRow += i;
            matrixCol += i;
            break;
          case Direction.DiagonalBottomToTop:
            matrixRow -= i;
            matrixCol += i;
            break;
        }

        if (
          matrixRow < 0 ||
          matrixRow >= matrix.rows ||
          matrixCol < 0 ||
          matrixCol >= matrix.columns ||
          (matrix.data[matrixRow][matrixCol] !== "" &&
            matrix.data[matrixRow][matrixCol] !== word[i])
        ) {
          isValidPosition = false;
          break;
        }

        if (matrix.data[matrixRow][matrixCol] === word[i]) {
          // Sumar 1 punto de peso si la letra ya existe en la matriz
          currentWordPosition.weight++;
        }
      }

      // Si la posición es válida, la añadimos al resultado
      if (isValidPosition) {
        const endRow =
          direction === Direction.Vertical ||
          direction === Direction.DiagonalTopToBottom
            ? row + wordLength - 1
            : direction === Direction.DiagonalBottomToTop
            ? row - wordLength + 1
            : row;
        const endCol =
          direction === Direction.Horizontal ||
          direction === Direction.DiagonalTopToBottom ||
          direction === Direction.DiagonalBottomToTop
            ? col + wordLength - 1
            : col;
        currentWordPosition.end = { row: endRow, column: endCol };

        const weight = currentWordPosition.weight;
        if (!possiblePositions[weight]) {
          possiblePositions[weight] = [];
        }
        possiblePositions[weight].push(currentWordPosition);
      }
      const a = 1;
    }
  }

  return possiblePositions;
}

// Función para obtener una posición aleatoria del array del peso más alto
function getRandomPositionFromWeightedObject(
  possiblePositions: PossiblePositionsByWeight
): WordPosition | null {
  // Obtener el peso más alto
  const maxWeight = Math.max(...Object.keys(possiblePositions).map(Number));

  // Obtener el array de posiciones del peso más alto
  const positionsWithMaxWeight = possiblePositions[maxWeight];

  if (!positionsWithMaxWeight || positionsWithMaxWeight.length === 0) {
    return null;
  }

  // Elegir una posición aleatoria del array
  const randomIndex = Math.floor(Math.random() * positionsWithMaxWeight.length);
  return positionsWithMaxWeight[randomIndex];
}

// Función para insertar la palabra en la matriz en base a WordPosition
function insertWordInMatrix(
  matrix: StringMatrix,
  word: string,
  position: WordPosition
): void {
  const startRow = position.start.row;
  const startCol = position.start.column;
  const endRow = position.end.row;
  const endCol = position.end.column;

  const wordLength = word.length;

  // Determinar la dirección en base a WordPosition
  let direction: Direction;
  if (startRow === endRow) {
    direction = Direction.Horizontal;
  } else if (startCol === endCol) {
    direction = Direction.Vertical;
  } else if (startRow < endRow && startCol < endCol) {
    direction = Direction.DiagonalTopToBottom;
  } else {
    direction = Direction.DiagonalBottomToTop;
  }

  // Insertar la palabra en la matriz en la dirección calculada
  for (let i = 0; i < wordLength; i++) {
    let matrixRow = startRow;
    let matrixCol = startCol;

    switch (direction) {
      case Direction.Horizontal:
        matrixCol += i;
        break;
      case Direction.Vertical:
        matrixRow += i;
        break;
      case Direction.DiagonalTopToBottom:
        matrixRow += i;
        matrixCol += i;
        break;
      case Direction.DiagonalBottomToTop:
        matrixRow -= i;
        matrixCol += i;
        break;
    }

    matrix.data[matrixRow][matrixCol] = word[i];
  }
}

// Función para elegir aleatoriamente una dirección del enum Direction, excluyendo las direcciones especificadas en exclude
function getRandomDirection(exclude: Direction[] = []): Direction | null {
  const availableDirections = Object.values(Direction).filter(
    (dir) => !exclude.includes(dir)
  );

  if (availableDirections.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * availableDirections.length);
  return availableDirections[randomIndex] as Direction;
}

// Función para devolver la palabra en orden inverso.
// Si se envía "random = true", puede devolver en orden inverso o no (50%)
// Si se envía "random = false", siempre hacer "reverse" de la palabra
function reverseWord(word: string, random = true): string {
  const shouldReverse = random ? Math.random() < 0.5 : true;

  if (shouldReverse) {
    return word.split("").reverse().join("");
  }

  return word;
}

function hasKeys(obj: object) {
  return Object.keys(obj).length > 0;
}

// Función para ordenar un arreglo de palabras de mayor a menor longitud
function sortWordsByLength(words: string[]): string[] {
  return [...words].sort((a, b) => b.length - a.length);
}

// Función para filtrar palabras por tamaño máximo
function filterWordsByMaxLength(
  words: string[],
  maxLength: number
): { original: string[]; omitted: string[] } {
  const omittedWords = words.filter((word) => word.length > maxLength);
  const filteredWords = words.filter((word) => word.length <= maxLength);
  return { original: filteredWords, omitted: omittedWords };
}

// Function to fill empty cells with random letters in a string matrix
function fillEmptyCells(matrix: string[][], alphabet = ""): void {
  alphabet = alphabet || "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ"; // Puedes ajustar según tus necesidades

  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (matrix[i][j] === "") {
        const randomIndex = Math.floor(Math.random() * alphabet.length);
        matrix[i][j] = alphabet[randomIndex];
      }
    }
  }
}

interface Props {
  words: string[];
  numRows: number;
  numColumns: number;
  params?: {
    maxAttempts?: number;
    randomReverseWord?: boolean;
    omitDirections?: Direction[];
    fillEmptyCells?: boolean | string;
  };
}

function generateMatrix(props: Props) {
  const { words, numRows: rows, numColumns: columns, params } = props;
  // Parámetros por defecto
  const maxAttempts = params?.maxAttempts || 10;
  const randomReverseWord = !!params?.randomReverseWord;
  const omitDirections = params?.omitDirections || [];

  // Generamos la matriz de datos con letras vacías
  const matrix = initializeMatrixWithStrings(rows, columns);

  // Generamos un objeto con todas las palabras (inicialmente no insertadas)
  // A medida que se van insertando, se van eliminando de este objeto
  const wordsNotInserted: {
    [key: string]: {
      testedDirections: Direction[]; // Direcciones en las que se probó insertar la palabra
      reverse: boolean; // Indica si la palabra está en reversa o no
      count: number; // Variable que indica cuantas veces se trató de insertar la palabra (en reversa o normal). Imporntante, no toma en cuenta los intentos por dirección
    };
  } = {};

  const filteredWords = filterWordsByMaxLength(words, Math.max(rows, columns));

  // Ordenamos las palabras: de mayor tamaño a menor tamaño
  const wordsByLength = sortWordsByLength(filteredWords.original);
  console.log("wordsByLength", wordsByLength);

  // Generamos todas las palabras, como no insertadas (luego se irán insertando una por una)
  wordsByLength.forEach((word) => {
    const _word = randomReverseWord ? reverseWord(word) : word;
    wordsNotInserted[_word] = {
      testedDirections: [...omitDirections],
      reverse: _word !== word,
      count: 1,
    };
  });

  // Variable para guardar las palabras insertadas
  const insertedWords: { word: string; position: WordPosition }[] = [];

  // Conteo de intentos para insertar un conjunto de palabras
  let attempts = 1;

  // Ciclo principal, para probar insertar el conjunto de palabras que todavía no han sido insertadas
  while (attempts < maxAttempts) {
    Object.keys(wordsNotInserted).forEach((word) => {
      const wordData = wordsNotInserted[word];
      const _realWord = wordData.reverse
        ? word.split("").reverse().join("")
        : word; // Copia de la palabra original, sin "reverse"
      // Obtenemos aleatoriamente una dirección (para insertar la palbra)
      const direction = getRandomDirection(wordData.testedDirections);
      if (!direction) {
        // Si ya probamos todas las direcciones para una palabra, vamos a validar si ya la probamos en "reversa"
        // Tiene que estar habilitada la opción "reverse", para proceder con esta opción
        if (randomReverseWord && wordData.count < 2) {
          // Primero limpiamos la palabra del objeto principal
          delete wordsNotInserted[word];
          // Insertamos la nueva palabra para probar
          const newWord = wordData.reverse ? word : reverseWord(word, false);
          wordsNotInserted[newWord] = {
            testedDirections: [...omitDirections],
            reverse: !wordData.reverse,
            count: 2, // Aumentamos a 2 el número de veces que probamos insertar (1 en modo normal y 2 en "reversa")
          };
        }
        return; // Terminamos la función, para probar en la próxima iteración
      }

      // Calculamos todas los posibles lugares donde se puede insertar la palabra, cada una con un peso
      const possiblePositions = testInsertion(matrix, word, direction);

      if (hasKeys(possiblePositions)) {
        // Obtenemos una posicion aleatoria (de las que obtuvieron mayor peso)
        const randomPos =
          getRandomPositionFromWeightedObject(possiblePositions);

        if (randomPos) {
          // Insertamos la variable en la matriz
          insertWordInMatrix(matrix, word, randomPos);
          // Guardamos la palabra insertada
          insertedWords.push({ word: _realWord, position: randomPos });
          // Eliminamos la palabra insertada, del objeto de "palabras no insertadas"
          delete wordsNotInserted[word];
        }
      } else {
        // Si una palabra no se pudo "insertar", guardamos con qué dirección probamos insertar la palabra,
        // para una posterior prueba de inserción y no repetir la misma dirección.
        wordData.testedDirections.push(direction);
      }
    });

    // Validamos si hay palabras que no se pudieron insertar
    const allInserted = Object.keys(wordsNotInserted).length === 0;
    if (allInserted) break; // terminamos el ciclo principal
    attempts++; // continuamos con el ciclo
  }

  // Al finalizar de generar la matrix, rellenamos con letras aleatorias los espacios vacíos
  if (params?.fillEmptyCells === true) {
    fillEmptyCells(matrix.data);
  } else if (params?.fillEmptyCells) {
    fillEmptyCells(matrix.data, params.fillEmptyCells);
  }

  const _wordsNotInserted: string[] = [];
  Object.keys(wordsNotInserted).forEach((key) => {
    const data = wordsNotInserted[key];
    const word = data.reverse ? key.split("").reverse().join("") : key;
    _wordsNotInserted.push(word);
  });

  return {
    matrix,
    nonInsertedWords: filteredWords.omitted.concat(_wordsNotInserted),
    insertedWords,
  };
}

export default class LetterGridBuilder {
  private props: Props;

  /**
   * Generate new matrix with randomly inserted words
   * @param words List of words to insert into the matrix
   * @param numRows Number of rows
   * @param numColumns Number of columns
   * @param params.maxAttempts Maximum number of attempts to try inserting a word
   * @param params.randomReverseWord Words will be taken backwards, randomly
   * @param params.omitDirections Allows you to skip word addresses when inserting them into the matrix
   */
  constructor(props: Props) {
    this.props = props;
  }

  build() {
    return generateMatrix(this.props);
  }
}
