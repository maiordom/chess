$.extend( App.Board.prototype,
{
    drawBoard: function()
    {
        var board, container, wrapper, back, tr, i, j;

        board     = $( ".desk" );
        wrapper   = $( ".desk__wrapper" );
        container = $( ".desk__container" );
        back      = $( "<div>" ).addClass( "cell-background" );

        for ( i = 0; i < 8; i++ )
        {
            tr = $( "<div>" ).appendTo( board ).addClass( "row" );

            for ( j = 0; j < 8; j++ )
                $( "<div class='cell'>" ).append( back.clone() ).appendTo( tr );
        }

        this.table     = board;
        this.wrapper   = wrapper;
        this.container = container;
    },

    drawCoords: function()
    {
        var
            lrow  = $( "<div>" ).addClass( "row_letters" ),
            nrow  = $( "<div>" ).addClass( "row_numbers" ),
            lcell = $( "<div>" ).addClass( "cell-letter" ),
            ncell = $( "<div>" ).addClass( "cell-number" );

        for ( var i = 0, len = this.letters.length; i < len; i++)
        {
            lrow.append( lcell.clone().text( this.letters[ i ] ) );
            nrow.append( ncell.clone().text( len - i ) );
        }

        lrow.appendTo( this.table );
        nrow.appendTo( this.table );
    },

    drawPieces: function()
    {
        var a = this, c = this.cells;

        for ( var i = 0; i < 8; i++ )
        {
            c[ 1 ][ i ].piece = new App.Piece( a.pnames[ 8 ], a.colors[ 0 ], c[ 1 ][ i ].cell );
            c[ 0 ][ i ].piece = new App.Piece( a.pnames[ i ], a.colors[ 0 ], c[ 0 ][ i ].cell );

            c[ 6 ][ i ].piece = new App.Piece( a.pnames[ 8 ], a.colors[ 1 ], c[ 6 ][ i ].cell );
            c[ 7 ][ i ].piece = new App.Piece( a.pnames[ i ], a.colors[ 1 ], c[ 7 ][ i ].cell );
        }

        this.setCellsColor();
    },

    appendRightColumn: function()
    {
        var column = $( ".b-column_right" ).show();

        this.tomb.white = column.find( ".b-tomb-white" );
        this.tomb.black = column.find( ".b-tomb-black" );

        this.wrapper.append( column );
    },

    setCellsColor: function()
    {
        this.table.find( ".row:even .cell:even, .row:odd .cell:odd" ).addClass( "cell-white" );
        this.table.find( ".row:even .cell:odd,  .row:odd .cell:even" ).addClass( "cell-black" );
    },

    setCells: function()
    {
        var tr = this.table.find( ".row" ), td, i, j;

        for ( i = 8; i--; )
        {
            this.cells[ i ] = [];

            for ( j = 0; j < 8; j++ )
            {
                td = tr.eq( i ).find( ".cell" );
                td.eq( j ).attr( "data-coords", j + "-" + ( 7 - i ) );

                this.cells[ i ][ j ] =
                {
                    cell:  td.eq( j ),
                    piece: null
                };
            }
        }

        this.cells.reverse();
    }
});