
//Indicam o postura do personagem, os valores se referem a linha no sprite com a respectivo postura
const PARADO_A = 0;
const ANDANDO_A_FRENTE = 1;
const ANDADADO_A_COSTAS = 2;
const ANDANDO_A_ESQUERDA = 3;
const ANDANDO_A_DIREITA = 4;
const PARADO_D = 5;
const ANDANDO_D_FRENTE = 6;
const ANDADADO_D_COSTAS = 7;
const ANDANDO_D_ESQUERDA = 8;
const ANDANDO_D_DIREITA = 9;


class Personagem {
    constructor (nome, velocidade, energia, vida = [ 2 ], spriteParams, posicao = [ 2 ]) {
        this.nome = nome;
        this.velocidade = velocidade;
        this.energia = energia;
        this.vida = vida;
        this.arma = null;
        this.sprites = Sprites(spriteParams);
        this.posicao = posicao;
        this.postura = 5;    //parado desarmado
    }
    spawn (x, y) {
        this.sprites.render(x, y);
    }
    atirar () {
        drawTiro(balaPistola, this.arma, tirosNoAr, [ mouseX, mouseY ], CONTEXT);
    }
    equipar (arma) {
        if (this.arma == null) {
            this.arma = arma;
            this.arma.anatomia.pArma[0] = this.posicao[0] + 20;
            this.arma.anatomia.pArma[1] = this.posicao[1] + 45;
            this.postura -= 5;   //todos os posturas armados sao (desarmado - 5)
        }
    }
    andar (direcao) {
        let v = 3;
        if (direcao == 'c') {
            this.postura = postura(this, ANDADADO_D_COSTAS);
            if (mouseY > this.posicao[1]) {
                //anda para cima olhando para baixo
                this.postura = postura(this, ANDANDO_D_FRENTE);
            }
            this.posicao[1] -= v;
        }
        if (direcao == 'b') {
            this.postura = postura(this, ANDANDO_D_FRENTE);
            if (mouseY < this.posicao[1]) {
                //anda para baixo olhando para cima
                this.postura = postura(this, ANDADADO_D_COSTAS);
            }
            this.posicao[1] += v;
        }
        if (direcao == 'e') {
            this.postura = postura(this, ANDANDO_D_ESQUERDA);
            if (mouseX > this.posicao[0]) {
                //anda para esquerda olhando para direita
                this.postura = postura(this, ANDANDO_D_DIREITA);
            }
            this.posicao[0] -= v;
        }
        if (direcao == 'd') {
            this.postura = postura(this,ANDANDO_D_DIREITA);
            if (mouseX < this.posicao[0]) {
                this.postura = postura(this, ANDANDO_D_ESQUERDA);
                //anda para direita olhando para esquerda
            }
            this.posicao[0] += v;
        }

        //quadros de movimento
        this.sprites.quadroInicial = 1;
        this.sprites.quadroFinal = 2;

        this.sprites.update(this.sprites.quadroInicial, this.sprites.quadroFinal);
        this.sprites.render(this.posicao[0], this.posicao[1]);
    }
    update () {
        if (mouseY < this.posicao[1]) {
            this.postura = postura(this, ANDADADO_D_COSTAS);
        } else {
            if (mouseX > this.posicao[0]) {    //mira a direita
                this.postura = postura(this, ANDANDO_D_DIREITA);
            }
            if (mouseX < this.posicao[0]) {
                this.postura = postura(this, ANDANDO_D_ESQUERDA);
            }
        }

        function renderArma (pers) {
            if (pers.arma != null) {
                pers.arma.anatomia.pArma[0] = pers.posicao[0] + 20;
                pers.arma.anatomia.pArma[1] = pers.posicao[1] + 45;

                drawArma(pers.arma, CONTEXT, [ mouseX, mouseY ]);
                return pers;
            }
        }
        function renderPersonagem (pers) {
            pers.sprites.update();
            pers.sprites.render(pers.posicao[0], pers.posicao[1], pers.postura);
        }

        //utilizado para "layer" com a arma (a frente ou atrás)
        if (this.postura == 2 || this.postura == 7) {
            //arma ao fundo
            renderArma(this);
            renderPersonagem(this);
        } else {
            renderPersonagem(this);
            renderArma(this);
        }
    }
}

function postura (pers, e) {
    //uso: a considerar postura desarmada, ja que a postura armada é a desarmada - 5
    if (pers.arma == null) { //desarmado
        return e;
    } else {
        return e - 5;
    }
}

const MILITAR_SHEET = new Image();
MILITAR_SHEET.src = './resources/char/char_militar1_sheet.png';
