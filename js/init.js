$( document ).ready( function()
{
    var
        board = new App.Board(),
        path  = App.Path( board.cells ),
        rules = App.Rules( board, path ),
        test  = App.Test();

    App.Instances =
    {
        board: board,
        path:  path,
        rules: rules,
        test:  test
    };

    App.Game();
});