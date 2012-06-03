$(document).ready(function()
{
    var
        board = new App.Board(),
        path  = App.Path( board.cells ),
        rules = App.Rules( board, path );

    App.Instances =
    {
        board: board,
        path:  path,
        rules: rules
    };

    App.Game();
});