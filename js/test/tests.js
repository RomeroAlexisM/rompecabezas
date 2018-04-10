var expect = chai.expect;

describe('Creación', function() {
    'use strict';

  describe('Juego', function() {
      it('El Objeto Juego está definido', function(done) {
        if (!window.Juego){
          done(err);
        }
        else{
          done();
        }
      });
  });

  describe('Tamaño de la grilla', function() {
      it('La grilla tiene el tamaño correcto', function() {
        //se crea la grilla con un valor de cantidad de piezas por lado
        Juego.cantidadDePiezasPorLado = 5;
        Juego.crearGrilla();
        //se evalua si el tamaño de la grilla creada es correcto
        expect(Juego.grilla.length).to.equal(Juego.cantidadDePiezasPorLado);
        expect(Juego.grilla[0].length).to.equal(Juego.cantidadDePiezasPorLado);
      });
    });

  describe("Posicion valida", function(){
      it('Se encuentra dentro de la grilla', function(){
        Juego.cantidadDePiezasPorLado = 5;
        Juego.crearGrilla();
        expect(Juego.posicionValida(2,2)).to.equal(true);
      });
      it('No se encuentra dentro de la grilla', function(){
        Juego.cantidadDePiezasPorLado = 5;
        Juego.crearGrilla();
        Juego.posicionValida(1,5);
        expect(Juego.posicionValida()).to.equal(false);
      });
    });
  describe("Actualizar posición Vacia", function(){
    it('se actualizó', function(){
      Juego.cantidadDePiezasPorLado = 2;
      Juego.crearGrilla();
      Juego.posicionFilaVacia = 1;
      Juego.posicionColumnaVacia = 1;
      Juego.actualizarPosicionVacia(0,1);
      expect(Juego.posicionFilaVacia).to.equal(0);
      expect(Juego.posicionColumnaVacia).to.equal(1);
    });
    it('no se actualizó', function(){
      Juego.cantidadDePiezasPorLado = 2;
      Juego.crearGrilla();
      Juego.posicionFilaVacia = 1;
      Juego.posicionColumnaVacia = 1;
      if(Juego.posicionValida(3,4)){
          Juego.actualizarPosicionVacia(3,4);
      }
      expect(Juego.posicionFilaVacia).to.equal(1);
      expect(Juego.posicionColumnaVacia).to.equal(1);
    });

  });


});
