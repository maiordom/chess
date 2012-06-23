$.extend( App.Board.prototype,
{
    getTomb: function( piece )
    {
        var a = {}, res = {};

        if ( piece.attr( "class" ).search( "piece-white" ) !== -1 )
        {
            a.tomb   = this.tomb.white;
            a.coords = this.tomb.white_coords;
        }
        else
        {
            a.tomb   = this.tomb.black;
            a.coords = this.tomb.black_coords;
        }

        a.coords.offset_x += 32;
        a.coords.left     += 32;
        a.coords.count++;

        if ( a.coords.count === 9 )
        {
            a.coords.left      = 544;
            a.coords.offset_x  = 32;
            a.coords.top      += 32;
            a.coords.offset_y += 32;
        }

        var coords = piece.parent().position();

        coords.position = "absolute";

        piece.css( coords ).appendTo( this.table );

        return a;
    },

    movePieceToTomb: function( piece )
    {
        if ( !piece.length ) { return false; }

        var obj = this.getTomb( piece );

        piece.animate( obj.coords, 500, function()
        {
            piece
                .removeClass( "ui-draggable" )
                .addClass( "piece-die" )
                .css( { top: obj.coords.offset_y, left: obj.coords.offset_x - 32 } )
                .appendTo( obj.tomb );
        });
    },

    disableSelectedCell: function()
    {
        if ( this.cell_active )
        {
            this.cell_active.removeClass( "cell-nonebck" ).removeClass( "cell-selected" );
            this.cell_active = null;

            this.table.trigger( $.Event( "onDragStop" ) );

            return true;
        }

        return false;
    },

    dropSelectedPiece: function( cell )
    {
        this.reversePlayer();

        this.table.trigger
        (
            $.Event( "onDrop",
            {
                drop: cell,
                drag: this.cell_active.find( ".piece" )
            })
        );

        this.disableSelectedCell();
    },

    setOnSelectPiece: function()
    {
        var Self = this, table = this.table, piece, cell;

        table.delegate( ".piece", "click", function( e )
        {
            piece = $( this );
            cell  = piece.parent();

            if ( cell.hasClass( "cell-selectable" ) )
            {
                Self.dropSelectedPiece( cell );
                return false;
            }

            if ( piece.hasClass( "ui-draggable-disabled" ) )
            {
                return false;
            }
            else if ( cell.hasClass( "cell-selected" ) )
            {
                Self.disableSelectedCell();
                return false;
            }

            Self.disableSelectedCell();

            Self.cell_active = piece.parent().addClass( "cell-selected" );

            table.trigger
            (
                $.Event( "onDragStart", { obj: piece } )
            );
        });
    },

    setOnDropSelectedPiece: function()
    {
        var Self = this, table = this.table;

        table.delegate( ".cell-selectable", "click", function()
        {
            Self.dropSelectedPiece( $( this ) );
        });
    },

    setOnDragAndDrop: function()
    {
        var table = this.table, Self = this, cell;

        for ( var i = 0; i < 8; i++ )
        for ( var j = 0; j < 8; j++ )
        {
            this._setDrop( i, j, table, Self );

            if ( this.cells[ i ][ j ].piece === null ) { continue; }

            this._setDrag( i, j, table, Self );
        }
    },

    _setDrag: function( i, j, table, Self )
    {
        this.cells[ i ][ j ].piece.obj.draggable(
        {
            revert: "invalid",
            containment: this.table,

            start: function( e, ui )
            {
                Self.disableSelectedCell();

                Self.cell_active = ui.helper.parent().addClass( "cell-nonebck" ).removeClass( "cell-selected" );

                table.trigger
                (
                    $.Event( "onDragStart", { obj: ui.helper } )
                );
            },

            stop: function()
            {
                Self.disableSelectedCell();
            }
        });
    },

    _setDrop: function( i, j, table, Self )
    {
        this.cells[ i ][ j ].cell.droppable(
        {
            hoverClass: "cell-available",

            drop: function( e, ui )
            {
                Self.reversePlayer();

                table.trigger( $.Event( "onDrop", { drop: $( e.target ), drag: ui.helper } ) );
            }
        });

        this.cells[ i ][ j ].cell.droppable( "disable" );
    }
});