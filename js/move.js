$.extend( App.Board.prototype,
{
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
        this.player = this.queue_players[ this.player ];

        this.table.trigger
        (
            $.Event( "onDrop",
            {
                drop: cell,
                drag: this.cell_active.find( ".piece" )
            })
        );

        this.disableSelectedCell();
        this.reversePlayer( this.player );
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
                Self.player = Self.queue_players[ Self.player ];

                table.trigger( $.Event( "onDrop", { drop: $( e.target ), drag: ui.helper } ) );

                Self.reversePlayer( Self.player );
            }
        });

        this.cells[ i ][ j ].cell.droppable( "disable" );
    }
});