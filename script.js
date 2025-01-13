document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita que el formulario se envíe de forma tradicional

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Aquí puedes agregar la lógica para autenticar al usuario
    // Por ejemplo, comparando con datos almacenados en una base de datos

    if (username === 'ZEROWASTE' && password === '123') {
        document.getElementById('message').innerText = 'Inicio de sesión exitoso';
        // Redirigir a otra página
        window.location.href = 'index1.html'; // Cambia 'index1.html' por la URL de la página a la que deseas redirigir
    } else {
        document.getElementById('message').innerText = 'Usuario o contraseña incorrectos';
    }
});

// Función para alternar la visibilidad de la contraseña
function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.getElementById('togglePassword');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.classList.remove('far', 'fa-eye');
        toggleIcon.classList.add('fas', 'fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        toggleIcon.classList.remove('fas', 'fa-eye-slash');
        toggleIcon.classList.add('far', 'fa-eye');
    }
}