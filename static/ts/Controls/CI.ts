import { estado, postura } from "../Environment/Characters/character.js";
import { Player } from "../Environment/Characters/player.js";
import { checkKeys } from "./MAK.js";
import { checkPads } from "./Gamepad.js";
import { Proximity, RemoveFromArray } from "../Tools/tools.js";
import { itens, excluirItem } from "../Environment/tobi.js";

let v = 3;
class ControlsInterface {
    up: boolean;
    down: boolean;
    left: boolean;
    right: boolean;
    run: boolean;
    reload: boolean;
    take: boolean;
    primaryAction: boolean;
    secondaryAction: boolean;
    x : number;
    y : number;
    mode: any;  //função que altera as propriedades da ControlsInterface

    constructor(mode) {
        this.up = false;
        this.down = false;
        this.left = false;
        this.right = false;

        this.run = false;
        this.reload = false;
        this.take = false;

        this.primaryAction = false;
        this.secondaryAction = false;

        this.x = 0;
        this.y = 0;

        this.mode = mode;
    }

    checkMode() {
        this.mode(this)
    }
}

function checkControls(controlMode : ControlsInterface, x, y, player : Player) {

    controlMode.checkMode()

    if (controlMode.run) { //Correr
        v = player.velocidade;
    } else {
        v = 3;
    }

    if (controlMode.reload) { //Recarregar
        player.recarregarArma();
    } else {    //quando soltar o botão está pronto para recarregar
        player.prontoRecarregar();
    }

    if (controlMode.take) { //Pegar
        let o = Proximity([player.sprites.posX, player.sprites.posY], itens, 100);   //se estiver perto armazena e 'o'
        player.usar(o); //tenta usar o item 'o' (guardar ou equipar [munição ou mochila])
        excluirItem(o)  //remove o item de ser renderizado
    }

    if (controlMode.up) { //Cima
        player.andar('c', v);
    } else {
        player.postura = postura(player, estado.PARADO_D);
    }
    if (controlMode.down) { //Baixo
        player.andar('b', v);
    } else {
        player.postura = postura(player, estado.PARADO_D);
    }
    if (controlMode.left) { //Esquerda
        player.andar('e', v);
    } else {
        player.postura = postura(player, estado.PARADO_D);
    }
    if (controlMode.right) { //Direita
        player.andar('d', v);
    } else {
        player.postura = postura(player, estado.PARADO_D);
    }

    if (controlMode.primaryAction) {    //ação primária
        player.agir(1, controlMode.x, controlMode.y)
    }
    if (controlMode.secondaryAction) {  //ação secundária
        player.agir(2, controlMode.x, controlMode.y)
    }

}

function loadControls(config) {
    if(config.controlMode == "Gamepad") {
        return new ControlsInterface(checkPads);    //gamepad
    } else {
        return new ControlsInterface(checkKeys);    //mouse e teclado
    }
}

export { checkControls, loadControls, ControlsInterface }
