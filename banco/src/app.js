// Definir clases

// Clase Cliente
class Cliente {
  constructor(cedula, nombres, apellidos) {
    this.cedula = cedula;
    this.nombres = nombres;
    this.apellidos = apellidos;
  }
}

// Clase Cuenta
class Cuenta {
  constructor(numero, clave, tipo, cliente, saldo) {
    this.numero = numero;
    this.clave = clave;
    this.tipo = tipo;
    this.cliente = cliente;
    this.saldo = saldo;
  }
}

// Funciones de manejo de datos

// Crear un cliente
function crearCliente(cedula, nombres, apellidos) {
  const cliente = new Cliente(cedula, nombres, apellidos);
  clientes.push(cliente);
  guardarClientesEnLocalStorage();
}

// Crear una cuenta
function crearCuenta(clave, tipo, cliente, saldo) {
  const numero = obtenerNuevoNumeroCuenta();
  const cuenta = new Cuenta(numero, clave, tipo, cliente, saldo);
  cuentas.push(cuenta);
  guardarCuentasEnLocalStorage();
}

// Obtener nuevo número de cuenta
function obtenerNuevoNumeroCuenta() {
  const numeroCuenta = padLeft(cuentas.length, 4, "0");
  return numeroCuenta;
}

// Rellenar un número con ceros a la izquierda
function padLeft(number, length, char) {
  return number.toString().length < length
    ? padLeft(char + number, length, char)
    : number;
}

// Guardar datos en localStorage
function guardarClientesEnLocalStorage() {
  localStorage.setItem("clientes", JSON.stringify(clientes));
}

function guardarCuentasEnLocalStorage() {
  localStorage.setItem("cuentas", JSON.stringify(cuentas));
}

// Cargar datos de localStorage
function cargarClientesDesdeLocalStorage() {
  const data = localStorage.getItem("clientes");
  return data ? JSON.parse(data) : [];
}

function cargarCuentasDesdeLocalStorage() {
  const data = localStorage.getItem("cuentas");
  return data ? JSON.parse(data) : [];
}

// Lógica de la aplicación

let clientes = cargarClientesDesdeLocalStorage();
let cuentas = cargarCuentasDesdeLocalStorage();
let sesionIniciada = false;
let cuentaActiva = null;

// Funciones de manejo de datos (continuación)

// Iniciar sesión
function iniciarSesion(numeroCuenta, clave) {
  const cuenta = cuentas.find(
    (c) => c.numero === numeroCuenta && c.clave === clave
  );
  if (cuenta) {
    sesionIniciada = true;
    cuentaActiva = cuenta;
    mostrarFormularioSesionIniciada();
  } else {
    alert("Número de cuenta o clave incorrectos.");
  }
}

// Realizar depósito
function depositar(monto) {
  cuentaActiva.saldo += monto;
  guardarCuentasEnLocalStorage();
  mostrarFormularioSesionIniciada();
}

// Realizar retiro
function retirar(monto) {
  if (cuentaActiva.saldo >= monto) {
    cuentaActiva.saldo -= monto;
    guardarCuentasEnLocalStorage();
    mostrarFormularioSesionIniciada();
  } else {
    alert("Saldo insuficiente.");
  }
}

// Mostrar el formulario de transferencia
function mostrarFormularioTransferencia() {
  const content = document.getElementById("content");
  content.innerHTML = `
      <h2>Transferencia Bancaria</h2>
      <form id="transferForm">
          <div class="mb-3">
              <label for="recipientAccount" class="form-label">Número de Cuenta del Destinatario:</label>
              <input type="text" class="form-control" id="recipientAccount" required>
          </div>
          <div class="mb-3">
              <label for="transferAmount" class="form-label">Monto:</label>
              <input type="number" class="form-control" id="transferAmount" required>
          </div>
          <button type="submit" class="btn btn-primary">Transferir</button>
          <button type="button" class="btn btn-secondary" onclick="mostrarFormularioSesionIniciada()">Volver</button>
      </form>
  `;

  const transferForm = document.getElementById("transferForm");
  transferForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const recipientAccount =
      transferForm.querySelector("#recipientAccount").value;
    const transferAmount = parseFloat(
      transferForm.querySelector("#transferAmount").value
    );

    const recipientCuenta = cuentas.find((c) => c.numero === recipientAccount);
    if (recipientCuenta) {
      if (cuentaActiva.saldo >= transferAmount) {
        cuentaActiva.saldo -= transferAmount;
        recipientCuenta.saldo += transferAmount;
        guardarCuentasEnLocalStorage();
        mostrarFormularioSesionIniciada();
      } else {
        alert("Saldo insuficiente para realizar la transferencia.");
      }
    } else {
      alert("Número de cuenta destinataria no encontrada.");
    }
  });
}

