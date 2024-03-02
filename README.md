
# Letter Grid Builder

With this library you can create letter matrices and insert hidden words into the matrix, to create board-type games.


## Installation

```bash
  $ npm i letter-grid-builder
```
    
## API Reference

#### Create a new object

```typescript
  import LetterGridBuilder from "letter-grid-builder"
  
  // define words to use
  const words = ["typescript", "javascript", "python", "java", "go", "php"];

  // Generate a new buider
  const builder = new LetterGridBuilder({
    words, // words to insert
    numRows: 10, // width
    numColumns: 10, // height
    params: {
      // can randomly do "reverse" of the word to be inserted
      randomReverseWord: true, 
    },
  });

  // build matrix
  const result = builder.build();

  // result example
  console.log(result.matrix.data)

  [" "," "," "," "," "," ","p"," "," "," "]
  [" "," "," "," "," ","g"," ","h"," "," "]
  [" "," "," ","a","n"," ","o"," ","p"," "]
  [" "," "," "," ","v","o"," "," "," "," "]
  [" "," "," "," "," ","a","h"," "," "," "]
  [" "," "," "," "," "," ","j","t"," "," "]
  ["t","p","i","r","c","s","e","p","y","t"]
  [" "," "," "," "," "," "," "," "," ","p"]
  ["j","a","v","a","s","c","r","i","p","t"]
  [" "," "," "," "," "," "," "," "," "," "]
```

```typescript
  // Example with automatic filling of empty cells
  const builder = new LetterGridBuilder({
    words, // words to insert
    numRows: 5, // width
    numColumns: 6, // height
    params: {
      // Pass a string with all the symbols to use to fill empty cells randomly
      fillEmptyCells: "1234567890",
    },
  });

  // build matrix
  const result = builder.build();

  // result example
  console.log(result.matrix.data)

  ["5","0","5","g","o","0"]
  ["7","5","j","a","v","a"]
  ["3","5","8","p","0","1"]
  ["p","y","t","h","o","n"]
  ["3","0","7","p","4","6"]
```



## License

[MIT](https://choosealicense.com/licenses/mit/)

