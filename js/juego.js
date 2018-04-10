var Juego = {

  grilla : [],
  piezas : [],
  cantidadDePiezasPorLado : 0,
  anchoPiezas: 0,
  altoPiezas: 0,
  anchoDeRompecabezas: 0,
  altoDeRompecabezas: 0,
  imagen: '',
  movimientosTotales: 0,
  contadorDeMovimientos: 0,
  posicionFilaVacia: 0,
  posicionColumnaVacia: 0,
  canvas: '',
  contexto: '',
  cronometro: 0,


  crearGrilla: function(){
    this.grilla.length = this.cantidadDePiezasPorLado;
    for (var fila = 0; fila< this.cantidadDePiezasPorLado; fila++) {
       this.grilla[fila] = new Array(this.cantidadDePiezasPorLado);
    }
    this.llenarGrilla();
  },

  llenarGrilla: function(){
    var contador= -1;
    for (var fila = 0; fila < this.cantidadDePiezasPorLado; fila++) {
      for (var columna = 0; columna< this.cantidadDePiezasPorLado; columna++) {
        contador++;
        this.grilla[fila][columna] = contador;
      }
    }
  },

  moverConClick: function(){
    var posicionClick = new Object;
    posicionClick.columna = 0;
    posicionClick.fila = 0;
    self = this;
    this.canvas.addEventListener("click", function(evento){
      posicionClick.columna = Math.floor((evento.pageX - this.offsetLeft) / self.anchoPiezas);
      posicionClick.fila = Math.floor((evento.pageY - this.offsetTop) / self.altoPiezas);
      if (self.chequearSiGano() == false && self.chequearSiPerdio() == false){
        if (self.calcularDistanciaPiezaVacia(posicionClick.fila, posicionClick.columna, self.posicionFilaVacia, self.posicionColumnaVacia) == 1) {
          self.intercambiarPosiciones(self.posicionFilaVacia, self.posicionColumnaVacia, posicionClick.fila, posicionClick.columna);
          self.actualizarPosicionVacia(posicionClick.fila,  posicionClick.columna);
          self.calcularMovimientosRestantes();
        }
      }
      if(self.chequearSiGano()){
        self.mostrarCartelGanador();
        self.dibujarImagen();
        self.detenerCronometro();
      }
      if(self.chequearSiPerdio()){
        sweetAlert("Perdiste");
        self.detenerCronometro();
      }
    });
  },

  calcularDistanciaPiezaVacia: function(posicionNuevaFilaVacia, posicionNuevaColumnaVacia, posicionFilaVacia, posicionColumnaVacia) {
    return Math.abs(posicionNuevaFilaVacia - posicionFilaVacia) + Math.abs(posicionNuevaColumnaVacia - posicionColumnaVacia);
  },

  dibujarImagen: function(){
    this.contexto.drawImage(this.imagen, 0, 0);
  },

  capturarTeclas: function(){
    var self = this;
    document.onkeydown = (function(evento) {
      if(evento.which == 40 || evento.which == 38 || evento.which == 39 || evento.which == 37){
        self.calcularMovimientosRestantes();
        self.moverEnDireccion(evento.which);
        if(self.chequearSiGano()){
          setTimeout(function(){
            self.dibujarImagen();
            self.detenerCronometro();
            self.mostrarCartelGanador();
          },50);
        }
        if(self.chequearSiPerdio()) {
          self.detenerCronometro();
          self.detenerCapturarTeclas();
          sweetAlert("Perdiste");
        }
        evento.preventDefault();
      }
    });
  },

  detenerCapturarTeclas: function(){//https://stackoverflow.com/questions/3036243/cancel-the-keydown-in-html
    var cancelKeypress = false;
    document.onkeydown = function(evt) {
      evt = evt || window.event;
      cancelKeypress = /^(13|32|37|38|39|40)$/.test("" + evt.keyCode);
      if (cancelKeypress) {
        return false;
      }
    }
  },

  mostrarCartelGanador: function(){
    if(this.chequearSiGano()) {
      this.detenerCapturarTeclas();
      sweetAlert("¡¡¡GANASTE!!!");
    }
  },

  // Esta función va a chequear si el Rompecabezas est&aacute; en la posición ganadora
  chequearSiGano: function(){
    var tamañoDeLaGrilla = this.grilla.length * this.grilla.length;
    var ubicacionCorrecta = 0;
    var grillaOrdenada = tamañoDeLaGrilla;

    for (var fila= 0; fila < this.grilla.length; fila++) {
     for (var columna= 0; columna < this.grilla.length; columna++) {
       if(this.grilla[fila][columna] == ubicacionCorrecta) {
         ubicacionCorrecta++;
       }else {
         ubicacionCorrecta = 0;
       }
     }
    }
    return(ubicacionCorrecta == grillaOrdenada);
  },

  chequearSiPerdio: function(){
    return(this.contadorDeMovimientos == 0);
  },

  mezclarPiezas: function(veces){
    if(veces<=0){return;}
    var direcciones = [40, 38, 39, 37];
    var direccion = direcciones[Math.floor(Math.random()*direcciones.length)];
    this.moverEnDireccion(direccion);
    self = this

    setTimeout(function(){
      self.mezclarPiezas(veces-1);
    },1);
  },

  // Movimiento de fichas, en este caso la que se mueve es la blanca intercambiando
  // su posición con otro elemento
  moverEnDireccion: function(direccion){
    var nuevaFilaPiezaVacia;
    var nuevaColumnaPiezaVacia;

    // Intercambia pieza blanca con la pieza que está arriba suyo
    if(direccion == 40){

      nuevaFilaPiezaVacia = this.posicionFilaVacia-1;
      nuevaColumnaPiezaVacia = this.posicionColumnaVacia;
    }
    // Intercambia pieza blanca con la pieza que está abajo suyo
    else if(direccion == 38) {
      nuevaFilaPiezaVacia = this.posicionFilaVacia+1;
      nuevaColumnaPiezaVacia = this.posicionColumnaVacia;
    }
    // Intercambia pieza blanca con la pieza que está a su izq
    else if(direccion == 39) {
      nuevaFilaPiezaVacia = this.posicionFilaVacia;
      nuevaColumnaPiezaVacia = this.posicionColumnaVacia-1;
    }
    // Intercambia pieza blanca con la pieza que está a su der
    else if(direccion == 37) {
      nuevaFilaPiezaVacia = this.posicionFilaVacia;
      nuevaColumnaPiezaVacia = this.posicionColumnaVacia+1;

    }
    // Se chequea si la nueva posición es válida, si lo es, se intercambia
    if(this.posicionValida(nuevaFilaPiezaVacia, nuevaColumnaPiezaVacia)){
      this.intercambiarPosiciones(this.posicionFilaVacia, this.posicionColumnaVacia,
      nuevaFilaPiezaVacia, nuevaColumnaPiezaVacia);
      this.actualizarPosicionVacia(nuevaFilaPiezaVacia, nuevaColumnaPiezaVacia);
    }
  },

  // Para chequear si la posicón está dentro de la grilla.
  posicionValida: function(fila, columna){
    return ((fila  >=0 && fila <this.cantidadDePiezasPorLado) && (columna >=0 && columna <this.cantidadDePiezasPorLado));
  },

  // Intercambia posiciones grilla y en el DOM
  intercambiarPosiciones: function(filaPiezaVacia, columnaPiezaVacia, filaNuevaPiezaVacia, columnaNuevaPiezaVacia){
    //Busqueda de posicion de la piezas en la grilla
    var piezaVacia = this.grilla[filaPiezaVacia][columnaPiezaVacia];
    var nuevaPiezaVacia = this.grilla[filaNuevaPiezaVacia][columnaNuevaPiezaVacia];
    var self = this;

    this.piezas.forEach(function(primerPieza, primerPosicion){
      if (piezaVacia == primerPosicion) {
        self.piezas.forEach(function(segundaPieza, segundaPosicion){
          if (nuevaPiezaVacia == segundaPosicion) {
            //Cambio de coordenadas de las piezas
            var cordenadaX = 0;
            var coordenadaY = 0;
            cordenadaX = primerPieza.xActual;
            coordenadaY = primerPieza.yActual;
            primerPieza.xActual = segundaPieza.xActual;
            primerPieza.yActual = segundaPieza.yActual;
            segundaPieza.xActual = cordenadaX;
            segundaPieza.yActual = coordenadaY;

            // Cambio de posiciones en la grilla
            self.grilla[filaPiezaVacia][columnaPiezaVacia] = nuevaPiezaVacia;
            self.grilla[filaNuevaPiezaVacia][columnaNuevaPiezaVacia] = piezaVacia;

            //Cambio de posiciones en canvas
            self.contexto.fillStyle="black";
            self.contexto.fillRect(primerPieza.xActual, primerPieza.yActual, self.anchoPiezas, self.altoPiezas);
            self.contexto.drawImage(self.imagen, segundaPieza.xOriginal, segundaPieza.yOriginal, self.anchoPiezas,
              self.altoPiezas, segundaPieza.xActual, segundaPieza.yActual , self.anchoPiezas, self.altoPiezas);
            self.contexto.strokeRect(segundaPieza.xActual, segundaPieza.yActual, self.anchoPiezas, self.altoPiezas);
          }
        });
      }
    });
  },

  // Actualiza la posición de la pieza vacía
  actualizarPosicionVacia: function(nuevaFila,nuevaColumna){
    this.posicionFilaVacia = nuevaFila;
    this.posicionColumnaVacia = nuevaColumna;
  },

  //se carga la imagen del rompecabezas
  cargarImagen: function () {
    //se calcula el ancho y el alto de las piezas de acuerdo al tamaño del canvas (600).
    this.anchoPiezas = Math.floor(600 / this.cantidadDePiezasPorLado);
    this.altoPiezas = Math.floor(600 / this.cantidadDePiezasPorLado);
    //se calcula el ancho y alto del rompecabezas de acuerdo al ancho y alto de cada pieza y la cantidad de piezas por lado
    this.anchoDeRompecabezas = this.anchoPiezas * this.cantidadDePiezasPorLado;
    this.altoDeRompecabezas = this.altoPiezas * this.cantidadDePiezasPorLado;
    this.configurarCanvas();
  },

  configurarCanvas: function(){
    this.canvas = document.getElementById("canvas");
    this.contexto = canvas.getContext("2d");

  },

  //funcion que carga la imagen
  iniciarImagen: function (callback) {
    this.cargarImagen();
    var self = this;
    //se espera a que se termine de cargar la imagen antes de ejecutar la siguiente funcion
    this.imagen.addEventListener('load', function () {
      self.cargarImagen.call(self);
      callback();
    }, false);
  },

  cambiarImagen: function(){
    self = this;
    $("#imagenes").on("click", "img",function(){
      self.imagen.src = $(this).attr("src");

      if (self.cantidadDePiezasCorrecta()) {
      self.modificarDificultad();
      }else {
        self.cantidadDePiezasPorLado = 0;
      }
    });
  },

  cantidadDePiezasCorrecta : function(){
    var piezasPorLado = 0;
    piezasPorLado = document.getElementById("cantidadPiezasPorLado").value;
    return(piezasPorLado>=2&& piezasPorLado<=10);
  },

  calcularCantidadDeMovimientos: function(){
    //limita la cantidad de piezas por lado ingreasada por el usuario
    if (this.cantidadDePiezasCorrecta()) {
      this.modificarDificultad();
    }else {
      this.cantidadDePiezasPorLado = 0;
      sweetAlert("El valor ingresado no es correcto");
    }
  },

  calcularMovimientosRestantes: function(){
    this.contadorDeMovimientos = this.contadorDeMovimientos-1;
    document.getElementById("contadorDeMovimientos").innerHTML = this.contadorDeMovimientos;
  },

  modificarDificultad: function(){
    //seleccion de dificultad
    var dificultad = document.getElementsByName("dificultad");
    var cantidadPiezas = document.getElementById("cantidadPiezasPorLado").value;
    for (var i = 0; i < dificultad.length; i++) {
      if (dificultad[i].checked) {
        switch (dificultad[i].value) {
          case "facil":
            this.iniciar(cantidadPiezas*40);
            break;
          case "medio":
            this.iniciar(cantidadPiezas*35);
            break;
          case "dificil":
            this.iniciar(cantidadPiezas*30);
            break;
        }
      }
    }
  },

  construirPiezas: function(){
    for (var fila= 0; fila < Juego.cantidadDePiezasPorLado; fila++) {
      for (var columna= 0; columna < Juego.cantidadDePiezasPorLado; columna++) {
        if (fila == this.posicionFilaVacia && columna == this.posicionColumnaVacia) {
          var piezaVacia = new Pieza(this.anchoPiezas*columna, this.altoPiezas*fila, this.anchoPiezas*columna, this.altoPiezas*fila);
          this.piezas.push(piezaVacia);
        }else{
          this.contexto.drawImage(this.imagen, this.anchoPiezas*columna, this.altoPiezas*fila, this.anchoPiezas,
           this.altoPiezas, this.anchoPiezas*columna, this.altoPiezas*fila, this.anchoPiezas, this.altoPiezas);
          this.contexto.strokeRect(this.anchoPiezas*columna, this.altoPiezas*fila, this.anchoPiezas, this.altoPiezas);
          var piezaNuva = new Pieza(this.anchoPiezas*columna, this.altoPiezas*fila, this.anchoPiezas*columna, this.altoPiezas*fila);
          this.piezas.push(piezaNuva);
        }
      }
    }
  },

  // una vez elegido el nivel, se inicia el juego
  iniciar: function (cantMovimientos) {
    this.movimientosTotales = cantMovimientos;
    this.contadorDeMovimientos = cantMovimientos;
    this.piezas = [];
    this.grilla = [];
    document.getElementById("contadorDeMovimientos").innerHTML = this.contadorDeMovimientos;
    //limita la cantidad de piezas por lado ingreasada por el usuario
    if (this.cantidadDePiezasCorrecta()) {
      this.cantidadDePiezasPorLado = document.getElementById("cantidadPiezasPorLado").value;
    }else {
      this.cantidadDePiezasPorLado = 0;
    }
    //se guarda el contexto en una variable para que no se pierda cuando se ejecute la funcion iniciarImagen (que va a tener otro contexto interno)
    var self = this;
    this.crearGrilla();
    //se instancian los atributos que indican la posicion de las fila y columna vacias de acuerdo a la cantidad de piezas por lado para que sea la ultima del tablero
    this.posicionFilaVacia = this.cantidadDePiezasPorLado - 1;
    this.posicionColumnaVacia = this.cantidadDePiezasPorLado - 1;
    //se asigna la imagen del rompecabezas
    if (this.imagen == '') {
      this.imagen = new Image();
      this.imagen.src = "images/paisaje1.jpg";
    }
    else {
      this.imagen.src = this.imagen.src;
    }
    //se espera a que este iniciada la imagen antes de construir las piezas y empezar a mezclarlas
    this.iniciarImagen(function () {
      self.construirPiezas();
      //la cantidad de veces que se mezcla es en funcion a la cantidad de piezas por lado que tenemos, para que sea lo mas razonable posible.
      var cantidadDeMezclas = Math.max(Math.pow(self.cantidadDePiezasPorLado, 3), 100);
      self.mezclarPiezas(cantidadDeMezclas);
      if (self.chequearSiGano() == false) {
        self.capturarTeclas();
        self.moverConClick();
      }
    });
    this.detenerCronometro();
    this.iniciarCronometro();

  },

  iniciarCronometro: function(){
    var contadorCentesimas = 0;
    var contadorSegundos = 0;
    var contadorMinutos = 0;
    var centesimas = document.getElementById("centesima");
    var segundos = document.getElementById("segundos");
    var minutos = document.getElementById("minutos");
    centesimas.innerHTML = contadorCentesimas;
    segundos.innerHTML = contadorSegundos;
    minutos.innerHTML = contadorMinutos;

    this.cronometro = setInterval(function(){
      if (contadorCentesimas == 100) {
        contadorCentesimas = 0;
        contadorSegundos++;
        segundos.innerHTML = contadorSegundos;
        if (contadorSegundos == 60) {
          contadorSegundos = 0;
          contadorMinutos++;
          minutos.innerHTML = contadorMinutos;
          if (contadorMinutos == 60) {
            contadorMinutos = 0;
          }
        }
      }
        centesimas.innerHTML = contadorCentesimas;
        contadorCentesimas++;
    },10);
  },

  detenerCronometro: function(){
    clearInterval(this.cronometro);
  },


}

$(document).ready(function(){
  $("input[name=dificultad]").click(function(){
    if (Juego.cantidadDePiezasCorrecta()) {
      Juego.cantidadDePiezasPorLado = document.getElementById("cantidadPiezasPorLado").value;
      Juego.modificarDificultad();
    }else {
      Juego.cantidadDePiezasPorLado = 0;
    }
  });
});
