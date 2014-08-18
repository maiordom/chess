App.Board = function() {
    this.cell_active = null;
    this.moved_path  = null;
    this.table       = null;
    this.container   = null;
    this.king_danger = false;
    this.cells       = [];
    this.letters     = [ "A", "B", "C", "D", "E", "F", "G", "H" ];
    this.pnames      = [ "rook", "knight" , "bishop", "queen", "king", "bishop", "knight", "rook", "pawn" ];
    this.colors      = [ "white", "black" ];

    this.player = "black";

    this.queue_players = {
        white: "black",
        black: "white"
    };

    this.tomb = {
        white:  null,
        black:  null,
        white_coords: {
            count:    0,
            left:     512,
            top:      0,
            offset_x: 0,
            offset_y: 0
        },
        black_coords: {
            count:    0,
            left:     512,
            top:      448,
            offset_x: 0,
            offset_y: 0
        }
    };

    this.current_player = {
        white: $( ".b-player__current .piece-white.piece__king" ),
        black: $( ".b-player__current .piece-black.piece__king" )
    };

    this.init();
};

App.Board.prototype = {
    init: function() {
        this.drawBoard();
        this.setCells();
        this.drawPieces();
    },

    setMoves: function() {
        this.setOnDragAndDrop();
        this.setOnDropSelectedPiece();
        this.setOnSelectPiece();

        this.reversePlayer( "white" );
    },

    setHelpers: function() {
        this.drawCoords();
        this.appendRightColumn();
    },

    setNewQueen: function( x, y ) {
        var cell = this.getCell( x, y );

        cell.piece = {
            color: this.queue_players[ this.player ],
            obj:   cell.piece.obj.addClass( "piece__queen" ).attr( "data-type", "queen" ),
            name:  "queen"
        };
    },

    reversePlayer: function() {
        this.current_player[ this.player ].hide();

        this.player = this.queue_players[ this.player ];

        this.current_player[ this.player ].show();

        for ( var i = 0; i < 8; i++ )
        for ( var j = 0; j < 8; j++ ) {
            if ( !this.getCell( i, j ).piece ) { continue; }

            this.getCell( i, j ).piece.color !== this.player ?
                this.getCell( i, j ).piece.obj.draggable( "disable" ) :
                this.getCell( i, j ).piece.obj.draggable( "enable" );
        }
    },

    setMovedPath: function( from_x, from_y, to_x, to_y ) {
        if ( this.moved_path ) {
            this.removeMovedPath.apply( this, this.moved_path );
        }

        this.moved_path = arguments;
        this.cells[ to_y ][ to_x ]    .cell.addClass( "cell-moved" );
        this.cells[ from_y ][ from_x ].cell.addClass( "cell-moved" );
    },

    setPiece: function( x, y, piece_obj ) {
        this.cells[ y ][ x ].piece = piece_obj;
    },

    getCell: function( x, y ) {
        return this.cells[ y ][ x ];
    },

    removeMovedPath: function( from_x, from_y, to_x, to_y ) {
        this.cells[ to_y ][ to_x ]    .cell.removeClass( "cell-moved" );
        this.cells[ from_y ][ from_x ].cell.removeClass( "cell-moved" );
    },

    moveCell: function( from_x, from_y, to_x, to_y ) {
        var
            to_cell   = this.cells[ to_y ][ to_x ],
            from_cell = this.cells[ from_y ][ from_x ];

        to_cell.piece   = from_cell.piece;
        from_cell.piece = null;

        return [ to_cell, from_cell ];
    },

    moveCellWithPiece: function( from_x, from_y, to_x, to_y ) {
        var cells = this.moveCell.apply( this, arguments );

        cells[ 0 ].cell.append( cells[ 0 ].piece.obj );
    },

    removeCell: function( x, y ) {
        this.cells[ y ][ x ].piece = null;
    },

    setNotAvailableCastling: function( from_x, from_y, to_x, to_y ) {
        var piece = this.getCell( to_x, to_y ).piece;

        if ( piece.name === "rook" || piece.name === "king" ) {
            piece.available_castling = false;
        }
    },

    makeCastling: function( from_x, from_y, to_x, to_y ) {
        var piece = this.getCell( to_x, to_y ).piece;

        if ( piece.name === "king" && piece.available_castling ) {
            if ( to_x === 6 ) {
                this.moveCellWithPiece( to_x + 1, to_y, to_x - 1, to_y );
            }
            else if ( to_x === 1 ) {
                this.moveCellWithPiece( to_x - 1, to_y, to_x + 1, to_y );
            }
        }
    },

    setCellsAsAvailable: function( data ) {
        for ( var i = data.length; i--; ) {
            this.getCell( data[ i ].x, data[ i ].y ).cell.droppable( "enable" );
            this.getCell( data[ i ].x, data[ i ].y ).cell.addClass( "cell-selectable" );
        }
    },

    setCellsAsDefault: function( data ) {
        for ( var i = data.length; i--; ) {
            this.getCell( data[ i ].x, data[ i ].y ).cell.droppable( "disable" );
            this.getCell( data[ i ].x, data[ i ].y ).cell.removeClass( "cell-selectable" );
        }
    },

    getCoordsByCell: function( cell, is_parent ) {
        cell = is_parent === true ? cell : cell.parent();

        var coords = cell.data( "coords" ).match( /\d+/g );

        return [ parseInt( coords[ 0 ] ), parseInt( coords[ 1 ] ) ];
    }
};