class Plateau {
  
    constructor() {
      this.plateau = this.initializePlateau();
    }
  
    initializePlateau() {
      return [
        ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
        ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
        Array(8).fill(null),
        Array(8).fill(null),
        Array(8).fill(null),
        Array(8).fill(null),
        ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
        ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
      ];
    }
  
    movePiece(start, end) {
      const [startRow, startCol] = start;
      const [endRow, endCol] = end;
  
      if (this.isValidPosition(startRow, startCol) && this.isValidPosition(endRow, endCol)) {
        const piece = this.plateau[startRow][startCol];
  
        if (piece) {
          this.plateau[startRow][startCol] = null;
          this.plateau[endRow][endCol] = piece;
        }
      }
    }
  
    isKingInCheck(color) {
      const kingPosition = this.findKingPosition(color);
  
      if (!kingPosition) {
        console.error("Position du roi introuvable.");
        return false;
      }
  
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          const piece = this.plateau[row][col];
          if (piece && piece.toUpperCase() !== color.toUpperCase()) {
            const possibleMoves = this.getValidMoves([row, col]);
            if (possibleMoves.some(move => move[0] === kingPosition.row && move[1] === kingPosition.col)) {
              return true;
            }
          }
        }
      }
  
      return false;
    }
  
    isCheckmate(color) {
      if (!this.isKingInCheck(color)) {
        return false;
      }
  
      // Vérifie si le roi peut échapper à l'échec en déplaçant ses pièces ou en bloquant l'attaque
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          const currentPosition = [i, j];
          const piece = this.getPiece(currentPosition);
  
          if (piece && piece.color === color) {
            // Essaye de déplacer chaque pièce pour bloquer l'échec
            for (let k = 0; k < 8; k++) {
              for (let l = 0; l < 8; l++) {
                const newPosition = [k, l];
  
                if (this.isValidMove(currentPosition, newPosition)) {
                  const updatedPlateau = this.simulateMove(currentPosition, newPosition);
                  const newKingPosition = updatedPlateau.findKingPosition(color);
                  const newAttackingPieces = updatedPlateau.findAttackingPieces(newKingPosition, color);
  
                  // Vérifie si le roi n'est plus en échec après le mouvement
                  if (!updatedPlateau.isKingInCheck(color) && newAttackingPieces.length === 0) {
                    return false;
                  }
                }
              }
            }
          }
        }
      }
      return true;
    }
  
    findKingPosition(color) {
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.plateau[row][col];
                if (piece && piece.toLowerCase() === 'k' && (color === undefined || piece === piece.toUpperCase())) {
                    return { row, col };
                }
            }
        }
        return null;
    }
  
    promotePawn(position, piece) {
        const [row, col] = position;
    
        if (this.plateau[row][col] === 'p') {
            this.plateau[row][col] = piece;
        } else {
            console.error('La case ne contient pas un pion à promouvoir.');
        }
    }
  
    getValidMoves(position) {
      if (!Array.isArray(position) || position.length !== 2) {
        throw new Error('Position should be an array of length 2');
      }
      const [row, col] = position;
      const piece = this.plateau[row][col];
  
      if (!piece) {
        return [];
      }
  
      const validMoves = [];
  
      switch (piece.toLowerCase()) {
        case 'p':
          const directionP = piece === 'p' ? -1 : 1; 
          const newRowP = row + directionP;
  
          if (this.isValidPosition(newRowP, col) && !this.plateau[newRowP][col]) {
            validMoves.push([newRowP, col]);
          }
          break;
  
        case 'r':
          for (let i = 0; i < 8; i++) {
            if (i !== row) {
              validMoves.push([i, col]); 
            }
            if (i !== col) {
              validMoves.push([row, i]);
            }
          }
          break;
  
        case 'n':
          const knightMoves = [
            [row - 2, col - 1], [row - 2, col + 1],
            [row - 1, col - 2], [row - 1, col + 2],
            [row + 1, col - 2], [row + 1, col + 2],
            [row + 2, col - 1], [row + 2, col + 1],
          ];
  
          for (const move of knightMoves) {
            if (this.isValidPosition(move[0], move[1])) {
              validMoves.push(move);
            }
          }
          break;
  
        case 'b':
          for (let i = 0; i < 8; i++) {
            if (i !== row) {
              validMoves.push([i, col + (i - row)]); 
              validMoves.push([i, col - (i - row)]); 
            }
          }
          break;
  
        case 'q':
          for (let i = 0; i < 8; i++) {
            if (i !== row) {
              validMoves.push([i, col]); 
              validMoves.push([i, col + (i - row)]); 
              validMoves.push([i, col - (i - row)]);
            }
            if (i !== col) {
              validMoves.push([row, i]);
            }
          }
          break;
  
        case 'k':
          const kingMoves = [
            [row - 1, col - 1], [row - 1, col], [row - 1, col + 1],
            [row, col - 1],[row, col + 1],
            [row + 1, col - 1], [row + 1, col], [row + 1, col + 1],
          ];
  
          for (const move of kingMoves) {
            if (this.isValidPosition(move[0], move[1])) {
              validMoves.push(move);
            }
          }
          break;
  
        default:
          break;
      }
  
      return validMoves;
    }
  
    isValidPosition(row, col) {
      return row >= 0 && row < 8 && col >= 0 && col < 8;
    }

    findAttackingPieces(kingPosition, color) {
        const attackingPieces = [];
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.plateau[row][col];
                if (piece && piece.toUpperCase() !== color.toUpperCase()) {
                    const possibleMoves = this.getValidMoves([row, col]);
                    if (possibleMoves.some(move => move[0] === kingPosition.row && move[1] === kingPosition.col)) {
                        attackingPieces.push({ position: [row, col], piece });
                    }
                }
            }
        }
        return attackingPieces;
    }
    
    getPiece(position) {
        const [row, col] = position;
        if (this.isValidPosition(row, col)) {
            return this.plateau[row][col];
        }
        return null;
    }
    
    simulateMove(start, end) {
        const [startRow, startCol] = start;
        const [endRow, endCol] = end;
    
        const updatedPlateau = this.copyPlateau();
    
        if (this.isValidPosition(startRow, startCol) && this.isValidPosition(endRow, endCol)) {
            const piece = updatedPlateau[startRow][startCol];
            updatedPlateau[startRow][startCol] = null;
            updatedPlateau[endRow][endCol] = piece;
        }
    
        return updatedPlateau;
    }
    
    isValidMove(start, end) {
        const [startRow, startCol] = start;
        const [endRow, endCol] = end;
    
        const piece = this.getPiece(start);
    
        if (!piece) {
            return false;
        }
    
        const validMoves = this.getValidMoves(start);
        return validMoves.some(move => move[0] === endRow && move[1] === endCol);
    }
    
    copyPlateau() {
        return this.plateau.map(row => [...row]);
    }
  }
  
  module.exports = Plateau;
  