// Mostrar el formulario de operaciones
function mostrarFormularioOperaciones() {
  const content = document.getElementById("content");
  content.innerHTML = `
      <h2>Operaciones Bancarias</h2>
      <p><strong>Número de Cuenta:</strong> ${cuentaActiva.numero}</p>
      <p><strong>Tipo de Cuenta:</strong> ${cuentaActiva.tipo}</p>
      <p><strong>Cliente:</strong> ${cuentaActiva.cliente.nombres} ${cuentaActiva.cliente.apellidos}</p>
      <p><strong>Saldo:</strong> ${cuentaActiva.saldo}</p>
      <button class="btn btn-primary" onclick="depositarForm()">Depositar</button>
      <button class="btn btn-primary" onclick="retirarForm()">Retirar</button>
      <button class="btn btn-primary" onclick="mostrarFormularioTransferencia()">Transferir</button>
      <button class="btn btn-secondary" onclick="mostrarFormularioLogin()">Salir</button>
  `;
}

// Mostrar formulario de depósito
function depositarForm() {
  const content = document.getElementById("content");
  content.innerHTML = `
      <h2>Depósito</h2>
      <form id="depositForm">
          <div class="mb-3">
              <label for="depositAmount" class="form-label">Monto a Depositar:</label>
              <input type="number" class="form-control" id="depositAmount" required>
          </div>
          <button type="submit" class="btn btn-primary">Depositar</button>
          <button type="button" class="btn btn-secondary" onclick="mostrarFormularioOperaciones()">Cancelar</button>
      </form>
  `;

  const depositForm = document.getElementById("depositForm");
  depositForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const depositAmount = parseFloat(
      depositForm.querySelector("#depositAmount").value
    );
    if (depositAmount > 0) {
      depositar(depositAmount);
    } else {
      alert("Ingrese un monto válido.");
    }
  });
}

// Mostrar formulario de retiro
function retirarForm() {
  const content = document.getElementById("content");
  content.innerHTML = `
      <h2>Retiro</h2>
      <form id="withdrawForm">
          <div class="mb-3">
              <label for="withdrawAmount" class="form-label">Monto a Retirar:</label>
              <input type="number" class="form-control" id="withdrawAmount" required>
          </div>
          <button type="submit" class="btn btn-primary">Retirar</button>
          <button type="button" class="btn btn-secondary" onclick="mostrarFormularioOperaciones()">Cancelar</button>
      </form>
  `;

  const withdrawForm = document.getElementById("withdrawForm");
  withdrawForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const withdrawAmount = parseFloat(
      withdrawForm.querySelector("#withdrawAmount").value
    );
    if (withdrawAmount > 0) {
      retirar(withdrawAmount);
    } else {
      alert("Ingrese un monto válido.");
    }
  });
}

// Mostrar el formulario de sesión iniciada
function mostrarFormularioSesionIniciada() {
  if (sesionIniciada) {
    mostrarFormularioOperaciones();
  } else {
    mostrarFormularioLogin();
  }
}

