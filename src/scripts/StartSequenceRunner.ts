class StartSequenceRunner {

    public static starterPicked: GameConstants.Starter = GameConstants.Starter.None

    public static start() {
        App.game.gameState = GameConstants.GameState.paused;
        $('#startSequenceModal').modal('show');

    }

    public static pickStarter(s: GameConstants.Starter) {
        this.starterPicked = s;
        $('#pickStarterModal').modal('hide');
        const dataPokemon = PokemonHelper.getPokemonByName(GameConstants.Starter[this.starterPicked]);
        const shiny: boolean = PokemonFactory.generateShiny(GameConstants.SHINY_CHANCE_BATTLE);

        App.game.gameState = GameConstants.GameState.fighting;

        const battlePokemon = new BattlePokemon(dataPokemon.name, dataPokemon.id, dataPokemon.type1, dataPokemon.type2, 10, 1, 100, 0, 0, shiny);
        Battle.enemyPokemon(battlePokemon);
        // Set the function to call showCaughtMessage after pokemon is caught
        battlePokemon.isAlive = function () {
            if (battlePokemon.health() <= 0) {
                setTimeout(
                    function () {
                        player.starter = StartSequenceRunner.starterPicked;
                        StartSequenceRunner.showCaughtMessage();
                    }, 1000);

                //reset the function so you don't call it too many times :)
                //What a beautiful piece of code
                battlePokemon.isAlive = function () {
                    return false;
                };
            }
            return this.health() > 0;
        };
    }

    public static showCaughtMessage() {
        App.game.gameState = GameConstants.GameState.paused;
        $('#starterCaughtModal').modal('show');
        $('#pokeballSelector').css('display', 'block');
        $('#pokemonListContainer').css('display', 'block');
        $('#oakItemsContainer').css('display','block');
        $('#questDisplayContainer').css('display','block');
    }
}

document.addEventListener('DOMContentLoaded', function (event) {

    $('#startSequenceModal').on('hidden.bs.modal', function () {
        $('#pickStarterModal').modal('show');

    });

    $('#pickStarterModal').on('hidden.bs.modal', function () {
        if (StartSequenceRunner.starterPicked == GameConstants.Starter.None) {
            $('#pickStarterModalText').text("I can't hold off all three! Please pick the pokémon you want to fight!");
            $('#pickStarterModal').modal('show');
        }
    });

    $('#starterCaughtModal').on('hidden.bs.modal', function () {
        Save.store(player);
        App.game.gameState = GameConstants.GameState.fighting;

    });
});
