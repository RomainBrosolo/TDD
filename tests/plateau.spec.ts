const Plateau = require('../src/plateau');

// Test du Plateau
describe('Plateau', () => {
  it('doit être initialisé correctement', () => {
    const plateau = new Plateau();
    expect(plateau).toBeDefined();
  });

  it('doit permettre le déplacement des pièces', () => {
    const plateau = new Plateau();
    
    plateau.movePiece([1, 0], [2, 0]);

    expect(plateau.plateau[1][0]).toBeNull();
    expect(plateau.plateau[2][0]).toEqual('p');
  });

  it('doit détecter l\'échec et l\'échec et mat', () => {
    const plateau = new Plateau();

    plateau.movePiece([6, 5], [4, 5]); // Déplace un pion blanc
    plateau.movePiece([1, 4], [3, 4]); // Déplace un pion noir
    plateau.movePiece([7, 3], [3, 7]); // Déplace la dame blanche pour mettre en échec

    const isInCheck = plateau.isKingInCheck('black');
    const isCheckmate = plateau.isCheckmate('black');

    expect(isInCheck).toBe(true);
    expect(isCheckmate).toBe(true);
  });

  it('doit permettre la promotion des pions', () => {
    const plateau = new Plateau();

    // Place un pion noir à la position où il sera promu
    plateau.plateau[6][0] = 'p';

    plateau.promotePawn([6, 0], 'q'); 

    expect(plateau.plateau[7][0]).toEqual('R');
});

  it('doit obtenir les mouvements valides pour une pièce', () => {
    const plateau = new Plateau();

    // Place une tour blanche au centre du plateau
    plateau.movePiece([7, 0], [3, 3]);

    const validMoves = plateau.getValidMoves([3, 3]);

    const expectedMoves = [
      [0, 3], [1, 3], [2, 3], [4, 3], [5, 3], [6, 3], [7, 3], // Mouvements horizontaux
      [3, 0], [3, 1], [3, 2], [3, 4], [3, 5], [3, 6], [3, 7], // Mouvements verticaux
    ];

    expect(validMoves).toEqual(expect.arrayContaining(expectedMoves));
    expect(validMoves.length).toEqual(expectedMoves.length);
  });

  it('doit vérifier si le roi est en échec', () => {
    const plateau = new Plateau();

    // Place une dame noire et un roi blanc dans une position où le roi est en échec
    plateau.movePiece([7, 3], [3, 7]); // Déplace la dame noire
    plateau.movePiece([0, 4], [5, 4]); // Déplace le roi blanc

    // Vérifie si le roi blanc est en échec
    const isInCheck = plateau.isKingInCheck('white');

    expect(isInCheck).toBe(true);
  });

  it('doit vérifier si le roi est en échec et mat', () => {
    const plateau = new Plateau();

    // Place une dame noire et un roi blanc dans une position d'échec et mat
    plateau.movePiece([7, 3], [3, 7]); // Déplace la dame noire
    plateau.movePiece([0, 4], [5, 4]); // Déplace le roi blanc
    plateau.movePiece([7, 2], [4, 5]); // Déplace le fou noir

    // Vérifie si le roi blanc est en échec et mat
    const isCheckmate = plateau.isCheckmate('white');

    expect(isCheckmate).toBe(true);
  });

  it('doit vérifier si une position est valide', () => {
    const plateau = new Plateau();

    // Vérifie plusieurs positions
    const isValidPosition1 = plateau.isValidPosition(0, 0);
    const isValidPosition2 = plateau.isValidPosition(7, 7);
    const isValidPosition3 = plateau.isValidPosition(-1, 3);
    const isValidPosition4 = plateau.isValidPosition(8, 4);

    expect(isValidPosition1).toBe(true);
    expect(isValidPosition2).toBe(true);
    expect(isValidPosition3).toBe(false);
    expect(isValidPosition4).toBe(false);
  });

  it('doit simuler un mouvement et obtenir la nouvelle position du roi', () => {
    const plateau = new Plateau();

    // Place une dame noire et un roi blanc dans une position où le roi est en échec
    plateau.movePiece([7, 3], [3, 7]); // Déplace la dame noire
    plateau.movePiece([0, 4], [5, 4]); // Déplace le roi blanc

    // Simule un mouvement poiur obtenir la nouvelle position du roi
    const newKingPosition = plateau.findKingPosition('white');

    expect(newKingPosition).toEqual({ row: 7, col: 4 });
  });

  it('doit détecter l\'échec avec une position spécifique', () => {
    const plateau = new Plateau();
  
    // Place une dame noire à une position où le roi blanc est en échec
    plateau.movePiece([5, 3], [3, 7]); // Déplace la dame noire
  
    // Vérifie si le roi blanc est en échec
    const isInCheck = plateau.isKingInCheck('white');

    expect(isInCheck).toBe(true);
  });
});