// Mostrar el formulario de creación de cuenta
function mostrarFormularioCrearCuenta() {
  const content = document.getElementById("content");
  content.innerHTML = `
      <h2>Crear Nueva Cuenta</h2>
      <form id="createAccountForm">
          <div class="mb-3">
              <label for="accountType" class="form-label">Tipo de Cuenta:</label>
              <select class="form-select" id="accountType" required>
                  <option value="CORRIENTE">Corriente</option>
                  <option value="AHORRO">Ahorro</option>
              </select>
          </div>
          <div class="mb-3">
              <label for="clientSelect" class="form-label">Cliente:</label>
              <select class="form-select" id="clientSelect" required>
                  ${clientes
                    .map(
                      (cliente) =>
                        `<option value="${cliente.cedula}">${cliente.nombres} ${cliente.apellidos}</option>`
                    )
                    .join("")}
              </select>
          </div>
          <div class="mb-3">
              <label for="initialBalance" class="form-label">Saldo Inicial:</label>
              <input type="number" class="form-control" id="initialBalance" required>
          </div>
          <button type="submit" class="btn btn-primary">Crear Cuenta</button>
          <button type="button" class="btn btn-secondary" onclick="mostrarFormularioLogin()">Cancelar</button>
      </form>
  `;

  const createAccountForm = document.getElementById("createAccountForm");
  createAccountForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const accountType = createAccountForm.querySelector("#accountType").value;
    const selectedClientCedula =
      createAccountForm.querySelector("#clientSelect").value;
    const initialBalance = parseFloat(
      createAccountForm.querySelector("#initialBalance").value
    );
    const selectedClient = clientes.find(
      (c) => c.cedula === selectedClientCedula
    );

    if (selectedClient) {
      crearCuenta(
        generarClaveAleatoria(),
        accountType,
        selectedClient,
        initialBalance
      );
      mostrarFormularioLogin();
    } else {
      alert("Cliente no encontrado.");
    }
  });
}

// Generar clave aleatoria para la cuenta
function generarClaveAleatoria() {
  const caracteres =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let clave = "";
  for (let i = 0; i < 8; i++) {
    const indice = Math.floor(Math.random() * caracteres.length);
    clave += caracteres.charAt(indice);
  }
  return clave;
}

// Mostrar el formulario de creación de cliente
function mostrarFormularioCrearCliente() {
  const content = document.getElementById("content");
  content.innerHTML = `
      <h2>Crear Nuevo Cliente</h2>
      <form id="createClientForm">
          <div class="mb-3">
              <label for="cedula" class="form-label">Cédula:</label>
              <input type="text" class="form-control" id="cedula" required>
          </div>
          <div class="mb-3">
              <label for="nombres" class="form-label">Nombres:</label>
              <input type="text" class="form-control" id="nombres" required>
          </div>
          <div class="mb-3">
              <label for="apellidos" class="form-label">Apellidos:</label>
              <input type="text" class="form-control" id="apellidos" required>
          </div>
          <button type="submit" class="btn btn-primary">Crear Cliente</button>
          <button type="button" class="btn btn-secondary" onclick="mostrarFormularioLogin()">Cancelar</button>
      </form>
  `;

  const createClientForm = document.getElementById("createClientForm");
  createClientForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const cedula = createClientForm.querySelector("#cedula").value;
    const nombres = createClientForm.querySelector("#nombres").value;
    const apellidos = createClientForm.querySelector("#apellidos").value;
    crearCliente(cedula, nombres, apellidos);
    mostrarFormularioLogin();
  });
}

// Mostrar el formulario de inicio de sesión
function mostrarFormularioLogin() {
  sesionIniciada = false;
  cuentaActiva = null;

  const content = document.getElementById("content");
  content.innerHTML = `
      <h2>Iniciar Sesión</h2>
      <form id="loginForm">
          <div class="mb-3">
              <label for="accountNumber" class="form-label">Número de Cuenta:</label>
              <input type="text" class="form-control" id="accountNumber" required>
          </div>
          <div class="mb-3">
              <label for="password" class="form-label">Clave:</label>
              <input type="password" class="form-control" id="password" required>
          </div>
          <button type="submit" class="btn btn-primary">Iniciar Sesión</button>
          <button type="button" class="btn btn-secondary" onclick="mostrarFormularioCrearCliente()">Crear Cliente</button>
          <button type="button" class="btn btn-secondary" onclick="mostrarFormularioCrearCuenta()">Crear Cuenta</button>
      </form>
  `;

  const loginForm = document.getElementById("loginForm");
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const accountNumber = loginForm.querySelector("#accountNumber").value;
    const password = loginForm.querySelector("#password").value;
    iniciarSesion(accountNumber, password);
  });
}

// Inicialización de la aplicación
mostrarFormularioLogin();

// Inicialización de la aplicación
mostrarFormularioLogin();
