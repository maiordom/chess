App.Game = function()
{
    var
        TPath  = App.Instances.path,
        TBoard = App.Instances.board,
        TRules = App.Instances.rules,
        TStart = App.Instances.start,
        Self   = {};

    Self =
    {
        curr_path: [],

        white:
        {
            danger:  false,
            message: [ "black_check", "white_win" ]
        },

        black:
        {
            danger: false,
            message: [ "white_check", "black_win" ]
        },

        onOpenDemo: function()
        {
            TStart.onOpenDemo( function()
            {
                TBoard.setMoves();
                TBoard.setHelpers();
            });
        },

        onDragStart: function()
        {
            TBoard.table.bind( "onDragStart", function( e )
            {
                Self.drawPiecePath( e );
            });
        },

        onDragStop: function()
        {
            TBoard.table.bind( "onDragStop", function()
            {
                TBoard.setCellsAsDefault( Self.curr_path );
            });
        },

        onDrop: function()
        {
            TBoard.table.bind( "onDrop", function( e )
            {
                var
                    from   = TBoard.getCoordsByCell( e.drag ),
                    to     = TBoard.getCoordsByCell( e.drop, true ),
                    coords = from.concat( to );

                TBoard.moveCell.apply( TBoard, coords );
                TBoard.makeCastling.apply( TBoard, coords );
                TBoard.setNotAvailableCastling.apply( TBoard, coords );
                TBoard.setMovedPath.apply( TBoard, coords );
                TRules.pawnChecking( coords[ 2 ], coords[ 3 ] );
                Self.checkKingDanger();
                TBoard.movePieceToTomb( e.drop.find( ".piece" ) );
                
                e.drop.append( e.drag.css( { top: "", left: "" } ) );
            });
        },

        checkKingDanger: function()
        {
            if ( TRules.isKingDanger( TBoard.player ) )
            {
                var
                    player = TBoard.queue_players[ TBoard.player ],
                    type   = TRules.isEnd( TBoard.player );

                alert( Self[ player ].message[ type ] );

                Self[ TBoard.player ].danger = true;
            }
            else
            {
                Self[ TBoard.player ].danger = false;
            }
        },

        drawPiecePath: function( e )
        {
            var
                path   = [],
                type   = e.obj.attr( "data-type" ),
                coords = TBoard.getCoordsByCell( e.obj );

            path = TPath.getPathByType( coords[ 0 ], coords[ 1 ], type );

            TRules.deleteForbiddenMoves( coords[ 0 ], coords[ 1 ], TBoard.player, path );

            if ( type === "king" && !Self[ TBoard.player ].danger )
            {
                Self.getCastlingPath( coords[ 0 ], coords[ 1 ], path );
            }

            TBoard.setCellsAsAvailable( path );

            Self.curr_path = path;

            console.log( type + " :", { data: path } );

            return path;
        },

        getCastlingPath: function( x, y, path )
        {
            var o = TPath.isAvailableCastling( x, y );

            if ( o.left_path.empty && o.left_path.rook )
            {
                TRules.deleteForbiddenMoves( x, y, TBoard.player, o.left_path.path );

                if ( o.left_path.path.length === 3 )
                {
                    path.push( App.Point( 1, y ) );

                    console.log( "левый путь для рокировки доступен" );
                }
            }

            if ( o.right_path.empty && o.right_path.rook )
            {
                TRules.deleteForbiddenMoves( x, y, TBoard.player, o.right_path.path );

                if ( o.right_path.path.length === 2 )
                {
                    path.push( App.Point( 6, y ) );

                    console.log( "правый путь для рокировки доступен" );
                }
            }
        }
    };

    Self.onDragStart();
    Self.onDragStop();
    Self.onDrop();
    Self.onOpenDemo();
};